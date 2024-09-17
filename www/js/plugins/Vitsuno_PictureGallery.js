//=============================================================================
// Vitsuno_PictureGallery.js
//-----------------------------------------------------------------------------
// Copyright (c) 2015 Tsuno Ozumi
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

var Vitsuno = Vitsuno || {};
Vitsuno.PicGallery = {};
Vitsuno.PicGallery.version = 1.10;

/*:
 * @plugindesc ピクチャーギャラリー機能を加えるプラグインです。
 * @author 尾角 つの
 *
 * @param On Menu
 * @desc メニューに表示するかどうか (0:しない 1:する)
 * @default 0
 *
 * @param Command Name
 * @desc ギャラリーコマンドの表示名
 * @default ギャラリー
 *
 * @param Max Size
 * @desc ギャラリーの最大数
 * @default 12
 *
 * @param Thumbnail Width
 * @desc リスト用縮小画像の幅 (px)
 * @default 140
 *
 * @param Thumbnail Height
 * @desc リスト用縮小画像の高さ (px)
 * @default 110
 *
 * @param None File
 * @desc 空白部分の画像のファイル名
 * @default GalleryNone
 *
 * @param Use Common Mode
 * @desc ギャラリーデータをファイル間で共有するか (0:しない, 1:する)
 * (※Vitsuno_CommonSave.jsが必要。こちらがリストの下側。)
 * @default 0
 * 
 * @help
 *
 * プラグインコマンド:
 *   PictureGallery SetFile リストID ファイル名 # ギャラリーにファイルを追加
 *   PictureGallery SetText リストID 説明文    # ギャラリーに説明分を追加
 *   PictureGallery Remove リストID           # ギャラリーから削除
 *   PictureGallery Clear                    # ギャラリーリストをクリア
 *
 *   PictureGallery Go                       # ギャラリー画面に移動
 *
 *   PictureGallery CommonSave               # 共有ギャラリーのみ即保存します。
 *
 * リストIDは 1 ～ プラグイン設定の最大数 まで。
 *
 * 必要画像: 以下の画像を img/pictures の中に入れる
 *   ・ギャラリー画像 (例/ AAA.png )
 *   ・リスト用縮小画像 (ギャラリー画像名の後ろに _tmb をつける : 例/ AAA_tmb.png )
 *   ・リスト用空白画像 (例/ GalleryNone.png )
 *
 * ギャラリーのファイル間共有について:
 *   ギャラリーをファイル間で共有する場合、Vitsuno_CommonSave.jsが必要です。
 *   必ず、こちらのプラグインを下になるようにプラグインリストを設定して下さい。
 *   なお、共有したデータは通常のセーブ時に同時に保存されます。
 */

// ● プラグインの設定値を取得
Vitsuno.PicGallery.parameters = PluginManager.parameters('Vitsuno_PictureGallery');
Vitsuno.PicGallery.onMenu = Number(Vitsuno.PicGallery.parameters['On Menu']);
Vitsuno.PicGallery.galleryName = Vitsuno.PicGallery.parameters['Command Name'];
Vitsuno.PicGallery.maxSize = Number(Vitsuno.PicGallery.parameters['Max Size']);
Vitsuno.PicGallery.tmbWidth = Number(Vitsuno.PicGallery.parameters['Thumbnail Width']);
Vitsuno.PicGallery.tmbHeight = Number(Vitsuno.PicGallery.parameters['Thumbnail Height']);
Vitsuno.PicGallery.noneFileName = Vitsuno.PicGallery.parameters['None File'];
Vitsuno.PicGallery.useCommonMode = Number(Vitsuno.PicGallery.parameters['Use Common Mode']);

//-----------------------------------------------------------------------------
// TextManager
//-----------------------------------------------------------------------------

// ● プロパティーの設定
Object.defineProperty(TextManager, 'picGallery', {
    get: function() { return Vitsuno.PicGallery.galleryName; },
    configurable: true
});

//-----------------------------------------------------------------------------
// Game_System
//-----------------------------------------------------------------------------

// ● 初期化
Vitsuno.PicGallery.GSystem_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    Vitsuno.PicGallery.GSystem_initialize.call(this);
    this._pictureGalleryList = [];
    this._pictureGalleryId = 1;
};

// ● ギャラリーリストの取得
Game_System.prototype.pictureGalleryList = function() {
    if (!this._pictureGalleryList) {
        this._pictureGalleryList = [];
    }
    return this._pictureGalleryList;
};

