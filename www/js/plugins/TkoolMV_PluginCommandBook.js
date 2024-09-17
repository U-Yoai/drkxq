//=============================================================================
// TkoolMV_PluginCommandBook.js
// https://github.com/AlecYawata/TkoolMV_PluginCommandBook
//=============================================================================
//
// Copyright (c) 2015 Alec
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//
//=============================================================================
/*:
 * @plugindesc プラグインコマンド集
 * @author 有志の皆さん
 *
 * @param 制御文字の拡張
 * @desc このプラグインで使えるパラメータの制御文字を
 * 通常のメッセージなどで使用できるようにするか(はい/いいえ)
 * Default: はい
 * @default はい
 *
 * @param スクリプトに制御文字適用
 * @desc スクリプト実行時に制御文字を使用できるようにするか(はい/いいえ)
 * Default: いいえ
 * @default いいえ
 *
 * @help
 *  Copyright (c) 2015 Alec
 *  This software is released under the MIT License.
 *  http://opensource.org/licenses/mit-license.php
 *
 * このプラグインは有志によるプラグインコマンド集です。
 * 商用利用、年齢制限のあるゲームへの使用、改変が可能です。
 * クレジットは不要です。
 * このプラグインはTitleCommandPosition.jsからLoopAnimation処理のみを抜き出したものです
 * ■使い方
 * イベントのコマンド追加からプラグインコマンドを選択し、
 * 以下のプラグインコマンドから好きなモノを選んで入力して下さい。
 * 
 * ■パラメータについて
 * プラグインコマンドの右に空白をつけてパラメータを追記することができます。
 * パラメータは数字、英数字、日本語、記号など以外にも以下のような制御文字が使えます。
 * （各数字部分には全角数字も使えます）
 * \V[n] 変数n番目の値に置き換えられます
 * \N[n] アクターn番の名前に置き換えられます
 * \P[n] パーティメンバーn番の値に置き換えられます
 * \G 　　通貨単位に置き換えられます
 * \In[n] アイテムn番の名前に置き換えられます
 * \Ip[n] アイテムn番の価格に置き換えられます
 * \Sn[n] スキルn番の名前に置き換えられます
 * \Js[X]\Js XをJavaScriptとして評価した値に置き換えられます
 * 
 * その他使用可能な制御文字や、\Js[X]\Jsで使えるスクリプトについては、下記シートを参照してください。
 * https://docs.google.com/spreadsheets/d/1rOIzDuhLC6IqJPEFciYOmXWL_O7X9-hMValMs7DpWCk/
 * 
 * ■プラグインコマンド
 * ===========================================================================
 * 指定位置にループアニメーション表示(English：Show_Loop_Animation)
 *  画面上の座標を指定してアニメーションを再生します。
 *  消去するか新たなアニメーションを指定するまでループ再生されます。
 * パラメータ：
 *  引数1：X座標
 *  引数2：Y座標
 *  引数3：アニメーションID
 * 使用例
 *  指定位置にループアニメーション表示 320 240 1
 *  Show_Loop_Animation \v[1] \v[2] 1
 * ===========================================================================
 * ループアニメーション消去(English：Erase_Loop_Animation)
 *  ループ再生しているアニメーションを消去します。
 * パラメータ：
 *  なし
 * 使用例
 *  ループアニメーション消去
 *  Erase_Loop_Animation
 * ===========================================================================
 */

