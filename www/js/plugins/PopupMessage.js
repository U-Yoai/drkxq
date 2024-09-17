//
//  ポップアップメッセージ ver1.02
//
// ------------------------------------------------------
// Copyright (c) 2016 Yana
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------
//
// author Yana
//

var Imported = Imported || {};
Imported['PopupMessage'] = 1.02;

if (!Imported.CommonPopupCore) {
    console.error('CommonPopupCoreを導入してください。')
}

/*:
 * @plugindesc ver1.02/メッセージの表示をポップアップに変更する制御文字_pum[delay,x,y,action]を追加します。
 * @author Yana
 * 
 * @param Pop Message FontSize
 * @desc ポップアップメッセージのデフォルトフォントサイズです。
 * @default 28
 * 
 * @param Pop Message Count
 * @desc ポップアップメッセージの表示時間です。
 * @default 120
 *
 * @param Popup Pattern
 * @desc ポップアップパターンの初期設定です。
 * @default Down
 *
 * @help プラグインコマンドはありません。
 * 
 * メッセージの表示のメッセージの中に_pum[delay,x,y,action,pattern]と記述することで、
 * メッセージをポップアップに変更します。
 * delayはディレイ値で、この値フレーム分待ってから、ポップアップを行います。
 * xは表示位置のX座標です。未指定の場合は、0が設定されます。
 * yは表示位置のY座標です。未指定の場合は、画面高さ-ポップアップの高さが設定されます。
 * actionはアクション形式です。1を指定すると、上から下にアクションします。
 * patternは動作パターンです。Normalで今まで通り、GrowUpでにょき、Stretchでうにょーんとなります。
 * ------------------------------------------------------
 * 利用規約
 * ------------------------------------------------------
 * 当プラグインはMITライセンスで公開されています。
 * 使用に制限はありません。商用、アダルト、いずれにも使用できます。
 * 二次配布も制限はしませんが、サポートは行いません。
 * 著作表示は任意です。行わなくても利用できます。
 * 要するに、特に規約はありません。
 * バグ報告や使用方法等のお問合せはネ実ツクールスレ、または、Twitterにお願いします。
 * https://twitter.com/yanatsuki_
 * 素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * このプラグインには「汎用ポップアップベース」のプラグインが必要です。
 * 汎用ポップアップベースより下に配置してください。 
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.03:
 * 各パラメータに制御文字が使用できるように変更。
 * ポップアップパターンのプラグインパラメータを追加。
 * ver1.02:
 * 動作パターンの設定を追加。
 * ver1.01:
 * 表示位置を調整する機能を追加。
 * ver1.00:
 * 公開
 */

