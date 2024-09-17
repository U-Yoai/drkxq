// DarkPlasma_ImageComposer
// Copyright (c) 2020 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * 2020/04/03 1.1.0 合成画像のメタデータをセーブデータに含めロード時に読み込む機能を追加
 *                  合成後の画像をキャッシュする機能を追加
 * 2020/04/02 1.0.0 公開
 */

/*:
 * @plugindesc 画像を合成するプラグイン
 * @author DarkPlasma
 * @license MIT
 *
 * @param Save Composed Images Meta
 * @desc 合成画像のメタデータをセーブデータに保存する。ロード時に保存していた合成画像を読み込む
 * @text 合成画像データセーブ
 * @type boolean
 * @default false
 *
 * @param Composed Image Cache Key Postfix
 * @desc 合成画像のキャッシュキーに付与する接頭辞
 * @text 合成画像キャッシュキー接頭辞
 * @type string
 * @default DPIC_COMPOSED_
 *
 * @param Composed Image Cache Limit
 * @desc 合成画像のキャッシュサイズ上限（MPixcel）。ツクールコアのキャッシュとは別枠です
 * @text 合成画像キャッシュ上限
 * @type number
 * @default 10
 *
 * @help
 * 画像を合成し、1枚のピクチャとして利用できるようにします。
 *
 * 利用方法は CBR_imgFusion.js と同様です。
 * イベントのスクリプトで以下のように入力してください。
 *
 * CBR-画像合成
 * <ベース画像.png>
 * 差分画像1.png
 * 差分画像2.png
 * ...
 *
 * これにより、ベース画像を読み込んだピクチャに差分画像が合成されます。
 * ピクチャの表示中でも合成が可能です。
 *
 * 合成解除したい際にも都度同様にして上書きする必要があります。
 *
 * このプラグインはCOBRAさんが公開されている CBR_imgFusion.js をリファクタしたものです。
 * 元のプラグインについては下記URLをご覧ください。
 *  http://cobrara.blogspot.jp/
 *  https://twitter.com/onarinin_san
 *
 * このプラグインはRPGツクールMV 1.6系で動作します。
 */

