/*:
 * @plugindesc ダメージ計算プラグイン ver1.00
 * @author めろん
 *
 * @param atk
 * @desc ATK計算式
 * @default 4 * a.atk 
 *
 * @param def
 * @desc DEF計算式
 * @default b.def * 2
 *
 * @param matk
 * @desc MATK計算式
 * @default 4 * a.mat
 *
 * @param mdef
 * @desc MDEF計算式
 * @default 3 * b.mdf
 *
 * @param x
 * @desc x計算式
 * @default a.atk * (100 - b.def) / 100 
 *
 * @param y
 * @desc y計算式
 * @default b.result().critical ? 4 : (100 - b.def) / 100 
 *
 * @help
 * actor	aのアクター判定	ex: actor ? Math.min(a.mat, 9999) : Math.min(a.mat, 99999)
 * g	bの防御判定		ex: g ? a.atk * 4 : a.atk / 2
 */

(function() {
	
	var parameters = PluginManager.parameters('ExDamageFormula');
	var atkEx = String(parameters['atk'] || '4 * a.atk');
	var matkEx = String(parameters['matk'] || '4 * a.mat');
	var defEx = String(parameters['def'] || 'b.def * 2');
	var mdefEx = String(parameters['mdef'] || 'b.mdf * 2');
	var xEx = String(parameters['x'] || '999999');
	var yEx = String(parameters['y'] || '999999');
	
	Game_Action.prototype.evalDamageFormula = function(target) {
		try {
			var item = this.item();
			var a = this.subject();
			var b = target;
			var v = $gameVariables._data;
			var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
			
			var actor = a.isActor();
			var g = b.isGuard();
			
			var user = this.subject();
			var t = target;
			var i = this.item();
			
			var atk = eval(atkEx);
			var def = eval(defEx);
			var matk = eval(matkEx);
			var mdef = eval(mdefEx);
			var x = eval(xEx);
			var y = eval(yEx);
		
			var value = Math.max(eval(item.damage.formula), 0) * sign;
			if (isNaN(value)) value = 0;
			return value;
		} catch (e) {
			return 0;
		}

	};
	
})();