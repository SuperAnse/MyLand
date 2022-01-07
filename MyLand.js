var PLUGIN_NAME = "§l[系统] ";
// @ts-ignore
var CONFIG = data.openConfig("plugins/MyLand/Config.json", "json");

// by: anseEND
// 联系QQ: 2335607935

// 领地购买单价
var LAND_BUY_PRICE = 100;
// 领地卖出单价
var LAND_SELL_PRICE = 100;
// 默认"grass_path"为泥土小径, "air"为取消
var BORDER_BLOCK_NAME = "grass_path";
// 每人领地数量限制, 小于等于0是无限制
var PLAYER_MAX_LAND_COUNT = -1;
// 圈地最大距离限制, 避免熊孩子干服务器
var MAX_LAND_SCOPE_DISTANCE = 256;
// Win10优化
var tradDelay = new Map();

// 不要修改此选项!!!
// Don't touch this!! 
var serverState = false;

var PROMPT = {
    DEFAULT_LAND_NAME: "家",
    NEED_SET_START_POS: "§c你需要设置起点.",
    SETTING_CONFIRM: "操作确认",
    SETTING_CANCE: "§f操作取消!",
    CANCE_INTERACTION: "§l§c停止, 这是§f %MASTER §c的领地哦",
    CANCE_RIDE: "§l§c你不能在§f %MASTER §c的领地中骑乘",
    CANCE_ATTACK: "§l§c你不能在§f %MASTER §c的领地中发动攻击",
    MAX_LAND_COUNT: "§c每人只能拥有§f " + PLAYER_MAX_LAND_COUNT + " §c块领地!",
    LAND_OVERLAP: "§c不能覆盖到其他的领地.",
    DIMENSION_ERROR: "§c无法跨维度圈地.",
    STATR_ENCLOSURE: "§a你已进入圈地模式.",
    END_ENCLOSURE: "§c你已退出圈地模式.",
    WALK_IN: "§e你进入了§f %MASTER §e的领地",
    WALK_OUT: "§7你离开了§f %MASTER §7的领地",
    TELEPORT_IN: "§f你来到了§e %MASTER §f的§e %LAND_TITLE §f!",
    REFUSED_WALK_IN: "§c你无法进入§f %MASTER §c的领地",
    YOUR_MONEY: "你的钱数: %MONEY",
    TITLE_SYSTEM: "领地系统",
    TITLE_MY_LAND: "我的领地",
    TITLE_FRIEND_LAND: "好友领地",
    TITLE_ENCLOSURE: "我要圈地",
    TITLE_ALL_LAND: "全部领地",
    SUBTITLE_TITLE_LAND: "领地管理: %LAND_TITLE",
    SUBTITLE_TITLE_DOOR: "领地门禁",
    SUBTITLE_TITLE_RENAME: "更改名字",
    SUBTITLE_TITLE_TELEPORT: "回到领地",
    SUBTITLE_TITLE_FRIEND: "领地共享",
    SUBTITLE_TITLE_TRANSFER: "领地转让",
    SUBTITLE_TITLE_SELL: "卖出领地",
    SETTING_DOOR_TITLE: "领地门禁",
    SETTING_DOOR_CONTENT: "是否允许陌生人进入领地参观?",
    SETTING_DOOR_TRUE: "允许",
    SETTING_DOOR_FALSE: "拒绝",
    SETTING_DOOR_OPEN: "§a门禁已关闭! 将允许陌生人进入领地参观!",
    SETTING_DOOR_CLOSE: "§e门禁已打开! 将拒绝陌生人进入领地参观!",
    SETTING_RENAME_TITLE: "更改名字",
    SETTING_RENAME_INPUT: "新的名字",
    SETTING_RENAME_SUCCESSFUL: "§f领地§e %OLD_LAND_TITLE §f改名为§e %NEW_LAND_TITLE§f!",
    SETTING_RENAME_FAILURE: "§c领地名不可为空!",
    SETTING_TELEPORT: "§f你来到了自己的§e %LAND_TITLE §f!",
    SETTING_ADD_FRIEND: "添加共享",
    SETTING_ADD_FRIEND_SELECT_PLAYER: "请选择玩家",
    SETTING_ADD_FRIEND_SUCCESSFUL_PLAYER: "§f玩家§e %NEW_FRIEND_NAME §f可以用你的§e %LAND_TITLE §f领地了!",
    SETTING_ADD_FRIEND_SUCCESSFUL_TARGET: "§f玩家§e %PLAYER_NAME §f给你了他的§e %LAND_TITLE §f领地使用权限!",
    SETTING_ADD_FRIEND_FAILURE: "§c玩家§e %FRIEND_NAME §c必须在线!",
    SETTING_DEL_FRIEND_CONTENT: "不再共享给 %FRIEND_NAME ?",
    SETTING_DEL_FRIEND_TRUE: "踢了他",
    SETTING_DEL_FRIEND_FALSE: "点错了",
    SETTING_DEL_FRIEND_SUCCESSFUL: "§f已将§e %FRIEND_NAME §f从你的§e %LAND_TITLE §f领地中踢出!",
    SETTING_MAKE_OVER_TITLE: "领地转让",
    SETTING_MAKE_OVER_INPUT: "请输入玩家名字 ➦区分大小写注意空格",
    SETTING_MAKE_OVER_SUCCESSFUL_PLAYER: "§f你成功将你的§e %LAND_TITLE §f领地送给了玩家§e %TARGET_NAME §f!",
    SETTING_MAKE_OVER_SUCCESSFUL_TARGET: "§f玩家§e %PLAYER_NAME §f将Ta的§e %LAND_TITLE §f领地送给了你!",
    SETTING_MAKE_OVER_FAILURE: "§c玩家§e %TARGET_NAME §c必须在线!",
    SETTING_SELL_CONTENT: "以 %MONEY 块钱的价格卖出 %LAND_TITLE ?",
    SETTING_SELL_TRUE: "卖了换钱",
    SETTING_SELL_FALSE: "我再想想",
    SETTING_SELL_SUCCESSFUL_PLAYER: "§f领地已卖出, 获得§e %MONEY §f块钱!",
    SETTING_SELL_SUCCESSFUL_FRIEND: "§f你的朋友§e %MASTER_NAME §f将Ta的§e %LAND_TITLE §f领地卖掉了",
    BUY_LAND_TITLE: "    §l购买这块地需要 %MONEY 块钱, 要买吗?   继续圈 ➦",
    BUY_LAND_BUY: "我要购买",
    BUY_LAND_CANCE: "§l取消圈地",
    BUY_LAND_SUCCESSFUL: "§a圈地成功, 共花费了§c %MONEY §a块钱.",
    BUY_LAND_FAILURE: "§c你的钱不够.",
    RENAME_NEW_LAND_TITLE: "恭喜! 圈地成功",
    RENAME_NEW_LAND_INPUT: "给你的新领地起个名字吧!",
    DEFAULT_RENAME_NEW_LAND_NAME: "The house of %MASTER",
    RENAME_NEW_LAND_SUCCESSFUL: "§f新的领地命名为§e %LAND_TITLE §f!",
    RENAME_NEW_LAND_FAILURE: "§c领地名不可为空!",
    COMMAND_REMOVE_LAND_SUCCESSFUL: "§a已将脚下的领地删除.",
    COMMAND_REMOVE_LAND_FAILURE: "§c你的脚下并没有领地.",
    COMMAND_NOT_ADMIN: "§c你不是管理员.",
    SEND_ENCLOSURE_TITLE: "§l§e-== §f设置领地范围 §e==-",
    SEND_ENCLOSURE_SUBTITLE_TITLE: "§l§f点击地面进行(以自身位置判断)§e下一步§f操作"
}

