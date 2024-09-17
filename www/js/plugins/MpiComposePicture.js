//===========================================================================
// MpiComposePicture.js
//===========================================================================

/*:
 * @plugindesc 2つのピクチャを合成します。
 * @author 奏ねこま（おとぶき ねこま）
 *
 * @param Plugin Command
 * @desc プラグインコマンドを任意のコマンド名に変更できます。
 * @default compose_picture
 * 
 * @help
 * [説明]
 *  2つのピクチャを合成して、新しいピクチャを作成します。
 * 
 * [使用方法]
 *  合成したい２つの画像をあらかじめ、イベントコマンド「ピクチャの表示」で表示さ
 *  せておき（不透明度０でも可）、プラグインコマンドでピクチャ番号と合成方法を指
 *  定して合成します。
 * 
 * [プラグインコマンド]
 *  compose_picture <pid1> <pid2> <type> <dx> <dy> <dw> <dh> <sx> <sy> <sw> <sh>
 * 
 *  <実行例>
 *   compose_picture 1 2 xor
 *   compose_picture 1 2 xor 10 10
 *   compose_picture 1 2 xor 10 10 200 200
 *   compose_picture 1 2 xor 10 10 200 200 30 30
 *   compose_picture 1 2 xor 10 10 200 200 30 30 400 400
 * 
 *  <引数に変数の値を使用する例>
 *   compose_picture \v[1] \v[2] xor \v[3] \v[4]
 * 
 *  <引数説明>
 *   pid1    : 合成先ピクチャ番号
 *   pid2    : 合成元ピクチャ番号
 *   type    : 合成方法
 *   dx      : 合成先X座標（省略可）
 *   dy      : 合成先Y座標（省略可）
 *   dw      : 合成先横サイズ（省略可）
 *   dh      : 合成先縦サイズ（省略可）
 *   sx      : 合成元X座標（省略可）
 *   sy      : 合成元Y座標（省略可）
 *   sw      : 合成元横サイズ（省略可）
 *   sh      : 合成元縦サイズ（省略可）
 * 
 *  <合成方法について>
 *   type（合成方法）に指定できるものには、以下のようなものがあります。
 * 
 *   source-atop
 *   source-in
 *   source-out
 *   source-over
 *   destination-atop
 *   destination-in
 *   destination-out
 *   destination-over
 *   lighter
 *   copy
 *   xor
 * 
 *   各合成方法の詳しい内容については、下記サイトなどをご参照下さい。
 *   http://www.html5.jp/canvas/ref/property/globalCompositeOperation.html
 * 
 * [利用規約] ..................................................................
 *  - 本プラグインの利用は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  - 商用、非商用、有償、無償、一般向け、成人向けを問わず、利用可能です。
 *  - 利用の際、連絡や報告は必要ありません。また、製作者名の記載等も不要です。
 *  - プラグインを導入した作品に同梱する形以外での再配布、転載はご遠慮ください。
 *  - 本プラグインにより生じたいかなる問題についても、一切の責任を負いかねます。
 * [改訂履歴] ..................................................................
 *   Version 1.00  2017/05/11  First edition.
 *   Version 1.01  2017/05/12  セーブ・ロードに対応。
 *   Version 1.02  2017/06/10  引数の変数指定が機能しなかった問題を修正
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
 *  Web Site: http://makonet.sakura.ne.jp/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 *  Copylight (c) 2017 Nekoma Otobuki
 */

var Imported = Imported || {};
var Makonet = Makonet || {};