(function(){
    'use strict';
    
    //制御文字の拡張
    Game_Interpreter.prototype.pluginCommandBook_unescape = function(text) {
        //全角数字を半角数字に変換する
        var wstringToString = function(text) {
            text = text.replace(/[０-９]/g, function(c) {
                return String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
            });
            return text;
        };
        var getActorName = function(n) {
            var actor = n >= 1 ? $gameActors.actor(n) : null;
            return actor ? actor.name() : '';
        };
        var getPartyMemberName = function(n) {
            var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
            return actor ? actor.name() : '';
        };
        var prevText = "";
        text = text.replace(/\\/g, '\x1b');
        while (prevText != text) {
            prevText = text;
            text = text.replace(/\x1b\x1b/g, '\\');
            text = text.replace(/\x1bV\[([０-９\d]+)\]/gi, function() {
                return $gameVariables.value(parseInt(wstringToString(arguments[1]), 10));
            }.bind(this));
            text = text.replace(/\x1bN\[([０-９\d]+)\]/gi, function() {
                return getActorName(parseInt(wstringToString(arguments[1]), 10));
            }.bind(this));
            text = text.replace(/\x1bP\[([０-９\d]+)\]/gi, function() {
                return getPartyMemberName(parseInt(wstringToString(arguments[1]), 10));
            }.bind(this));
            text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
            text = text.replace(/\x1bIn\[([０-９\d]+)\]/gi, function() {
                return $dataItems[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text = text.replace(/\x1bNi\[([０-９\d]+)\]/gi, function() {
                return $dataItems[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text = text.replace(/\x1bIp\[([０-９\d]+)\]/gi, function() {
                return $dataItems[parseInt(wstringToString(arguments[1]), 10)].price;
            }.bind(this));
            text = text.replace(/\x1bPi\[([０-９\d]+)\]/gi, function() {
                return $dataItems[parseInt(wstringToString(arguments[1]), 10)].price;
            }.bind(this));
            text = text.replace(/\x1bSn\[([０-９\d]+)\]/gi, function() {
                return $dataSkills[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text = text.replace(/\x1bNs\[([０-９\d]+)\]/gi, function() {
                return $dataSkills[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text = text.replace(/\x1bNc\[([０-９\d]+)\]/gi, function() {
                return $dataClasses[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text = text.replace(/\x1bNt\[([０-９\d]+)\]/gi, function() {
                return $dataStates[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text = text.replace(/\x1bNw\[([０-９\d]+)\]/gi, function() {
                return $dataWeapons[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text = text.replace(/\x1bNa\[([０-９\d]+)\]/gi, function() {
                return $dataArmors[parseInt(wstringToString(arguments[1]), 10)].name;
            }.bind(this));
            text = text.replace(/\x1bJs\[(.*)\]\x1bJs/gi, function() {
                try{
                    var value = eval(arguments[1]);
                    if (value != null){return value}else{
                        console.log('制御文字 \\JS のパラメータでエラー  詳細：評価値が無い(null or undefined)');
                        return 0;
                    }
                } catch(ex){
                    console.log( '制御文字 \\JS のパラメータでエラー  詳細： ' + ex.toString());
                    return 0;
                }
            }.bind(this));
        }
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    /**
     * 厳密な数値チェックを行います。引数が数値でなければ例外を発生されます。
     * プラグインコマンド集では、例外が発生してもその場でゲームは中断されず
     * 実行したコマンドのみが無効になり、さらにテストプレーなら自動でデベロッパツールが起動します。
     *
     * @method parseIntStrict
     * @param {Number} value
     * @param {String} errorMessage
     * @type Number
     * @return {Number} 数値に変換した結果
     */
    var parseIntStrict = function(value, errorMessage) {
        var result = parseInt(value, 10);
        if (isNaN(result)) throw Error('指定した値[' + value + ']が数値ではありません。' + errorMessage);
        return result;
    };

    var parameters = PluginManager.parameters('TkoolMV_PluginCommandBook');

    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if (command.length == 0) {
            return;
        }

        // コマンドの実行
        this.executePluginCommand(command, args);
    };

    Game_Interpreter.prototype.executePluginCommand = function(command, args) {
        var methodName = 'pluginCommandBook_' + command;
        if (typeof this[methodName] === 'function') {
            // 引数パラメータの制御文字での変換
            for (var i=0; i<args.length; i++) {
                args[i] = Game_Interpreter.prototype.pluginCommandBook_unescape(args[i]);
            }
            try {
                this[methodName](args);
            } catch (e) {
                if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                    var window = require('nw.gui').Window.get();
                    if (!window.isDevToolsOpen()) {
                        var devTool = window.showDevTools();
                        devTool.moveTo(0, 0);
                        devTool.resizeTo(Graphics.width, Graphics.height);
                        window.focus();
                    }
                }
                console.log('プラグインコマンドの実行中にエラーが発生しました。');
                console.log('- コマンド名 　: ' + command);
                console.log('- コマンド引数 : ' + args);
                console.log('- エラー原因   : ' + e.toString());
            }
        }
    };

    Game_Interpreter.prototype.pluginCommandBook_指定位置にアニメーション表示 = function(args) {
        var x = parseIntStrict(args[0]);
        var y = parseIntStrict(args[1]);
        var id =  parseIntStrict(args[2]);
        var wait = args[3] && (args[3] === 'ウェイトあり' || args[3].toUpperCase() === 'wait');
        $gameScreen.startAnimation(x, y, id, false);
        if (wait) this.wait($dataAnimations[id].frames.length * 4);
    };

    Game_Interpreter.prototype.pluginCommandBook_Show_Animation = function(args) {
        this.pluginCommandBook_指定位置にアニメーション表示(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_指定位置にループアニメーション表示 = function(args) {
        var x = parseIntStrict(args[0]);
        var y = parseIntStrict(args[1]);
        var id =  parseIntStrict(args[2]);
        $gameScreen.startAnimation(x, y, id, true);
    };

    Game_Interpreter.prototype.pluginCommandBook_Show_Loop_Animation = function(args) {
        this.pluginCommandBook_指定位置にループアニメーション表示(args);
    };

    Game_Interpreter.prototype.pluginCommandBook_ループアニメーション消去 = function(args) {
        $gameScreen.animationLoop = false;
    };

    Game_Interpreter.prototype.pluginCommandBook_Erase_Loop_Animation = function(args) {
        this.pluginCommandBook_ループアニメーション消去(args);
    };

   

    //=============================================================================
    // Gameクラス定義領域
    //=============================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._mapTouchDisable = false;
    };

    var _Game_Message_initialize= Game_Message.prototype.initialize;
    Game_Message.prototype.initialize = function() {
        _Game_Message_initialize.call(this);
        this._numInputBackground = 0;
        this._numInputPositionType = 1;
        this._numInputValidDigit = 1;
        this.clearNumInputRange();
    };

    Game_Message.prototype.clearNumInputRange = function() {
        this._numInputMaxValue = Infinity;
        this._numInputMinValue = -Infinity;
        this._numInputValidDigit = 1;
    };

    Game_Message.prototype.setNumInputRange = function(min, max) {
        this._numInputMaxValue = max;
        this._numInputMinValue = min;
    };

    Game_Message.prototype.setNumInputBackground = function(background) {
        this._numInputBackground = background;
    };

    Game_Message.prototype.setNumInputPositionType = function(positionType) {
        this._numInputPositionType = positionType;
    };

    Game_Message.prototype.numInputBackground = function() {
        return this._numInputBackground;
    };

    Game_Message.prototype.numInputPositionType = function() {
        return this._numInputPositionType;
    };

    var _Game_Screen_clear = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.apply(this, arguments);
        this.clearAnimation();
    };

    Game_Screen.prototype.startAnimation = function(x, y, id, loop) {
        this._animationContainerX = x;
        this._animationContainerY = y;
        this._animationId         = id;
        this._animationLoop       = loop;
    };

    Game_Screen.prototype.clearAnimation = function() {
        this._animationContainerX = 0;
        this._animationContainerY = 0;
        this._animationId         = 0;
    };

    Object.defineProperty(Game_Screen.prototype, 'animationContainerX', {
        get: function() {
            return this._animationContainerX;
        },
        configurable: false
    });

    Object.defineProperty(Game_Screen.prototype, 'animationContainerY', {
        get: function() {
            return this._animationContainerY;
        },
        configurable: false
    });

    Object.defineProperty(Game_Screen.prototype, 'animationId', {
        get: function() {
            return this._animationId;
        },
        configurable: false
    });

    Object.defineProperty(Game_Screen.prototype, 'animationLoop', {
        get: function() {
            return this._animationLoop;
        },
        set: function(value) {
            this._animationLoop = value;
        },
        configurable: false
    });

    var _Game_Screen_clearPictures = Game_Screen.prototype.clearPictures;
    Game_Screen.prototype.clearPictures = function() {
        _Game_Screen_clearPictures.apply(this, arguments);
        this.needsSortPictures = false;
    };

    var _Game_Picture_initBasic = Game_Picture.prototype.initBasic;
    Game_Picture.prototype.initBasic = function() {
        _Game_Picture_initBasic.apply(this, arguments);
        this._frameX      = 0;
        this._frameY      = 0;
        this._frameWidth  = 0;
        this._frameHeight = 0;
        this.z            = 100;
    };

    Game_Picture.prototype.setZ = function(value) {
        this.z = value;
    };

    Game_Picture.prototype.setFrameDirect = function(x, y, width, height) {
        this._frameX = x;
        this._frameY = y;
        this._frameWidth = width;
        this._frameHeight = height;
    };

    Game_Picture.prototype.isValidFrame = function() {
        return this._frameX + this._frameY + this._frameWidth + this._frameHeight > 0;
    };

    Game_Picture.prototype.setAngleDirect = function(value) {
        this._rotationSpeed = 0;
        this._angle = value % 360;
    };

    //=============================================================================
    // Sceneクラス定義領域
    //=============================================================================
    var _Scene_Map_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
    Scene_Map.prototype.isMapTouchOk = function() {
        return (!$gameSystem._mapTouchDisable || $gameTemp.isDestinationValid()) && _Scene_Map_isMapTouchOk.call(this);
    };

    //=============================================================================
    // Windowクラス定義領域
    //=============================================================================
    var _Window_NumberInput_refresh = Window_NumberInput.prototype.refresh;
    Window_NumberInput.prototype.refresh = function() {
        if (this._number != null) this._number = this._number.clamp(
            $gameMessage._numInputMinValue, $gameMessage._numInputMaxValue);
        _Window_NumberInput_refresh.apply(this, arguments);
    };

    var _Window_NumberInput_start = Window_NumberInput.prototype.start;
    Window_NumberInput.prototype.start = function() {
        _Window_NumberInput_start.apply(this, arguments);
        this.updateBackground();
    };

    var _Window_NumberInput_processOk = Window_NumberInput.prototype.processOk;
    Window_NumberInput.prototype.processOk = function() {
        _Window_NumberInput_processOk.apply(this, arguments);
        $gameMessage.clearNumInputRange();
    };

    var _Window_NumberInput_updatePlacement = Window_NumberInput.prototype.updatePlacement;
    Window_NumberInput.prototype.updatePlacement = function() {
        _Window_NumberInput_updatePlacement.apply(this, arguments);
        var positionType = $gameMessage.numInputPositionType();
        this.width = this.windowWidth();
        switch (positionType) {
            case 0:
                this.x = 0;
                break;
            case 1:
                this.x = (Graphics.boxWidth - this.width) / 2;
                break;
            case 2:
                this.x = Graphics.boxWidth - this.width;
                break;
        }
    };

    var _Window_NumberInput_changeDigit = Window_NumberInput.prototype.changeDigit;
    Window_NumberInput.prototype.changeDigit = function(up) {
        if (this.maxItems() - this.index() < $gameMessage._numInputValidDigit) {
            return;
        }
        _Window_NumberInput_changeDigit.apply(this, arguments);
    };

    Window_NumberInput.prototype.updateBackground = function() {
        this._background = $gameMessage.numInputBackground();
        this.setBackgroundType(this._background);
    };

    //=============================================================================
    // Spriteクラス定義領域
    //=============================================================================
    var _Sprite_Picture_initialize = Sprite_Picture.prototype.initialize;
    Sprite_Picture.prototype.initialize = function(pictureId) {
        _Sprite_Picture_initialize.apply(this, arguments);
        this.z = 0;
    };

    var _Sprite_Picture_update = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_Picture_update.call(this);
        if (this.visible) {
            var newZ = this.picture().z;
            if (newZ != this.z) {
                this.z = newZ;
                $gameScreen.needsSortPictures = true;
            }
            this.updateFrame();
        }
    };

    Sprite_Picture.prototype.updateFrame = function() {
        if (this.picture().isValidFrame()) {
            var p = this.picture();
            this.setFrame(p._frameX, p._frameY, p._frameWidth, p._frameHeight);
        }
    };

    var _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
    Spriteset_Base.prototype.createUpperLayer = function() {
        _Spriteset_Base_createUpperLayer.apply(this, arguments);
        this.createAnimationContainer();
    };

    Spriteset_Base.prototype.createAnimationContainer = function() {
        this._animationContainer = new Sprite_Base();
        this._animationId = 0;
        this.addChild(this._animationContainer);
    };

    var _Spriteset_Base_update = Spriteset_Base.prototype.update;
    Spriteset_Base.prototype.update = function() {
        _Spriteset_Base_update.call(this);
        if ($gameScreen.needsSortPictures) {
            this.sortPictures();
            $gameScreen.needsSortPictures = false;
        }
        this.updateAnimationContainer();
    };

    Spriteset_Base.prototype.updateAnimationContainer = function() {
        var id = $gameScreen.animationId;
        if (id > 0 && id < $dataAnimations.length) {
            this._animationContainer.x = $gameScreen.animationContainerX;
            this._animationContainer.y = $gameScreen.animationContainerY;
            this._animationContainer.startAnimation($dataAnimations[id], false, 0);
            this._animationId = id;
            $gameScreen.clearAnimation();
        }
        if (!this._animationContainer.isAnimationPlaying() && this._animationId > 0) {
            if ($gameScreen.animationLoop) {
                this._animationContainer.startAnimation($dataAnimations[this._animationId], false, 0);
            } else {
                this._animationId = 0;
            }
        }
    };

    Spriteset_Base.prototype.sortPictures = function() {
        this._pictureContainer.children.sort(this._comparePictureChildOrder.bind(this));
    };

    Spriteset_Base.prototype._comparePictureChildOrder = function(a, b) {
        if (a.z !== b.z) {
            return a.z - b.z;
        } else {
            return a._pictureId - b._pictureId;
        }
    };

})();
