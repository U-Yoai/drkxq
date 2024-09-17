//=============================================================================
// KMS_SomStyleDamage.js
//   Last update: 2015/12/06
//=============================================================================

/*:
 * @plugindesc
 * [v0.1.0] Display damages like Secret of Mana 2.
 * 
 * @author TOMY (Kamesoft)
 *
 * @param MaxSpeed X
 * @default 0.7
 * @desc The maximum speed for horizontal direction.
 *
 * @param InitialSpeed Y
 * @default -6
 * @desc The initial speed for vertical direction.
 *
 * @param Delay Y
 * @default 0.2
 * @desc Revise falling speed of damage.
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc
 * [v0.1.0] ダメージ表示を聖剣 3 スタイルにします。
 * 
 * @author TOMY (Kamesoft)
 *
 * @param MaxSpeed X
 * @default 0.7
 * @desc ダメージ数値を横に飛ばす最大速度です。
 *
 * @param InitialSpeed Y
 * @default -6
 * @desc ダメージの上下方向への初速です。
 *
 * @param Delay Y
 * @default -0.2
 * @desc ダメージの落下速度補正です。
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

var KMS = KMS || {};

(function() {

KMS.imported = KMS.imported || {};
KMS.imported['SomStyleDamage'] = true;

var pluginParams = PluginManager.parameters('KMS_SomStyleDamage');
var Params = {};
Params.maxSpeedX = Number(pluginParams['MaxSpeed X'] || 0.7);
Params.initialSpeedY = Number(pluginParams['InitialSpeed Y'] || -6);
Params.delayY = Number(pluginParams['Delay Y'] || 0.2);

//-----------------------------------------------------------------------------
// Sprite_Damage

var _KMS_SomStyleDamage_Sprite_Damage_setup = Sprite_Damage.prototype.setup;
Sprite_Damage.prototype.setup = function(target)
{
    _KMS_SomStyleDamage_Sprite_Damage_setup.call(this, target);
    this.setupSomStyleDamageParameter();
};

Sprite_Damage.prototype.setupSomStyleDamageParameter = function()
{
    var stepX = (Math.random() - 0.5) * 2 * Params.maxSpeedX;
    for (var i = 0; i < this.children.length; i++)
    {
        var sprite = this.children[i];
        sprite.dy = Params.initialSpeedY;
        sprite._stepX = stepX;
        sprite._stepScaleY = 0.02;
        sprite.scale.y = 0.1;
    }
};

var _KMS_SomStyleDamage_Sprite_Damage_updateChild = Sprite_Damage.prototype.updateChild;
Sprite_Damage.prototype.updateChild = function(sprite)
{
    sprite.dy -= Params.delayY;

    _KMS_SomStyleDamage_Sprite_Damage_updateChild.call(this, sprite);

    sprite.x += sprite._stepX;
    sprite.scale.y = Math.min(sprite.scale.y + sprite._stepScaleY, 1.0);
};

})();