// 可覆盖方块
var CHANGE_BLOCKS = [
    "minecraft:sand",
    "minecraft:dirt",
    "minecraft:grass",
    "minecraft:gravel",
    "minecraft:crimson_nylium",
    "minecraft:warped_nylium",
    "minecraft:basalt",
    "minecraft:polished_basalt",
    "minecraft:smooth_basalt",
    "minecraft:soul_soil",
    "minecraft:moss_block",
    "minecraft:magma",
    "minecraft:netherrack",
    "minecraft:soul_sand",
    "minecraft:end_stone",
    "minecraft:farmland",
    "minecraft:podzol",
    "minecraft:mycelium",
    "minecraft:stone",
    "minecraft:snow_layer",
    "minecraft:stained_hardened_clay",
    "minecraft:concrete",
    "minecraft:concretePowder",
];

class Tools {

    /**
     * @param {any} player
     * @param {string} message
     */
    static sendMessage(player, message) {
        player.tell(PLUGIN_NAME + message);
    }

    /**
     * @param {any} player
     * @param {string} message
     */
    static sendPopup(player, message) {
        player.tell(message, 4);
    }

    /**
     * @param {any} player
     * @param {string} message
     */
    static sendTip(player, message) {
        player.tell(message, 5);
    }
};

class Vector3 {

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} dimensionId
     */
    constructor(x, y, z, dimensionId) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.dimensionId = dimensionId;
    }

    getFloorX() {
        return Math.floor(this.x);
    };

    getFloorY() {
        return Math.floor(this.y);
    };

    getFloorZ() {
        return Math.floor(this.z);
    };
    /**
     * @param {Vector3} pos
     */
    addVector3(pos) {
        return new Vector3(this.x + pos.x, this.y + pos.y, this.z + pos.z, this.dimensionId);
    };

    getDimensionId() {
        return this.dimensionId;
    };

    /**
     * @param {number} addX
     * @param {number} addY
     * @param {number} addZ
     */
    add(addX, addY, addZ) {
        let newX = (addX !== undefined) ? this.x + addX : this.x;
        let newY = (addY !== undefined) ? this.y + addY : this.y;
        let newZ = (addZ !== undefined) ? this.z + addZ : this.z;
        return new Vector3(newX, newY, newZ, this.dimensionId);
    };

    floor() {
        return new Vector3(this.getFloorX(), this.getFloorY(), this.getFloorZ(), this.dimensionId);
    };

    /**
     * @param {Vector3} pos
     */
    distance(pos) {
        return Math.sqrt(this.distanceSquared(pos));
    };

    /**
     * @param {Vector3} pos
     */
    distanceSquared(pos) {
        return Math.pow(this.x - pos.x, 2) + Math.pow(this.y - pos.y, 2) + Math.pow(this.z - pos.z, 2);
    };

    toVector2() {
        return new Vector2(this.x, this.z);
    };

    toStr() {
        return this.getFloorX() + ":" + this.getFloorY() + ":" + this.getFloorZ() + ":" + this.dimensionId;
    };

    /**
     * @param {Vector3} pos
     */
    equals(pos) {
        return this.x == pos.x && this.y == pos.y && this.z == pos.z && this.dimensionId == pos.dimensionId;
    }
}

class Vector2 {

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getFloorX() {
        return Math.floor(this.x);
    };

    getFloorY() {
        return Math.floor(this.y);
    };

    /**
     * @param {Vector2} vector
     */
    distance(vector) {
        return Math.sqrt(this.distanceSquared(vector.x, vector.y));
    };

    /**
     * @param {number} x
     * @param {number} y
     */
    distanceSquared(x, y) {
        return Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2);
    };

    /**
     * @param {Vector2} end
     */
    squared(end) {
        let startX = this.x;
        let startY = this.y;
        let endX = end.x;
        let endY = end.y;
        let width = ((startX > endX) ? (startX - endX) : (endX - startX)) + 1;
        let height = ((startY > endY) ? (startY - endY) : (endY - startY)) + 1;
        return Math.floor(width * height);
    };
}

class Land {

    /**
     * @param {string} land_string
     * @param {Map<any, any>} data
     */
    constructor(land_string, data) {
        /** @type {string} */
        this.land_string = land_string;
        let strings = land_string.split("::");
        /** @type {Vector3} */
        this.start = toVector3(strings[0]);
        /** @type {Vector3} */
        this.end = toVector3(strings[1]);
        /** @type {boolean} */
        this.open = data.get("open");
        /** @type {string} */
        this.master = "" + data.get("master");
        /** @type {string} */
        this.masterXuid = "" + data.get("masterXuid");
        /** @type {string} */
        this.title = "" + data.get("title");
        this.friends = data.get("friends");
    }

    getData() {
        let map = {};
        map["open"] = this.open;
        map["master"] = this.master;
        map["masterXuid"] = this.masterXuid;
        map["title"] = this.title;
        let friends_obj = Object.create(null);
        for (let [friends_key, friends_value] of this.friends) {
            friends_obj[friends_key] = friends_value;
        }
        map["friends"] = friends_obj;
        return map;
    };

    isOpen() {
        return this.open;
    }

    /** @param {boolean} state */
    setOpen(state) {
        this.open = state;
    }

    getLandString() {
        return this.land_string;
    };

    getStartVector2() {
        return new Vector2(this.start.x, this.start.z);
    };

    getEndVector2() {
        return new Vector2(this.end.x, this.end.z);
    };

    getMaster() {
        return this.master;
    };

    /**
     * @param {any} player
     */
    setMaster(player) {
        this.master = player.realName;
        this.masterXuid = player.xuid;
    };

    getTitle() {
        return this.title;
    };

    /**
     * @param {string} title
     */
    setTitle(title) {
        this.title = title;
    };

    getFriends() {
        return this.friends;
    };

    /**
     * @param {any} player
     */
    addFriend(player) {
        let player_real_name = player.realName;
        if (!this.friends.has(player_real_name)) {
            this.friends.set(player_real_name, player.xuid)
        }
    };

    /**
     * @param {any} player_real_name
     */
    removeFriend(player_real_name) {
        if (this.friends.has(player_real_name)) {
            this.friends.delete(player_real_name)
        }
    };

    /**
     * @param {any} player
     */
    isMaster(player) {
        let player_real_name = player.realName;
        let player_xuid = player.xuid;

        // 使用XUID判断，自动同步名字
        let sameUuid = this.masterXuid === player_xuid;
        if (sameUuid && this.master !== player_real_name) {
            this.master = player_real_name;
        }
        return sameUuid;
    };

