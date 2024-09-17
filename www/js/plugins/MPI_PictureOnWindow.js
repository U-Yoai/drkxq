//===========================================================================
// MPI_PictureOnWindow.js
//===========================================================================

/*:
 * @plugindesc 指定のピクチャをウインドウより手前に表示します。
 * @author 奏ねこま（おとぶき ねこま）
 *
 * @param ピクチャ番号
 * @desc ウインドウよりも手前に表示するピクチャの番号を指定して下さい。カンマ区切りで複数指定できます。
 * @default 
 *
 * @help
 * [ 概要 ] ...
 *  プラグインパラメータで指定した番号のピクチャが、ウインドウよりも手前に表示さ
 *  れるようになります。
 *
 * [ プラグインコマンド ] ...
 *  プラグインコマンドはありません。
 *
 * [ 利用規約 ] ................................................................
 *  ・本プラグインの利用は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  ・商用、非商用、有償、無償、一般向け、成人向けを問わず、利用可能です。
 *  ・利用の際、連絡や報告は必要ありません。また、製作者名の記載等も不要です。
 *  ・プラグインを導入した作品に同梱する形以外での再配布、転載はご遠慮ください。
 *  ・不具合対応以外のサポートやリクエストは、基本的に受け付けておりません。
 *  ・本プラグインにより生じたいかなる問題についても、一切の責任を負いかねます。
 * [ 改訂履歴 ] ................................................................
 *   Version 1.00  2017/01/15  First edition.
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
 *  Web Site: http://makonet.sakura.ne.jp/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 *  Copylight (c) 2017 Nekoma Otobuki
 */

var Imported = Imported || {};
Imported.MPI_PictureOnWindow = true;

var Makonet = Makonet || {};
Makonet.POW = {};

(function(){
    'use strict';

    var MPD        = Makonet.POW;
    MPD.product    = 'MPI_PictureOnWindow';
    MPD.parameters = PluginManager.parameters(MPD.product);
    MPD.pictureId  = MPD.parameters['ピクチャ番号'].trim().split(/ *, */).map(function(value){ return +value });
    
    var _ = MPD.product;
    
    //==============================================================================
    // Spriteset_Base
    //==============================================================================

    (function (o, p) {
        var f = o[p]; o[p] = function() {
            f.apply(this, arguments);
            this._pictureContainer.children.forEach(function(picture) {
                if (~MPD.pictureId.indexOf(picture._pictureId)) {
                    this._pictureContainer.removeChild(picture);
                }
            }, this);
        };
    }(Spriteset_Base.prototype, 'createPictures'));

    //==============================================================================
    // Scene_Base
    //==============================================================================

    (function (o, p) {
        var f = o[p]; o[p] = function() {
            f.apply(this, arguments);
            var width = Graphics.boxWidth;
            var height = Graphics.boxHeight;
            var x = (Graphics.width - width) / 2;
            var y = (Graphics.height - height) / 2;
            var sprite = new Sprite();
            sprite.setFrame(x, y, width, height);
            MPD.pictureId.forEach(function(id) {
                sprite.addChild(new Sprite_Picture(id));
            });
            this.addChild(sprite);
        };
    }(Scene_Base.prototype, 'createWindowLayer'));
}());
