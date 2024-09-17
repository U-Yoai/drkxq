//=============================================================================
// HasItemsSaver.js
//=============================================================================
// ----------------------------------------------------------------------------
// (C)2021 maguros
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2021/03/22 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/maguros3/
// [GitHub] : https://github.com/maguros/
//=============================================================================

/*:
 * @plugindesc 所持アイテム保存プラグイン
 * @target MZ
 * @url https://github.com/maguros/RPGMakerMZ_Plugins/blob/master/SampleProject/js/plugins/HasItemsSaver.js
 * @author maguros
 * @base PluginCommonBase
 * 
 * @param ProtectedItemList
 * @text 保護アイテム一覧（アイテム）
 * @desc 上書き・消去の対象にしないアイテムの一覧です。
 * アイテムカテゴリのアイテムのみ登録できます。
 * @type struct<ProtectedItem>[]
 * 
 * @param ProtectedWeaponList
 * @text 保護アイテム一覧（武器）
 * @desc 上書き・消去の対象にしないアイテムの一覧です。
 * 武器カテゴリのアイテムのみ登録できます。
 * @type struct<ProtectedWeapon>[]
 * 
 * @param ProtectedArmorList
 * @text 保護アイテム一覧（防具）
 * @desc 上書き・消去の対象にしないアイテムの一覧です。
 * 防具カテゴリのアイテムのみ登録できます。
 * @type struct<ProtectedArmor>[]
 * 
 * @command SAVE_HASITEMS
 * @text アイテム保存
 * @desc 現在の所持アイテムを変数に保存します。カテゴリ関係なく全て保存します。
 * 
 * @arg item_stock_variable
 * @text 所持アイテム保存先変数
 * @desc 所持アイテムを保存する変数です。
 * @type variable
 * 
 * @command LOAD_HASITEMS
 * @text アイテム読み出し
 * @desc 保存済みの所持アイテムを変数から読み出します。
 * 現在の所持アイテムは「保護アイテム一覧」に登録したもの以外、全て上書きされます。
 * 
 * @arg item_stock_variable
 * @text 所持アイテム読み出し元変数
 * @desc 所持アイテムを読み出す変数です。
 * @type variable
 * 
 * @arg enable_protected_item_list
 * @text 保護アイテム機能有効化
 * @desc 「保護アイテム一覧」のアイテムを保護する機能の有効・無効を切り替えます。
 * OFFに設定した場合、「保護アイテム一覧」のアイテムも含めた全てのアイテムを上書きします。
 * @default true
 * @type boolean
 * 
 * @command CLEAR_ALL_HASITEMS
 * @text アイテム全消去
 * @desc 現在の所持アイテムから「保護アイテム一覧」に登録したもの以外のアイテムを全て消去します。
 * 
 * @arg enable_protected_item_list
 * @text 保護アイテム機能有効化
 * @desc 「保護アイテム一覧」のアイテムを保護する機能の有効・無効を切り替えます。
 * OFFに設定した場合、「保護アイテム一覧」のアイテムも含めた全てのアイテムを消去します。
 * @default true
 * @type boolean
 * 
 * @help 現在の所持アイテムを変数の保存・読み出しを行うプラグインです。
 * 
 * ■プラグインコマンド
 * 　アイテム保存：　　現在の所持アイテムを変数に保存します。カテゴリ関係なく全てのアイテムが保存されます。
 * 　アイテム読み出し：保存済みの所持アイテムを変数から読み出します。「保護アイテム一覧」に登録したもの以外のアイテムは全て上書きされます。
 * 　アイテム全消去：　現在の所持アイテムから「保護アイテム一覧」に登録したもの以外のアイテムを全て消去します。
 * 
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 * 
 * 利用規約：
 * 　作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 * 　についても制限はありません。
 */

/*~struct~ProtectedItem:
 *
 * @param Item
 * @text 保護アイテム
 * @desc プラグインコマンド実行時に消去や上書きの対象にしないアイテムです。
 * @type item
 * 
 */

/*~struct~ProtectedWeapon:
 *
 * @param Item
 * @text 保護アイテム
 * @desc プラグインコマンド実行時に消去や上書きの対象にしないアイテムです。
 * @type weapon
 * 
 */

/*~struct~ProtectedArmor:
 *
 * @param Item
 * @text 保護アイテム
 * @desc プラグインコマンド実行時に消去や上書きの対象にしないアイテムです。
 * @type armor
 * 
 */

/*~struct~ProtectedItem:
 *
 * @param Item
 * @text 保護アイテム
 * @desc プラグインコマンド実行時に消去や上書きの対象にしないアイテムです。
 * @type item
 * 
 */

