//-----------------------------------------------------------------------------------
//sai_Scenefile.js
//-----------------------------------------------------------------------------------
/*:ja
 * @plugindesc 補助ウインドウを使ったSS付セーブ画面
 *
 * @param bgBitmapFile
 * @desc セーブ／ロード画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 *
 *
 * @param List X
 * @desc セーブファイルリストの位置Xです。
 * @default 100
 *
 * @param List Y
 * @desc セーブファイルリストの位置Yです。
 * @default 120
 *
 * @param List Width
 * @desc セーブファイルリストのウインドウ幅です。
 * @default 280
 *
 * @param List Height
 * @desc セーブファイルリストのウインドウ高さです。
 * @default 380
 *
 * @param List MaxItems
 * @desc セーブファイルリストの数です。
 * @default 10
 *
 * @param List MaxCols
 * @desc セーブファイルリストの列数です。
 * @default 2
 *
 * @param List Opacity
 * @desc セーブファイルリストのウインドウ透過度です。
 * @default 0
 *
 * @param List Font Size
 * @desc セーブファイルリストのフォントサイズです。
 * @default 20
 *
 * @param Help X
 * @desc ヘルプのウインドウ位置Xです。
 * @default 100
 *
 * @param Help Y
 * @desc ヘルプのウインドウ位置Yです。
 * @default 50
 *
 * @param Help Width
 * @desc ヘルプのウインドウ幅です。
 * @default 580
 *
 * @param Help Opacity
 * @desc ヘルプのウインドウ透過度です。
 * @default 0
 *
 * @param Help Font Size
 * @desc ヘルプのフォントサイズです。
 * @default 18
 *
 * @param State X
 * @desc セーブ内容の位置Xです。
 * @default 380
 *
 * @param State Y
 * @desc セーブ内容の位置Yです。
 * @default 120
 *
 * @param State Width
 * @desc セーブ内容のウインドウ幅です。
 * @default 300
 *
 * @param State Height
 * @desc セーブ内容のウインドウ高さです。
 * @default 370
  
 * @param State Opacity
 * @desc セーブ内容のウインドウ透過度です。
 * @default 0
 *
 * @param State Font Size
 * @desc セーブ内容のフォントサイズです。
 * @default 18
 *
 * @param SS X
 * @desc スクリーンショットの表示位置Xです。
 * @default 0
 *
 * @param SS Y
 * @desc スクリーンショットの表示位置Yです。
 * @default 0
 *
 * @param SS Percent
 * @desc スクリーンショットの圧縮率です。
 *この数字が大きいほどデータが重くなります。
 * @default 0.30
 *
 * @param Savetime X
 * @desc セーブ日時の表示位置Xです。
 * @default 0
 *
 * @param Savetime Y
 * @desc セーブ日時の表示位置Yです。
 * @default 190
 *
 * @param hizuke TEXT
 * @desc 日付です。
 * @default 記録場所：
 *
 * @param hizuke TEXT X
 * @desc 日付表示位置Xです。
 * @default 0
 *
 * @param hizuke TEXT Y
 * @desc 日付表示位置Yです。
 * @default 220
 *
 * @param hizuke X
 * @desc 日付変数の表示位置Xです。
 * @default 0
 *
 * @param hizuke Y
 * @desc 日付変数の表示位置Yです。
 * @default 215
 
  * @param Location TEXT
 * @desc マップ名の名称です、制御文字が使えます。
 * @default 記録場所：
 *
 * @param Location TEXT X
 * @desc マップ名の名称表示位置Xです。
 * @default 0
 *
 * @param Location TEXT Y
 * @desc マップ名の名称表示位置Yです。
 * @default 220
 *
 * @param Location X
 * @desc マップ名の表示位置Xです。
 * @default 0
 *
 * @param Location Y
 * @desc マップ名の表示位置Yです。
 * @default 215
 *
 * @param Gold TEXT
 * @desc 所持金の名称です、制御文字が使えます。
 * @default 所持金　：
  *
 * @param Gold TEXT X
 * @desc 所持金の名称表示位置Xです。
 * @default 0
 *
 * @param Gold TEXT Y
 * @desc 所持金の名称表示位置Yです。
 * @default 245
 *
 * @param Gold X
 * @desc 所持金の表示位置Xです。
 * @default 0
 *
 * @param Gold Y
 * @desc 所持金の表示位置Yです。
 * @default 240
  
 * * @param syukai TEXT
 * @desc 周回です。
 * @default 周回回数：
 *
 * @param syukai TEXT X
 * @desc 周回表示位置Xです。
 * @default 0
 *
 * @param syukai TEXT Y
 * @desc 周回表示位置Yです。
 * @default 220
 *
 * @param syukai X
 * @desc 周回変数の表示位置Xです。
 * @default 0
 *
 * @param syukai Y
 * @desc 周回変数の表示位置Yです。
 * @default 215
 
 * * @param achieve TEXT
 * @desc 実績です。
 * @default 実績：
 *
 * @param achieve TEXT X
 * @desc 実績表示位置Xです。
 * @default 0
 *
 * @param achieve TEXT Y
 * @desc 実績表示位置Yです。
 * @default 220
 *
 * @param achieve X
 * @desc 実績変数の表示位置Xです。
 * @default 0
 *
 * @param achieve Y
 * @desc 実績変数の表示位置Yです。
 * @default 215
 
 * @param Level X
 * @desc （パーティリーダー）レベルの表示位置Xです。
 * @default 0
 *
 * @param Level Y
 * @desc （パーティリーダー）レベルの表示位置Yです。
 * @default 280 
 *
 * @param Member X
 * @desc パーティメンバーの表示位置Xです。
 * @default 80 
 *
 * @param Member Y
 * @desc パーティメンバーの表示位置Yです。
 * @default 320 
 *	
 * @help このプラグインには、プラグインコマンドはありません。
 *
 * 制作者：sairi　[Twitter＠sairi55]
 * SPECIALTHANKS
 * 翠様、尾角つの様、剣崎宗二様
 * ツクマテお呼びTwitterで何時も構ってくれるツクラーの皆様
 *  
 * 無責任に行きたいので他のプラグインとの競合等により
 * バグ、エラーが発生した場合の対応、責任は取れません。
 * 改変がし易いように説明も入れたつもりですが
 * 全てご使用は自己責任でお願い致します。
 *  
 * 使用規約：
 * ジャンル無制限、改変可
 * 素材自体の販売禁止
 * ゲームに含めての再配布は可
 *  
 * クレジットの記載は強制しませんが入れてくれると嬉しいです。
 * あと教えてくれるともっと嬉しいです。
 * 以上宜しくお願いします。
 *  
 *  
*/



