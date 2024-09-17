//=============================================================================
// PictureZIndex.js
//=============================================================================

/*:
 * @plugindesc ピクチャのZ-Index（重なり順序）を設定します。
 * @author 奏ねこま（おとぶきねこま）
 *
 * @help
 * [プラグインコマンド]
 *  PictureZIndex <picture id> <z-index>
 *    指定したピクチャ番号（picture id）に、重なり順序（z-index）を設定します。
 *    z-indexがより大きいピクチャが前面に表示されるようになります。
 *    ピクチャ番号と重なり順序には、制御文字で変数を指定することもできます。
 *    指定方法については下記使用例を参考にしてください。
 *    z-indexには1以上の値を設定してください。0を指定した場合の動作は保証されませ
 *    ん。また、複数のピクチャに同じz-indexを指定した場合の動作も保証されません。
 *
 *    使用例：ピクチャ番号#1のピクチャの重なり順序に10を設定する
 *     PictureZIndex 1 10
 *
 *    使用例：ピクチャ番号とピクチャの重なり順序に変数を指定する
 *     PictureZIndex \v[1] \v[2]
 *
 *  PictureZIndex reset
 *    ピクチャの重なり順序をリセットします。ピクチャ番号がより大きいピクチャが
 *    前面に表示されるようになります。
 *
 * [z-indexの初期状態について]
 *  プラグインコマンド実行前の各ピクチャのz-indexは、ピクチャ番号と同じです。
 *  例えば、ピクチャ#1のz-indexに5を指定したあと、ピクチャ#6を表示すると、
 *  ピクチャ#6はピクチャ#1よりも前に表示されます。
 *
 * [ 利用規約 ] .................................................................
 *  本プラグインの利用者は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  商用、非商用、ゲームの内容（年齢制限など）を問わず利用可能です。
 *  ゲームへの利用の際、報告や出典元の記載等は必須ではありません。
 *  二次配布や転載、ソースコードURLやダウンロードURLへの直接リンクは禁止します。
 *  （プラグインを利用したゲームに同梱する形での結果的な配布はOKです）
 *  不具合対応以外のサポートやリクエストは受け付けておりません。
 *  本プラグインにより生じたいかなる問題においても、一切の責任を負いかねます。
 * [ 改訂履歴 ] .................................................................
 *   Version 1.00  2016/08/06  初版
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  Web Site: http://i.gmobb.jp/nekoma/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 */

(function(){
    'use strict';
    
    const _PRODUCT    = 'PictureZIndex';
    const _PARAMETERS = PluginManager.parameters(_PRODUCT);

    function _(f){ return f[_PRODUCT] = f[_PRODUCT] || {} }

    function processVariableCharacter(text) {
        var org_text = '';
        while (text !== org_text ) {
            org_text = text;
            text = text.replace(/\\v\[(\d+)\]/gi, function() {
                return $gameVariables.value(parseInt(arguments[1]));
            }.bind(this));
        }
        return text;
    }
    
    var _Spriteset_Base_createPictures = Spriteset_Base.prototype.createPictures;
    Spriteset_Base.prototype.createPictures = function() {
        _Spriteset_Base_createPictures.call(this);
        var zIndex = _($gameSystem).zIndex = _($gameSystem).zIndex || [];
        this._pictureContainer.children.sort(function(a, b) {
            var az = zIndex[a._pictureId] || a._pictureId;
            var bz = zIndex[b._pictureId] || b._pictureId;
            return az - bz;
        });
    };
    
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toLowerCase() === 'picturezindex') {
            args = processVariableCharacter(args.join(' ')).split(' ');
            var spriteset = SceneManager._scene._spriteset;
            if (args[0].toLowerCase() !== 'reset') {
                var zIndex = _($gameSystem).zIndex = _($gameSystem).zIndex || [];
                zIndex[+args[0]] = +args[1];
                if (spriteset) {
                    spriteset._pictureContainer.children.sort(function(a, b) {
                        var az = zIndex[a._pictureId] || a._pictureId;
                        var bz = zIndex[b._pictureId] || b._pictureId;
                        return az - bz;
                    });
                }
            } else {
                _($gameSystem).zIndex = [];
                if (spriteset) {
                    spriteset._pictureContainer.children.sort(function(a, b) {
                        return a._pictureId - b._pictureId;
                    });
                }
            }
        }
    };
}());
