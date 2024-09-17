//=============================================================================
// CRTA_TimerManager.js
//=============================================================================
 
/*:
 * @plugindesc v1.1.0 タイマー関係の管理プラグイン
 * @author tokineco@cretia studio
 *
 * @param Font Size
 * @desc フォントサイズ
 * Default: 32
 * @default 32
 *
 * @param Width
 * @desc 横幅
 * Default: 96
 * @default 96
 *
 * @param Height
 * @desc 縦幅
 * Default: 48
 * @default 48
 *
 * @param Position X
 * @desc X位置
 * Default: Graphics.width - this.bitmap.width
 * @default Graphics.width - this.bitmap.width
 * @param Position Y
 * @desc Y位置
 * Default: 0
 * @default 0
 *
 * @help
 * 概要:
 * ツクール標準のカウントダウンタイマーの表示を変えたり、いろいろな操作を行うプラグインです。
 * 時間延長、減少、停止、再開が行えます。
 *
 * 詳細な使用方法は下記をご覧ください。
 * http://studio.cretia.net/blog/666
 *
 * プラグインコマンド:
 *   CRTA_TimerManager add 10       # タイマーを指定秒数増加させる
 *   CRTA_TimerManager sub 10       # タイマーを指定秒数減少させる
 *   CRTA_TimerManager pause        # タイマーを一時停止させる
 *   CRTA_TimerManager resume       # タイマーを再開させる
 * 
 * ※このプラグインでは、以下を書き換えていますので、本体アップデートや競合に注意してください。
 *    Sprite_Timer.prototype.createBitmap
 *    Sprite_Timer.prototype.updatePosition
 *    Game_Timer.prototype.start
 *    Game_Timer.prototype.update
 * 
 * ライセンス:
 * このプラグインは以下のライセンスのもと、使用することができます。 
 *   Copyright (c) 2016 tokineco
 *   Released under the MIT license
 *   https://github.com/tokineco/RMMV_CRTAPlugins/blob/master/LICENSE
 */
 
(function() {
 
    var parameters = PluginManager.parameters('CRTA_TimerManager');
    var fontSize = Number(parameters['Font Size'] || 32);
    var width = Number(parameters['Width'] || 96);
    var height = Number(parameters['Height'] || 48);
    var posX = String(parameters['Position X']);
    var posY = String(parameters['Position Y']);

    var _timerPause = false;

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'CRTA_TimerManager') {

            switch (args[0]) {
            case 'add':
                $gameTimer.addFrames(eval(args[1]));
                break;
            case 'sub':
                $gameTimer.subFrames(eval(args[1]));
                break;
            case 'pause':
                $gameTimer.pause();
                break;
            case 'resume':
                $gameTimer.resume();
                break;
            }
        }
    };

    var _Sprite_Timer_createBitmap = Sprite_Timer.prototype.createBitmap;
    Sprite_Timer.prototype.createBitmap = function() {
        _Sprite_Timer_createBitmap.call(this);

        this.bitmap.width = width;
        this.bitmap.height = height;
        this.bitmap.fontSize = fontSize;
    }

    var _Sprite_Timer_updatePosition = Sprite_Timer.prototype.updatePosition;
    Sprite_Timer.prototype.updatePosition = function() {
        _Sprite_Timer_updatePosition.call(this);

        this.x = eval(posX);
        this.y = eval(posY);
    };


    //=================================
    // Game_Timer (プラグインスクリプト用)
    //=================================
    // override
    var _Game_Timer_start = Game_Timer.prototype.start;
    Game_Timer.prototype.start = function(count) {
        _Game_Timer_start.call(this, count);
        _timerPause = false;
    };

    // override
    var _Game_Timer_update = Game_Timer.prototype.update;
    Game_Timer.prototype.update = function(sceneActive) {
        if (!_timerPause) {
            _Game_Timer_update.call(this, sceneActive);
        }
    };

    // Game_Timer に addFrames を追加
    Game_Timer.prototype.addFrames = function(second) {
        this._frames += second * 60;
    };

    // Game_Timer に subFrames を追加
    Game_Timer.prototype.subFrames = function(second) {
        this._frames -= second * 60;
        if (this._frames < 0) {
            this._frames = 0;
        }
    };

    // Game_Timer に pause を追加
    Game_Timer.prototype.pause = function() {
        _timerPause = true;
    };

    // Game_Timer に resume を追加
    Game_Timer.prototype.resume = function() {
        _timerPause = false;
    };

})();