(function() {
	var Imported = Imported || {};
　　Imported.sai_Scenefile = true;
　　var sai = sai || {}; 

	var parameters = PluginManager.parameters('sai_Scenefile');
    var bgBitmapFile = parameters['bgBitmapFile'] || '';
	sai.list_x = Number(parameters['List X'] || 100);	
	sai.list_y = Number(parameters['List Y'] || 120);	
	sai.list_width = Number(parameters['List Width'] || 280);
	sai.list_height = Number(parameters['List Height'] || 380);
	sai.list_maxItems = Number(parameters['List MaxItems'] || 10);	
	sai.list_maxcols = Number(parameters['List MaxCols'] || 2);	
    sai.list_opacity = Number(parameters['List Opacity'] || 0);	
    sai.list_fontsize = Number(parameters['List Font Size'] || 20);	
	sai.help_x = Number(parameters['Help X'] || 100);	
	sai.help_y = Number(parameters['Help Y'] || 50);	
	sai.help_width = Number(parameters['Help Width'] || 580);
	sai.help_opacity = Number(parameters['Help Opacity'] || 0);	
　　sai.help_fontsize = Number(parameters['Help Font Size'] || 18);	
	sai.state_x = Number(parameters['State X'] || 380);	
	sai.state_y = Number(parameters['State Y'] || 120);	
	sai.state_width = Number(parameters['State Width'] || 300);
	sai.state_height = Number(parameters['State Height'] || 370);	
	sai.state_opacity = Number(parameters['State Opacity'] || 0);	
	sai.state_fontsize = Number(parameters['State Font Size'] || 18);	
	sai.ss_x = Number(parameters['SS X'] || 0);	
	sai.ss_y = Number(parameters['SS Y'] || 0);	
	sai.ss_percent = Number(parameters['SS Percent'] || 0.30);	
	sai.savetime_x = Number(parameters['Savetime X'] || 0);	
	sai.savetime_y = Number(parameters['Savetime Y'] || 190);
	sai.hizuke_text = (parameters['hizuke TEXT'] || '日付：');		
	sai.hizuketext_x = Number(parameters['hizuke TEXT X'] || 0);	
	sai.hizuketext_y = Number(parameters['hizuke TEXT Y'] || 220);	
	sai.hizuke_x = Number(parameters['hizuke X'] || 0);	
	sai.hizuke_y = Number(parameters['hizuke Y'] || 215);	
	sai.location_text = (parameters['Location TEXT'] || '記録場所：');		
	sai.locationtext_x = Number(parameters['Location TEXT X'] || 0);	
	sai.locationtext_y = Number(parameters['Location TEXT Y'] || 220);	
	sai.location_x = Number(parameters['Location X'] || 0);	
	sai.location_y = Number(parameters['Location Y'] || 215);	
	sai.syukai_text = (parameters['syukai TEXT'] || '周回：');		
	sai.syukaitext_x = Number(parameters['syukain TEXT X'] || 0);	
	sai.syukaitext_y = Number(parameters['syukai TEXT Y'] || 220);	
	sai.syukai_x = Number(parameters['syukai X'] || 0);	
	sai.syukai_y = Number(parameters['syukai Y'] || 215);	
	sai.achieve_text = (parameters['achieve TEXT'] || '実績：');		
	sai.achievetext_x = Number(parameters['achieve TEXT X'] || 0);	
	sai.achievetext_y = Number(parameters['achieve TEXT Y'] || 220);	
	sai.achieve_x = Number(parameters['achieve X'] || 0);	
	sai.achieve_y = Number(parameters['achieve Y'] || 215);	
	sai.gold_text = (parameters['Gold TEXT'] || '所持金　：');
	sai.goldtext_x = Number(parameters['Gold TEXT X'] || 0);	
	sai.goldtext_y = Number(parameters['Gold TEXT Y'] || 245);	
	sai.gold_x = Number(parameters['Gold X'] || 0);	
	sai.gold_y = Number(parameters['Gold Y'] || 240);
	sai.level_x = Number(parameters['Level X'] || 0);	
	sai.level_y = Number(parameters['Level Y'] || 280);	
	sai.members_x = Number(parameters['Member X'] || 80);	
	sai.members_y = Number(parameters['Member Y'] || 320);	
		
	
//Bitmap-----------------------------------------------------------------------------
if (!Bitmap.prototype.save){
    Bitmap.prototype.toDataURL = function(){
 // jpegとPNGサイズが小さくなる方を返す
           var png = this._canvas.toDataURL('image/png');
            var jpeg = this._canvas.toDataURL('image/jpeg');
            return (png.length < jpeg.length) ? png : jpeg;

    };
}

//DataManager-----------------------------------------------------------------------------
var DM_LSImage = DataManager.loadSavefileImages;
DataManager.loadSavefileImages = function(info){
    DM_LSImage.call(this, info);
    if (info.snapUrl){
		var DH = Decrypter.hasEncryptedImages;//暗号化してるかどうかのフラグを一旦適当な変数に保存
		Decrypter.hasEncryptedImages = false;//その場合一時的にfalse
         ImageManager.loadNormalBitmap(info.snapUrl);
		Decrypter.hasEncryptedImages = DH;    //フラグを戻す 
    }
	    if (info.characters) {
        for (var i = 0; i < info.characters.length; i++) {
            ImageManager.loadCharacter(info.characters[i][0]);
        }
    }
};

var DM_MSInfo = DataManager.makeSavefileInfo;//セーブファイルの内容
DataManager.makeSavefileInfo = function(){
var info = DM_MSInfo.call(this);	
　  info.syukai = $gameVariables.value(130);
	info.achieve = $gameVariables.value(131);
　  info.hizuke = $gameVariables.value(132);
	info.location = $gameActors.actor(1).name();
　  info.level = $gameParty.exists() ? $gameParty.members()[0].level : null;
	info.gold = $gameParty.gold();        
    info.map_id = $gameMap.mapId();
	
	
	var today = new Date();
    var dateOptions = {
         year: "numeric",
         month: "2-digit",
         day: "2-digit",
         hour: "2-digit",
         minute: "2-digit"
};
    info.savetime = today.toLocaleDateString("ja-JP",dateOptions)

　　var bitmap = this.makeSavefileBitmap();
    if (bitmap){
        info.snapUrl = bitmap.toDataURL();
    }
    return info;
};


DataManager.makeSavefileBitmap = function(){//セーブファイル用のビットマップを作成
    var bitmap = $gameTemp.getSavefileBitmap();
    if (!bitmap){
        return null;
    }
    var scale = Number(sai.ss_percent);
    var newBitmap = new Bitmap(bitmap.width * scale, bitmap.height * scale);
    newBitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, newBitmap.width, newBitmap.height);
    return newBitmap;
};

//Game_Temp-----------------------------------------------------------------------------
var Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function(){
    Game_Temp_initialize.call(this);
    this._savefileBitmap = null;
};

Game_Temp.prototype.setSavefileBitmap = function(bitmap){
    this._savefileBitmap = bitmap;
};

Game_Temp.prototype.getSavefileBitmap = function(){
    if (this._savefileBitmap){
        return this._savefileBitmap;
    }
    else{
        return SceneManager._backgroundBitmap;
    }
};

//---------------------------------------------------------------------------------
Window_SavefileList.prototype.maxItems = function() {
    return Number(sai.list_maxItems);
};
Window_SavefileList.prototype.maxCols = function() {
    return Number(sai.list_maxcols);　
};
Window_SavefileList.prototype.standardFontSize = function() {
    return Number(sai.list_fontsize);
};
Window_Help.prototype.standardFontSize = function() {
    return Number(sai.help_fontsize);
};
SceneManager.snapForBackground = function() {
    this._backgroundBitmap = this.snap();　//モーションブラーを取り外す

};
//----------------------------------------------------------------------------------
    var _Scene_File_create = Scene_File.prototype.create;
    Scene_File.prototype.create = function() {
        _Scene_File_create.call(this);
		//ステータスウインドウの配置
        this._statusWindow = new Window_SavefileStatus(Number(sai.state_x),Number(sai.state_y),Number(sai.state_width), Number(sai.state_height));
        this._statusWindow.setMode(this.mode());
        this._listWindow.statusWindow = this._statusWindow;
		// セーブ画面全てのウインドウを透明にする
		this._statusWindow.opacity = Number(sai.state_opacity);
		this._helpWindow.opacity = Number(sai.help_opacity);
        this._listWindow.opacity = Number(sai.list_opacity);
		//---------------------------------------
        this._listWindow.callUpdateHelp();
		//ヘルプウインドウの配置
		this._helpWindow.x = Number(sai.help_x);
		this._helpWindow.y = Number(sai.help_y);
		this._helpWindow.width = Number(sai.help_width);
        this.addWindow(this._statusWindow);
		this.addChildAt(this._helpWindow,2); //helpWindowの表示順位を入れ替える		
    };

    var _Scene_File_start = Scene_File.prototype.start;
    Scene_File.prototype.start = function() {
        _Scene_File_start.call(this);
        this._listWindow.ensureCursorVisible();
        this._listWindow.callUpdateHelp();
    };

Window_SavefileList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, Number(sai.list_x), Number(sai.list_y), Number(sai.list_width), Number(sai.list_height));
    this.activate();
    this._mode = null;
};
Window_SavefileList.prototype.itemHeight = function() {
    return this.padding * 1.8;
};

    var _Window_SavefileList_callUpdateHelp =
            Window_SavefileList.prototype.callUpdateHelp;
    Window_SavefileList.prototype.callUpdateHelp = function() {
        _Window_SavefileList_callUpdateHelp.call(this);
        if (this.active && this.statusWindow) {
            this.statusWindow.setId(this.index() + 1);
        }
    };

    function Window_SavefileStatus() {
        this.initialize.apply(this, arguments);
    }

    Window_SavefileStatus.prototype = Object.create(Window_Base.prototype);
    Window_SavefileStatus.prototype.constructor = Window_SavefileStatus;

    Window_SavefileStatus.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._id = 1;
    };

    Window_SavefileStatus.prototype.setMode = function(mode) {
        this._mode = mode;
    };

    Window_SavefileStatus.prototype.setId = function(id) {
        this._id = id;
						this.contents.fontSize = Number(sai.state_fontsize);
        this.refresh();
    };
	Window_SavefileStatus.prototype.standardFontSize = function(id) {
        return  Number(sai.state_fontsize);
    };

    Window_SavefileStatus.prototype.refresh = function() {
        this.contents.clear();
    var id = this._id;
    var info = DataManager.loadSavefileInfo(id);
	var valid = DataManager.isThisGameFile(id);
    if (info){
        var rect = this.contents.rect;
        this.drawSnappedImage(info, rect, valid);
		this.drawFileId(id, rect.x, rect.y);
		this.drawContents(info, rect.x, valid);
    }
    };
	
