/*:
 * @plugindesc 
 * @version 1.0
 */

/*:ja
 * @plugindesc ぬぷ竜の暗黒プログラム::弄っちゃダメよ
 * @version 1.0
 */
//■ピクチャ関係■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
var NP_原点 = 0; //原点： 0:左上 1:中心 2:右上
//----------------------------------
var _NP_ImageCacheArr = [];
var _NPicZureX = 0; //全体のズレ設定X
var _NPicZureY = 0; //全体のズレ設定Y
//Pictureの表示（簡易）
Game_Interpreter.prototype.SetPict = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    var setx = typeof setx !== 'undefined' ? setx : 0;
    var sety = typeof sety !== 'undefined' ? sety : 0;
    var opi = typeof opi !== 'undefined' ? opi : 255;
    var mx = typeof mx !== 'undefined' ? mx : 100;
    var my = typeof my !== 'undefined' ? my : 100;
    var _blend = typeof _blend !== 'undefined' ? _blend : 0;
    setx += _NPicZureX; sety += _NPicZureY;
    _NP_ImageCacheArr.push(FileName);
    $gameScreen.showPicture(PicNo, FileName, NP_原点, setx, sety, mx, my, opi, _blend);
    NP_原点 = 0; //左上に戻す
}
//Pictureの表示（簡易）中央
Game_Interpreter.prototype.SetPictC = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    NP_原点 = 1;
    this.SetPict(PicNo, FileName, setx, sety, opi, mx, my, _blend);
}
Game_Interpreter.prototype.SetPictR = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    NP_原点 = 2;
    this.SetPict(PicNo, FileName, setx, sety, opi, mx, my, _blend);
    DebugPicNo(PicNo, "SetPictR");
}
Game_Interpreter.prototype.SetPictB = function (PicNo, FileName, setx, sety, opi, mx, my, _blend) {
    NP_原点 = 3;
    this.SetPict(PicNo, FileName, setx, sety, opi, mx, my, _blend);
    DebugPicNo(PicNo, "SetPictB");
}

//■ピクチャアニメ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ PictureAnimation.js
var PPicAnimeLoopFlg = true;
var _PAnimeCenterFlg = false;
var PicAnimeOne = function(){ //次のアニメをワンショットにする
    PPicAnimeLoopFlg = false;
}
var _PicAnimeLCLoop = 0;
var PicAnimeLCLoop = function (_lcnt) { //最後のセルを指定回数ループするようにする
    _PicAnimeLCLoop = _lcnt;
}

var _PlayPicAnime_RenFlg = false; //trueの時：読み込み画像タイプが"連番"になる。
var _PlayPicAnime_Type = 3; //再生タイプ
var _PlayPicAnime_CstmArr = [];
var _PACustmList = [];      //カスタム再生リスト

//◆ 連番読み込みのアニメ再生 ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
Game_Interpreter.prototype.PlayRenAnime = function (PicNo, FileName, CellSu, CellFlm , CellType, setx, sety, opi, mx, my , _CstmArr) {
    var _CstmArr = typeof _CstmArr !== 'undefined' ? _CstmArr : [];
    _PlayPicAnime_RenFlg = true;
    _PlayPicAnime_Type = CellType;
    _PlayPicAnime_CstmArr = _CstmArr;
    this.PlayPicAnime(PicNo, FileName, CellSu, CellFlm, setx, sety, opi, mx, my , _CstmArr);
}
Game_Interpreter.prototype.PlayRenAnimeC = function (PicNo, FileName, CellSu, CellFlm , CellType, setx, sety, opi, mx, my , _CstmArr) {
    _PAnimeCenterFlg = true;
    this.PlayRenAnime(PicNo, FileName, CellSu, CellFlm , CellType, setx, sety, opi, mx, my , _CstmArr);
    _PAnimeCenterFlg = false;
}
Game_Interpreter.prototype.PlayRenAnimeOne = function (PicNo, FileName, CellSu, CellFlm , CellType, setx, sety, opi, mx, my , _CstmArr) {
    PPicAnimeLoopFlg = false;
    this.PlayRenAnime(PicNo, FileName, CellSu, CellFlm , CellType, setx, sety, opi, mx, my , _CstmArr);
}
Game_Interpreter.prototype.PlayRenAnimeCOne = function (PicNo, FileName, CellSu, CellFlm , CellType, setx, sety, opi, mx, my , _CstmArr) {
    PPicAnimeLoopFlg = false;
    this.PlayRenAnimeC(PicNo, FileName, CellSu, CellFlm , CellType, setx, sety, opi, mx, my , _CstmArr);
}

