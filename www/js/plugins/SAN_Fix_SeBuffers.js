//=============================================================================
// SAN_Fix_SeBuffers.js
//=============================================================================
// Copyright (c) 2018 Sanshiro
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//=============================================================================
// GitHub  : https://github.com/rev2nym
// Twitter : https://twitter.com/rev2nym
//=============================================================================

/*:
 * @plugindesc SEバッファ修正 1.0.0
 * 不具合修正プラグインです。複数の演奏中のSEを正常に停止できるようにします。
 * @author Sanshiro https://github.com/rev2nym
 * @help
 * ■概要
 * コアスクリプト ver1.6.1 にて
 * 複数のSEを同時に演奏しているときに
 * イベントコマンド「SEの停止」を実行したとき
 * 最後に演奏したSEしか停止できない不具合を修正します。
 * 
 * ■詳細
 * 「AudioManager」のSEの演奏開始の処理「playSe()」には
 * すでに演奏を終了したSE「WebAudio」を
 * リスト「AudioManager._seBuffers」から
 * 除外する処理が組み込まれています。
 * しかしリストから除外する対象を決める判定条件に誤りがあるため
 * まだ演奏を開始していないSEまでリストから除外されており
 * その後に演奏を開始したSEがリストから漏れている状態でした。
 * その結果リストから漏れた再生中のSEを停止させることができない状態でした。
 * 
 * このプラグインは
 * SEのリスト除外対象の判定条件を修正することでリスト漏れを無くし
 * 複数の演奏中のSEを正常に停止できるようにします。
 * 
 * ■利用規約
 * MITライセンスのもと、商用利用、改変、再配布が可能です。
 * ただし冒頭のコメントは削除や改変をしないでください。
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 */

var Imported = Imported || {};
Imported.SAN_Fix_SeBuffers = true;

var Sanshiro = Sanshiro || {};
Sanshiro.Fix_SeBuffers = Sanshiro.Fix_SeBuffers || {};
Sanshiro.Fix_SeBuffers.version = '1.0.0';

(function() {
'use strict';

//-----------------------------------------------------------------------------
// AudioManager
//
// オーディオマネージャー

// SEの演奏
AudioManager.playSe = function(se) {
    if (se.name) {
        this._seBuffers = this._seBuffers.filter(function(audio) {
            return !audio.isReady() || audio.isPlaying();
        });
        var buffer = this.createBuffer('se', se.name);
        this.updateSeParameters(buffer, se);
        buffer.play(false);
        this._seBuffers.push(buffer);
    }
};

})();