    /**
     * @param {any} player
     */
    isFriend(player) {
        let player_real_name = player.realName;
        let player_xuid = player.xuid;
        let hasFriend = false;
        let old_friend_name = undefined;
        this.friends.forEach(function (/** @type {any} */ friend_xuid, /** @type {any} */ friend_name) {
            if (player_xuid === friend_xuid) {
                hasFriend = true;
                if (player_real_name !== friend_name) {
                    old_friend_name = friend_name;
                }
            }
        });
        // 自动更新朋友名字
        if (old_friend_name !== undefined) {
            this.friends.delete(old_friend_name);
            this.friends.set(player_real_name, player_xuid);
            this.saveLand();
        }
        return hasFriend;
    };

    getSafeSpawn() {
        return this.end;
    };

    /**
     * @param {number} x
     * @param {number} z
     * @param {number} dimensionId
     */
    inTheLand(x, z, dimensionId) {
        if (this.start.dimensionId !== dimensionId) {
            return false;
        }
        let min_x = Math.min(this.start.x, this.end.x);
        let max_x = Math.max(this.start.x, this.end.x);
        let min_z = Math.min(this.start.z, this.end.z);
        let max_z = Math.max(this.start.z, this.end.z);
        return (x >= min_x && x <= max_x && z >= min_z && z <= max_z);
    };

    /**
     * @param {any} player
     */
    hasPermission(player) {
        if (this.isMaster(player)) {
            return true;
        }
        return this.isFriend(player);
    };

    saveLand() {
        saveLandConfig();
    };

    /**
     *
     * @param {any} intPos
     */
    setBorderBlock(intPos) {
        // @ts-ignore
        mc.setBlock(intPos, "minecraft:" + BORDER_BLOCK_NAME, 0);
    }

    generateBorder() {
        if (BORDER_BLOCK_NAME === "air") {
            return;
        }
        let dimension = this.start.dimensionId;
        let min_x = Math.min(this.start.getFloorX(), this.end.getFloorX());
        let max_x = Math.max(this.start.getFloorX(), this.end.getFloorX());
        let min_z = Math.min(this.start.getFloorZ(), this.end.getFloorZ());
        let max_z = Math.max(this.start.getFloorZ(), this.end.getFloorZ());
        let y = Math.max(this.start.getFloorY(), this.end.getFloorY());
        for (let x = min_x; x <= max_x; x++) {
            this.setBorderBlock(this.safePos(x, y, min_z, dimension));
            this.setBorderBlock(this.safePos(x, y, max_z, dimension));
        }
        for (let z = min_z; z <= max_z; z++) {
            this.setBorderBlock(this.safePos(min_x, y, z, dimension));
            this.setBorderBlock(this.safePos(max_x, y, z, dimension));
        }
    }

    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} dimension
     * @returns
     */
    safePos(x, y, z, dimension) {
        // @ts-ignore
        let blockPos = mc.newIntPos(x, y, z, dimension);
        for (let i = y + 12; i > -64; i--) {
            // @ts-ignore
            let block = mc.getBlock(x, i, z, dimension);
            if (CHANGE_BLOCKS.indexOf(block.name) != -1) {
                // @ts-ignore
                blockPos = mc.newIntPos(x, i, z, dimension);
                break;
            }
        }
        return blockPos;
    }
}

class Form {

    /**
     * @param {any} player
     */
    static sendLandForm(player) {
        let player_real_name = player.realName;
        if (setter.has(player_real_name)) {
            if (PLAYER_MAX_LAND_COUNT > 0) {
                let count = 0;
                for (let land of landHashMap.values()) {
                    if (land.isMaster(player)) {
                        count += 1;
                    }
                }
                if (count >= PLAYER_MAX_LAND_COUNT) {
                    setter.delete(player_real_name);
                    Tools.sendMessage(player, PROMPT.MAX_LAND_COUNT);
                    return;
                }
            }
            if (isOverlap(player)) {
                setter.delete(player_real_name);
                Tools.sendMessage(player, PROMPT.LAND_OVERLAP);
            } else {
                let end = FloatPosToVector3(player.pos).floor();
                let start = setter.get(player_real_name);
                if (start.dimensionId !== end.dimensionId) {
                    setter.delete(player_real_name);
                    Tools.sendMessage(player, PROMPT.DIMENSION_ERROR);
                } else {
                    // 256 * 256
                    let min_x = Math.min(start.getFloorX(), end.getFloorX());
                    let max_x = Math.max(start.getFloorX(), end.getFloorX());
                    let min_z = Math.min(start.getFloorZ(), end.getFloorZ());
                    let max_z = Math.max(start.getFloorZ(), end.getFloorZ());
                    if ((max_x - min_x) > MAX_LAND_SCOPE_DISTANCE || (max_z - min_z) > MAX_LAND_SCOPE_DISTANCE) {
                        player.sendMessage(PLUGIN_NAME + "§c领地过大, 平面范围不能超过 §f" + MAX_LAND_SCOPE_DISTANCE + " * " + MAX_LAND_SCOPE_DISTANCE + " §c!");
                        quitEnclosure(player);
                    } else {
                        ender.set(player_real_name, end);
                        Form.sendBuyLandForm(player, end);
                    }
                }
            }

        } else {
            // @ts-ignore
            let simple = mc.newSimpleForm();
            simple.setTitle(PROMPT.TITLE_SYSTEM);
            simple.setContent(PROMPT.YOUR_MONEY.replace("%MONEY", "" + parseInt(myMoney(player))));
            simple.addButton(PROMPT.TITLE_MY_LAND, "textures/ui/dressing_room_animation");
            simple.addButton(PROMPT.TITLE_FRIEND_LAND, "textures/ui/dressing_room_skins");
            simple.addButton(PROMPT.TITLE_ENCLOSURE, "textures/ui/icon_new");
            player.sendForm(simple, function (/** @type {any} */ player, /** @type {any} */ buttonId) {
                let player_real_name = player.realName;
                if (buttonId === undefined) {
                    return;
                }
                switch (buttonId) {
                    case 0:
                        Form.sendMyLandsForm(player);
                        break;
                    case 1:
                        Form.sendFriendsLandForm(player);
                        break;
                    case 2:
                        setter.set(player_real_name, FloatPosToVector3(player.pos).floor());
                        Tools.sendMessage(player, PROMPT.STATR_ENCLOSURE);
                        sendTitle(player_real_name, PROMPT.SEND_ENCLOSURE_TITLE, PROMPT.SEND_ENCLOSURE_SUBTITLE_TITLE);
                        break;
                    default:
                        break;
                }
            });
        }
    };

