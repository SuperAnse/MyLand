var PLUGIN_NAME = "§l[系统] ";
// @ts-ignore
var CONFIG = data.openConfig("plugins/MyLand/Config.json", "json");

// by: anseEND
// 联系QQ: 2335607935

// 领地购买单价
var LAND_BUY_PRICE = 100;
// 领地卖出单价
var LAND_SELL_PRICE = 100;
// 领地边界方块名字
var BORDER_BLOCK_NAME = "stone";

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
     * @param {{ realName: string; xuid: string; }} player
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
     * @param {{ realName: any; xuid: any; }} player
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
     * @param {{ realName: any; xuid: any; }} player
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
        let player = mc.getPlayer(this.master);
        if (player !== null) {
            let command = "setblock " + intPos.x + " " + intPos.y + " " + intPos.z + " " + BORDER_BLOCK_NAME;
            // @ts-ignore
            mc.runcmd("execute \"" + player.realName + "\" ~ ~ ~ " + command)
        }
    }

    generateBorder() {
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
            if (block.id != 0) {
                let findY = i;
                if(block.name.indexOf(BORDER_BLOCK_NAME) != -1){
                    findY = i + 1;
                }
                // @ts-ignore
                blockPos = mc.newIntPos(x, findY, z, dimension);
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
            if (isOverlap(player)) {
                setter.delete(player_real_name);
                player.tell(PLUGIN_NAME + "§c不能覆盖到其他的领地.");
            } else {
                let end = FloatPosToVector3(player.pos).floor();
                let start = setter.get(player_real_name);
                if (start.dimensionId !== end.dimensionId) {
                    setter.delete(player_real_name);
                    player.tell(PLUGIN_NAME + "§c无法跨维度圈地.");
                } else {
                    Form.sendBuyLandForm(player, end);
                    ender.set(player_real_name, end);
                }
            }
        } else {
            // @ts-ignore
            let simple = mc.newSimpleForm();
            simple.setTitle('领地系统');
            simple.setContent('你的钱数: ' + parseInt(myMoney(player)));
            simple.addButton("我的领地", "textures/ui/dressing_room_animation");
            simple.addButton("好友领地", "textures/ui/dressing_room_skins");
            simple.addButton("我要圈地", "textures/ui/icon_new");
            player.sendForm(simple, function (/** @type {{ realName: any; pos: any; tell: (arg0: string) => void; }} */ player, /** @type {any} */ buttonId) {
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
                        player.tell(PLUGIN_NAME + "§a你已进入圈地模式.");
                        sendTitle(player_real_name, "§l§e-== §f设置领地范围 §e==-", "§l§f点击地面进行(以自身位置判断)§e下一步§f操作");
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
        simple.setTitle('全部领地');
        simple.setContent('你的钱数: ' + parseInt(myMoney(player)));
        let my_lands = new Map();
        let id = 0;
        landHashMap.forEach(function (land, landName) {
            my_lands.set("" + id, land);
            simple.addButton(land.getTitle() + "\nMaster: " + land.getMaster(), "textures/ui/pointer");
            id += 1;
        });
        player.sendForm(simple, function (/** @type {{ teleport: (arg0: any, arg1: any, arg2: any, arg3: any) => void; tell: (arg0: string) => void; }} */ player, /** @type {string} */ buttonId) {
            if (buttonId === undefined) {
                return;
            }
            let land = my_lands.get("" + buttonId);
            if (land !== undefined) {
                let safe_spawn = land.getSafeSpawn();
                player.teleport(safe_spawn.x, safe_spawn.y, safe_spawn.z, safe_spawn.dimensionId);
                player.tell(PLUGIN_NAME + "§f你来到了§e " + land.getMaster() + " §f的§e " + land.getTitle() + " §f!");
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
        simple.setTitle('我的领地');
        simple.setContent('你的钱数: ' + parseInt(myMoney(player)));
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

        player.sendForm(simple, function (/** @type {{ sendForm: (arg0: any, arg1: (player: any, buttonId: any) => void) => void; }} */ player, /** @type {string} */ buttonId) {
            if (buttonId === undefined) {
                return;
            }
            let land = my_lands.get("" + buttonId);
            if (land !== undefined) {
                // @ts-ignore
                let formAdmin = mc.newSimpleForm();
                formAdmin.setTitle("领地管理: " + land.getTitle());
                // 切换状态
                formAdmin.addButton("领地门禁", "textures/ui/" + (land.isOpen() ? "icon_unlocked" : "icon_lock"));
                formAdmin.addButton("更改名字", "textures/ui/icon_fall");
                formAdmin.addButton("回到领地", "textures/ui/pointer");
                formAdmin.addButton("领地共享", "textures/ui/icon_multiplayer");
                formAdmin.addButton("领地转让", "textures/ui/dressing_room_customization");
                formAdmin.addButton("卖出领地", "textures/ui/storexblsignin");

                player.sendForm(formAdmin, function (/** @type {{ sendForm: (arg0: any, arg1: { (player: any, data: any): void; (player: any, buttonId: any): void; (player: any, data: any): void; }) => void; teleport: (arg0: any, arg1: any, arg2: any, arg3: any) => void; tell: (arg0: string) => void; sendModalForm: (arg0: string, arg1: string, arg2: string, arg3: string, arg4: (player: any, bool: any) => void) => void; }} */ player, /** @type {any} */ buttonId) {
                    if (buttonId === undefined) {
                        return;
                    }
                    switch (buttonId) {
                        case 0:
                            player.sendModalForm("领地门禁", "是否允许陌生人进入领地参观?", "允许", "拒绝", function (/** @type {any} */ player, /** @type {any} */ bool) {
                                if (bool === undefined) {
                                    return;
                                }
                                if (bool) {
                                    land.setOpen(true);
                                    player.tell(PLUGIN_NAME + "§a门禁已关闭! 将允许陌生人进入领地参观!");
                                } else {
                                    land.setOpen(false);
                                    player.tell(PLUGIN_NAME + "§e门禁已打开! 将拒绝陌生人进入领地参观!");
                                }
                                land.saveLand();
                            });
                            break;
                        case 1:
                            // @ts-ignore
                            let change = mc.newCustomForm();
                            change.setTitle("更改名字");
                            change.addInput("新的名字", "Home name", "");
                            player.sendForm(change, function (/** @type {{ tell: (arg0: string) => void; }} */ player, /** @type {string[]} */ data) {
                                if (data === undefined) {
                                    return;
                                }
                                let new_title = data[0].replace("\n", "").replace(".", "");
                                if (new_title !== "") {
                                    let old_title = land.getTitle();
                                    land.setTitle(new_title);
                                    land.saveLand();
                                    player.tell(PLUGIN_NAME + "§f领地§e " + old_title + " §f改名为§e " + new_title + " §f!");
                                } else {
                                    player.tell(PLUGIN_NAME + "§c领地名不可为空!");
                                }
                            });
                            break;
                        case 2:
                            let safe_spawn = land.getSafeSpawn();
                            player.teleport(safe_spawn.getFloorX(), safe_spawn.getFloorY(), safe_spawn.getFloorZ(), safe_spawn.getDimensionId());
                            player.tell(PLUGIN_NAME + "§f你来到了自己的§e " + land.getTitle() + " §f!");
                            break;
                        case 3:
                            // @ts-ignore
                            let friendSystemForm = mc.newSimpleForm();
                            friendSystemForm.addButton("添加共享", "textures/ui/profile_new_look");
                            //todo
                            let myFriends = new Map();
                            let id = 0;
                            land.getFriends().forEach(function (/** @type {any} */ friend_xuid, /** @type {any} */ friend_name) {
                                friendSystemForm.addButton(friend_name, "textures/ui/warning_alex");
                                myFriends.set(id, friend_name);
                                id += 1;
                            });
                            player.sendForm(friendSystemForm, function (/** @type {{ sendForm: (arg0: any, arg1: (player: any, data: any) => void) => void; sendModalForm: (arg0: string, arg1: string, arg2: string, arg3: string, arg4: (player: any, bool: any) => void) => void; }} */ player, /** @type {number} */ buttonId) {
                                if (buttonId === undefined) {
                                    return;
                                }
                                if (buttonId === 0) {
                                    // @ts-ignore
                                    let addFriendForm = mc.newCustomForm();
                                    addFriendForm.setTitle("添加共享");

                                    let items = [];
                                    // @ts-ignore
                                    let allPlayer = mc.getOnlinePlayers();
                                    for (let index = 0; index < allPlayer.length; index++) {
                                        let online_player = allPlayer[index];
                                        items[index] = online_player.realName;
                                    }
                                    addFriendForm.addDropdown("请选择玩家", items, 0);

                                    player.sendForm(addFriendForm, function (/** @type {{ tell: (arg0: string) => void; realName: string; }} */ player, /** @type {(string | number)[]} */ data) {
                                        if (data === undefined) {
                                            return;
                                        }
                                        let friend_name = items[data[0]];
                                        // @ts-ignore
                                        let newFriend = mc.getPlayer(friend_name);
                                        if (newFriend !== undefined) {
                                            land.addFriend(newFriend);
                                            land.saveLand();
                                            player.tell(PLUGIN_NAME + "§f玩家§e " + newFriend.realName + " §f可以用你的§e " + land.getTitle() + " §f领地了!");
                                            newFriend.tell(PLUGIN_NAME + "§f玩家§e " + player.realName + " §f给你了他的§e " + land.getTitle() + " §f领地使用权限!");
                                        } else {
                                            player.tell(PLUGIN_NAME + "§c玩家§e " + friend_name + " §c必须在线!");
                                        }
                                    });
                                } else {
                                    let friend_name = myFriends.get(buttonId - 1);
                                    player.sendModalForm("操作确认", "不再共享给 " + friend_name + " ?", "踢了他", "点错了", function (/** @type {{ tell: (arg0: string) => void; }} */ player, /** @type {any} */ bool) {
                                        if (bool === undefined) {
                                            return;
                                        }
                                        if (bool) {
                                            land.removeFriend(friend_name);
                                            land.saveLand();
                                            player.tell(PLUGIN_NAME + "§f已将§e " + friend_name + " §f从你的§e " + land.getTitle() + " §f领地中踢出!");
                                        } else {
                                            player.tell(PLUGIN_NAME + "§f操作取消!");
                                        }
                                    });
                                }
                            });
                            break;
                        case 4:
                            // @ts-ignore
                            let make_over = mc.newCustomForm();
                            make_over.setTitle("领地转让");
                            make_over.addInput("请输入玩家名字 ➦区分大小写注意空格", "", "");
                            player.sendForm(make_over, function (/** @type {{ tell: (arg0: string) => void; realName: string; }} */ player, /** @type {string[]} */ data) {
                                if (data === undefined) {
                                    return;
                                }
                                let target_name = data[0].replace("\n", "").replace(".", "");
                                // @ts-ignore
                                let target = mc.getPlayer(target_name);
                                if (target !== undefined) {
                                    land.setMaster(target);
                                    land.saveLand();
                                    player.tell(PLUGIN_NAME + "§f你成功将你的§e " + land.getTitle() + " §f领地送给了玩家§e " + target.realName + " §f!");
                                    target.tell(PLUGIN_NAME + "§f玩家§e " + player.realName + " §f将Ta的§e " + land.getTitle() + " §f领地送给了你!");
                                } else {
                                    player.tell(PLUGIN_NAME + "§c玩家§e " + target_name + " §c必须在线!");
                                }
                            });
                            break;
                        case 5:
                            let money_count = land.getStartVector2().squared(land.getEndVector2()) * LAND_SELL_PRICE;
                            player.sendModalForm("操作确认", "以 " + Math.floor(money_count) + " 块钱的价格卖出 " + land.getTitle() + " ?", "卖了换钱", "我再想想", function (/** @type {{ tell: (arg0: string) => void; }} */ player, /** @type {any} */ bool) {
                                if (bool === undefined) {
                                    return;
                                }
                                if (bool) {
                                    land.getFriends().forEach(function (/** @type {any} */ friend_xuid, /** @type {any} */ friend_name) {
                                        // @ts-ignore
                                        let friend = mc.getPlayer(friend_name);
                                        if (friend !== undefined) {
                                            friend.tell(PLUGIN_NAME + "§f你的朋友§e " + land.getMaster() + " §f将Ta的§e " + land.getTitle() + " §f领地卖掉了");
                                        }
                                    });
                                    removeLand(land.getLandString());
                                    addMoney(player, money_count);
                                    player.tell(PLUGIN_NAME + "§f领地已卖出, 获得§e " + Math.floor(money_count) + " §f块钱!");
                                } else {
                                    player.tell(PLUGIN_NAME + "§f操作取消!");
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
        simple.setTitle('好友领地');
        simple.setContent('你的钱数: ' + parseInt(myMoney(player)));
        let my_lands = new Map();
        let id = 0;
        landHashMap.forEach(function (land, landName) {
            if (land.isFriend(player)) {
                my_lands.set("" + id, land);
                simple.addButton(land.getTitle(), "textures/ui/pointer");
                id += 1;
            }
        });
        player.sendForm(simple, function (/** @type {{ teleport: (arg0: any, arg1: any, arg2: any, arg3: any) => void; tell: (arg0: string) => void; }} */ player, /** @type {string} */ buttonId) {
            if (buttonId === undefined) {
                return;
            }
            let land = my_lands.get("" + buttonId);
            if (land !== undefined) {
                let safe_spawn = land.getSafeSpawn();
                player.teleport(safe_spawn.x, safe_spawn.y, safe_spawn.z, safe_spawn.dimensionId);
                player.tell(PLUGIN_NAME + "§f你来到了§e " + land.getMaster() + " §f的§e " + land.getTitle() + " §f!");
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
            player.tell(PLUGIN_NAME + "§c你需要设置起点.");
            return;
        }
        let start = setter.get(player_real_name);
        let need_money = start.toVector2().squared(end.toVector2()) * LAND_BUY_PRICE;

        // @ts-ignore
        let simple = mc.newSimpleForm();
        simple.setTitle("    §l购买这块地需要" + Math.floor(need_money) + "块钱, 要买吗?   继续圈 ➦");
        simple.setContent('你的钱数: ' + parseInt(myMoney(player)));
        simple.addButton("我要购买", "textures/ui/MCoin");
        simple.addButton("§l取消圈地", "textures/ui/icon_trash");

        player.sendForm(simple, function (/** @type {{ realName: any; xuid: any; tell: (arg0: string) => void; sendForm: (arg0: any, arg1: (player: any, data: any) => void) => void; }} */ player, /** @type {any} */ buttonId) {
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
                        map.set("title", "家");
                        map.set("open", true);
                        map.set("master", player_real_name);
                        map.set("masterXuid", player.xuid);
                        map.set("friends", new Map());
                        createLand(land_string, map);

                        reduceMoney(player, need_money);

                        setter.delete(player_real_name);
                        player.tell(PLUGIN_NAME + "§a圈地成功, 共花费了§c " + Math.floor(need_money) + "§a 块钱.");

                        // @ts-ignore
                        let change = mc.newCustomForm();
                        change.setTitle("恭喜! 圈地成功");
                        change.addInput("给你的新领地起个名字吧!", "Home name", player_real_name + "的新家");
                        player.sendForm(change, function (/** @type {{ tell: (arg0: string) => void; }} */ player, /** @type {string[]} */ data) {
                            if (data === undefined) {
                                return;
                            }
                            let title = data[0].replace("\n", "").replace(".", "");
                            if (title !== "") {
                                let land = landHashMap.get(land_string);
                                land.setTitle(title);
                                land.saveLand();
                                player.tell(PLUGIN_NAME + "§f新的领地命名为 §e" + title + "§f !");
                            } else {
                                player.tell(PLUGIN_NAME + "§c领地名不可为空!");
                            }
                        });
                    } else {
                        setter.delete(player_real_name);
                        player.tell(PLUGIN_NAME + "§c你的钱不够.");
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
    // @ts-ignore
    mc.regPlayerCmd("land", "领地指令.", function (/** @type {any} */ player, /** @type {any} */ args) {
        Form.sendLandForm(player);
        return false;
    });
    // @ts-ignore
    mc.regPlayerCmd("landlist", "领地列表.", function (/** @type {{ tell: (arg0: string) => void; }} */ player, /** @type {any} */ args) {
        //todo
        if (isOp(player)) {
            Form.sendLandListForm(player);
        } else {
            player.tell(PLUGIN_NAME + "§c你不是管理员.");
        }
        return false;
    });
    // @ts-ignore
    mc.regPlayerCmd("myland", "我的领地.", function (/** @type {any} */ player, /** @type {any} */ args) {
        Form.sendMyLandsForm(player);
        return false;
    });
    // @ts-ignore
    mc.regPlayerCmd("removeland", "删除脚下领地.", function (/** @type {{ pos: any; tell: (arg0: string) => void; }} */ player, /** @type {any} */ args) {
        if (isOp(player)) {
            let playerPos = FloatPosToVector3(player.pos);
            let land_string = getLandString(playerPos.getFloorX(), playerPos.getFloorZ(), playerPos.getDimensionId());
            if (land_string !== null) {
                removeLand(land_string);
                player.tell(PLUGIN_NAME + "§a已将脚下的领地删除.");
            } else {
                player.tell(PLUGIN_NAME + "§c你的脚下并没有领地.");
            }
        } else {
            player.tell(PLUGIN_NAME + "§c你不是管理员.");
        }
        return false;
    });
    onUpdate();
    info("加载成功...");
}

function onUpdate() {
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
                                player.tell("§c你无法进入 §f" + land.getMaster() + " §c的领地", 5);
                                haulBack = true;
                            }
                        }
                        hasUpdate = false;
                    }
                }
                if (!haulBack) {
                    let delay = tipDelay.get(player_real_name);
                    if (!playerInLand.has(player_real_name) || playerInLand.get(player_real_name) !== land) {
                        player.tell("§e你进入了 §f" + land.getMaster() + " §e的领地", 5);
                        playerInLand.set(player_real_name, land);
                        if (delay === undefined || delay < 7) {
                            tipDelay.set(player_real_name, 7);
                        }
                    } else {
                        if (delay === undefined) {
                            player.tell("§l" + (land.hasPermission(player) ? "§7" : "§e") + land.getTitle(), 5);
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
                player.tell("§7你离开了 §f" + land.getMaster() + " §7的领地", 5);
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
    });
}

/**
 * @param {string} event
 * @param {any} v
 */
function registerEvent(event, v) {
    // @ts-ignore
    mc.listen(event, v);
}

registerEvent("onPlaceBlock", function (/** @type {{ tell: (arg0: string, arg1: number) => void; }} */ player, /** @type {{ pos: any; id: number; }} */ block) {
    let blockPosition = FloatPosToVector3(block.pos);
    // 保护他人领地
    if (!hasPermissionByVector3(player, blockPosition)) {
        if (block.id !== 207) {
            player.tell("§l§c停止, 这是 §f" + whoLandByVector3(blockPosition) + "§c 的领地哦", 5);
        }
        if (!isOp(player)) {
            return false;
        }
    }
});

registerEvent("onDestroyBlock", function (/** @type {{ tell: (arg0: string, arg1: number) => void; }} */ player, /** @type {{ pos: any; }} */ block) {
    let blockPosition = FloatPosToVector3(block.pos);
    // 保护他人领地
    if (!hasPermissionByVector3(player, blockPosition)) {
        player.tell("§l§c停止, 这是 §f" + whoLandByVector3(blockPosition) + "§c 的领地哦", 5);
        if (!isOp(player)) {
            return false;
        }
    }
});

registerEvent("onUseItemOn", function (/** @type {{ realName: any; tell: (arg0: string, arg1: number) => void; }} */ player, /** @type {any} */ item, /** @type {{ pos: any; }} */ block) {
    // todo
    let player_real_name = player.realName;
    if (setter.has(player_real_name)) {
        Form.sendLandForm(player);
    }
    let blockPosition = FloatPosToVector3(block.pos);
    // 保护他人领地
    if (!hasPermissionByVector3(player, blockPosition)) {
        player.tell("§l§c停止, 这是 §f" + whoLandByVector3(blockPosition) + "§c 的领地哦", 5);
        if (!isOp(player)) {
            return false;
        }
    }
});

registerEvent("onUseFrameBlock", function (/** @type {{ tell: (arg0: string, arg1: number) => void; }} */ player, /** @type {{ pos: any; }} */ block) {
    let blockPosition = FloatPosToVector3(block.pos);
    // 保护他人领地展示框
    if (!hasPermissionByVector3(player, blockPosition)) {
        player.tell("§l§c停止, 这是 §f" + whoLandByVector3(blockPosition) + "§c 的领地哦", 5);
        if (!isOp(player)) {
            return false;
        }
    }
});

registerEvent("onLiquidFlow", function (/** @type {{ pos: any; }} */ block, /** @type {{ x: number; z: number; dimid: number; }} */ intPos) {
    let blockPosition = FloatPosToVector3(block.pos);
    let from_land_string = whoLand(Math.floor(blockPosition.x), Math.floor(blockPosition.z), blockPosition.getDimensionId());
    let to_land_string = whoLand(Math.floor(intPos.x), Math.floor(intPos.z), intPos.dimid);
    // 保护他人领地不被外来流体破坏
    if (to_land_string !== null) {
        if (from_land_string !== to_land_string) {
            return false;
        }
    }
});

registerEvent("onFireSpread", function (/** @type {{ x: number; z: number; dimid: number; }} */ intPos) {
    let land_string = whoLand(Math.floor(intPos.x), Math.floor(intPos.z), intPos.dimid);
    // 保护他人领地不被烧毁
    if (land_string !== null) {
        return false;
    }
});

registerEvent("onExplode", function (/** @type {any} */ entity, /** @type {{ x: number; z: number; dimid: number; }} */ floatPos, /** @type {any} */ power, /** @type {any} */ range, /** @type {any} */ isDestroy, /** @type {any} */ isFire) {
    // 保护他人领地不被实体炸毁
    let master = getNearLand(Math.floor(floatPos.x), Math.floor(floatPos.z), floatPos.dimid);
    if (master !== undefined) {
        return false;
    }
});

registerEvent("onRespawnAnchorExplode", function (/** @type {{ x: number; z: number; dimid: number; }} */ intPos, /** @type {any} */ player) {
    // 保护他人领地不被重生锚炸毁
    let master = getNearLand(intPos.x, intPos.z, intPos.dimid);
    if (master !== undefined) {
        return false;
    }
});

registerEvent("onOpenContainer", function (/** @type {{ tell: (arg0: string, arg1: number) => void; }} */ player, /** @type {{ pos: any; }} */ block) {
    let blockPosition = FloatPosToVector3(block.pos);
    // 保护他人领地容器
    if (!hasPermissionByVector3(player, blockPosition)) {
        player.tell("§l§c停止, 这是 §f" + whoLandByVector3(blockPosition) + "§c 的领地哦", 5);
        if (!isOp(player)) {
            return false;
        }
    }
});

registerEvent("onRide", function (/** @type {{ toPlayer: () => any; }} */ ride, /** @type {{ pos: any; }} */ entity) {
    let player = ride.toPlayer();
    if (player !== null) {
        let entityPosition = FloatPosToVector3(entity.pos);
        // 保护他人领地坐骑
        if (!hasPermissionByVector3(player, entityPosition)) {
            player.tell("§l§c你不能在 §f" + whoLandByVector3(entityPosition) + "§c 的领地中骑乘实体", 5);
            if (!isOp(player)) {
                return false;
            }
        }
    }
});

registerEvent("onBlockInteracted", function (/** @type {{ tell: (arg0: string, arg1: number) => void; }} */ player, /** @type {{ pos: any; }} */ block) {
    let blockPosition = FloatPosToVector3(block.pos);
    // 保护他人领地互交方块
    if (!hasPermissionByVector3(player, blockPosition)) {
        player.tell("§l§c停止, 这是 §f" + whoLandByVector3(blockPosition) + "§c 的领地哦", 5);
        if (!isOp(player)) {
            return false;
        }
    }
});

registerEvent("onAttack", function (/** @type {{ tell: (arg0: string, arg1: number) => void; }} */ player, /** @type {{ pos: any; }} */ entity) {
    let entityPosition = FloatPosToVector3(entity.pos);
    // 保护他人领地生物
    if (!hasPermissionByVector3(player, entityPosition)) {
        player.tell("§l§c你不能在 §f" + whoLandByVector3(entityPosition) + "§c 的领地中发动攻击", 5);
        if (!isOp(player)) {
            return false;
        }
    }
});


registerEvent("onWitherBossDestroy", function (/** @type {any} */ entity, /** @type {any} */ intPos, /** @type {any} */ intPos2) {
    // 保护他人领地不被凋零破坏
    return false;
});

registerEvent("onLeft", function (/** @type {any} */ player) {
    // 离开游戏退出圈地模式
    quitEnclosure(player);
});

function saveLandConfig() {
    let obj = Object.create(null);
    for (let [key, value] of landHashMap) {
        obj[key] = value.getData();
    }
    CONFIG.write(JSON.stringify(obj, null, "\t"));
}

/**
 * @param {{ realName: any; tell: (arg0: string) => void; }} player
 */
function quitEnclosure(player) {
    let player_real_name = player.realName;
    if (setter.has(player_real_name)) {
        setter.delete(player_real_name);
        player.tell(PLUGIN_NAME + "§c你已退出圈地模式.");
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
 * @param {{ x: number; y: number; z: number; dimid: number; }} floatPos
 */
function FloatPosToVector3(floatPos) {
    if (floatPos === undefined) {
        return new Vector3(0, 0, 0, 0);
    }
    return new Vector3(floatPos.x, floatPos.y, floatPos.z, floatPos.dimid);
}

/** @param {any} player */
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