(function () {
  'use strict';
  const pluginName = document.currentScript.src.replace(/^.*\/(.*).js$/, function () {
    return arguments[1];
  });
  const pluginParameters = PluginManager.parameters(pluginName);

  const settings = {
    saveComposedImageMeta: String(pluginParameters['Save Composed Images Meta'] || 'false') === 'true',
    cacheKeyPostfix: String(pluginParameters['Composed Image Cache Key Postfix'] || 'DPIC_COMPOSED_'),
    cacheLimit: Number(pluginParameters['Composed Image Cache Limit'] || 10) * 1000 * 1000,
  };

  const LOADING_STATE = {
    LOADED: 'loaded',
    REQUESTING: 'requesting',
    DECRYPTING: 'decrypting'
  };

  /**
   * 合成Bitmap一覧
   */
  class ComposedBitmaps {
    constructor() {
      this._bitmaps = {};
    }

    /**
     * 指定したベース画像の合成画像を削除する
     * @param {string} key ベース画像の名前
     */
    clear(key) {
      delete this._bitmaps[key];
    }

    /**
     * 合成画像を追加する
     * @param {string} baseImageName ベース画像の名前
     * @param {string[]} additionalImageNames 差分画像の名前リスト
     * @param {number|undefined} touch 最終アクセス時刻
     */
    pushComposedBitmap(baseImageName, additionalImageNames, touch) {
      this._bitmaps[baseImageName] = new ComposedBitmap(baseImageName, additionalImageNames, touch);
      this._bitmaps[baseImageName].load();
      this._truncateCache();
    }

    /**
     * 合成画像の全Bitmapがロードされているかどうか
     * 指定したベース画像が合成画像でない場合は偽を返す
     * @param {string} key ベース画像の名前
     */
    isAllBitmapLoaded(key) {
      if (!this._bitmaps[key]) {
        return false;
      }
      return this._bitmaps[key].isAllBitmapLoaded();
    }

    /**
     * 画像を合成して返す
     * @param {string} key ベース画像の名前
     * @return {Bitmap}
     */
    compose(key) {
      if (!this._bitmaps[key]) {
        return null;
      }
      return this._bitmaps[key].compose();
    }

    /**
     * セーブ用メタデータを返す
     * @return {object}
     */
    get meta() {
      Object.keys(this._bitmaps).map(baseImageName => {
        return {
          base: baseImageName,
          additional: this._bitmaps[baseImageName].additionalImageNames,
          touch: this._bitmaps[baseImageName].touch
        };
      });
    }

    /**
     * 合成画像が多くなりすぎたら削除する
     */
    _truncateCache() {
      let items = this._bitmaps;
      let sizeLeft = settings.cacheLimit;

      Object.keys(items).map(key => {
        return items[key];
      }).sort((a, b) => {
        return b.touch - a.touch;
      }).forEach(item => {
        if (sizeLeft > 0 || item.mustBeHeld()) {
          sizeLeft -= item.wholePixcel();
        } else {
          this.clear(item.baseImageName);
        }
      });
    }
  }

  /**
   * 合成画像Bitmap
   */
  class ComposedBitmap {
    constructor(baseImageName, additionalImageNames, touch) {
      this._baseImageName = baseImageName;
      this._bitmaps = [];
      this._additionalImageNames = additionalImageNames;
      this._touch = touch ? touch : Date.now();
    }

    /**
     * @return {string} ベース画像の名前
     */
    get baseImageName() {
      return this._baseImageName;
    }

    /**
     * @return {string[]} 差分画像の名前リスト
     */
    get additionalImageNames() {
      return this._additionalImageNames;
    }

    /**
     * @return {number} 最終アクセス時刻
     */
    get touch() {
      return this._touch;
    }

    /**
     * 画像をロードする
     */
    load() {
      this._bitmaps = [];
      this._bitmaps.push(
        ImageManager.loadBitmap('img/pictures/', this._baseImageName.slice(0, -4), 0, true)
      );
      this._additionalImageNames.forEach(imageName => {
        const bitmap = ImageManager.loadBitmap('img/pictures/', imageName.slice(0, -4), 0, true);
        this._bitmaps.push(bitmap);
      });
    }

    /**
     * 合成画像のキャッシュキーを生成する
     */
    generateCacheKey() {
      return `${settings.cacheKeyPostfix}${this._baseImageName}${this._additionalImageNames.join()}`;
    }

    /**
     * @return {boolean} 全画像のロードが終わっているかどうか
     */
    isAllBitmapLoaded() {
      return !this._bitmaps.some(bitmap => bitmap._loadingState !== LOADING_STATE.LOADED);
    }

    /**
     * @return {Bitmap} 合成したBitmapを返す
     */
    compose() {
      if (!this._bitmaps) {
        return null;
      }
      const baseBitmap = this._bitmaps[0];
      let bitmap = ImageManager.getComposedBitmapCache(this.generateCacheKey());
      if (!bitmap) {
        bitmap = new Bitmap(baseBitmap.width, baseBitmap.height);
        bitmap.blt(baseBitmap, 0, 0, baseBitmap.width, baseBitmap.height, 0, 0);
        const additionalBitmaps = this._bitmaps.slice(1);
        additionalBitmaps.forEach(additionalBitmap => {
          bitmap.context.drawImage(additionalBitmap._image, 0, 0);
        });
        bitmap._setDirty();
        ImageManager.cacheComposedBitmap(this.generateCacheKey(), bitmap);
      }
      this._touch = Date.now();
      return bitmap;
    }

    /**
     * @return {number} 全画像のピクセル数合計を返す
     */
    wholePixcel() {
      if (!this.isAllBitmapLoaded()) {
        return 0;
      }
      return this._bitmaps
        .map(bitmap => bitmap.width * bitmap.height)
        .reduce((a, b) => a + b, 0);
    }

    /**
     * @return {boolean} キャッシュし続けるべきか
     */
    mustBeHeld() {
      // 将来的に、よく使う合成画像は明示的にreserveできるようにしても良い
      return false;
    }
  }

  /**
   * @param {string} cacheKey キャッシュキー
   * @param {Bitmap} bitmap 合成画像Bitmap
   */
  ImageManager.cacheComposedBitmap = function (cacheKey, bitmap) {
    this._imageCache.add(cacheKey, bitmap);
  };

  /**
   * @param {string} cacheKey キャッシュキー
   * @return {Bitmap} 合成画像Bitmap
   */
  ImageManager.getComposedBitmapCache = function (cacheKey) {
    return this._imageCache.get(cacheKey);
  };

  const composedBitmaps = new ComposedBitmaps();

  const _Game_Interpreter_command355 = Game_Interpreter.prototype.command355;
  Game_Interpreter.prototype.command355 = function () {
    const key = this.currentCommand().parameters[0];
    // TODO: インターフェースは後々考えるが、互換性を持たせる
    const keyScript = /^CBR\-(画像合成)$/.exec(key);
    if (keyScript) {
      let imageList = [];
      //下に続いてるスクリプトの取得
      while (this.nextEventCode() === 655) {
        this._index++;
        imageList.push(this.currentCommand().parameters[0]);
      }
      if (keyScript[1] === "画像合成") {
        $gameSystem.composeImage(imageList);
      }
    } else {
      //普通にスクリプト実行
      _Game_Interpreter_command355.call(this);
    }
    return true;
  }

  /**
   * 画像を合成する
   * @param {string[]} imageNameList
   * @param {number|undefined} touch
   */
  Game_System.prototype.composeImage = function (imageNameList, touch) {
    // 画像の名前に含まれる変数を展開
    imageNameList = imageNameList
      .map(imageName => imageName.replace(/\\V\[(\d+)\]/g, (_, variableId) => $gameVariables.value(variableId)));

    const baseImageName = imageNameList.shift().slice(1, -1);

    // composedBitmapsにpush
    composedBitmaps.pushComposedBitmap(baseImageName, imageNameList, touch);
  };

  const _Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
  Game_System.prototype.onBeforeSave = function () {
    _Game_System_onBeforeSave.call(this);
    if (settings.saveComposedImageMeta) {
      this._composedImageMeta = composedBitmaps.meta;
    } else if (this._composedImageMeta) {
      delete this._composedImageMeta;
    }
  };

  const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function () {
    _Game_System_onAfterLoad.call(this);
    if (this._composedImageMeta) {
      Object.keys(this._composedImageMeta)
        .map(baseImageName => {
          return {
            imageNames: [`<${baseImageName}>`].concat(this._composedImageMeta[baseImageName].additional),
            touch: this._composedImageMeta[baseImageName].touch
          };
        })
        .forEach(meta => this.composeImage(meta.imageNames, meta.touch));
    }
  };

  const _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
  Sprite_Picture.prototype.updateBitmap = function () {
    _Sprite_Picture_updateBitmap.call(this);
    const picture = this.picture();
    if (picture) {
      if (composedBitmaps.isAllBitmapLoaded(`${picture.name()}.png`)) {
        this.bitmap = composedBitmaps.compose(`${picture.name()}.png`);
      }
    }
  };
})();
