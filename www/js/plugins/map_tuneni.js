(function() {
  'use strict';//厳格モード

  /////////////////////////////////////////////////////////////////////////////
  //Scene_Map
  Scene_Map.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SceneManager.clearStack();
    if (this._transfer) {
      this.fadeInForTransfer();
      //this._mapNameWindow.open();
      $gameMap.autoplay();
    } else if (this.needsFadeIn()) {
      this.startFadeIn(this.fadeSpeed(), false);
    }
    this._mapNameWindow.open();//常に表示
    this.menuCalling = false;
  };

  /////////////////////////////////////////////////////////////////////////////
  //Window_MapName
  Window_MapName.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (this._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
      this.updateFadeIn();
      //this._showCount--;
    } else {
      this.updateFadeOut();
    }
  };

  Window_MapName.prototype.updateFadeIn = function() {
    if (this.contentsOpacity < 256) {
      this.contentsOpacity += 16;
    }
  };
})();
