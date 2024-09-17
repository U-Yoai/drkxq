//=============================================================================
// RPG Maker MZ - Mouse in picture
//=============================================================================

/*:
 * @target MZ
 * @plugindesc ピクチャ内にマウスがあるか条件分岐で判定
 * @version 1.01
 * @author Kato Marine
 *
 * @help mouse_in_picture.js
 *
 * このプラグインは、イベントコマンドの条件分岐「スクリプト」内に
 * $gameMap.MouseInPicture(ピクチャ番号, 透明考慮)
 * と指定することでマウスカーソルがピクチャ内に存在するか判定します。
 * 
 * TouchInput.isTriggered() と組み合わせるとクリック後に判定になるので
 * 使い勝手が良いと思います。
 * 
 * 例１（透明色を考慮する）：
 * ◆条件分岐：スクリプト：TouchInput.isTriggered() && $gameMap.MouseInPicture(1, true)
 * ◆なんらかの処理
 * ：分岐終了
 * 
 * 例２（透明色を考慮しない）：
 * ◆条件分岐：スクリプト：TouchInput.isTriggered() && $gameMap.MouseInPicture(1, false)
 * ◆なんらかの処理
 * ：分岐終了
 * 
 * 
 * Q.ピクチャボタン化となにが違うのか？
 * A.いちいちコモンイベント呼ぶの嫌だ！並列処理の中で直接条件分岐かけたい！
 * という時に役に立つと思います。
 *
 * プラグインコマンドはありません。
 */

(() => {

    Game_Map.prototype.MouseInPicture = function (picID, alpha) {

        if ($gameScreen._pictures[$gameScreen.realPictureId(picID)]) {

            var thisPic = SceneManager._scene._spriteset._pictureContainer.children[$gameScreen.realPictureId((picID)) - 1];
            var picX = thisPic.x;
            var picY = thisPic.y;
            var picScaleX = ($gameScreen.picture($gameScreen.realPictureId(picID)).scaleX() / 100);
            var picScaleY = ($gameScreen.picture($gameScreen.realPictureId(picID)).scaleY() / 100);
            var picWidth = thisPic.width * picScaleX;
            var picHeight = thisPic.height * picScaleY;

            if ($gameScreen._pictures[$gameScreen.realPictureId(picID)]._origin == 0) {
                if (TouchInput._x >= picX && TouchInput._x <= picX + picWidth && TouchInput._y >= picY && TouchInput._y <= picY + picHeight) {
                    if (alpha == true) {
                        if (thisPic.bitmap.getAlphaPixel((TouchInput._x - picX) / picScaleX, (TouchInput._y - picY) / picScaleY)) {
                            return true;
                        }
                    } else { return true; }
                }
                return false;
            }
            if (TouchInput._x >= (picX - (picWidth / 2)) && TouchInput._x <= (picX + (picWidth / 2)) && TouchInput._y >= (picY - (picHeight / 2)) && TouchInput._y <= (picY + (picHeight / 2))) {
                if (alpha == true) {
                    if (thisPic.bitmap.getAlphaPixel((TouchInput._x - picX + (picWidth / 2)) / picScaleX, (TouchInput._y - picY + (picHeight / 2)) / picScaleY)) {
                        return true;
                    }
                } else { return true; }
            }
            return false;
        }

    }
})();
