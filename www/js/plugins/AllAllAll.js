//=============================================================================
// AllAllAll.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00 全部だ。
 * @author まっつＵＰ
 * 
 * @param isall
 * @desc アイテムはどれくらい混じってるんだ？
 * 0-全部だ。0以外-それは「アイテム」！
 * @default 0
 *
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * メニューとショップのカテゴリウインドウの処理が事実上飛びます。
 * バトルアイテムの処理や仕様には変更ありません。
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
    
var parameters = PluginManager.parameters('AllAllAll');
var AAAisall = Number(parameters['isall'] || 0);

var _Scene_Item_create = Scene_Item.prototype.create;
    Scene_Item.prototype.create = function() {
    _Scene_Item_create.call(this);
    this._categoryWindow.deselect();
    this._categoryWindow.deactivate();
    this.onCategoryOk();
};

var _Scene_Shop_activateSellWindow = Scene_Shop.prototype.activateSellWindow;
    Scene_Shop.prototype.activateSellWindow = function() {
    _Scene_Shop_activateSellWindow.call(this);
    this.Categoryhide();
};

var _Scene_Shop_commandSell = Scene_Shop.prototype.commandSell;
    Scene_Shop.prototype.commandSell = function() {
    _Scene_Shop_commandSell.call(this);
    this.onCategoryOk();
};

var _Scene_Shop_onSellCancel = Scene_Shop.prototype.onSellCancel;
Scene_Shop.prototype.onSellCancel = function() {
    _Scene_Shop_onSellCancel.call(this);
    this.Categoryhide();
    this.onCategoryCancel();
};

Scene_Shop.prototype.Categoryhide = function() {
    this._categoryWindow.deselect();
    this._categoryWindow.deactivate();
    this._categoryWindow.hide();
};

var _Window_ItemCategory_initialize = Window_ItemCategory.prototype.initialize;
    Window_ItemCategory.prototype.initialize = function() {
    _Window_ItemCategory_initialize.call(this);
    this.visible = 0;
    this.y = 0;
    this.height = 0;
};

var _Window_ItemList_includes = Window_ItemList.prototype.includes;
    Window_ItemList.prototype.includes = function(item) {
    if(!item) return false;
    if(!AAAisall) return true;
    this._category = 'item';
    return _Window_ItemList_includes.call(this, item);
};
      
})();
