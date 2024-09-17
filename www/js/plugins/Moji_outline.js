(function () {
    'use strict';
    var _Window_Base_createContents = Window_Base.prototype.createContents;
    Window_Base.prototype.createContents = function() {
        _Window_Base_createContents.apply(this, arguments);
        this.contents.outlineColor = 'black';
        this.contents.outlineWidth = 3;
    };
})();