//セーブステータス画面に表示させる名称と位置------------------------------------
//現状[ファイル名+ID、プレイ時間、地名、持ち金]、名称変更は''の中の文字で
    Window_SavefileStatus.prototype.drawFileId = function(id, x, y) {
        		this.drawTextEx((sai.syukai_text) + ' ', Number(sai.syukaitext_x), Number(sai.syukaitext_y), 120);
        		this.drawTextEx((sai.achieve_text) + ' ', Number(sai.achievetext_x), Number(sai.achievetext_y), 120);
    		this.drawTextEx((sai.hizuke_text) + ' ', Number(sai.hizuketext_x), Number(sai.hizuketext_y), 120);
		this.drawTextEx((sai.location_text) + ' ', Number(sai.locationtext_x), Number(sai.locationtext_y), 120);
		this.drawTextEx((sai.gold_text) + ' ', Number(sai.goldtext_x), Number(sai.goldtext_y), 120);
    };

      Window_SavefileStatus.prototype.drawContents = function(info, x, valid) {
        this.drawText(info.savetime, Number(sai.savetime_x), Number(sai.savetime_y), 200);
        		if (info.syukai) {
		this.drawText(info.syukai, (sai.syukai_x), Number(sai.syukai_y), 150);
		}
        		if (info.achieve) {
		this.drawText(info.achieve, (sai.achieve_x), Number(sai.achieve_y), 150);
		}
        		if (info.hizuke) {
		this.drawText(info.hizuke, (sai.hizuke_x), Number(sai.hizuke_y), 150);
		}
		if (info.location) {
		this.drawText(info.location, (sai.location_x), Number(sai.location_y), 150);
		}
		if (info.level) {
			this.drawText(TextManager.levelA + " " + info.level, Number(sai.level_x), Number(sai.level_y), 60);
		}
		if (typeof info.gold === 'number') {　//値が数字の時に通る
			this.drawText(info.gold + " " + TextManager.currencyUnit, (sai.gold_x), Number(sai.gold_y), 200);
		}


		if (valid) {
            this.drawPartyCharacters(info,Number(sai.members_x),Number(sai.members_y));
        }

    };