// ● ギャラリーデータの取得
Game_System.prototype.pictureGalleryData = function(listId) {
    return this.pictureGalleryList()[listId] || {};
};

// ● ピクチャー名の取得
Game_System.prototype.pictureGalleryFileName = function(listId) {
    var obj = this.pictureGalleryData(listId);
    return obj.fileName ? obj.fileName : null;
};

// ● 説明文の取得
Game_System.prototype.pictureGalleryText = function(listId) {
    var obj = this.pictureGalleryData(listId);
    return obj.fileName && obj.text ? obj.text : '';
};

// ● 縮小版ピクチャー名の取得
Game_System.prototype.pictureGalleryTmbFileName = function(listId) {
    var fileName = this.pictureGalleryFileName(listId);
    return fileName ? fileName + '_tmb' : Vitsuno.PicGallery.noneFileName;
};

// ● ピクチャー名の設定
Game_System.prototype.setPictureGalleryFileName = function(listId, fileName) {
    var obj = this.pictureGalleryData(listId);
    obj.fileName = fileName;
    this.pictureGalleryList()[listId] = obj;
};

// ● 説明文の設定
Game_System.prototype.setPictureGalleryText = function(listId, text) {
    var obj = this.pictureGalleryData(listId);
    obj.text = text;
    this.pictureGalleryList()[listId] = obj;
};

// ● ギャラリーデータの削除
Game_System.prototype.removePictureGallery = function(listId) {
    this.pictureGalleryList()[listId] = null;
};

// ● ギャラリーデータのクリア
Game_System.prototype.clearPictureGallery = function() {
    this._pictureGalleryList = [];
};

// ● ギャラリーリストIDの取得
Game_System.prototype.pictureGalleryId = function() {
    return this._pictureGalleryId || 1;
};

// ● ギャラリーリストIDの設定
Game_System.prototype.setPictureGalleryId = function(listId) {
    this._pictureGalleryId = listId;
};

//-----------------------------------------------------------------------------
// Game_Interpreter
//-----------------------------------------------------------------------------

// ● プラグインコマンドの実行
Vitsuno.PicGallery.GInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Vitsuno.PicGallery.GInterpreter_pluginCommand.call(this, command, args);
    if (command === 'PictureGallery') {
        switch (args[0]) {
            case 'SetFile':
                var listId = Number(args[1]);
                var fileName = args[2];
                $gameSystem.setPictureGalleryFileName(listId, fileName);
                break;
            case 'SetText':
                var listId = Number(args[1]);
                var text = args[2];
                $gameSystem.setPictureGalleryText(listId, text);
                break;
            case 'Remove':
                var listId = Number(args[1]);
                $gameSystem.removePictureGallery(listId);
                break;
            case 'Clear':
                $gameSystem.clearPictureGallery();
                break;
            case 'Go':
                SceneManager.push(Scene_PictureGalleryList);
                break;
            case 'CommonSave':
                if (Vitsuno.CommonSave && Vitsuno.PicGallery.useCommonMode) {
                    var data = $gameSystem._pictureGalleryList;
                    CommonDataManager.save('PicGallery', data);
                }
                break;
        }
    }
};

//-----------------------------------------------------------------------------
// Window_MenuCommand
//-----------------------------------------------------------------------------

// ● ピクチャーギャラリーコマンドが有効かどうか
Window_MenuCommand.prototype.isPicGalleryEnabled = function() {
    return true;
};

// ● ピクチャーギャラリーを表示するかどうか
Window_MenuCommand.prototype.isPicGalleryDisplayed = function() {
    return Vitsuno.PicGallery.onMenu;
};

// ● オリジナルコマンドの追加
Vitsuno.PicGallery.WMenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
    Vitsuno.PicGallery.WMenuCommand_addOriginalCommands.call(this);
    if (this.isPicGalleryDisplayed()) {
        var enabled = this.isPicGalleryEnabled();
        this.addCommand(TextManager.picGallery, 'picGallery', enabled);
    }
};

//-----------------------------------------------------------------------------
// Window_PictureGalleryList
//
// ギャラリーリスト表示用のウィンドウです。

// ● クラスの作成
function Window_PictureGalleryList() {
    this.initialize.apply(this, arguments);
}

