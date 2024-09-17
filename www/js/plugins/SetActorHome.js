//=============================================================================
// SetActorHome.js
//=============================================================================

/*:
 * @plugindesc サイドビューバトルでアクターを表示する位置を設定します。
 * @author こま
 *
 * @param Default Home X
 * @desc アクターを表示するX座標の計算式の初期設定
 * @default 600 + index * 32
 *
 * @param Default Home Y
 * @desc アクターを表示するY座標の計算式の初期設定
 * @default 280 + index * 48
 *
 * @help
 * プラグインコマンド：
 *   SetActorHomeX 式        # アクターを表示するX座標の計算式を設定します。
 *   SetActorHomeY 式        # アクターを表示するY座標の計算式を設定します。
 *
 * プラグインコマンド例：
 *   SetActorHomeX 600 + index * 32
 *   : 式中にindexというワードを使用すると、何番目のアクターかを示す数値に置き換え
 *   : られます。先頭のアクターを「0番目」とし、以降は+1ずつとなります。
 *
 * プラグインコマンド例（応用編）：
 *   SetActorHomeX (index == 0) ? 100 : 200
 *   : 「indexが0の場合、100。それ以外の場合、200」
 *   
 *   SetActorHomeX (index == 0 || index == 1) ? 100 : 200
 *   : 「indexが0か1の場合、100。それ以外の場合、200」
 *   
 *   SetActorHomeX (index == 0) ? 100 : (index == 1) ? 200 : 300
 *   : 「indexが0の場合、100。indexが1の場合、200。それ以外の場合、300」
 *
 * [ 利用規約 ] ...................................................................
 *  本プラグインの利用者は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  商用、非商用、ゲームの内容（年齢制限など）を問わず利用可能です。
 *  ゲームへの利用の際、報告や出典元の記載等は必須ではありません。
 *  二次配布や転載、ソースコードURLやダウンロードURLへの直接リンクは禁止します。
 *  （プラグインを利用したゲームに同梱する形での結果的な配布はOKです）
 *  不具合対応以外のサポートやリクエストは受け付けておりません。
 *  本プラグインにより生じたいかなる問題においても、一切の責任を負いかねます。
 * [ 改訂履歴 ] ...................................................................
 *   Version 1.02  2016/05/05  リファクタリング
 *   Version 1.01  2016/02/20  プラグインコマンドによる設定変更を追加
 *   Version 1.00  2016/01/31  初版
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  Web Site: http://i.gmobb.jp/nekoma/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 */

(function(){
    var _PLUGIN = 'SetActorHome';
    var _PARAMETERS = PluginManager.parameters(_PLUGIN);
    
    var _DEFAULT_HOME_X = _PARAMETERS['Default Home X'];
    var _DEFAULT_HOME_Y = _PARAMETERS['Default Home Y'];
    
    function _p(o){ return o[_PLUGIN] = o[_PLUGIN] || {} };
    
    var _alias_Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
    Sprite_Actor.prototype.setActorHome = function(index) {
        _alias_Sprite_Actor_setActorHome.call(this, index);
        var homeX = _p($gameSystem).x ? _p($gameSystem).x : _DEFAULT_HOME_X;
        var homeY = _p($gameSystem).y ? _p($gameSystem).y : _DEFAULT_HOME_Y;
        this.setHome(eval(homeX), eval(homeY));
    };

    var _alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _alias_Game_Interpreter_pluginCommand.call(this, command, args);
        switch (command) {
            case 'SetActorHomeX':
                _p($gameSystem).x = args.join(' ');
                break;
            case 'SetActorHomeY':
                _p($gameSystem).y = args.join(' ');
                break;
        }
    }
}());