    /**
     * @param {any} player
     */
    static sendLandListForm(player) {
        // @ts-ignore
        let simple = mc.newSimpleForm();
        simple.setTitle(PROMPT.TITLE_ALL_LAND);
        simple.setContent(PROMPT.YOUR_MONEY.replace("%MONEY", "" + parseInt(myMoney(player))));
        let my_lands = new Map();
        let id = 0;
        landHashMap.forEach(function (land, landName) {
            my_lands.set("" + id, land);
            simple.addButton(land.getTitle() + "\nMaster: " + land.getMaster(), "textures/ui/pointer");
            id += 1;
        });
        player.sendForm(simple, function (/** @type {any} */ player, /** @type {string} */ buttonId) {
            if (buttonId === undefined) {
                return;
            }
            let land = my_lands.get("" + buttonId);
            if (land !== undefined) {
                let safe_spawn = land.getSafeSpawn();
                player.teleport(safe_spawn.x, safe_spawn.y, safe_spawn.z, safe_spawn.dimensionId);
                Tools.sendMessage(player, PROMPT.TELEPORT_IN.replace("%MASTER", land.getMaster()).replace("%LAND_TITLE", land.getTitle()));
            }
        });
    };

    /**
     * @param {any} player
     */
    static sendMyLandsForm(player) {
        let player_real_name = player.realName;
        // @ts-ignore
        let simple = mc.newSimpleForm();
        simple.setTitle(PROMPT.TITLE_MY_LAND);
        simple.setContent(PROMPT.YOUR_MONEY.replace("%MONEY", "" + parseInt(myMoney(player))));
        /**  @type {Map<string, Land>} */
        let my_lands = new Map();
        let id = 0;
        for (let land of landHashMap.values()) {
            if (land.isMaster(player)) {
                my_lands.set("" + id, land);
                simple.addButton(land.getTitle(), "textures/ui/icon_spring");
                id += 1;
            }
        }

        player.sendForm(simple, function (/** @type {any} */ player, /** @type {string} */ buttonId) {
            if (buttonId === undefined) {
                return;
            }
            let land = my_lands.get("" + buttonId);
            if (land !== undefined) {
                // @ts-ignore
                let formAdmin = mc.newSimpleForm();
                formAdmin.setTitle(PROMPT.SUBTITLE_TITLE_LAND.replace("%LAND_TITLE", land.getTitle()));
                // 切换状态
                formAdmin.addButton(PROMPT.SUBTITLE_TITLE_DOOR, "textures/ui/" + (land.isOpen() ? "icon_unlocked" : "icon_lock"));
                formAdmin.addButton(PROMPT.SUBTITLE_TITLE_RENAME, "textures/ui/icon_fall");
                formAdmin.addButton(PROMPT.SUBTITLE_TITLE_TELEPORT, "textures/ui/pointer");
                formAdmin.addButton(PROMPT.SUBTITLE_TITLE_FRIEND, "textures/ui/icon_multiplayer");
                formAdmin.addButton(PROMPT.SUBTITLE_TITLE_TRANSFER, "textures/ui/dressing_room_customization");
                formAdmin.addButton(PROMPT.SUBTITLE_TITLE_SELL, "textures/ui/storexblsignin");

                player.sendForm(formAdmin, function (/** @type {any} */ player, /** @type {any} */ buttonId) {
                    if (buttonId === undefined) {
                        return;
                    }
                    switch (buttonId) {
                        case 0:
                            player.sendModalForm(PROMPT.SETTING_DOOR_TITLE, PROMPT.SETTING_DOOR_CONTENT, PROMPT.SETTING_DOOR_TRUE, PROMPT.SETTING_DOOR_FALSE, function (/** @type {any} */ player, /** @type {any} */ bool) {
                                if (bool === undefined) {
                                    return;
                                }
                                if (bool) {
                                    land.setOpen(true);
                                    Tools.sendMessage(player, PROMPT.SETTING_DOOR_OPEN);
                                } else {
                                    land.setOpen(false);
                                    Tools.sendMessage(player, PROMPT.SETTING_DOOR_CLOSE);
                                }
                                land.saveLand();
                            });
                            break;
                        case 1:
                            // @ts-ignore
                            let change = mc.newCustomForm();
                            change.setTitle(PROMPT.SETTING_RENAME_TITLE);
                            change.addInput(PROMPT.SETTING_RENAME_INPUT, "Home name", "");
                            player.sendForm(change, function (/** @type {any} */ player, /** @type {string[]} */ data) {
                                if (data === undefined) {
                                    return;
                                }
                                let new_title = data[0].replace("\n", "").replace(".", "");
                                if (new_title !== "") {
                                    let old_title = land.getTitle();
                                    land.setTitle(new_title);
                                    land.saveLand();
                                    Tools.sendMessage(player, PROMPT.SETTING_RENAME_SUCCESSFUL.replace("%OLD_LAND_TITLE", old_title).replace("%NEW_LAND_TITLE", new_title));
                                } else {
                                    Tools.sendMessage(player, PROMPT.SETTING_RENAME_FAILURE);
                                }
                            });
                            break;
                        case 2:
                            let safe_spawn = land.getSafeSpawn();
                            player.teleport(safe_spawn.getFloorX(), safe_spawn.getFloorY(), safe_spawn.getFloorZ(), safe_spawn.getDimensionId());
                            Tools.sendMessage(player, PROMPT.SETTING_TELEPORT.replace("%LAND_TITLE", land.getTitle()));
                            break;
                        case 3:
                            // @ts-ignore
                            let friendSystemForm = mc.newSimpleForm();
                            friendSystemForm.setTitle(PROMPT.SUBTITLE_TITLE_FRIEND);
                            friendSystemForm.addButton(PROMPT.SETTING_ADD_FRIEND, "textures/ui/profile_new_look");
                            //todo
                            let myFriends = new Map();
                            let id = 0;
                            land.getFriends().forEach(function (/** @type {any} */ friend_xuid, /** @type {any} */ friend_name) {
                                friendSystemForm.addButton(friend_name, "textures/ui/warning_alex");
                                myFriends.set(id, friend_name);
                                id += 1;
                            });
                            player.sendForm(friendSystemForm, function (/** @type {any} */ player, /** @type {number} */ buttonId) {
                                if (buttonId === undefined) {
                                    return;
                                }
                                if (buttonId === 0) {
                                    // @ts-ignore
                                    let addFriendForm = mc.newCustomForm();
                                    addFriendForm.setTitle(PROMPT.SETTING_ADD_FRIEND);

                                    let items = [];
                                    // @ts-ignore
                                    let allPlayer = mc.getOnlinePlayers();
                                    for (let index = 0; index < allPlayer.length; index++) {
                                        let online_player = allPlayer[index];
                                        items[index] = online_player.realName;
                                    }
                                    addFriendForm.addDropdown(PROMPT.SETTING_ADD_FRIEND_SELECT_PLAYER, items, 0);

                                    player.sendForm(addFriendForm, function (/** @type {any} */ player, /** @type {(string | number)[]} */ data) {
                                        if (data === undefined) {
                                            return;
                                        }
                                        let friend_name = items[data[0]];
                                        // @ts-ignore
                                        let newFriend = mc.getPlayer(friend_name);
                                        if (newFriend !== undefined) {
                                            land.addFriend(newFriend);
                                            land.saveLand();
                                            Tools.sendMessage(player, PROMPT.SETTING_ADD_FRIEND_SUCCESSFUL_PLAYER.replace("%NEW_FRIEND_NAME", newFriend.realName).replace("%LAND_TITLE", land.getTitle()));
                                            Tools.sendMessage(newFriend, PROMPT.SETTING_ADD_FRIEND_SUCCESSFUL_TARGET.replace("%PLAYER_NAME", player.realName).replace("%LAND_TITLE", land.getTitle()));
                                        } else {
                                            Tools.sendMessage(player, PROMPT.SETTING_ADD_FRIEND_FAILURE.replace("%FRIEND_NAME", friend_name));
                                        }
                                    });
                                } else {
                                    let friend_name = myFriends.get(buttonId - 1);
                                    player.sendModalForm(PROMPT.SETTING_CONFIRM, PROMPT.SETTING_DEL_FRIEND_CONTENT.replace("%FRIEND_NAME", friend_name), PROMPT.SETTING_DEL_FRIEND_TRUE, PROMPT.SETTING_DEL_FRIEND_FALSE, function (/** @type {any} */ player, /** @type {any} */ bool) {
                                        if (bool === undefined) {
                                            return;
                                        }
                                        if (bool) {
                                            land.removeFriend(friend_name);
                                            land.saveLand();
                                            Tools.sendMessage(player, PROMPT.SETTING_DEL_FRIEND_SUCCESSFUL.replace("%FRIEND_NAME", friend_name).replace("%LAND_TITLE", land.getTitle()));
                                        } else {
                                            Tools.sendMessage(player, PROMPT.SETTING_CANCE);
                                        }
                                    });
                                }
                            });
                            break;
                        case 4:
                            // @ts-ignore
                            let make_over = mc.newCustomForm();
                            make_over.setTitle(PROMPT.SETTING_MAKE_OVER_TITLE);
                            make_over.addInput(PROMPT.SETTING_MAKE_OVER_INPUT, "", "");
                            player.sendForm(make_over, function (/** @type {any} */ player, /** @type {string[]} */ data) {
                                if (data === undefined) {
                                    return;
                                }
                                let target_name = data[0].replace("\n", "").replace(".", "");
                                // @ts-ignore
                                let target = mc.getPlayer(target_name);
                                if (target !== undefined) {
                                    land.setMaster(target);
                                    land.saveLand();
                                    Tools.sendMessage(player, PROMPT.SETTING_MAKE_OVER_SUCCESSFUL_PLAYER.replace("%LAND_TITLE", land.getTitle()).replace("%TARGET_NAME", target.realName));
                                    Tools.sendMessage(target, PROMPT.SETTING_MAKE_OVER_SUCCESSFUL_TARGET.replace("%PLAYER_NAME", player.realName).replace("%LAND_TITLE", land.getTitle()));
                                } else {
                                    Tools.sendMessage(player, PROMPT.SETTING_MAKE_OVER_FAILURE.replace("%TARGET_NAME", target_name));
                                }
                            });
                            break;
                        case 5:
                            let money_count = land.getStartVector2().squared(land.getEndVector2()) * LAND_SELL_PRICE;
                            player.sendModalForm(PROMPT.SETTING_CONFIRM, PROMPT.SETTING_SELL_CONTENT.replace("%MONEY", "" + Math.floor(money_count)).replace("%LAND_TITLE", land.getTitle()), PROMPT.SETTING_SELL_TRUE, PROMPT.SETTING_SELL_FALSE, function (/** @type {any} */ player, /** @type {any} */ bool) {
                                if (bool === undefined) {
                                    return;
                                }
                                if (bool) {
                                    land.getFriends().forEach(function (/** @type {any} */ friend_xuid, /** @type {any} */ friend_name) {
                                        // @ts-ignore
                                        let friend = mc.getPlayer(friend_name);
                                        if (friend !== undefined) {
                                            Tools.sendMessage(friend, PROMPT.SETTING_SELL_SUCCESSFUL_FRIEND.replace("%MASTER_NAME", land.getMaster()).replace("%LAND_TITLE", land.getTitle()));
                                        }
                                    });
                                    removeLand(land.getLandString());
                                    addMoney(player, money_count);
                                    Tools.sendMessage(player, PROMPT.SETTING_SELL_SUCCESSFUL_PLAYER.replace("%MONEY", "" + Math.floor(money_count)));
                                } else {
                                    Tools.sendMessage(player, PROMPT.SETTING_CANCE);
                                }
                            });
                            break;
                        default:
                            break;
                    }
                });
            }
        });
    };