// ● クラスの継承
Window_PictureGalleryList.prototype = Object.create(Window_Selectable.prototype);
Window_PictureGalleryList.prototype.constructor = Window_PictureGalleryList;

// ● 初期化
Window_PictureGalleryList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    var sel = this.maxRows();
    for(var i = sel; i >= 1; i--){
      sel = i * this.maxCols() - 1;
      this.select(sel);
    }
    this.selectLast();
    this.activate();
};

// ● サムネイルの幅の取得
Window_PictureGalleryList.prototype.tmbWidth = function() {
    return Vitsuno.PicGallery.tmbWidth;
};

// ● サムネイルの高さの取得
Window_PictureGalleryList.prototype.tmbHeight = function() {
    return Vitsuno.PicGallery.tmbHeight;
};

// ● 行数の取得
Window_PictureGalleryList.prototype.maxCols = function() {
    return Math.floor(this.contentsWidth() / this.tmbWidth());
};

// ● 項目の高さの取得
Window_PictureGalleryList.prototype.itemHeight = function() {
    var rows = Math.floor(this.contentsHeight() / this.tmbHeight());
    return Math.floor(this.contentsHeight() / rows);
};

// ● 最大項目数の取得
Window_PictureGalleryList.prototype.maxItems = function() {
    return Vitsuno.PicGallery.maxSize;
};

// ● スペースの取得
Window_PictureGalleryList.prototype.spacing = function() {
    return 0;
};

// ● インデックスからリストIDを取得
Window_PictureGalleryList.prototype.listIdFromIndex = function(index) {
    return index + 1;
};

// ● リストIDからインデックスを取得
Window_PictureGalleryList.prototype.IndexFromListId = function(listId) {
    return listId - 1;
};

// ● 現在選択中の項目が選択可能かどうか
Window_PictureGalleryList.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.listIdFromIndex(this.index()));
};

// ● リストが選択可能かどうか
Window_PictureGalleryList.prototype.isEnabled = function(listId) {
    return !!$gameSystem.pictureGalleryFileName(listId);
};

// ● 決定時の処理
Window_PictureGalleryList.prototype.processOk = function() {
    Window_Selectable.prototype.processOk.call(this);
    $gameSystem.setPictureGalleryId(this.listIdFromIndex(this.index()));
};

// ● 最後に選択したリストを選択
Window_PictureGalleryList.prototype.selectLast = function() {
    this.select(this.IndexFromListId($gameSystem.pictureGalleryId()));
};

// ● 項目の描画
Window_PictureGalleryList.prototype.drawItem = function(index) {
    var listId = this.listIdFromIndex(index);
    var fileName = $gameSystem.pictureGalleryTmbFileName(listId);
    if (fileName) {
        var rect = this.itemRect(index);
        this.drawPicture(fileName, rect.x, rect.y, rect.width, rect.height);
    }
};

// ● ピクチャーの描画
Window_PictureGalleryList.prototype.drawPicture = function(fileName, x, y, width, height) {
    width = width || this.tmbWidth();
    height = height || this.tmbHeight();
    var bitmap = ImageManager.loadPicture(fileName);
    var pw = this.tmbWidth();
    var ph = this.tmbHeight();
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    var sx = (pw - sw) / 2;
    var sy = (ph - sh) / 2;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};

// ● ヘルプウィンドウの更新
Window_PictureGalleryList.prototype.updateHelp = function() {
    var listId = this.listIdFromIndex(this.index());
    var text = $gameSystem.pictureGalleryText(listId);
    this._helpWindow.setText(text);
};

// ● リフレッシュ
Window_PictureGalleryList.prototype.refresh = function() {
    this.createContents();
    this.drawAllItems();
};

//-----------------------------------------------------------------------------
// Window_PictureGalleryMain
//
// ギャラリー画像表示用のウィンドウです。

// ● クラスの作成
function Window_PictureGalleryMain() {
    this.initialize.apply(this, arguments);
}

// ● クラスの継承
Window_PictureGalleryMain.prototype = Object.create(Window_Selectable.prototype);
Window_PictureGalleryMain.prototype.constructor = Window_PictureGalleryMain;

// ● 初期化
Window_PictureGalleryMain.prototype.initialize = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    this.createGallerySprite();
    this.opacity = 0;
    this.refresh();
    this.activate();
};

// ● 余白の取得
Window_PictureGalleryMain.prototype.standardPadding = function() {
    return 0;
};

