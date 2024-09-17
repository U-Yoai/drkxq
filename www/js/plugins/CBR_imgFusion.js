/*
##################################################
	作者: COBRA
	改造や配布しても大丈夫だよ
	寧ろ積極的に配布して皆のゲーム快適にしてあげて
	もし音信普通になったら誰でもいいから引き継いで
	http://cobrara.blogspot.jp/
	https://twitter.com/onarinin_san
##################################################
*/

/*:
* @plugindesc 画像合成
* @author COBRA
* @help Version 1.0.0　2020/2/8
* rpg_core.js v1.6.1に対応
* 
* 
* 画像の名前に\V[n]で変数名も使えます
* ピクチャを消去、セーブ→ロードしても効果は持続します
*
* イベントのスクリプトで実行してね
* 合成する画像全て読み終えてから全て同時に描写されます
*
* ～合成したい時～
*
* CBR-画像合成　(これを1行目に書いてね)
* <合成したい画像名.png>　(2行目に書いてね)
* 追加したい画像名.png　(1行につき1つまでだよ)
*
*
* ～解除したい時～
*
* CBR-画像合成
* <解除したい画像名.png>　(これを1行目に書いてね)
*
*
* おわり
*/

var CBR = CBR || {};
CBR.imgFusion = {};

if(!CBR_Game_Interpreter_command355){
	var CBR_Game_Interpreter_command355 = Game_Interpreter.prototype.command355;
	Game_Interpreter.prototype.command355 = function() {
		//CBR-xxxの場合CBR.xxxにobjを渡す
		var key = this.currentCommand().parameters[0];
		if(key.match(/^CBR\-/)){
			var obj = [];
			//下に続いてるスクリプトの取得
			while (this.nextEventCode() === 655) {
				this._index++;
				obj[obj.length] = this.currentCommand().parameters[0];
			}
			var temp = key.split('-');
			//CBR-×××があったら
			if(CBR[temp[1]]){
				//下に続くデータを入れる
				CBR[temp[1]](obj);
			}
		//普通にスクリプト実行
		}else{
			CBR_Game_Interpreter_command355.call(this);
		}
		return true;
	};
};




//他の人がややこしくなるだろうからGame_Systemには追加したくない
CBR.imgFusion.key = function(name){
	//後に何があるかわからないから.pngは残す
	var key = null;
	var ary = $gameSystem._CBR_imgFusion._fusionList;
	for(var i=0,len=ary.length; i<len; i++){
		if(ary[i].base == name){
			key = i;
		}
	}
	return key;
};

//基画像、要素のロード完了後実行するヤツ
CBR.imgFusion.onLoad = function(e){
	//ロード終わっても合成解除されてCBR_imgFusionが消されてたら
	if(!this.CBR_imgFusion){
		this.clear();
		this._context.drawImage(this._image, 0, 0);
		return;
	}
	if(!CBR.imgFusion.check(this.CBR_imgFusion._name)){//今後何があるかわらないから
		return;
	}
	this.clear();
	this._context.drawImage(this._image, 0, 0);
	//終わってた！画像描写するぞー！
	var key = CBR.imgFusion.key(this.CBR_imgFusion._name);
	var ary = $gameSystem._CBR_imgFusion._fusionList;
	for(var i=0,len=ary[key].add_ary.length; i<len; i++){
		var bitmap2 = ImageManager.loadBitmap('img/pictures/', ary[key].add_ary[i].slice(0,-4), undefined, true);
		this.context.drawImage(bitmap2._image, 0, 0);
	}
	//オンロードしたらbitmapがキャッシュされるんで追加描写は前もって
	//キャッシュのbitmapはちゃんと変更されてる、だから消してまた読み込んだ時反映されてる
	//Game_Pictureにはアップデートがある picture.update();
	//もしロード終了後の流れだったら
	if(!this._loadingState){
		this._loadingState = this._CBR_loadingState;
		this._renewCanvas = Bitmap.prototype._renewCanvas;//元に戻す
	}

	//ロード終了→オンロード→_renewCanvas内での実行だったらこれが終わった後オンロード実行される
	if(e){
		this._renewCanvas();	
	}else{
		Bitmap.prototype._onLoad.call(this);
		//もしピクチャが表示されてたらこの場でピクチャをリフレッシュ
		var temp = this.CBR_imgFusion._name.slice(0,-4);
		if(SceneManager._scene._spriteset){
			for(var i=1; i<101; i++){
				var temp2 = $gameScreen._pictures[i];
				//Game_Pictureがあったら
				if(temp2 && temp == temp2._name){
					//ピクチャスプライトをリフレッシュする
					SceneManager._scene._spriteset._pictureContainer.children[i-1]._refresh();
					this._baseTexture.update();//リフレッシュしたらbitmapのベーステクスチャもアップデートする事。リフレッシュの挙動的に
					break;
				}
			}
		}
	}
};