    /**
     * @param {any} player
     */
    static sendFriendsLandForm(player) {
        let player_real_name = player.realName;
        // @ts-ignore
        let simple = mc.newSimpleForm();
        simple.setTitle(PROMPT.TITLE_FRIEND_LAND);
        simple.setContent(PROMPT.YOUR_MONEY.replace("%MONEY", "" + parseInt(myMoney(player))));
        let my_lands = new Map();
        let id = 0;
        landHashMap.forEach(function (land, landName) {
            if (land.isFriend(player)) {
                my_lands.set("" + id, land);
                simple.addButton(land.getTitle(), "textures/ui/pointer");
                id += 1;
            }
        });
        player.sendForm(simple, function (/** @type {any} */ player, /** @type {string} */ buttonId) {
            if (buttonId === undefined) {
                return;
            }
            let land = my_lands.get("" + buttonId);
            if (land !== undefined) {
                let safe_spawn = land.getSafeSpawn();
                player.teleport(safe_spawn.x, safe_spawn.y, safe_spawn.z, safe_spawn.dimensionId);
                Tools.sendMessage(player, PROMPT.TELEPORT_IN.replace("%MASTER", land.getMaster()).replace("%LAND_TITLE", land.getTitle()));
            }
        });
    };

    /**
     * @param {any} player
     * @param {Vector3} end
     */
    static sendBuyLandForm(player, end) {
        let player_real_name = player.realName;
        if (!setter.has(player_real_name)) {
            Tools.sendMessage(player, PROMPT.NEED_SET_START_POS);
            return;
        }
        let start = setter.get(player_real_name);
        let need_money = start.toVector2().squared(end.toVector2()) * LAND_BUY_PRICE;

        // @ts-ignore
        let simple = mc.newSimpleForm();
        simple.setTitle(PROMPT.BUY_LAND_TITLE.replace("%MONEY", "" + Math.floor(need_money)));
        simple.setContent(PROMPT.YOUR_MONEY.replace("%MONEY", "" + parseInt(myMoney(player))));
        simple.addButton(PROMPT.BUY_LAND_BUY, "textures/ui/MCoin");
        simple.addButton(PROMPT.BUY_LAND_CANCE, "textures/ui/icon_trash");

        player.sendForm(simple, function (/** @type {any} */ player, /** @type {any} */ buttonId) {
            let player_real_name = player.realName;
            ender.delete(player_real_name);
            if (buttonId === undefined) {
                return;
            }
            let start = setter.get(player_real_name);
            switch (buttonId) {
                case 0:
                    let my_money = myMoney(player);
                    if (my_money >= need_money) {
                        let land_string = start.toStr() + "::" + end.toStr();

                        let map = new Map();
                        map.set("title", PROMPT.DEFAULT_LAND_NAME);
                        map.set("open", true);
                        map.set("master", player_real_name);
                        map.set("masterXuid", player.xuid);
                        map.set("friends", new Map());
                        createLand(land_string, map);

                        reduceMoney(player, need_money);

                        setter.delete(player_real_name);
                        Tools.sendMessage(player, PROMPT.BUY_LAND_SUCCESSFUL.replace("%MONEY", "" + Math.floor(need_money)));

                        // @ts-ignore
                        let change = mc.newCustomForm();
                        change.setTitle(PROMPT.RENAME_NEW_LAND_TITLE);
                        change.addInput(PROMPT.RENAME_NEW_LAND_INPUT, "Home name", PROMPT.DEFAULT_RENAME_NEW_LAND_NAME.replace("%MASTER", player_real_name));
                        player.sendForm(change, function (/** @type {any} */ player, /** @type {string[]} */ data) {
                            if (data === undefined) {
                                return;
                            }
                            let title = data[0].replace("\n", "").replace(".", "");
                            if (title !== "") {
                                let land = landHashMap.get(land_string);
                                land.setTitle(title);
                                land.saveLand();
                                Tools.sendMessage(player, PROMPT.RENAME_NEW_LAND_SUCCESSFUL.replace("%LAND_TITLE", title));
                            } else {
                                Tools.sendMessage(player, PROMPT.RENAME_NEW_LAND_FAILURE);
                            }
                        });
                    } else {
                        setter.delete(player_real_name);
                        Tools.sendMessage(player, PROMPT.BUY_LAND_FAILURE);
                    }
                    break;
                case 1:
                    quitEnclosure(player);
                    break;
                default:
                    break;
            }
        });
    };
}