// ● 画像の作成
Window_PictureGalleryMain.prototype.createGallerySprite = function() {
    this._gallerySprite = new Sprite();
    this.addChild(this._gallerySprite);
};

// ● リフレッシュ
Window_PictureGalleryMain.prototype.refresh = function() {
    this.contents.clear();
    var listId = $gameSystem.pictureGalleryId();
    var fileName = $gameSystem.pictureGalleryFileName(listId);
    if (fileName) {
        var bitmap = ImageManager.loadPicture(fileName);
        this._gallerySprite.bitmap = bitmap;
    }
};

//-----------------------------------------------------------------------------
// Scene_Menu
//-----------------------------------------------------------------------------

// ● コマンドウィンドウの作成
Vitsuno.PicGallery.SMenu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    Vitsuno.PicGallery.SMenu_createCommandWindow.call(this);
    this._commandWindow.setHandler('picGallery', this.commandPicGallery.bind(this));
};

// ● ピクチャギャラリーコマンドの実行
Scene_Menu.prototype.commandPicGallery = function() {
    SceneManager.push(Scene_PictureGalleryList);
};

//-----------------------------------------------------------------------------
// Scene_PictureGalleryList
//
// ギャラリーリストを表示するシーンです。

// ● クラスの作成
function Scene_PictureGalleryList() {
    this.initialize.apply(this, arguments);
}

// ● クラスの継承
Scene_PictureGalleryList.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PictureGalleryList.prototype.constructor = Scene_PictureGalleryList;

// ● 初期化
Scene_PictureGalleryList.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

// ● シーンの作成
Scene_PictureGalleryList.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createListWindow();
};

// ● シーンの開始
Scene_PictureGalleryList.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._listWindow.refresh();
};

// ● リストウィンドウの作成
Scene_PictureGalleryList.prototype.createListWindow = function() {
    var wy = this._helpWindow.height;
    var ww = Graphics.boxWidth;
    var wh = Graphics.boxHeight - wy;
    this._listWindow = new Window_PictureGalleryList(0, wy, ww, wh);
    this._listWindow.setHelpWindow(this._helpWindow);
    this._listWindow.setHandler('ok',     this.onListOk.bind(this));
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._listWindow);
};

// ● リスト決定時の処理
Scene_PictureGalleryList.prototype.onListOk = function() {
    SceneManager.push(Scene_PictureGalleryMain);
};

//-----------------------------------------------------------------------------
// Scene_PictureGalleryMain
//
// ギャラリー画像を表示するシーンです。

// ● クラスの作成
function Scene_PictureGalleryMain() {
    this.initialize.apply(this, arguments);
}

// ● クラスの継承
Scene_PictureGalleryMain.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PictureGalleryMain.prototype.constructor = Scene_PictureGalleryMain;

// ● 初期化
Scene_PictureGalleryMain.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

// ● シーンの作成
Scene_PictureGalleryMain.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createGalleryWindow();
};

// ● シーンの開始
Scene_PictureGalleryMain.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._galleryWindow.refresh();
};

// ● ギャラリーウィンドウの作成
Scene_PictureGalleryMain.prototype.createGalleryWindow = function() {
    this._galleryWindow = new Window_PictureGalleryMain();
    this._galleryWindow.setHandler('cancel',   this.popScene.bind(this));
    this.addWindow(this._galleryWindow);
};

// (他のプラグインを使用) - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// コモンセーブ
if (Vitsuno.CommonSave) {
    
    // ● ゲーム開始時の処理
    Vitsuno.PicGallery.CommonDataMgr_startGame = CommonDataManager.startGame;
    CommonDataManager.startGame = function() {
        Vitsuno.PicGallery.CommonDataMgr_startGame.call(this);
        if (Vitsuno.PicGallery.useCommonMode) {
            var data = CommonDataManager.load('PicGallery') || [];
            $gameSystem._pictureGalleryList = data;
        }
    };
    
    // ● ゲームセーブ時の処理
    Vitsuno.PicGallery.CommonDataMgr_saveGame = CommonDataManager.saveGame;
    CommonDataManager.saveGame = function() {
        Vitsuno.PicGallery.CommonDataMgr_saveGame.call(this);
        if (Vitsuno.PicGallery.useCommonMode) {
            var data = $gameSystem._pictureGalleryList;
            CommonDataManager.save('PicGallery', data);
        }
    };
    
}
