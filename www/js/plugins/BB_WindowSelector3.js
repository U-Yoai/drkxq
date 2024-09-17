//=============================================================================
// BB_WindowSelector3.js
//=============================================================================

/*:
 * @plugindesc ウインドウスキンと切り替えるプラグイン。
 * @author ビービー
 *
 * @param Variable ID
 * @desc 指定したIDの変数が2の時にWindow2が3のときにWindow3が表示されます。
 * それ以外のときはデフォルトのWindowが表示されます。default：0
 * @default 0
 * 
 * @param Window1 Opacity
 * @desc 指定したIDの変数の数値によってウインドウの透明度を調節します。default：192
 * @default 192
 *
 * @param Window2 Opacity
 * @desc 指定したIDの変数の数値によってウインドウの透明度を調節します。default：192
 * @default 192
 * 
 * @param Window3 Opacity
 * @desc 指定したIDの変数の数値によってウインドウの透明度を調節します。default：192
 * @default 192
 * 
 * @param Window1 OutlineColor
 * @desc Windowの文字枠の色を変更します。R(赤),G(緑),B(青),A(強さ)の順番でカンマ(,)区切りで指定。default：rgba(0, 0, 0, 0.5)
 * @default rgba(0, 0, 0, 0.5)
 * 
 * @param Window1 OutlineWidth
 * @desc Windowの文字枠の幅を変更します。default：4
 * @default 4
 * 
 * @param Window2 OutlineColor
 * @desc Window2の文字枠の色を変更します。R(赤),G(緑),B(青),A(強さ)の順番でカンマ(,)区切りで指定。default：rgba(0, 0, 0, 0.5)
 * @default rgba(0, 0, 0, 0.5)
 * 
 * @param Window2 OutlineWidth
 * @desc Windowの文字枠の幅を変更します。default：4
 * @default 4
 * 
 * @param Window3 OutlineColor
 * @desc Window3の文字枠の色を変更します。R(赤),G(緑),B(青),A(強さ)の順番でカンマ(,)区切りで指定。default：rgba(0, 0, 0, 0.5)
 * @default rgba(0, 0, 0, 0.5)
 * 
 * @param Window3 OutlineWidth
 * @desc Windowの文字枠の幅を変更します。default：4
 * @default 4
 * 
 * @param Window1 DimmerColor
 * @desc Window1を暗くするに設定した時の背景色。
 * default：rgba(0, 0, 0, 0.6)
 * @default rgba(0, 0, 0, 0.6)
 * 
 * @param Window1 DimGradationColor
 * @desc Window1を暗くするに設定した時の背景色グラデーション。
 * default：rgba(0, 0, 0, 0)
 * @default rgba(0, 0, 0, 0)
 * 
 * @param Window2 DimmerColor
 * @desc Window2を暗くするに設定した時の背景色。
 * default：rgba(0, 0, 0, 0.6)
 * @default rgba(0, 0, 0, 0.6)
 * 
 * @param Window2 DimGradationColor
 * @desc Window2を暗くするに設定した時の背景色グラデーション。
 * default：rgba(0, 0, 0, 0)
 * @default rgba(0, 0, 0, 0)
 * 
 * @param Window3 DimmerColor
 * @desc Window3を暗くするに設定した時の背景色。
 * default：rgba(0, 0, 0, 0.6)
 * @default rgba(0, 0, 0, 0.6)
 * 
 * @param Window3 DimGradationColor
 * @desc Window3を暗くするに設定した時の背景色グラデーション。
 * default：rgba(0, 0, 0, 0)
 * @default rgba(0, 0, 0, 0)
 * 
 * @help Variable ID：パラメータで指定したIDの変数が2の時にWindow2が表示され、
 * 3のときにはWindow3が表示されます。それ以外のときはWindowを表示します。
 * --------------------------------------------------------------------------
 * Window1～3 Opacity：それぞれのウインドウの透明度を設定できます。
 * 透明度範囲＝0～255。デフォルト＝192。
 * --------------------------------------------------------------------------
 * ウインドウはそれぞれ文字枠色、文字枠幅を調節できます。
 * 変更されるのはメッセージウインドウのみです。
 * 
 * OutlineColor：文字枠の色を変更します。
 * デフォルト：rgba(0, 0, 0, 0.5)
 * R(赤),G(緑),B(青),A(強さ)の順番でカンマ(,)区切りで指定。
 * RGB(赤緑青)は0～255(0=明るい,255=暗い)の間で指定、A(強さ)は0～1(0=透明,1=不透明)の間で指定。
 * 
 * OutlineWidth：Windowの文字枠の幅を変更します。
 * デフォルト：4
 * --------------------------------------------------------------------------
 * ウインドウを暗くするに設定した場合の背景色を指定できます。
 * 
 * DimmerColor：背景中央部分の色指定。
 * デフォルト：rgba(0, 0, 0, 0.6)
 * R(赤),G(緑),B(青),A(強さ)の順番でカンマ(,)区切りで指定。
 * RGB(赤緑青)は0～255(0=明るい,255=暗い)の間で指定、A(強さ)は0～1(0=透明,1=不透明)の間で指定。
 * 
 * DimGradationColor：背景上下グラデーション部分の色指定。
 * デフォルト：rgba(0, 0, 0, 0)
 * R(赤),G(緑),B(青),A(強さ)の順番でカンマ(,)区切りで指定。
 * RGB(赤緑青)は0～255(0=明るい,255=暗い)の間で指定、A(強さ)は0～1(0=透明,1=不透明)の間で指定。
 * --------------------------------------------------------------------------
 * 利用規約：
 * 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 * についても制限はありません。
 * 
 * BLOG:http://bb-entertainment-blog.blogspot.jp/
 *
 */

