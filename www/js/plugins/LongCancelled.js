//==============================================================================
// LongCancelled.js
//==============================================================================
// License CC0
// https://creativecommons.org/choose/zero/?lang=ja
// -----------------------------------------------------------------------------
// Version
// 1.0.0 2019/09/03 初版公開
// 2020/11/18 ライセンスをCC0に変更、内容の変更はありません
//==============================================================================

/*:
 *
 * @plugindesc 右クリックによる長押し機能
 * @author トンバ
 *
 * @help 右クリックによる長押し機能を追加します。
 * ※二本指タッチでのキャンセルには対応していません。
 *
 * コアスクリプトの書き換えによって実現しているため
 * 今後の更新やスクリプトによって使えなくなることがあります、ご注意ください。
 * このスクリプトは1.6.2用です。
 *
 * スクリプトコマンド:
 *   ○TouchInput.isLongCancelled()
 *   TouchInput.isLongPressed()の右クリック版です。
 *   初期設定では24フレーム以上押されていると反応します。
 *
 *   ○TouchInput.isRightPressed()
 *   TouchInput.isPressed()の右クリック版です。
 *   押されている場合反応します。
 *
 *   既に用意されているTouchInput.isCancelled()と合わせれば
 *   クリックの代わりに右クリックを対応することができます。
 *
 *
 * 利用規約:
 *   本スクリプトはCC0となっています。
 *   著作者の明記の必要はなく、改変や再配布に制限はありません。
 *   また利用形態(R-18、有料作品等)にも制限はありません。
 *
 *   本プラグインを使用したことにより発生した問題について
 *   作者は一切の責任を負いません。
 *
 *   コアスクリプトの書き換えのため使用できなくなる場合があります
 *   ご注意ください。
 *
*/

(function () {
    'use strict';

const _TouchInput_clear = TouchInput.clear;
    TouchInput.clear = function() {
        this._mousePressed = false;
        this._mouseRightPressed = false;
        this._screenPressed = false;
        this._pressedTime = 0;
        this._RightPressedTime = 0;
        this._events = {};
        this._events.triggered = false;
        this._events.cancelled = false;
        this._events.moved = false;
        this._events.released = false;
        this._events.wheelX = 0;
        this._events.wheelY = 0;
        this._triggered = false;
        this._cancelled = false;
        this._moved = false;
        this._released = false;
        this._wheelX = 0;
        this._wheelY = 0;
        this._x = 0;
        this._y = 0;
        this._date = 0;
    };

const _TouchInput_update = TouchInput.update;
TouchInput.update = function() {
    this._triggered = this._events.triggered;
    this._cancelled = this._events.cancelled;
    this._moved = this._events.moved;
    this._released = this._events.released;
    this._wheelX = this._events.wheelX;
    this._wheelY = this._events.wheelY;
    this._events.triggered = false;
    this._events.cancelled = false;
    this._events.moved = false;
    this._events.released = false;
    this._events.wheelX = 0;
    this._events.wheelY = 0;
    if (this.isPressed()) {
        this._pressedTime++;
    }
    if (this.isRightPressed()) {
        this._RightPressedTime++;
    }
};

TouchInput.isRightPressed = function() {
    return this._mouseRightPressed;
};

TouchInput.isLongCancelled = function() {
    return this.isRightPressed() && this._RightPressedTime >= this.keyRepeatWait;
};


const _TouchInput__onRightButtonDown = TouchInput._onRightButtonDown;
TouchInput._onRightButtonDown = function(event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    if (Graphics.isInsideCanvas(x, y)) {
        this._mouseRightPressed = true;
        this._RightPressedTime = 0;
        this._onCancel(x, y);
    }
};

const _TouchInput__onMouseUp = TouchInput._onMouseUp;
TouchInput._onMouseUp = function(event) {
    if (event.button === 0) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._mousePressed = false;
        this._onRelease(x, y);
    } else if (event.button === 2) {
        this._mouseRightPressed = false;
    }
};

})();