(() => {
    'use strict';
    const _script = document.currentScript;
    const _param = PluginManagerEx.createParameter(_script);

    const ItemType = {
        item: 0,
        weapon: 1,
        armor: 2
    };

    function getProtectdItems(type) {
        let result = null;

        switch (type) {
            case ItemType.item:
                result = _param.ProtectedItemList;
                break;
            case ItemType.weapon:
                result = _param.ProtectedWeaponList;
                break;
            case ItemType.armor:
                result = _param.ProtectedArmorList;
                break;
            default:
                break;
        }

        return result;
    }

    function isProtectedItem(item_id, protected_items) {
        if (!protected_items) return false;
        let result = protected_items.find((x) => x.Item === parseInt(item_id));
        return (result) ? true : false;
    }

    function clearItems(type, items, protected_items = null) {
        let clearItem = null;
        switch (type) {
            case ItemType.item:
                clearItem = (item_id, amount) => $gameParty.loseItem($dataItems[item_id], amount, false);
                break;
            case ItemType.weapon:
                clearItem = (weapon_id, amount) => $gameParty.loseItem($dataWeapons[weapon_id], amount, false);
                break;
            case ItemType.armor:
                clearItem = (armor_id, amount) => $gameParty.loseItem($dataArmors[armor_id], amount, false);
                break;
            default:
                return;
        }
        
        for(let key in items) {
            if (isProtectedItem(key, protected_items)) continue;
            
            let item_id = key;
            let amount = items[key];
            clearItem(item_id, amount);
        }
    }

    function clearAllItems(enable_protected_item_list) {
        let protected_items = (enable_protected_item_list) ? getProtectdItems(ItemType.item) : null;
        let protected_weapons = (enable_protected_item_list) ? getProtectdItems(ItemType.weapon) : null;
        let protected_armors = (enable_protected_item_list) ? getProtectdItems(ItemType.armor) : null;

        let items = $gameParty._items;
        clearItems(ItemType.item, items, protected_items);

        let weapons = $gameParty._weapons;
        clearItems(ItemType.weapon, weapons, protected_weapons);

        let armors = $gameParty._armors;
        clearItems(ItemType.armor, armors, protected_armors);
    }

    function loadItems(type, items, enable_protected_item_list) {
        let getItem = null;
        let protected_items;
        switch (type) {
            case ItemType.item:
                getItem = (item_id) => { return $dataItems[item_id] };
                protected_items = (enable_protected_item_list) ? getProtectdItems(ItemType.item) : null;
                break;
            case ItemType.weapon:
                getItem = (item_id) => { return $dataWeapons[item_id] };
                protected_items = (enable_protected_item_list) ? getProtectdItems(ItemType.weapon) : null;
                break;
            case ItemType.armor:
                getItem = (item_id) => { return $dataArmors[item_id] };
                protected_items = (enable_protected_item_list) ? getProtectdItems(ItemType.armor) : null;
                break;
            default:
                break;
        }

        for(let key in items) {
            if (isProtectedItem(key, protected_items)) continue;

            let item = getItem(key);
            let amount = items[key];
            $gameParty.gainItem(item, amount);
        }
    }

    PluginManagerEx.registerCommand(_script, 'SAVE_HASITEMS', function(args) {
        if (args.item_stock_variable <= 0) return;
        
        let item_list = {
            items: null,
            weapons: null,
            armors: null,
        };

        item_list.items = $gameParty._items;
        item_list.weapons = $gameParty._weapons;
        item_list.armors = $gameParty._armors;
        
        let json = JsonEx.stringify(item_list);
        $gameVariables.setValue(args.item_stock_variable, json);
    });

    PluginManagerEx.registerCommand(_script, 'LOAD_HASITEMS', function(args) {
        if (args.item_stock_variable <= 0) return;

        clearAllItems(args.enable_protected_item_list);

        let json = $gameVariables.value(args.item_stock_variable);
        if (!json) return;

        let item_list = JsonEx.parse(json);
        
        let items = item_list.items;
        let weapons = item_list.weapons;
        let armors = item_list.armors;

        loadItems(ItemType.item, items, args.enable_protected_item_list);
        loadItems(ItemType.weapon, weapons, args.enable_protected_item_list);
        loadItems(ItemType.armor, armors, args.enable_protected_item_list);
    });

    PluginManagerEx.registerCommand(_script, 'CLEAR_ALL_HASITEMS', function(args) {
        clearAllItems(args.enable_protected_item_list);
    });
})();