//ステータスウインドウに表示させるPTの詳細--------------------------------------
Window_SavefileStatus.prototype.drawPartyCharacters = function(info, x, y) {
    if (info.characters) {
        for (var i = 0; i < info.characters.length; i++) {
            var data = info.characters[i];
            this.drawCharacter(data[0], data[1], x + i * 48, y);
        }
    }
};
//セーブファイルリストの中身-------------------------------------------------
Window_SavefileList.prototype.drawItem = function(index) {
    var id = index + 1;
    var rect = this.itemRectForText(index);
    this.resetTextColor();
    this.drawFileId(id, rect.x, rect.y);

};
//セーブファイルの画像を表示
Window_SavefileStatus.prototype.drawSnappedImage = function(info, rect, valid){
    if (!(valid && info.snapUrl)){
        return;
    }
　　var DH = Decrypter.hasEncryptedImages;//暗号化してるかどうかのフラグを一旦適当な変数に保存
	Decrypter.hasEncryptedImages = false;//その場合一時的にfalse
    var bitmap = ImageManager.loadNormalBitmap(info.snapUrl);
	Decrypter.hasEncryptedImages = DH;    //フラグを戻す 
    var dh = 0;
    var dw = 0;
    var dx = rect.x + Number(sai.ss_x);　//表示位置X
    var dy = rect.y + Number(sai.ss_y);　　//表示位置Y

    this.changePaintOpacity(true);
    this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, dx, dy, dw, dh);
};

    //セーブ画面の背景読み込み
    var _Scene_File_createBackground = Scene_File.prototype.createBackground;
    Scene_File.prototype.createBackground = function(){
        if(bgBitmapFile){
			Scene_MenuBase.prototype.createBackground.call(this);//追加行
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapFile);
            this.addChild(this._backgroundSprite);
            return;
        }
        _Scene_File_createBackground.call(this);    // 背景ファイルが無い場合
    };


})();