var commands = {
    "land": ["领地指令", function (/** @type {any} */ player, /** @type {any} */ args) {
        Form.sendLandForm(player);
        return false;
    }],
    "landlist": ["领地列表", function (/** @type {any} */ player, /** @type {any} */ args) {
        //todo
        if (isOp(player)) {
            Form.sendLandListForm(player);
        } else {
            Tools.sendMessage(player, PROMPT.COMMAND_NOT_ADMIN);
        }
        return false;
    }],
    "myland": ["我的领地", function (/** @type {any} */ player, /** @type {any} */ args) {
        Form.sendMyLandsForm(player);
        return false;
    }],
    "removeland": ["删除脚下领地", function (/** @type {any} */ player, /** @type {any} */ args) {
        if (isOp(player)) {
            let playerPos = FloatPosToVector3(player.pos);
            let land_string = getLandString(playerPos.getFloorX(), playerPos.getFloorZ(), playerPos.getDimensionId());
            if (land_string !== null) {
                removeLand(land_string);
                Tools.sendMessage(player, PROMPT.COMMAND_REMOVE_LAND_SUCCESSFUL);
            } else {
                Tools.sendMessage(player, PROMPT.COMMAND_REMOVE_LAND_FAILURE);
            }
        } else {
            Tools.sendMessage(player, PROMPT.COMMAND_NOT_ADMIN);
        }
        return false;
    }]
}

var listener = {
    "onServerStarted": function () {
        serverState = true;
    },
    "onPlaceBlock": function (/** @type {any} */ player, /** @type {any} */ block) {
        let blockPosition = FloatPosToVector3(block.pos);
        // 保护他人领地
        if (!hasPermissionByVector3(player, blockPosition)) {
            if (block.id !== 207) {
                Tools.sendTip(player, PROMPT.CANCE_INTERACTION.replace("%MASTER", whoLandByVector3(blockPosition)));
            }
            if (!isOp(player)) {
                return false;
            }
        }
    },
    "onDestroyBlock": function (/** @type {any} */ player, /** @type {any} */ block) {
        let blockPosition = FloatPosToVector3(block.pos);
        // 保护他人领地
        if (!hasPermissionByVector3(player, blockPosition)) {
            Tools.sendTip(player, PROMPT.CANCE_INTERACTION.replace("%MASTER", whoLandByVector3(blockPosition)));
            if (!isOp(player)) {
                return false;
            }
        }
    },
    "onUseItemOn": function (/** @type {any} */ player, /** @type {any} */ item, /** @type {any} */ block) {
        let player_real_name = player.realName;
        if (setter.has(player_real_name)) {
            // 防止Win10玩家错误触发GUI
            let trad = tradDelay.get(player_real_name);
            if (trad === undefined) {
                tradDelay.set(player_real_name, "undefined");
                setTimeout(function () {
                    tradDelay.delete(player_real_name);
                }, 200);
                Form.sendLandForm(player);
            }
        }
        let blockPosition = FloatPosToVector3(block.pos);
        // 保护他人领地
        if (!hasPermissionByVector3(player, blockPosition)) {
            Tools.sendTip(player, PROMPT.CANCE_INTERACTION.replace("%MASTER", whoLandByVector3(blockPosition)));
            if (!isOp(player)) {
                return false;
            }
        }
    },
    "onUseFrameBlock": function (/** @type {any} */ player, /** @type {any} */ block) {
        let blockPosition = FloatPosToVector3(block.pos);
        // 保护他人领地展示框
        if (!hasPermissionByVector3(player, blockPosition)) {
            Tools.sendTip(player, PROMPT.CANCE_INTERACTION.replace("%MASTER", whoLandByVector3(blockPosition)));
            if (!isOp(player)) {
                return false;
            }
        }
    },
    "onLiquidFlow": function (/** @type {any} */ block, /** @type {any} */ intPos) {
        let blockPosition = FloatPosToVector3(block.pos);
        let from_land_string = whoLand(Math.floor(blockPosition.x), Math.floor(blockPosition.z), blockPosition.getDimensionId());
        let to_land_string = whoLand(Math.floor(intPos.x), Math.floor(intPos.z), intPos.dimid);
        // 保护他人领地不被外来流体破坏
        if (to_land_string !== null) {
            if (from_land_string !== to_land_string) {
                return false;
            }
        }
    },
    "onFireSpread": function (/** @type {any} */ intPos) {
        let land_string = whoLand(Math.floor(intPos.x), Math.floor(intPos.z), intPos.dimid);
        // 保护他人领地不被烧毁
        if (land_string !== null) {
            return false;
        }
    },
    "onExplode": function (/** @type {any} */ entity, /** @type {any} */ floatPos, /** @type {any} */ power, /** @type {any} */ range, /** @type {any} */ isDestroy, /** @type {any} */ isFire) {
        // 保护他人领地不被实体炸毁
        let master = getNearLand(Math.floor(floatPos.x), Math.floor(floatPos.z), floatPos.dimid);
        if (master !== undefined) {
            return false;
        }
    },
    "onRespawnAnchorExplode": function (/** @type {any} */ intPos, /** @type {any} */ player) {
        // 保护他人领地不被重生锚炸毁
        let master = getNearLand(intPos.x, intPos.z, intPos.dimid);
        if (master !== undefined) {
            return false;
        }
    },
    "onOpenContainer": function (/** @type {any} */ player, /** @type {any} */ block) {
        let blockPosition = FloatPosToVector3(block.pos);
        // 保护他人领地容器
        if (!hasPermissionByVector3(player, blockPosition)) {
            Tools.sendTip(player, PROMPT.CANCE_INTERACTION.replace("%MASTER", whoLandByVector3(blockPosition)));
            if (!isOp(player)) {
                return false;
            }
        }
    },
    "onRide": function (/** @type {any} */ ride, /** @type {any} */ entity) {
        let player = ride.toPlayer();
        if (player !== null && player !== undefined) {
            // try
            if (typeof (player.realName) === "undefined") {
                return false;
            }
            let entityPosition = FloatPosToVector3(entity.pos);
            // 保护他人领地坐骑
            if (!hasPermissionByVector3(player, entityPosition)) {
                Tools.sendTip(player, PROMPT.CANCE_RIDE.replace("%MASTER", whoLandByVector3(entityPosition)));
                if (!isOp(player)) {
                    return false;
                }
            }
        }
    },
    "onBlockInteracted": function (/** @type {any} */ player, /** @type {any} */ block) {
        let blockPosition = FloatPosToVector3(block.pos);
        // 保护他人领地互交方块
        if (!hasPermissionByVector3(player, blockPosition)) {
            Tools.sendTip(player, PROMPT.CANCE_INTERACTION.replace("%MASTER", whoLandByVector3(blockPosition)));
            if (!isOp(player)) {
                return false;
            }
        }
    },
    "onAttack": function (/** @type {any} */ player, /** @type {any} */ entity) {
        let entityPosition = FloatPosToVector3(entity.pos);
        // 保护他人领地生物
        if (!hasPermissionByVector3(player, entityPosition)) {
            Tools.sendTip(player, PROMPT.CANCE_ATTACK.replace("%MASTER", whoLandByVector3(entityPosition)));
            if (!isOp(player)) {
                return false;
            }
        }
    },
    "onWitherBossDestroy": function (/** @type {any} */ entity, /** @type {any} */ intPos, /** @type {any} */ intPos2) {
        // 保护他人领地不被凋零破坏
        return false;
    },
    "onLeft": function (/** @type {any} */ player) {
        // 离开游戏退出圈地模式
        quitEnclosure(player);
    }
}