(function(){
    'use strict';

    var plugin = 'MpiComposePicture';

    Imported[plugin] = true;
    Makonet[plugin] = {};

    var $mpi        = Makonet[plugin];
    $mpi.parameters = PluginManager.parameters(plugin);

    $mpi.plugin_command = $mpi.parameters['Plugin Command'];

    var _  = plugin;
    var __ = `$${_}`;

    //==============================================================================
    // Private Functions
    //==============================================================================

    // 文字列中の変数を値に変換
    function convertVariables(text) {
        if (typeof(text) !== 'string') return text;
        var pattern = '\\\\v\\[(\\d+)\\]';
        while (text.match(RegExp(pattern, 'i'))) {
            text = text.replace(RegExp(pattern, 'gi'), function(){
                return $gameVariables.value(+arguments[1]);
            });
        }
        return text;
    }

    // 画像を合成
    function executeComposition(condition) {
        var bitmap_d = null;
        var bitmap_s = null;
        if (condition.dname.match(/^::composed/)) {
            var sprite = getSpritePicture(condition.did);
            if (sprite && sprite._pictureName === condition.dname && sprite[_].condition) {
                bitmap_d = sprite.bitmap;
            } else {
                bitmap_d = executeComposition(condition.dcond);
            }
        } else {
            bitmap_d = ImageManager.loadPicture(condition.dname);
        }
        if (condition.sname.match(/^::composed/)) {
            var sprite = getSpritePicture(condition.sid);
            if (sprite && sprite._pictureName === condition.sname && sprite[_].condition) {
                bitmap_s = sprite.bitmap;
            } else {
                bitmap_s = executeComposition(condition.scond);
            }
        } else {
            bitmap_s = ImageManager.loadPicture(condition.sname);
        }
        var type = condition.type;
        var sx   = condition.sx;
        var sy   = condition.sy;
        var sw   = condition.sw || (bitmap_s.width - sx);
        var sh   = condition.sh || (bitmap_s.height - sy);
        var dx   = condition.dx;
        var dy   = condition.dy;
        var dw   = condition.dw || sw;
        var dh   = condition.dh || sh;
        var bitmap_c = new Bitmap(bitmap_d.width, bitmap_d.height);
        bitmap_c.blt(bitmap_d, 0, 0, bitmap_d.width, bitmap_d.height, 0, 0);
        bitmap_c.context.globalCompositeOperation = type;
        bitmap_c.context.drawImage(bitmap_s.canvas, sx, sy, sw, sh, dx, dy, dw, dh);
        bitmap_c._setDirty();
        return bitmap_c;
    }

    // Bitmapチェック
    function checkBitmap(condition) {
        if (condition.dname.match(/^::composed/)) {
            var sprite = getSpritePicture(condition.did);
            if (!sprite || sprite._pictureName !== condition.dname || !sprite[_].condition) {
                if (!checkBitmap(condition.dcond)) {
                    return false;
                }
            }
        } else if (!ImageManager.loadPicture(condition.dname).isReady()) {
            return false;
        }
        if (condition.sname.match(/^::composed/)) {
            var sprite = getSpritePicture(condition.sid);
            if (!sprite || sprite._pictureName !== condition.sname || !sprite[_].condition) {
                if (!checkBitmap(condition.scond)) {
                    return false;
                }
            }
        } else if (!ImageManager.loadPicture(condition.sname).isReady()) {
            return false;
        }
        return true;
    }

    // ピクチャIDからSprite_Pictureを取得
    function getSpritePicture(pictureId) {
        var sprite_picture = null;
        var spriteset = SceneManager._scene._spriteset;
        if (spriteset) {
            spriteset._pictureContainer.children.some(function(sprite) {
                if ((sprite instanceof Sprite_Picture) && sprite._pictureId === pictureId) {
                    sprite_picture = sprite;
                    return true;
                }
            });
        }
        return sprite_picture;
    }

    //==============================================================================
    // Game_Picture
    //==============================================================================

    Object.defineProperty(Game_Picture.prototype,_,{
        get:function(){return this[__]=this[__]||{ condition: null }},
        set:function(value){this[__]=value},
        configurable: true
    });

    //==============================================================================
    // Sprite_Picture
    //==============================================================================

    Object.defineProperty(Sprite_Picture.prototype,_,{
        get:function(){return this[__]=this[__]||{ condition: null }},
        set:function(value){this[__]=value},
        configurable: true
    });

    (function(o,p){
        var f=o[p];o[p]=function(){
            var picture = this.picture();
            if (picture) {
                var condition = picture[_].condition;
                if (condition && condition !== this[_].condition) {
                    this[_].condition = null;
                    if (checkBitmap(condition)) {
                        this.bitmap = executeComposition(condition);
                        this[_].condition = condition;
                    }
                }
            }
            f.apply(this,arguments);
        };
    }(Sprite_Picture.prototype,'updateBitmap'));

    (function(o,p){
        var f=o[p];o[p]=function(){
            if (!this._pictureName.match(/^::composed/)) {
                f.apply(this,arguments);
            }
        };
    }(Sprite_Picture.prototype,'loadBitmap'));

    //==============================================================================
    // Game_Interpreter
    //==============================================================================

    (function(o,p){
        var f=o[p];o[p]=function(command, args){
            if (command === $mpi.plugin_command) {
                var did = +convertVariables(args[0]) || 0;
                var sid = +convertVariables(args[1]) || 0;
                var picture_d = $gameScreen.picture(did);
                var picture_s = $gameScreen.picture(sid);
                if (picture_d && picture_s) {
                    picture_d[_].condition = {
                        did:   did,
                        dname: picture_d.name(),
                        dcond: picture_d[_].condition,
                        sid:   sid,
                        sname: picture_s.name(),
                        scond: picture_s[_].condition,
                        type:  convertVariables(args[2])  || 'source-over',
                        dx:   +convertVariables(args[3])  || 0,
                        dy:   +convertVariables(args[4])  || 0,
                        dw:   +convertVariables(args[5])  || 0,
                        dh:   +convertVariables(args[6])  || 0,
                        sx:   +convertVariables(args[7])  || 0,
                        sy:   +convertVariables(args[8])  || 0,
                        sw:   +convertVariables(args[9])  || 0,
                        sh:   +convertVariables(args[10]) || 0
                    };
                    picture_d._name = '::composed' + Date.now();
                } else {
                    var id = [];
                    if (!picture_d) id.push(did);
                    if (!picture_s) id.push(sid);
                    throw new Error('[' + plugin + '] Picture does not exist. [id:' + id.join(',') + ']');
                }
            }
            f.apply(this,arguments);
        };
    }(Game_Interpreter.prototype,'pluginCommand'));
}());