//◆ 通常アニメ再生処理 ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
Game_Interpreter.prototype.PlayPicAnime = function (PicNo, FileName, CellSu, CellFlm, setx, sety, opi, mx, my) {
    var opi = typeof opi !== 'undefined' ? opi : 255;
    var mx = typeof mx !== 'undefined' ? mx : 100;
    var my = typeof my !== 'undefined' ? my : 100;

    var _ALoadStyle = "横";
    if(_PlayPicAnime_RenFlg) _ALoadStyle = "連番"
    var args = [String(CellSu), String(CellFlm), _ALoadStyle, "0"];
    _PlayPicAnime_RenFlg = false;

    this.pluginCommand("PA_INIT", args);
    if (_PAnimeCenterFlg) {
        this.SetPictC(PicNo, FileName, setx, sety, opi, mx, my);
    } else {
        this.SetPict(PicNo, FileName, setx, sety, opi, mx, my);
    }
    args2 = new Array(String(PicNo), String(_PlayPicAnime_Type));
    if(_PlayPicAnime_Type == 3) {
        var _SetCC = "[" + CellSu;
        for (var ci = 1; ci <= CellSu; ci++) {
            if (_SetCC == "[") {
                _SetCC += String(ci);
            } else {
                _SetCC += "," + String(ci)
            }
        }
        if(_PicAnimeLCLoop > 0){
            for (var i = 0; i <= _PicAnimeLCLoop - 1; i++) {
                _SetCC += "," + String(ci - 1); //ラストを連続追加する
            }
        }
        _SetCC += "]";
        if(_PlayPicAnime_CstmArr.length > 0){
            _SetCC = "[";
            for (var i = 0; i <= _PlayPicAnime_CstmArr.length - 1; i++) {
                if (_SetCC == "[") {
                    _SetCC += String(_PlayPicAnime_CstmArr[i]);
                } else {
                    _SetCC += "," + String(_PlayPicAnime_CstmArr[i])
                }
            }
            _SetCC += "]";
        }
        args2 = [String(PicNo), String(_PlayPicAnime_Type), _SetCC];
    }
    if (PPicAnimeLoopFlg) {
        this.pluginCommand("PA_START_LOOP", args2);
    } else {
        this.pluginCommand("PA_START", args2);
    }
    _PlayPicAnime_Type = 3; //通常はカスタム配列とする

    _PicAnimeLCLoop = 0;
    PPicAnimeLoopFlg = true; //ループするように変更

    //アニメ効果音を無効
    this.PicObjGet(PicNo)._SeArr = [];
}
//アニメ表示(中心)
Game_Interpreter.prototype.PlayPicAnimeC = function (PicNo, FileName, CellSu, CellFlm, setx, sety, opi, mx, my) {
    var opi = typeof opi !== 'undefined' ? opi : 255;
    var mx = typeof mx !== 'undefined' ? mx : 100;
    var my = typeof my !== 'undefined' ? my : 100;
    _PAnimeCenterFlg = true;
    this.PlayPicAnime(PicNo, FileName, CellSu, CellFlm, setx, sety, opi, mx, my);
    _PAnimeCenterFlg = false;
}
//アニメーションの特定セル表示
Game_Interpreter.prototype.PicAnimeCell = function (PicNo, FileName, CellSu, _CellNo, setx, sety, opi, mx, my) {
    var _CellNo = typeof _CellNo !== 'undefined' ? _CellNo : 1;
    var opi = typeof opi !== 'undefined' ? opi : 255;
    var mx = typeof mx !== 'undefined' ? mx : 100;
    var my = typeof my !== 'undefined' ? my : 100;
    var CellFlm = 10;
    var args = new Array(String(CellSu), String(CellFlm), "横", "0");
    this.pluginCommand("PA_INIT", args);
    if (_PAnimeCenterFlg) {
        this.SetPictC(PicNo, FileName, setx, sety, opi, mx, my);
    } else {
        this.SetPict(PicNo, FileName, setx, sety, opi, mx, my);
    }
    this.pluginCommand("PA_SET_CELL", [String(PicNo), String(_CellNo)]); //停止
    this.pluginCommand("PA_STOP_FORCE", [String(PicNo)]); //停止
}
Game_Interpreter.prototype.PicAnimeCellC = function (PicNo, FileName, CellSu, _CellNo, setx, sety, opi, mx, my) {
    var _CellNo = typeof _CellNo !== 'undefined' ? _CellNo : 1;
    var opi = typeof opi !== 'undefined' ? opi : 255;
    var mx = typeof mx !== 'undefined' ? mx : 100;
    var my = typeof my !== 'undefined' ? my : 100;
    _PAnimeCenterFlg = true;
    this.PicAnimeCell(PicNo, FileName, CellSu, _CellNo, setx, sety, opi, mx, my);
    _PAnimeCenterFlg = false;
}
Game_Interpreter.prototype.PicAnimeCellCng = function (PicNo, _CellNo) {
    this.pluginCommand("PA_SET_CELL", [String(PicNo), String(_CellNo)]); //停止
}
//■ アニメSE再生処理 ■■■■■■■■■■■■■■■■■■
//アニメ更新処理対応
var N_AnimeUpdate = Game_Picture.prototype.updateAnimationFrame;
Game_Picture.prototype.updateAnimationFrame = function() {
    N_AnimeUpdate.call(this);
    if(this._SeArr == undefined) this._SeArr = [];
    for (var i = 0; i <= this._SeArr.length - 1; i++) {
        if(this._SeArr[i][0] == (this.cell) && (this._Befcell != this.cell)){
            var SetName = this._SeArr[i][1];
            var SetVol = typeof SetVol !== 'undefined' ? SetVol : 90;
            var SetPic = typeof SetPic !== 'undefined' ? SetPic : 100;
            var SetPn = typeof SetPn !== 'undefined' ? SetPn : 0;
            AudioManager.playSe({ "name": SetName, "volume": SetVol, "pitch": SetPic, "pan": SetPn });
        }
    }
    if(this._Befcell == undefined) this._Befcell = this.cell;
    this._Befcell = this.cell;
}
Game_Interpreter.prototype.PicAnimeSeSet = function (_PicNo , _SeArr) {
    this.PicObjGet(_PicNo)._SeArr = _SeArr;
}

//■基幹システム■■■■■■■■■■■■■■■■■■■■■■■■
//ファイルパスが入力されている時は、それを優先する:ロード追加機能
ImageManager.loadBitmap = function (folder, filename, hue, smooth) {
    if (filename) {
        var path = folder + encodeURIComponent(filename) + '.png';
        if (filename.indexOf('/') !== -1) {
            path = "img/" + filename + '.png';
        }
        var bitmap = this.loadNormalBitmap(path, hue || 0);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};
Game_Interpreter.prototype.PicObjGet = function (_PicNo) {
    if ($gameScreen.picture(_PicNo) != undefined) { //nullのピクチャは移動させない
        return $gameScreen.PicObjGet(_PicNo);
    }
    return null;
}
Game_Screen.prototype.PicObjGet = function (_PicNo) {
    var realPictureId = this.realPictureId(_PicNo);
    return this._pictures[realPictureId];
};