/** @type {Map<string, Vector3>} */
var MOVE_CHACK_MAP = new Map();
/** @type {Map<string, Vector3>} */
var setter = new Map();
/** @type {Map<string, Vector3>} */
var ender = new Map();
/** @type {Map<string, Land>} */
var landHashMap = new Map();
// 玩家是否进入某个领地
var playerInLand = new Map();
/** @type {Map<string, number>} */
var tipDelay = new Map();

/** @param {any} player */
function isOp(player) {
    return player.permLevel == 1;
}

/** @param {string} message */
function info(message) {
    // @ts-ignore
    log("[MyLand] " + message);
}

/** @param {string} message */
function warn(message) {
    // @ts-ignore
    colorLog("yellow", "[MyLand] " + message);
}

/**
 * @param {string} player_real_name
 * @param {string} messageOne
 * @param {string} messageTwo
 */
function sendTitle(player_real_name, messageOne, messageTwo) {
    // @ts-ignore
    mc.runcmd('title \"' + player_real_name + '\" title ' + messageOne);
    // @ts-ignore
    mc.runcmd('title \"' + player_real_name + '\" subtitle ' + messageTwo);
}

onEnable();
function onEnable() {
    info("开始读取领地数据...");
    let load = JSON.parse(CONFIG.read());
    for (let land_string in load) {
        let map = new Map();
        let landData = load[land_string];
        map.set("title", landData.title);

        // 默认兼容开启状态
        let open = landData.open;
        if (open === undefined) {
            open = true;
        }

        map.set("open", open);
        map.set("master", landData.master);
        map.set("masterXuid", landData.masterXuid);
        let friends_map = new Map();
        for (let friends_name in landData.friends) {
            friends_map.set(friends_name, landData.friends[friends_name]);
        }
        map.set("friends", friends_map);
        landHashMap.set(land_string, new Land(land_string, map));
    }
    info("领地数据读取完毕...");
    warn("=============== 食用方法 ===============");
    // @register-commands
    for (let command_name in commands) {
        // @ts-ignore
        mc.regPlayerCmd(command_name, commands[command_name][0], commands[command_name][1]);
        warn("| " + commands[command_name][0] + ": /" + command_name);
    }
    warn("========================================");
    // @register-events
    for (let event_name in listener) {
        // @ts-ignore
        mc.listen(event_name, listener[event_name]);
    }
    onUpdate();
    info("加载成功...");
}

function onUpdate() {
    if (serverState) {
        buildLandParticle();
        // @ts-ignore
        let allPlayer = mc.getOnlinePlayers();
        for (let index = 0; index < allPlayer.length; index++) {
            let hasUpdate = true;
            let player = allPlayer[index];
            let player_real_name = player.realName;
            let playerPosition = FloatPosToVector3(player.pos);
            let land_string = getLandString(playerPosition.getFloorX(), playerPosition.getFloorZ(), playerPosition.getDimensionId());
            if (land_string !== null) {
                let land = landHashMap.get(land_string);
                if (land !== undefined) {
                    let haulBack = false;
                    if (!land.isOpen() && !isOp(player)) {
                        // 拉回
                        if (!land.hasPermission(player)) {
                            let old = MOVE_CHACK_MAP.get(player_real_name);
                            if (old !== undefined) {
                                // 防止被囚禁
                                let check = getLandString(old.getFloorX(), old.getFloorZ(), old.getDimensionId());
                                if (check === null) {
                                    player.teleport(old.x, old.y, old.z, old.dimensionId);
                                    Tools.sendTip(player, PROMPT.REFUSED_WALK_IN.replace("%MASTER", land.getMaster()));
                                    haulBack = true;
                                    hasUpdate = false;
                                }
                            }
                        }
                    }
                    if (!haulBack) {
                        let delay = tipDelay.get(player_real_name);
                        if (!playerInLand.has(player_real_name) || playerInLand.get(player_real_name) !== land) {
                            Tools.sendTip(player, PROMPT.WALK_IN.replace("%MASTER", land.getMaster()));
                            playerInLand.set(player_real_name, land);
                            if (delay === undefined || delay < 7) {
                                tipDelay.set(player_real_name, 7);
                            }
                        } else {
                            if (delay === undefined) {
                                Tools.sendTip(player, "§l" + (land.hasPermission(player) ? "§7" : "§e") + land.getTitle());
                            }
                        }
                        if (delay !== undefined) {
                            if (delay > 0) {
                                tipDelay.set(player_real_name, delay - 1);
                            } else {
                                tipDelay.delete(player_real_name);
                            }
                        }
                    }
                }
            } else if (playerInLand.has(player_real_name)) {
                let land = playerInLand.get(player_real_name);
                if (land !== undefined) {
                    Tools.sendTip(player, PROMPT.WALK_OUT.replace("%MASTER", land.getMaster()));
                    playerInLand.delete(player_real_name);
                }
            }
            // 更新位置, 以便获取可拉回位置
            if (hasUpdate) {
                let old = MOVE_CHACK_MAP.get(player_real_name);
                if (old === undefined || !old.equals(playerPosition)) {
                    MOVE_CHACK_MAP.set(player_real_name, playerPosition);
                }
            }
        }
    }
    setTimeout(onUpdate, 200);
}

