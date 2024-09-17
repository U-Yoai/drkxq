 //=============================================================================
// Mano_ItemPocket.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017-2017 Sigureya
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/Sigureya/
// [github]:https://github.com/Sigureya/RPGmakerMV
//=============================================================================

/*:
 * @author しぐれん（魔のささやき）
 * @plugindesc ピクチャーの衝突判定を行います。
 * 
 * @help
 * 最小構成です。
 * スイッチの操作
 * スクリプトに以下の処理を書いてください。
 * $gameSwitches.setValue(スイッチ番号,picCollision(ピクチャ番号1,ピクチャ番号2))
 * -
*/

(function(global){

const Sprite_Picture_loadBitmap =Sprite_Picture .prototype.loadBitmap;
Sprite_Picture .prototype.loadBitmap =function(){
    Sprite_Picture_loadBitmap.call(this);
    const picture = this.picture();
    picture._spriteMA =this;    
};
function hagaHanase(ax,aw,bx,bw){
    return ax <(bx +bw) &&bx <(ax+aw)  ;//&&bx <(ax+aw);
}


/**
 * @param {Game_Picture} picture1
 * @param {Game_Picture} picture2
 */
function pictureIntersect(picture1,picture2){    
        if(!picture1._spriteMA.renderable){
            return false;
        }
        if(!picture2._spriteMA.renderable){
            return false;
        }
        if(hagaHanase(picture1.x(),picture1._spriteMA.width,picture2.x(),picture2._spriteMA.width)
        &&hagaHanase(picture1.y(),picture1._spriteMA.height,picture2.y(),picture2._spriteMA.height)){
            return true;
        }
        return false;
    }
    global.pictureIntersect_MA = pictureIntersect;
})(this);




/**
 * 
 * @param {number} a 
 * @param {number} b 
 */
function picCollision(a,b){
    return pictureIntersect_MA(
        $gameScreen.picture(a),
        $gameScreen.picture(b)        
    );

}