(function() {

        var parameters = PluginManager.parameters('BB_WindowSelector3');
        var BBWSvar = Number(parameters['Variable ID'] || '0');
        var BBWS1o = Number(parameters['Window1 Opacity'] || '192');
        var BBWS2o = Number(parameters['Window2 Opacity'] || '192');
        var BBWS3o = Number(parameters['Window3 Opacity'] || '192');
        var BBWS1oc = String(parameters['Window1 OutlineColor'] || 'rgba(0, 0, 0, 0.5)');
        var BBWS1ow = Number(parameters['Window1 OutlineWidth'] || '4');
        var BBWS2oc = String(parameters['Window2 OutlineColor'] || 'rgba(0, 0, 0, 0.5)');
        var BBWS2ow = Number(parameters['Window2 OutlineWidth'] || '4');
        var BBWS3oc = String(parameters['Window3 OutlineColor'] || 'rgba(0, 0, 0, 0.5)');
        var BBWS3ow = Number(parameters['Window3 OutlineWidth'] || '4');
        var BBWS1dm = String(parameters['Window1 DimmerColor'] || 'rgba(0, 0, 0, 0.6)');
        var BBWS2dm = String(parameters['Window1 DimGradationColor'] || 'rgba(0, 0, 0, 0)');
        var BBWS3dm = String(parameters['Window2 DimmerColor'] || 'rgba(0, 0, 0, 0.6)');
        var BBWS4dm = String(parameters['Window2 DimGradationColor'] || 'rgba(0, 0, 0, 0)');
        var BBWS5dm = String(parameters['Window3 DimmerColor'] || 'rgba(0, 0, 0, 0.6)');
        var BBWS6dm = String(parameters['Window3 DimGradationColor'] || 'rgba(0, 0, 0, 0)');

// 画像の読み込み
var _Scene_Boot_prototype_loadSystemWindowImage = Scene_Boot.prototype.loadSystemWindowImage;
Scene_Boot.prototype.loadSystemWindowImage = function() {
    ImageManager.loadSystem('Window');
    ImageManager.loadSystem('Window2');
    ImageManager.loadSystem('Window3');
};

// ウインドウ画像の切り替え
var _Window_Base_prototype_update = Window_Base.prototype.update;
Window_Base.prototype.update = function() {
    Window.prototype.update.call(this);
    if($gameVariables.value(BBWSvar) == 3){
        this.windowskin = ImageManager.loadSystem('Window3');
        this.backOpacity = BBWS3o;
        this.contents.outlineColor = BBWS3oc;
        this.contents.outlineWidth = BBWS3ow;
    }else if($gameVariables.value(BBWSvar) == 2){
        this.windowskin = ImageManager.loadSystem('Window2');
        this.backOpacity = BBWS2o;
        this.contents.outlineColor = BBWS2oc;
        this.contents.outlineWidth = BBWS2ow;
    }else{
        this.windowskin = ImageManager.loadSystem('Window');
        this.backOpacity = BBWS1o;
        this.contents.outlineColor = BBWS1oc;
        this.contents.outlineWidth = BBWS1ow;
    }
    this.updateTone();
    this.updateOpen();
    this.updateClose();
    this.updateBackgroundDimmer();
};

var _Window_Base_prototype_updateBackgroundDimmer = Window_Base.prototype.updateBackgroundDimmer;
Window_Base.prototype.updateBackgroundDimmer = function() {
    if (this._dimmerSprite) {
        this._dimmerSprite.opacity = this.openness;
        this.refreshDimmerBitmap();
    }
};

var _Window_Base_prototype_refreshDimmerBitmap = Window_Base.prototype.refreshDimmerBitmap;
Window_Base.prototype.refreshDimmerBitmap = function() {
    if (this._dimmerSprite) {
        var bitmap = this._dimmerSprite.bitmap;
        var w = this.width;
        var h = this.height;
        var m = this.padding;
        if($gameVariables.value(BBWSvar) == 3){
            var c1 = this.dimColor5();
            var c2 = this.dimColor6();
        }else if($gameVariables.value(BBWSvar) == 2){
            var c1 = this.dimColor3();
            var c2 = this.dimColor4();
        }else{
            var c1 = this.dimColor1();
            var c2 = this.dimColor2();
        }
        bitmap.resize(w, h);
        bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
        bitmap.fillRect(0, m, w, h - m * 2, c1);
        bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
        this._dimmerSprite.setFrame(0, 0, w, h);
    }
};

var _Window_Base_prototype_dimColor1 = Window_Base.prototype.dimColor1;
Window_Base.prototype.dimColor1 = function() {
    return BBWS1dm;
};

var _Window_Base_prototype_dimColor21 = Window_Base.prototype.dimColor2;
Window_Base.prototype.dimColor2 = function() {
    return BBWS2dm;
};

var _Window_Base_prototype_dimColor3 = Window_Base.prototype.dimColor3;
Window_Base.prototype.dimColor3 = function() {
    return BBWS3dm;
};

var _Window_Base_prototype_dimColor4 = Window_Base.prototype.dimColor4;
Window_Base.prototype.dimColor4 = function() {
    return BBWS4dm;
};

var _Window_Base_prototype_dimColor5 = Window_Base.prototype.dimColor5;
Window_Base.prototype.dimColor5 = function() {
    return BBWS5dm;
};

var _Window_Base_prototype_dimColor6 = Window_Base.prototype.dimColor6;
Window_Base.prototype.dimColor6 = function() {
    return BBWS6dm;
};


})();