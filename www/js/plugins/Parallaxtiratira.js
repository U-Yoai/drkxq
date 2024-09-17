//=============================================================================
// Parallaxtiratira.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00 ゲーム開始時にタイルセットロードの猶予を与えます。
 * @author まっつＵＰ
 *
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * このプラグインを利用する場合は
 * 素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *  
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 * 
 */

(function() {

var _Game_Player_fadeType = Game_Player.prototype.fadeType;
Game_Player.prototype.fadeType = function() {
    if(!this._fadeType) return 0;
    return _Game_Player_fadeType.call(this);
};
 
})();
