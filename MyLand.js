var PLUGIN_NAME = "§l[系统] ";
var CONFIG = data.openConfig("plugins/MyLand/Config.json", "json");

var LAND_PRICE = 100;
var form = getPluginForm();

// 圈地Map<playerName, startPos>
var setter = new Map();
// 领地Map<landName, Land>
var landHashMap = new Map();
var playerMessageTip = new Map();
// 玩家是否进入某个领地
var playerInLand = new Map();

function isOp(player) {
    return player.permLevel == 1;
}

function info(message) {
    log("[MyLand] " + message);
}

function sendTitle(player_real_name, messageOne, messageTwo) {
    mc.runcmd('title \"' + player_real_name + '\" title ' + messageOne);
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
        map.set("master", landData.master);
        map.set("masterXuid", landData.masterXuid);
        let friends_map = new Map();
        for (let friends_name in landData.friends) {
            friends_map.set(friends_name, landData.friends[friends_name]);
        }
        map.set("friends", friends_map);
        landHashMap.set(land_string, getLandClass(land_string, map));
    }
    info("领地数据读取完毕...");

    mc.regPlayerCmd("land", "领地指令.", function (player, args) {
        form.sendLandForm(player);
        return false;
    });
    mc.regPlayerCmd("landlist", "领地列表.", function (player, args) {
        //todo
        if (isOp(player)) {
            form.sendLandListForm(player);
        } else {
            player.tell(PLUGIN_NAME + "§c你不是管理员.");
        }
        return false;
    });
    mc.regPlayerCmd("myland", "我的领地.", function (player, args) {
        form.sendMyLandsForm(player);
        return false;
    });
    mc.regPlayerCmd("removeland", "删除脚下领地.", function (player, args) {
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
    //  领地显示延迟
    playerMessageTip = new Map();
    // todo 更多功能...

    buildLandParticle();
    setTimeout(onUpdate, 200);
}

function buildLandParticle() {
    setter.forEach(function (start, player_real_name) {
        let player = mc.getPlayer(player_real_name);
        if (player !== undefined) {
            let end = FloatPosToVector3(player.pos);
            let min_x = Math.min(start.getFloorX(), end.getFloorX());
            let max_x = Math.max(start.getFloorX(), end.getFloorX());
            let min_z = Math.min(start.getFloorZ(), end.getFloorZ());
            let max_z = Math.max(start.getFloorZ(), end.getFloorZ());
            let y = start.getFloorY();
            let dimensionId = start.getDimensionId();
            for (let x = min_x; x < max_x; x++) {
                mc.spawnParticle(x + 0.5, y + 0.2, min_z + 0.5, dimensionId, "minecraft:falling_dust_top_snow_particle");
                mc.spawnParticle(x + 0.5, y + 0.2, max_z + 0.5, dimensionId, "minecraft:falling_dust_top_snow_particle");
            }
            for (let z = min_z; z < max_z; z++) {
                mc.spawnParticle(min_x + 0.5, y + 0.2, z + 0.5, dimensionId, "minecraft:falling_dust_top_snow_particle");
                mc.spawnParticle(max_x + 0.5, y + 0.2, z + 0.5, dimensionId, "minecraft:falling_dust_top_snow_particle");
            }
        }
    });
}

function sendTipDelay(player, message) {
    let player_real_name = player.realName;
    if (!playerMessageTip.has(player_real_name)) {
        player.tell(message, 5);
        playerMessageTip.set(player_real_name, message);
    }
}

mc.listen("onMove", function (player) {
    let player_real_name = player.realName;
    let playerPosition = FloatPosToVector3(player.pos);
    let land_string = getLandString(playerPosition.getFloorX(), playerPosition.getFloorZ(), playerPosition.getDimensionId());
    if (land_string !== null) {
        let land = landHashMap.get(land_string);
        sendTipDelay(player, "§l" + (land.hasPermission(player) ? "§7" : "§e") + land.getTitle());

        if (!playerInLand.has(player_real_name) || playerInLand.get(player_real_name) !== land) {
            playerInLand.set(player_real_name, land);
            //显示边界粒子
            land.showBorder(10);
        }
    } else if (playerInLand.has(player_real_name)) {
        let land = playerInLand.get(player_real_name);
        //显示边界粒子
        land.showBorder(10);
        playerInLand.delete(player_real_name);
    }
});

mc.listen("onPlaceBlock", function (player, block) {
    let blockPosition = FloatPosToVector3(block.pos);
    // 保护他人领地
    if (!hasPermission(player, blockPosition.getFloorX(), blockPosition.getFloorZ(), blockPosition.getDimensionId())) {
        if (block.id !== 207) {
            player.tell("§l§c停止, 这是 §f" + whoLand(blockPosition.getFloorX(), blockPosition.getFloorZ(), blockPosition.getDimensionId()) + "§c 的领地哦", 5);
        }
        if (!isOp(player)) {
            return false;
        }
    }
});

mc.listen("onDestroyBlock", function (player, block) {
    let blockPosition = FloatPosToVector3(block.pos);
    // 保护他人领地
    if (!hasPermission(player, blockPosition.getFloorX(), blockPosition.getFloorZ(), blockPosition.getDimensionId())) {
        player.tell("§l§c停止, 这是 §f" + whoLand(blockPosition.getFloorX(), blockPosition.getFloorZ(), blockPosition.getDimensionId()) + "§c 的领地哦", 5);
        if (!isOp(player)) {
            return false;
        }
    }
});

mc.listen("onUseItemOn", function (player, item, block) {
    let player_real_name = player.realName;
    if (setter.has(player_real_name)) {
        form.sendLandForm(player);
    }
    let blockPosition = FloatPosToVector3(block.pos);
    // 保护他人领地
    if (!hasPermission(player, blockPosition.getFloorX(), blockPosition.getFloorZ(), blockPosition.getDimensionId())) {
        player.tell("§l§c停止, 这是 §f" + whoLand(blockPosition.getFloorX(), blockPosition.getFloorZ(), blockPosition.getDimensionId()) + "§c 的领地哦", 5);
        if (!isOp(player)) {
            return false;
        }
    }
});

mc.listen("onUseFrameBlock", function (player, block) {
    let blockPosition = FloatPosToVector3(block.pos);
    // 保护他人领地展示框
    if (!hasPermission(player, blockPosition.getFloorX(), blockPosition.getFloorZ(), blockPosition.getDimensionId())) {
        player.tell("§l§c停止, 这是 §f" + whoLand(blockPosition.getFloorX(), blockPosition.getFloorZ(), blockPosition.getDimensionId()) + "§c 的领地哦", 5);
        if (!isOp(player)) {
            return false;
        }
    }
});

mc.listen("onLiquidFlow", function (block, intPos) {
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

mc.listen("onFireSpread", function (intPos) {
    let land_string = whoLand(Math.floor(intPos.x), Math.floor(intPos.z), intPos.dimid);
    // 保护他人领地不被烧毁
    if (land_string !== null) {
        return false;
    }
});

mc.listen("onExplode", function (entity, floatPos, power, range, isDestroy, isFire) {
    // 保护他人领地不被实体炸毁
    let master = getNearLand(Math.floor(floatPos.x), Math.floor(floatPos.z), floatPos.dimid);
    if (master !== undefined) {
        return false;
    }
});

mc.listen("onRespawnAnchorExplode", function (intPos, player) {
    // 保护他人领地不被重生锚炸毁
    let master = getNearLand(intPos.x, intPos.z, intPos.dimid);
    if (master !== undefined) {
        return false;
    }
});

mc.listen("onWitherBossDestroy", function (entity, intPos, intPos2) {
    // 保护他人领地不被凋零破坏
    return false;
});

function saveLandConfig() {
    let obj = Object.create(null);
    for (let [key, value] of landHashMap) {
        obj[key] = value.getData();
    }
    CONFIG.write(JSON.stringify(obj, null, "\t"));
}

function quitEnclosure(player) {
    let player_real_name = player.realName;
    if (setter.has(player_real_name)) {
        setter.delete(player_real_name);
        player.tell(PLUGIN_NAME + "§c你已退出圈地模式.");
    }
}

function createLand(land_string, data) {
    landHashMap.set(land_string, getLandClass(land_string, data));
    saveLandConfig();
}

function removeLand(land_string) {
    landHashMap.delete(land_string);
    saveLandConfig();
}

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

function whoLand(x, z, dimensionId) {
    let land_string = getLandString(x, z, dimensionId);
    if (land_string !== null) {
        return landHashMap.get(land_string).getMaster();
    }
    return null;
}

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

function hasPermission(player, x, z, dimensionId) {
    let land_string = getLandString(x, z, dimensionId);
    if (land_string !== null) {
        return landHashMap.get(land_string).hasPermission(player);
    }
    return true;
}

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

//todo Vector3, Vector2, Land
function toVector3(str) {
    let strings = str.split(":");
    return getVector3(parseFloat(strings[0]), parseFloat(strings[1]), parseFloat(strings[2]), parseInt(strings[3]));
}

function FloatPosToVector3(floatPos) {
    if (floatPos === undefined) {
        return getVector3(0, 0, 0, 0);
    }
    return getVector3(floatPos.x, floatPos.y, floatPos.z, floatPos.dimid);
}

function getVector3(x, y, z, dimensionId) {
    let vector3 = {};
    vector3.x = x;
    vector3.y = y;
    vector3.z = z;
    vector3.dimensionId = dimensionId;

    vector3.getX = function () {
        return vector3.x;
    };
    vector3.getY = function () {
        return vector3.y;
    };
    vector3.getZ = function () {
        return vector3.z;
    };

    vector3.getFloorX = function () {
        return Math.floor(vector3.x);
    };

    vector3.getFloorY = function () {
        return Math.floor(vector3.y);
    };

    vector3.getFloorZ = function () {
        return Math.floor(vector3.z);
    };

    vector3.addVector3 = function (pos) {
        return getVector3(vector3.x + pos.x, vector3.y + pos.y, vector3.z + pos.z);
    };

    vector3.getDimensionId = function () {
        return vector3.dimensionId;
    };

    vector3.add = function (addX, addY, addZ) {
        let newX = (addX !== undefined) ? vector3.x + addX : vector3.x;
        let newY = (addY !== undefined) ? vector3.y + addY : vector3.y;
        let newZ = (addZ !== undefined) ? vector3.z + addZ : vector3.z;
        return getVector3(newX, newY, newZ, vector3.dimensionId);
    };

    vector3.floor = function () {
        return getVector3(vector3.getFloorX(), vector3.getFloorY(), vector3.getFloorZ(), vector3.dimensionId);
    };

    vector3.distance = function (pos) {
        return Math.sqrt(vector3.distanceSquared(pos));
    };

    vector3.distanceSquared = function (pos) {
        return Math.pow(vector3.x - pos.x, 2) + Math.pow(vector3.y - pos.y, 2) + Math.pow(vector3.z - pos.z, 2);
    };

    vector3.toVector2 = function () {
        return getVector2(vector3.x, vector3.z);
    };

    vector3.toStr = function () {
        return vector3.getFloorX() + ":" + vector3.getFloorY() + ":" + vector3.getFloorZ() + ":" + vector3.dimensionId;
    };
    return vector3;
}

function getVector2(x, y) {
    let vector2 = {};
    vector2.x = x;
    vector2.y = y;

    vector2.getX = function () {
        return vector2.x;
    };
    vector2.getY = function () {
        return vector2.y;
    };
    vector2.getFloorX = function () {
        return Math.floor(vector2.x);
    };
    vector2.getFloorY = function () {
        return Math.floor(vector2.y);
    };
    vector2.distance = function (vector) {
        return Math.sqrt(vector2.distanceSquared(vector.x, vector.y));
    };
    vector2.distanceSquared = function (x, y) {
        return Math.pow(vector2.x - x, 2) + Math.pow(vector2.y - y, 2);
    };

    vector2.squared = function (end) {
        let startX = vector2.x;
        let startY = vector2.y;
        let endX = end.x;
        let endY = end.y;
        let width = ((startX > endX) ? (startX - endX) : (endX - startX)) + 1;
        let height = ((startY > endY) ? (startY - endY) : (endY - startY)) + 1;
        return parseInt(width * height);
    };
    return vector2;
}

function getLandClass(land_string, data) {

    let land = {};
    land.land_string = land_string;
    let strings = land_string.split("::");
    land.start = toVector3(strings[0]);
    land.end = toVector3(strings[1]);
    land.master = "" + data.get("master");
    land.masterXuid = "" + data.get("masterXuid");
    land.title = "" + data.get("title");
    land.friends = data.get("friends");

    land.getData = function () {
        let map = {};
        map["master"] = land.master;
        map["masterXuid"] = land.masterXuid;

        map["title"] = land.title;
        let friends_obj = Object.create(null);
        for (let [friends_key, friends_value] of land.friends) {
            friends_obj[friends_key] = friends_value;
        }
        map["friends"] = friends_obj;
        return map;
    };

    land.getLandString = function () {
        return land.land_string;
    };

    land.getStartVector2 = function () {
        return getVector2(land.start.x, land.start.z);
    };

    land.getEndVector2 = function () {
        return getVector2(land.end.x, land.end.z);
    };

    land.getMaster = function () {
        return land.master;
    };

    land.setMaster = function (player) {
        land.master = player.realName;
        land.masterXuid = player.xuid;
    };

    land.getTitle = function () {
        return land.title;
    };

    land.setTitle = function (title) {
        land.title = title;
    };

    land.getFriends = function () {
        return land.friends;
    };

    land.addFriend = function (player) {
        let player_real_name = player.realName;
        if (!land.friends.has(player_real_name)) {
            land.friends.set(player_real_name, player.xuid)
        }
    };

    land.removeFriend = function (player_real_name) {
        if (land.friends.has(player_real_name)) {
            land.friends.delete(player_real_name)
        }
    };

    land.isMaster = function (player) {
        let player_real_name = player.realName;
        let player_xuid = player.xuid;

        // 使用XUID判断，自动同步名字
        let sameUuid = land.masterXuid === player_xuid;
        if (sameUuid && land.master !== player_real_name) {
            land.master = player_real_name;
        }
        return sameUuid;
    };

    land.isFriend = function (player) {
        let player_real_name = player.realName;
        let player_xuid = player.xuid;
        let hasFriend = false;
        let hasUpdateFriendName = false;
        land.friends.forEach(function (friend_xuid, friend_name) {
            if (player_xuid === friend_xuid) {
                hasFriend = true;
                if (player_real_name !== friend_name) {
                    hasUpdateFriendName = true;
                }
            }
        });
        // 自动更新朋友名字
        if (hasUpdateFriendName) {
            land.friends.delete(friend_name);
            land.friends.set(player_real_name, player_xuid);
            land.saveLand();
        }
        return hasFriend;
    };

    land.getSafeSpawn = function () {
        return land.end;
    };

    land.inTheLand = function (x, z, dimensionId) {
        if (land.start.dimensionId !== dimensionId) {
            return false;
        }
        let min_x = Math.min(land.start.x, land.end.x);
        let max_x = Math.max(land.start.x, land.end.x);
        let min_z = Math.min(land.start.z, land.end.z);
        let max_z = Math.max(land.start.z, land.end.z);
        return (x >= min_x && x <= max_x && z >= min_z && z <= max_z);
    };

    land.hasPermission = function (player) {
        if (land.isMaster(player)) {
            return true;
        }
        return land.isFriend(player);
    };

    land.showBorder = function (tick) {
        if (land.showTick <= 0) {
            land.show(tick);
        } else {
            land.showTick = tick;
            land.showTickChange = true;
        }
    };

    land.showTick = 0;
    land.showTickChange = false;
    land.show = function (number) {
        if (land.showTickChange) {
            land.showTickChange = false;
        } else {
            land.showTick = number;
        }
        let min_x = Math.min(land.start.getFloorX(), land.end.getFloorX());
        let max_x = Math.max(land.start.getFloorX(), land.end.getFloorX());
        let min_z = Math.min(land.start.getFloorZ(), land.end.getFloorZ());
        let max_z = Math.max(land.start.getFloorZ(), land.end.getFloorZ());
        let y = land.start.getFloorY();
        let dimensionId = land.start.getDimensionId();
        for (let x = min_x; x < max_x; x++) {
            mc.spawnParticle(x + 0.5, y + 0.2, min_z + 0.5, dimensionId, "minecraft:falling_dust_top_snow_particle");
            mc.spawnParticle(x + 0.5, y + 0.2, max_z + 0.5, dimensionId, "minecraft:falling_dust_top_snow_particle");
        }
        for (let z = min_z; z < max_z; z++) {
            mc.spawnParticle(min_x + 0.5, y + 0.2, z + 0.5, dimensionId, "minecraft:falling_dust_top_snow_particle");
            mc.spawnParticle(max_x + 0.5, y + 0.2, z + 0.5, dimensionId, "minecraft:falling_dust_top_snow_particle");
        }
        if (land.showTick > 0) {
            setTimeout(function () {
                land.show(land.showTick - 1);
            }, 200);
        }

    }

    land.saveLand = function () {
        saveLandConfig();
    };
    return land;
}

function getPluginForm() {
    let form = {};

    form.sendLandForm = function (player) {
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
                    form.sendBuyLandForm(player, end);
                }
            }
        } else {
            let simple = mc.newSimpleForm();
            simple.setTitle('领地系统');
            simple.setContent('你的钱数: ' + parseInt(myMoney(player)));
            simple.addButton("我的领地", "textures/ui/dressing_room_animation");
            simple.addButton("好友领地", "textures/ui/dressing_room_skins");
            simple.addButton("我要圈地", "textures/ui/icon_new");
            player.sendForm(simple, function (player, buttonId) {
                let player_real_name = player.realName;
                if (buttonId === undefined) {
                    return;
                }
                switch (buttonId) {
                    case 0:
                        form.sendMyLandsForm(player);
                        break;
                    case 1:
                        form.sendFriendsLandForm(player);
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

    form.sendLandListForm = function (player) {
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
        player.sendForm(simple, function (player, buttonId) {
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

    form.sendMyLandsForm = function (player) {
        let player_real_name = player.realName;
        let simple = mc.newSimpleForm();
        simple.setTitle('我的领地');
        simple.setContent('你的钱数: ' + parseInt(myMoney(player)));
        let my_lands = new Map();
        let id = 0;
        for (let land of landHashMap.values()) {
            if (land.isMaster(player)) {
                my_lands.set("" + id, land);
                simple.addButton(land.getTitle(), "textures/ui/icon_spring");
                id += 1;
            }
        }

        player.sendForm(simple, function (player, buttonId) {
            if (buttonId === undefined) {
                return;
            }
            let land = my_lands.get("" + buttonId);
            if (land !== undefined) {
                let formAdmin = mc.newSimpleForm();
                formAdmin.setTitle("领地管理: " + land.getTitle());
                formAdmin.addButton("更改名字", "textures/ui/icon_fall");
                formAdmin.addButton("回到领地", "textures/ui/pointer");
                formAdmin.addButton("领地共享", "textures/ui/icon_multiplayer");
                formAdmin.addButton("领地转让", "textures/ui/dressing_room_customization");
                formAdmin.addButton("卖出领地", "textures/ui/storexblsignin");

                player.sendForm(formAdmin, function (player, buttonId) {
                    if (buttonId === undefined) {
                        return;
                    }
                    switch (buttonId) {
                        case 0:
                            let change = mc.newCustomForm();
                            change.setTitle("更改名字");
                            change.addInput("新的名字", "Home name", "");
                            player.sendForm(change, function (player, data) {
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
                        case 1:
                            let safe_spawn = land.getSafeSpawn();
                            player.teleport(safe_spawn.getFloorX(), safe_spawn.getFloorY(), safe_spawn.getFloorZ(), safe_spawn.getDimensionId());
                            player.tell(PLUGIN_NAME + "§f你来到了自己的§e " + land.getTitle() + " §f!");
                            break;
                        case 2:
                            let friendSystem = mc.newSimpleForm();
                            friendSystem.addButton("添加共享", "textures/ui/profile_new_look");
                            //todo
                            let myFriends = new Map();
                            let id = 0;
                            land.getFriends().forEach(function (friend_xuid, friend_name) {
                                friendSystem.addButton(friend_name, "textures/ui/warning_alex");
                                myFriends.set(id, friend_name);
                                id += 1;
                            });
                            player.sendForm(friendSystem, function (player, buttonId) {
                                if (buttonId === undefined) {
                                    return;
                                }
                                if (buttonId === 0) {
                                    let addFriend = mc.newCustomForm();
                                    addFriend.setTitle("添加共享");
                                    addFriend.addInput("请输入玩家名字 ➦区分大小写注意空格", "", "");

                                    player.sendForm(addFriend, function (player, data) {
                                        if (data === undefined) {
                                            return;
                                        }
                                        let friend_name = data[0];
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
                                    player.sendModalForm("操作确认", "不再共享给 " + friend_name + " ?", "踢了他", "点错了", function (player, bool) {
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
                        case 3:
                            let make_over = mc.newCustomForm();
                            make_over.setTitle("领地转让");
                            make_over.addInput("请输入玩家名字 ➦区分大小写注意空格", "", "");
                            player.sendForm(make_over, function (player, data) {
                                if (data === undefined) {
                                    return;
                                }
                                let target_name = data[0].replace("\n", "").replace(".", "");
                                let target = mc.getPlayer(friend_name);
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
                        case 4:
                            let money_count = land.getStartVector2().squared(land.getEndVector2()) * LAND_PRICE;
                            player.sendModalForm("操作确认", "以 " + parseInt(money_count) + " 块钱的价格卖出 " + land.getTitle() + " ?", "卖了换钱", "我再想想", function (player, bool) {
                                if (bool === undefined) {
                                    return;
                                }
                                if (bool) {
                                    let money_count = land.getStartVector2().squared(land.getEndVector2()) * LAND_PRICE;
                                    land.getFriends().forEach(function (friend_xuid, friend_name) {
                                        let friend = mc.getPlayer(friend_name);
                                        if (friend !== undefined) {
                                            friend.tell(PLUGIN_NAME + "§f你的朋友§e " + land.getMaster() + " §f将Ta的§e " + land.getTitle() + " §f领地卖掉了");
                                        }
                                    });
                                    removeLand(land.getLandString());
                                    addMoney(player, money_count);
                                    player.tell(PLUGIN_NAME + "§f领地已卖出, 获得§e " + parseInt(money_count) + " §f块钱!");
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

    form.sendFriendsLandForm = function (player) {
        let player_real_name = player.realName;
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
        player.sendForm(simple, function (player, buttonId) {
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

    form.sendBuyLandForm = function (player, end) {
        let player_real_name = player.realName;
        if (!setter.has(player_real_name)) {
            player.tell(PLUGIN_NAME + "§c你需要设置起点.");
            return;
        }
        let start = setter.get(player_real_name);
        let simple = mc.newSimpleForm();
        simple.setTitle("    §l购买这块地需要" + (start.toVector2().squared(end.toVector2()) * LAND_PRICE) + "块钱, 要买吗?   继续圈 ➦");
        simple.setContent('你的钱数: ' + parseInt(myMoney(player)));
        simple.addButton("我要购买", "textures/ui/MCoin");
        simple.addButton("§l取消圈地", "textures/ui/icon_trash");

        player.sendForm(simple, function (player, buttonId) {
            if (buttonId === undefined) {
                return;
            }
            let player_real_name = player.realName;
            let start = setter.get(player_real_name);
            switch (buttonId) {
                case 0:
                    let need_money = start.toVector2().squared(end.toVector2()) * LAND_PRICE;

                    let my_money = myMoney(player);
                    if (my_money >= need_money) {
                        let land_string = start.toStr() + "::" + end.toStr();

                        let map = new Map();
                        map.set("title", "家");
                        map.set("master", player_real_name);
                        map.set("masterXuid", player.xuid);
                        map.set("friends", new Map());
                        createLand(land_string, map);

                        reduceMoney(player, need_money);

                        setter.delete(player_real_name);
                        player.tell(PLUGIN_NAME + "§a圈地成功, 共花费了§c " + parseInt(need_money) + "§a 块钱.");

                        let change = mc.newCustomForm();
                        change.setTitle("恭喜! 圈地成功");
                        change.addInput("给你的新领地起个名字吧!", "Home name", player_real_name + "的新家");
                        player.sendForm(change, function (player, data) {
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
    return form;
}

function myMoney(player) {
    return money.get(player.xuid);
}

function addMoney(player, value) {
    money.add(player.xuid, Math.floor(value));
}

function reduceMoney(player, value) {
    money.reduce(player.xuid, Math.floor(value));
}