(function() {

    'use strict';

    var parameters = PluginManager.parameters('PopupMessage');
    var popMesFontSize = Number(parameters['Pop Message FontSize'] || 28);
    var popMesCount = Number(parameters['Pop Message Count'] || 120);
    var popMesSlide = Number(parameters['Pop Message Slide'] || 60);
    var popupPattern = parameters['Popup Pattern'] || 0;
    var popMesRegExp = /_PUM\[(.+)\]/gi;
    
    var _pMes_GInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _pMes_GInterpreter_pluginCommand.call(this, command, args);
        if (command === 'PopupMessage') {
        }
    };
    
    var _pMes_GInterpreter_c101 = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function(){
        var texts = [];
        var pIndex = this._index;
        var param = {'delay':null};
        while (this.nextEventCode() === 401){
            this._index++;
            texts.push(this.currentCommand().parameters[0]);
        }
        var window = CommonPopupManager.window();
        for(var i=0;i<texts.length;i++){
            if (texts[i].match(popMesRegExp)){
                var ary = [0,null,null,0,popupPattern];
                var text = texts[i].replace(popMesRegExp,function(){
                    var arg = arguments[1].split(',');
                    ary[0] = Number(window.convertEscapeCharacters(arg[0]));
                    if (arg[1]) ary[1] = Number(window.convertEscapeCharacters(arg[1]));
                    if (arg[2]) ary[2] = Number(window.convertEscapeCharacters(arg[2]));
                    if (arg[3]) ary[3] = Number(window.convertEscapeCharacters(arg[3]));
                    if (arg[4]) ary[4] = arg[4];
                    return '';
                }.bind(this));
                texts[i] = text;
                CommonPopupManager.setPopupMessage(this._params, texts, ary);
                return true;
            }
        }
        this._index = pIndex;
        var result = _pMes_GInterpreter_c101.call(this);
        return result;
    };
    
    var _pMes_GMessage_add = Game_Message.prototype.add;
    Game_Message.prototype.add = function(text){
        text = text.replace(popMesRegExp,'');
        _pMes_GMessage_add.call(this,text);
    };
    
    CommonPopupManager.setPopupMessage = function(params,texts,ary){
        this._readyPopup = this._readyPopup || [];
        var bitmap = ImageManager.loadFace(params[0]);
        this.bltCheck(bitmap);
        this._readyPopup.push([params, texts, ary, 'pMessage']);
    };
    
    var _pMes_CPManager_makeBitmap = CommonPopupManager.makeBitmap;
    CommonPopupManager.makeBitmap = function(arg){
        if (arg[3] === 'pMessage'){
            return ImageManager.loadFace(arg[0][0]);
        }else{
            return _pMes_CPManager_makeBitmap.call(this,arg);
        }
    };
    
    var _pMes_CPManager_startPopup = CommonPopupManager.startPopup;
    CommonPopupManager.startPopup = function(arg){
        if (arg[3] === 'pMessage'){
            this.startPopupMessage(arg[0],arg[1],arg[2]);   
        }else{
            _pMes_CPManager_startPopup.call(this,arg);
        }
    };
    
    CommonPopupManager.startPopupMessage = function(params,texts,arg){
        var fontSize = popMesFontSize;
        var oneHeight = (fontSize + 8);
        var height = params[0] ? 144 : oneHeight * texts.length;
        var bitmap = new Bitmap(Graphics.boxWidth, height);
        var faceSize = params[0] === '' ? 0 : 144;
        var delay = arg[0];
        var x = arg[1];
        var y = arg[2];
        var action = arg[3];
        var pattern = arg[4];
        bitmap.fillRect(0, 0, bitmap.width / 2, bitmap.height, 'rgba(0,0,0,0.5)');
        bitmap.gradientFillRect(bitmap.width / 2, 0, bitmap.width / 2, bitmap.height, 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0)');
        this.window().contents = bitmap;
        this.window().drawTextEx('\\FS[' + fontSize + ']', 0, 0);
        this.window().drawFace(params[0],params[1],0,0);
        var iFontSize = fontSize;
        for (var i = 0; i < texts.length; i++) {
            var text = '\\FS[' + iFontSize + ']' + texts[i];
            this.window().drawTextEx(text, 8 + faceSize, i * oneHeight);
            iFontSize = this.window().contents.fontSize;
        }
        var arg = this.setPopup([]);
        arg.bitmap = bitmap;
        if (pattern === 'GrowUp') {
            arg.x = 0;
            arg.y = Graphics.boxHeight;
            arg.moveX = 0;
            arg.anchorX = 0;
            arg.anchorY = 1.0;
            arg.pattern = -2;
        } else if (pattern === 'Stretch'){
            arg.x = 0;
            arg.y = Graphics.boxHeight - height;
            arg.moveX = 0;
            arg.anchorX = 0;
            arg.anchorY = 0;
            arg.pattern = -1;
        } else {
            arg.x = Graphics.boxWidth * -1;
            arg.y = Graphics.boxHeight - height;
            arg.moveX = Graphics.boxWidth;
            arg.anchorX = 0;
            arg.anchorY = 0;
        }
        if (x){ arg.x += x }
        if (y){ arg.y = y }
        if ($gameParty.inBattle()){ arg.y = Math.min(Graphics.boxHeight - 180,arg.y) }
        arg.moveY = 0;
        arg.count = popMesCount;
        arg.fixed = false;
        arg.slideCount = popMesSlide;
        if (action === 1){ arg.slideAction = 'Down' }
        arg.delay = delay;
        this._tempCommonSprites.setNullPos(arg);
    }
})();