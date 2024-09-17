//■データベース全て取得■■■■■■■■■■■■■■■■■■■■■■■■
Game_Interpreter.prototype.AllItemGet = function () {
    for (var i = 1; i < $dataWeapons.length; i++) {
        if ($dataWeapons[i].description != "") {
            $gameParty.gainItem($dataWeapons[i], 1);
        }
    }
    for (var i = 1; i < $dataArmors.length; i++) {
        if ($dataArmors[i].description != "") {
            $gameParty.gainItem($dataArmors[i], 1);
        }
    }
    for (var i = 1; i < $dataItems.length; i++) {
        if ($dataItems[i].itypeId == 2 || $dataItems[i].itypeId == 4) {
            $gameParty.gainItem($dataItems[i], 1);
        }
    }
}