function buildLandParticle() {
    setter.forEach(function (start, player_real_name) {
        // @ts-ignore
        let player = mc.getPlayer(player_real_name);
        if (player !== undefined) {
            let end = FloatPosToVector3(player.pos);
            if (ender.has(player_real_name)) {
                end = ender.get(player_real_name);
            }
            let min_x = Math.min(start.getFloorX(), end.getFloorX());
            let max_x = Math.max(start.getFloorX(), end.getFloorX());
            let min_z = Math.min(start.getFloorZ(), end.getFloorZ());
            let max_z = Math.max(start.getFloorZ(), end.getFloorZ());

            if ((max_x - min_x) > MAX_LAND_SCOPE_DISTANCE || (max_z - min_z) > MAX_LAND_SCOPE_DISTANCE) {
                player.sendMessage(PLUGIN_NAME + "§c领地过大, 平面范围不能超过 §f" + MAX_LAND_SCOPE_DISTANCE + " * " + MAX_LAND_SCOPE_DISTANCE + " §c!");
                quitEnclosure(player);
            } else {
                let y = start.getFloorY();
                let dimensionId = start.getDimensionId();
                for (let x = min_x; x <= max_x; x++) {
                    // @ts-ignore
                    mc.spawnParticle(x + 0.5, y + 0.2, min_z + 0.5, dimensionId, "minecraft:falling_dust_top_snow_particle");
                    // @ts-ignore
                    mc.spawnParticle(x + 0.5, y + 0.2, max_z + 0.5, dimensionId, "minecraft:falling_dust_top_snow_particle");
                }
                for (let z = min_z; z <= max_z; z++) {
                    // @ts-ignore
                    mc.spawnParticle(min_x + 0.5, y + 0.2, z + 0.5, dimensionId, "minecraft:falling_dust_top_snow_particle");
                    // @ts-ignore
                    mc.spawnParticle(max_x + 0.5, y + 0.2, z + 0.5, dimensionId, "minecraft:falling_dust_top_snow_particle");
                }
            }
        }
    });
}

function saveLandConfig() {
    let obj = Object.create(null);
    for (let [key, value] of landHashMap) {
        obj[key] = value.getData();
    }
    CONFIG.write(JSON.stringify(obj, null, "\t"));
}

/**
 * @param {any} player
 */
function quitEnclosure(player) {
    let player_real_name = player.realName;
    if (setter.has(player_real_name)) {
        setter.delete(player_real_name);
        Tools.sendMessage(player, PROMPT.END_ENCLOSURE);
    }
    ender.delete(player_real_name);
}

/**
 * @param {string} land_string
 * @param {Map<any, any>} data
 */
function createLand(land_string, data) {
    let land = new Land(land_string, data);
    landHashMap.set(land_string, land);
    saveLandConfig();
    land.generateBorder();
}

/**
 * @param {string} land_string
 */
function removeLand(land_string) {
    landHashMap.delete(land_string);
    saveLandConfig();
}

/**
 * @param {number} x
 * @param {number} z
 * @param {number} dimensionId
 */
function getLandString(x, z, dimensionId) {
    let landString = null;
    for (let land of landHashMap.values()) {
        if (land.inTheLand(x, z, dimensionId)) {
            landString = land.getLandString();
            break;
        }
    }
    return landString;
}

/**
 * @param {number} x
 * @param {number} z
 * @param {number} dimensionId
 */
function whoLand(x, z, dimensionId) {
    let land_string = getLandString(x, z, dimensionId);
    if (land_string !== null) {
        return landHashMap.get(land_string).getMaster();
    }
    return null;
}

/**
 * @param {Vector3} vector3
 */
function whoLandByVector3(vector3) {
    return whoLand(vector3.getFloorX(), vector3.getFloorZ(), vector3.dimensionId);
}

/**
 * @param {number} intX
 * @param {number} intZ
 * @param {number} dimensionId
 */
function getNearLand(intX, intZ, dimensionId) {
    let protect_scope = 10;
    let who_land = undefined;
    for (let x = - protect_scope; x < protect_scope; x++) {
        if (who_land !== undefined) {
            break;
        }
        for (let z = - protect_scope; z < protect_scope; z++) {
            let master = whoLand(Math.floor(intX + x), Math.floor(intZ + z), dimensionId);
            if (master !== null) {
                who_land = master;
                break;
            }
        }
    }
    return who_land;
}

/**
 * @param {any} player
 * @param {number} [x]
 * @param {number} [z]
 * @param {number} [dimensionId]
 */
function hasPermission(player, x, z, dimensionId) {
    let land_string = getLandString(x, z, dimensionId);
    if (land_string !== null) {
        return landHashMap.get(land_string).hasPermission(player);
    }
    return true;
}

/**
 * @param {any} player
 * @param {Vector3} [vector3]
 */
function hasPermissionByVector3(player, vector3) {
    return hasPermission(player, vector3.getFloorX(), vector3.getFloorZ(), vector3.dimensionId);
}

/**
 * @param {any} player
 */
function isOverlap(player) {
    let player_real_name = player.realName;
    let start = setter.get(player_real_name);
    let end = FloatPosToVector3(player.pos);
    let min_x = Math.min(start.getFloorX(), end.getFloorX());
    let max_x = Math.max(start.getFloorX(), end.getFloorX());
    let min_z = Math.min(start.getFloorZ(), end.getFloorZ());
    let max_z = Math.max(start.getFloorZ(), end.getFloorZ());
    for (let x = min_x; x < max_x; x++) {
        for (let z = min_z; z < max_z; z++) {
            if (whoLand(x, z, end.dimensionId) !== null) {
                return true;
            }
        }
    }
    return false;
}

/**
 * @param {string} str
 */
function toVector3(str) {
    let strings = str.split(":");
    return new Vector3(parseFloat(strings[0]), parseFloat(strings[1]), parseFloat(strings[2]), parseInt(strings[3]));
}

/**
 * @param {any} floatPos
 */
function FloatPosToVector3(floatPos) {
    if (floatPos === undefined) {
        return new Vector3(0, 0, 0, 0);
    }
    return new Vector3(floatPos.x, floatPos.y, floatPos.z, floatPos.dimid);
}

/**
 *  @param {any} player
 *  @returns {any}
 */
function myMoney(player) {
    // @ts-ignore
    return money.get(player.xuid);
}

/**
 * @param {any} player
 * @param {number} value
 */
function addMoney(player, value) {
    // @ts-ignore
    money.add(player.xuid, Math.floor(value));
}

/**
 * @param {any} player
 * @param {number} value
 */
function reduceMoney(player, value) {
    // @ts-ignore
    money.reduce(player.xuid, Math.floor(value));
}
