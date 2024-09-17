//=============================================================================
// ChoiceWithCondition.js
//=============================================================================

/*:
 * @plugindesc Make choice lists with some conditions by writing # and these conditions
 * @author Kanji the Grass
 *
 *
 * @help No message
 */


/*:ja
 * @plugindesc 選択肢の文章のしりに#と条件文を書いて、条件付きの選択肢を作ることができます。
 * @author 莞爾の草
 *
 * @help
 * ■条件文の形式
 *   スイッチの場合#スイッチ*num（スイッチ番号、半角数字）が*tof（オンかオフ。オンがtrueでオフがfalse。）
 *   変数の場合　　#変数*num（変数番号、半角数字）が*num（変数の数値）
 * 例：
 * 選択肢１：はい　#スイッチ1がオフ
 * 選択肢２：いいえ#変数1が100
 */

Window_ChoiceList.prototype.isCommandEnabled = function(index) {
  var command_name = $gameMessage.choices()[index];
  if(/.*#(スイッチ|変数)(\d+)が(オン|オフ|\d+)/i.test( command_name ) ){
    var data = command_name.match( /.*#(スイッチ|変数)(\d+)が(オン|オフ|\d+)/i );
    var tf = data[3] == "オン"
    if(data[1] == "スイッチ"){
      return $gameSwitches.value(data[2]) == tf;
    }else{
      return $gameVariables.value(data[2]) == data[3]
    }
  }else{
    return true;
  }
};

Window_ChoiceList.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    this.changePaintOpacity(this.isCommandEnabled( index ));
    this.drawTextEx(this.commandName(index).split("#")[0], rect.x, rect.y);
};

Window_ChoiceList.prototype.makeCommandList = function() {
    var choices = $gameMessage.choices();
    for (var i = 0; i < choices.length; i++) {
        this.addCommand(choices[i], 'choice', this.isCommandEnabled( i ));
    }
};

Window_ChoiceList.prototype.maxChoiceWidth = function() {
    var maxWidth = 96;
    var choices = $gameMessage.choices();
    for (var i = 0; i < choices.length; i++) {
        var choiceWidth = this.textWidthEx(choices[i].split("#")[0]) + this.textPadding() * 2;
        if (maxWidth < choiceWidth) {
            maxWidth = choiceWidth;
        }
    }
    return maxWidth;
};