//その名前の要素が全部読み込めてるかどうか できてたらtrue
CBR.imgFusion.check = function(name){
	var key = CBR.imgFusion.key(name);
	var temp = true;
	var ary = $gameSystem._CBR_imgFusion._fusionList;
	if(key !== null){
		for(var i=0,len=ary[key].add_ary.length; i<len; i++){
			//素材読みこむよー
			var bitmap = ImageManager.loadBitmap('img/pictures/', ary[key].add_ary[i].slice(0,-4),undefined, true);
			//終わってなかったよ
			if(bitmap._loadingState!='loaded'){
				//素材のロード終わったら実行する奴
				bitmap._CBR_imgFusion_parent = name;
				var test =function(){
					//普通にロード終わったよ
					Bitmap.prototype._onLoad.call(this);
					//ベース画像を読みこむ
					var bitmap = ImageManager.loadBitmap('img/pictures/', this._CBR_imgFusion_parent.slice(0,-4), undefined, true);
					//そしてオンロード オンロードはloadでバインドしたものとは別物だからダメ
					bitmap.CBR_imgFusion_load();
				};
				bitmap._image.removeEventListener('load', bitmap._loadListener);
				bitmap._image.addEventListener('load', bitmap._loadListener = test.bind(bitmap));
				//ダメだったよ
				temp = false;
				break;
			}
		}
	}
	return temp;
};



var _CBRimgFusion_Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function(){
	_CBRimgFusion_Game_System_initialize.call(this);
	
	this._CBR_imgFusion = {};
	this._CBR_imgFusion._fusionList = [];
};

var _CBRimgFusion_ImageManager_loadPicture = ImageManager.loadPicture;
ImageManager.loadPicture = function(filename, hue) {

	//フュージョンに同じものあるかな？
	var temp = false;
	for(var i=0,len=$gameSystem._CBR_imgFusion._fusionList.length; i<len; i++){
		if($gameSystem._CBR_imgFusion._fusionList[i].base == filename+'.png'){
			temp = true;
			break;
		}
	}

	//あったー
	if(temp){
		//bitmap初期設定
		var bitmap = this.loadBitmap('img/pictures/', filename, hue, true);
		//ロード時、systemには残ってるけどbitmapは初期化されてしまってるとき
		if(!bitmap.CBR_imgFusion){
			bitmap.CBR_imgFusion = {};
			bitmap.CBR_imgFusion._name = filename+'.png';
			bitmap.CBR_imgFusion_load = CBR.imgFusion.onLoad;

			//基画像がロード中だったらロード終わった後に実行させないとね
			//ロード済みだったら合成しちゃお
			if(bitmap._loadingState=='requesting' || bitmap._loadingState=='decrypting'){
				//ロード終わったらload()実行させないとね！
				bitmap._renewCanvas = function(){
					this._CBR_loadingState = this._loadingState;
					this._loadingState = null;
					this.CBR_imgFusion_load(true);
					return;
				};
			}
		}

		if(bitmap._loadingState == 'loaded'){
			bitmap.CBR_imgFusion_load();//とりあえず更新
		}
		return bitmap;
	}else{
		return _CBRimgFusion_ImageManager_loadPicture.call(this,filename, hue);
	}
};



//合成するぞー
CBR["画像合成"] = function(ary){	
	//ベースと要素の変数を実行
	for(var i=0,len=ary.length; i<len; i++){
		ary[i] = ary[i].replace(/\\V\[(\d+)\]/g,function(a,b){//汚いけどこれは毎回やらないとね
				return $gameVariables.value(b);//律儀にNumberしなくてもいいか
		});
	}

	var base = ary.shift().slice(1,-1);
	var key = CBR.imgFusion.key(base);

	//同じベース画像だったら上書きする
	if(key === null){
		key = $gameSystem._CBR_imgFusion._fusionList.length;
	}
	$gameSystem._CBR_imgFusion._fusionList[key] = {
		'base':base,
		'add_ary':ary
	};

	var bitmap = ImageManager.loadBitmap('img/pictures/', base.slice(0,-4), undefined, true);	
	
	//初期設定
	bitmap.CBR_imgFusion = {};
	bitmap.CBR_imgFusion._name = base;
	//コレや素材の読み込みが終わったら実行するヤツ
	bitmap.CBR_imgFusion_load = CBR.imgFusion.onLoad;

	//ロード済みだったら合成しちゃお
	if(bitmap._loadingState=='loaded'){
		//ベースがピクチャとして表示されてなかったら隠す
		var temp = base.slice(0,-4);
		if(SceneManager._scene._spriteset){
			for(var i=1; i<101; i++){
				var temp2 = $gameScreen._pictures[i];
				//Game_Pictureがあったら
				if(temp2 && temp == temp2._name){
					break;
				}
			}
			if(i==101){
				bitmap.clear();
			}
		}
		bitmap.CBR_imgFusion_load();
	//ロード・解読中だったら
	}else if(bitmap._loadingState=='requesting' || bitmap._loadingState=='decrypting'){
		//ロード終わったらload()実行させないとね！
		bitmap._renewCanvas = function(){
			this._CBR_loadingState = this._loadingState;
			this._loadingState = null;
			this.CBR_imgFusion_load(true);
			return;
		};
	}
};