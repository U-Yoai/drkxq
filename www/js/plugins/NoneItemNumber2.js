//=============================================================================
// NoneItemNumber2.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00 アイテムリストの所持数表示に制限をかけます。
 * @author まっつＵＰ
 * 
 * @param listnum
 * @desc そのアイテムの所持数がこの値以上でなければ
 * アイテムリストで所持数を表示しない。 
 * @default 1
 * 
 * @param shop
 * @desc そのアイテムの所持数がこの値以上でなければ
 * ショップステータスに所持数を表示しない。 
 * @default 1
 * 
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * アイテム個数の表示が消えるだけで個数のカウント等は行われています。
 * 
 * このプラグインを利用する場合は
 * readmeなどに「まっつＵＰ」の名を入れてください。
 * また、素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *  
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 * 
 */

(function() {
    
var parameters = PluginManager.parameters('NoneItemNumber2');
var NINNlistnum = Number(parameters['listnum'] || 1);
var NINNshop = Number(parameters['shop'] || 1);
    
//引数とフックの関係でneedsNumberでなく以下のメソッドに処理をフックする。

var _Window_ItemList_drawItemNumber = Window_ItemList.prototype.drawItemNumber;
Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    if($gameParty.numItems(item) < NINNlistnum) return;
    _Window_ItemList_drawItemNumber.call(this, item, x, y, width);
};

var _Window_ShopStatus_drawPossession = Window_ShopStatus.prototype.drawPossession;
Window_ShopStatus.prototype.drawPossession = function(x, y) {
    if($gameParty.numItems(this._item) < NINNshop) return;
    _Window_ShopStatus_drawPossession.call(this, x, y);
};
    
})();
