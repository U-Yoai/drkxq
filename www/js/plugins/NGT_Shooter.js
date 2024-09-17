//=============================================================================
// NGT_Shooter.js
// ----------------------------------------------------------------------------
// Copyright (c) 2018 Velfare Nagata
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// Version
//
// 1.0.0 2018/0x/xx ・初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/velfare_nagata/
//=============================================================================

/*:ja
 * @plugindesc 指定した方向に弾を発射します。
 * 
 * @help このプラグインの使い方は下記のサンプルゲームにて紹介しています。
 * https://game.nicovideo.jp/atsumaru/games/gm9334
 * 
 * ▼簡単な使い方---------------------------------------------------------------
 * 1.プラグインパラメータ：bulletDataList を設定して、
 *   発射する弾オブジェクトの設定を行う。
 * 2.プラグインコマンド：SHOOT_TO_DEGREE または SHOOT_TO_POINT を実行し、
 *   指定した弾を任意の方向に発射する。
 * 3.発射した弾を消す場合は、プラグインコマンド：DELETE_BULLET を実行する。
 * -----------------------------------------------------------------------------
 *   
 * ▼プラグインコマンド---------------------------------------------------------
 * 0.予備知識
 * ・プラグインコマンドの引数には、下記のフォーマットで変数を指定することができます。
 *   \v[{0}]
 *     {0}：変数の番号
 * 
 * ・プラグインコマンドの引数には、下記のフォーマットで変数を指定することができます。
 *   \v[{0}]
 *     {0}：変数の番号
 * 
 * 
 * 1.弾を指定した角度で発射する場合
 * ・SHOOT_TO_DEGREE {0} {1} {2} {3}
 * ・角度指定発射 {0} {1} {2} {3}
 *   {0}：弾オブジェクトID
 *   {1}：発射開始位置 X座標
 *   {2}：発射開始位置 Y座標
 *   {3}：発射角度
 * 
 * 実際の発射方向と角度の関係性は下記の通りとなっています。
 *   0：　上
 *  45：右上
 *  90：　右
 * 135：右下
 * 180：　下
 * 225：左下
 * 270：　左
 * 315：左上
 * 
 * 
 * 2.弾を指定した発射開始位置から終了位置までの角度で発射する場合
 * ・SHOOT_TO_POINT {0} {1} {2} {3}
 * ・位置指定発射 {0} {1} {2} {3}
 *   {0}：弾オブジェクトID
 *   {1}：発射開始位置 X座標
 *   {2}：発射開始位置 Y座標
 *   {3}：発射方向位置 X座標
 *   {4}：発射方向位置 Y座標
 * 
 * プラグインコマンド：SHOOT_TO_DEGREE とほぼ同様の動作を行いますが、
 * 角度計算を行わなくても直感的に弾を発射することができます。
 * 
 * 
 * 3.指定したインデックス値の弾を削除する場合
 * ・DELETE_BULLET {0}
 * ・弾丸削除 {0}
 *   {0}：弾オブジェクトインデックス値
 * 
 * 引数に指定する弾オブジェクトインデックス値は、下記の方法で取得できます。
 * 
 * A.プラグインコマンド：SHOOT_TO_DEGREE または SHOOT_TO_POINT を実行すると、
 *   プラグインパラメータ：PointerOfBulletIndex で指定した変数に格納される。
 * 
 * B.NGT_CollisionManager（当たり判定プラグイン）と連携している場合、
 *   発射した弾の当たり判定が行われると、
 *   プラグインコマンド：COLLISION_RESULT_GET 実行時に、
 *   プラグインパラメータ：判定結果（対象オブジェクト インデックス） 格納変数番号 
 *   または 判定結果（衝突オブジェクト インデックス） 格納変数番号 で
 *   指定した変数に格納される。
 * 
 * 
 * 2.当たり判定を終了する場合
 * ・COLLISION_CHECK_STOP
 * ・当たり判定_終了
 * 
 * 当たり判定処理を終了します。
 * 
 * 
 * 3.当たり判定結果を取得する場合
 * ・COLLISION_RESULT_GET
 * ・当たり判定_結果_取得
 * 
 * 現在のフレーム内で発生した当たり判定の結果を取得します。
 * 結果はプラグインパラメータ：〇〇格納変数番号 で設定した変数に格納されます。
 * 当たり判定結果が無い場合は全ての変数に-1が格納されます。
 * 
 * 
 * 4.指定したオブジェクトの当たり判定を一時的に無効化する場合
 * ・COLLISION_INVINCIBLE_ADD {0} {1} {2}
 * ・当たり判定_無敵_追加 {0} {1} {2}
 *   {0}：対象オブジェクト インデックス
 *   {1}：衝突オブジェクト インデックス
 *   {2}：無敵時間（フレーム）
 * 
 * 指定した時間、指定したオブジェクト同士の当たり判定を行わないようにします。
 * 同じオブジェクト同士で連続で当たり判定が行われないように、
 * 無敵時間を設けるために使用します。
 * 対象オブジェクト インデックス 及び 衝突オブジェクト インデックス は
 * プラグインコマンド：COLLISION_RESULT_GET で取得することを想定しています。
 * 
 * 
 * 
 * ▼備考---------------------------------------------------------------------
 * 1.当たり判定の親子関係について
 * ・collisionDatas.fileNameで指定した画像のオブジェクトを基準に、
 *   collisionDatas.collisionTargetsで指定した画像のオブジェクトに対して
 *   当たり判定判定処理を行います。
 * 
 *   オブジェクトA・Bで当たり判定を行うとき、
 *   fileNameにA、collisionTargetsにBを設定した場合は、
 *   別途fileNameにB、collisionTargetsにAなどと設定する必要はありません。
 *   そのようにした場合、AとBの当たり判定は二重に行われてしまいます。
 * 　　
 * 2.めりこみ量算出処理について
 *   めりこみ量の算出は、移動方向によって取得内容が異なります。
 *   X軸のめりこみ量は、左右に移動している時に当たった場合に取得できます。
 *   Y軸のめりこみ量は、上下に移動している時に当たった場合に取得できます。
 *   
 *   正直めりこみ距離の算出処理が全然宜しくないので、誰か助言ください。
 * 
 * ----------------------------------------------------------------------------
 * 
 * @author ベルファーレ長田（゜∀゜）◆AHYA/HaiA.
 *
 * @param maxBulletCount
 * @desc 一度に表示される最大弾数を指定します。
 * 最大段数を超える場合、弾は発射されません。
 * @type number
 * @default 1000
 *
 * @param bulletDataList
 * @desc 発射する弾のデータを定義します。
 * @type struct<bullet>[]
 * @default []
 *
 * @param PointerOfBulletIndex
 * @desc 弾が発射された時に、弾オブジェクトインデックス値が格納される変数の番号を指定します。
 * @type number
 * @default 0
 */
/*~struct~bullet:ja
 * @param fileName
 * @desc 弾画像のファイル名を指定します。
 * @type string
 * @default 
 * 
 * @param aliveTime
 * @desc 弾の生存時間（フレーム数）を指定します。
 * @type number
 * @default 0
 * 
 * @param speed
 * @desc 弾の速度を指定します。
 * @type struct<speed>
 * @default {"value":"0","accelerationList":"[]"}
 * 
 * @param enlargeSpeed
 * @desc 弾の拡大速度を指定します。
 * @type struct<enlargeSpeed>
 * @default {"value":"0","increaseList":"[]"}
 * 
 * @param rotationSpeed
 * @desc 弾の回転速度を指定します。
 * @type struct<rotationSpeed>
 * @default {"value":"0","increaseList":"[]"}
 * 
 * @param subShootList
 * @desc 弾から発射する弾の情報一覧を指定します。
 * @type struct<subShoot>[]
 * @default []
 * 
 * @param isFixationPoint
 * @desc trueの場合、プラグインコマンドの引数に依らず発射位置を固定化します。
 * @type boolean
 * @default false
 * 
 * @param point
 * @desc 弾の発射位置の補正値を指定します。
 * @type struct<point>
 * @default {"x":"{\"value\":\"0\",\"min\":\"0\",\"max\":\"0\"}","y":"{\"value\":\"0\",\"min\":\"0\",\"max\":\"0\"}","radius":"0"}
 * 
 * @param isFixationDegree
 * @desc trueの場合、プラグインコマンドの引数に依らず発射角度を固定化します。
 * @type boolean
 * @default false
 * 
 * @param degree
 * @desc 弾の発射角度の補正値を指定します。
 * @type struct<randomRange>
 * @default {"value":"0","min":"0","max":"0"}
 * 
 * @param sound
 * @desc 弾を発射する時の音声情報を指定します。
 * @type struct<audioFile>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 * 
 * @param isLowerPicture
 * @desc trueの場合、ピクチャレイヤの下側に表示されます。
 * falseの場合、ピクチャレイヤの上側に表示されます。
 * @type boolean
 * @default false
 * 
 * @param animation
 * @desc 弾のアニメーション情報を指定します。
 * @type struct<animation>
 * @default {"isAnimation":"false","animationFrameRate":"1","frameWidth":"1","frameHeight":"1"}
 * 
 * @param isLinear
 * @desc trueの場合、弾は発射角度に対応して画像角度が変化します。
 * @type boolean
 * @default false
 * 
 * @param isLay
 * @desc trueの場合、弾が移動経路に沿って一直線に並んで表示されます。
 * @type boolean
 * @default false
*/
/*~struct~subShoot:ja
 * @param bulletId
 * @desc 発射する弾のIDを指定します。
 * @type number
 * @min 1
 * @max 999
 * @default 1
 * 
 * @param frame
 * @desc 弾を発射するフレーム数を指定します。
 * @type number
 * @default 0
 * 
 * @param isFixationPoint
 * @desc trueの場合、弾の現在位置に依らず発射位置を固定化します。
 * @type boolean
 * @default false
 * 
 * @param point
 * @desc 弾の発射位置の補正値を指定します。
 * @type struct<point>
 * @default {"x":"{\"value\":\"0\",\"min\":\"0\",\"max\":\"0\"}","y":"{\"value\":\"0\",\"min\":\"0\",\"max\":\"0\"}","radius":"0"}
 * 
 * @param isFixationDegree
 * @desc trueの場合、弾の現在角度に依らず発射角度を固定化します。
 * @type boolean
 * @default false
 * 
 * @param degree
 * @desc 弾の発射位置の補正値を指定します。
 * @type struct<randomRange>
 * @default {"value":"0","min":"0","max":"0"}
*/
/*~struct~point:ja
 * @param x
 * @desc x座標を指定します。
 * @type struct<randomRange>
 * @default {"value":"0","min":"0","max":"0"}
 * 
 * @param y
 * @desc y座標を指定します。
 * @type struct<randomRange>
 * @default {"value":"0","min":"0","max":"0"}
 * 
 * @param radius
 * @desc 発射角度に対する座標までの半径を指定します。
 * @type number
 * @default 0
*/
/*~struct~randomRange:ja
 * @param value
 * @desc 乱数に依らない固定値を指定します。
 * @type number
 * @default 0
 * 
 * @param min
 * @desc 乱数範囲の最小値を指定します。
 * @type number
 * @default 0
 * 
 * @param max
 * @desc 乱数範囲の最大値を指定します。
 * @type number
 * @default 0
*/
/*~struct~speed:ja
 * @param value
 * @desc 弾の速度を指定します。
 * @type number
 * @default 0
 * 
 * @param accelerationList
 * @desc 弾の加速情報一覧を指定します。
 * @type struct<acceleration>[]
 * @default []
*/
/*~struct~enlargeSpeed:ja
 * @param value
 * @desc 弾の拡縮速度を指定します。
 * @type number
 * @default 0
 * @min -100
 * @max 100
 * 
 * @param increaseList
 * @desc 弾の拡大加速情報一覧を指定します。
 * @type struct<increase>[]
 * @default []
*/
/*~struct~rotationSpeed:ja
 * @param value
 * @desc 弾の回転速度を指定します。
 * @type number
 * @default 0
 * @min -360
 * @max 360
 * 
 * @param increaseList
 * @desc 弾の回転加速情報一覧を指定します。
 * @type struct<increase>[]
 * @default []
*/
/*~struct~acceleration:ja
 * @param value
 * @desc 1フレームあたりの弾の加速度を指定します。
 * @type number
 * @default 0
 * 
 * @param isFixationDegree
 * @desc trueの場合、弾の発射角度に依らず加速角度を固定化します。
 * @type boolean
 * @default false
 * 
 * @param degree
 * @desc 弾の加速角度の補正値を指定します。
 * @type number
 * @min -360
 * @max 360
 * @default 0
 * 
 * @param startFrame
 * @desc 弾が発射されてから加速を開始するまでのフレーム数を指定します。
 * @type number
 * @min 0
 * @max 9999
 * @default 0
 * 
 * @param endFrame
 * @desc 弾が発射されてから加速を終了するまでのフレーム数を指定します。
 * @type number
 * @min 0
 * @max 9999
 * @default 0
*/
/*~struct~increase:ja
 * @param value
 * @desc 1フレームあたりの増加値を指定します。
 * @type number
 * @default 0
 * 
 * @param startFrame
 * @desc 弾が発射されてから増加を開始するまでのフレーム数を指定します。
 * @type number
 * @min 0
 * @max 9999
 * @default 0
 * 
 * @param endFrame
 * @desc 弾が発射されてから増加を終了するまでのフレーム数を指定します。
 * @type number
 * @min 0
 * @max 9999
 * @default 0
*/
/*~struct~audioFile:ja
 * @param name
 * @desc 音声ファイル名を指定します。
 * @type string
 * @default 
 * 
 * @param volume
 * @desc 音量を指定します。
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * 
 * @param pitch
 * @desc ピッチを指定します。
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * 
 * @param pan
 * @desc 位相を指定します。
 * @type number
 * @min -100
 * @max 100
 * @default 0
*/
/*~struct~animation:ja
 * @param isAnimation
 * @desc trueの場合、弾画像をスプライトシートとして扱い、複数フレームでの分割アニメーションを行います。
 * @type boolean
 * @default false
 * 
 * @param animationFrameRate
 * @desc 弾アニメのフレームレートを指定します。
 * ※ アニメフラグがtrueの場合のみ使用されます。
 * @type number
 * @min 1
 * @default 1
 * 
 * @param frameWidth
 * @desc 弾画像スプライトシートの1フレームの横幅を指定します。
 * ※ アニメフラグがtrueの場合のみ使用されます。
 * @type number
 * @min 1
 * @default 1
 * 
 * @param frameHeight
 * @desc 弾画像スプライトシートの1フレームの縦幅を指定します。
 * ※ アニメフラグがtrueの場合のみ使用されます。
 * @type number
 * @min 1
 * @default 1
*/

( function() {
    'use strict';
	var pluginName = 'NGT_Shooter';
	
    // --------------------------------------------------
    // ローカル関数
    // 参考：トリアコンタン殿の各種プラグインファイル
    // --------------------------------------------------
    var getArgNumber = function( arg, min, max ) {
        min = ( arguments.length < 2 ) ? -Infinity : min; 
        max = ( arguments.length < 3 ) ? -Infinity : max;

        return ( parseInt( convertEscapeCharacters( arg ), 10 ) || 0 ).clamp( min, max );
	};
    var convertEscapeCharacters = function( text ) {
        text = ( text == null ) ? '' : text;
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters( text ) : text;
    };
    var getParam = function( paramNames ) {
        for( var i = 0; i < paramNames.length; i++ ) {
            var name = PluginManager.parameters( pluginName )[paramNames[i]];
            if( name ) {
                return name;
            }
        }
        return null;
    };
    var getParamNumber = function( paramNames, min, max ) {
        min = ( arguments.length < 2 ) ? -Infinity : min; 
        max = ( arguments.length < 3 ) ? -Infinity : max;

        var value = getParam( paramNames );
        return ( parseInt( value, 10 ) || 0 ).clamp( min, max );
    };
    
    var getParamBoolean = function( paramNames ) {
        var value = getParam( paramNames );
        return ( value == "true" );
	};

    // --------------------------------------------------
    // ローカル関数
    // 参考：フトコロ殿の各種プラグインファイル
    // --------------------------------------------------
	var paramParse = function( obj ) {
        return JSON.parse( JSON.stringify( obj, paramReplace ) );
    };

    var paramReplace = function( key, value ) {
        try {
            return JSON.parse( value || null );
        } catch ( e ) {
            return value;
        }
    };

	// --------------------------------------------------
    // プラグインコマンド追加　　　　
    // --------------------------------------------------
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function( command, args ) {
		_Game_Interpreter_pluginCommand.apply( this, arguments );

		var addShootData = function( bulletId, x, y, degree ) {
        	$gameTemp.shooterManager.clearShootIndexVariable();
			if( !$gameTemp.shooterManager.isExistMargin() ) {
				return;
			}
			// パラメータチェック
			if( bulletId == null ) {
				throw new Error( "弾ID が指定されていません。" );
			}
			if( x == null ) {
				throw new Error( "発射位置-X座標 が指定されていません。" );
			}
			if( y == null ) {
				throw new Error( "発射位置-Y座標 が指定されていません。" );
			}
			var bullet = $gameTemp.shooterManager.bulletDatas()[bulletId - 1];
			if( bullet == null ) {
				throw new Error( "指定された弾IDから弾情報を取得できませんでした。" + "（" + "弾ID：" + bulletId + "）");
			}

			// 銃弾発射データ登録
			var spriteBullets = SceneManager._scene._spriteset.getCorrespondedBullets( bullet );
			var spriteBullet = null;
			if( bullet.isLay ) {
				spriteBullet = new Sprite_LayBullet( bulletId, x, y, degree );
			} else {
				spriteBullet = new Sprite_Bullet( bulletId, x, y, degree );
			}
			// 効果音演奏
			var sound = bullet.sound;
			if( sound != null ) {
				AudioManager.playSe( { "name":sound.name, "volume":sound.volume, "pitch":sound.pitch, "pan":sound.pan } );
			}
        	$gameTemp.shooterManager.setupShootIndexVariable();
			spriteBullets.addChild( spriteBullet );
		};

		var getDegree = function( startX, startY, endX, endY ) {
			// パラメータチェック
			if( startX == null ) {
				throw new Error( "開始位置-X座標 が指定されていないため、発射角度を取得できません。" );
			}
			if( startY == null ) {
				throw new Error( "開始位置-Y座標 が指定されていないため、発射角度を取得できません。" );
			}
			if( endX == null ) {
				throw new Error( "終了位置-X座標 が指定されていないため、発射角度を取得できません。" );
			}
			if( endY == null ) {
				throw new Error( "終了位置-Y座標 が指定されていないため、発射角度を取得できません。" );
			}
			// 弾データ取得＆チェック
			var degree = Math.atan2( endY - startY, endX - startX ) * 180 / Math.PI + 90;
			if( degree < 0 ) {
				degree = 360 + degree;
			}
			return degree;
		};
		
		var commandName = command.toUpperCase();
        switch( commandName ) {
			case 'SHOOT_TO_DEGREE':
			case '角度指定発射':
				// パラメータ取得
				var argBulletId = ( args.length >= 1 ) ? getArgNumber( args[0], 1, 9999 ) : null;
				var argStartX = ( args.length >= 2 ) ? getArgNumber( args[1], -9999, 9999 ) : null;
				var argStartY = ( args.length >= 3 ) ? getArgNumber( args[2], -9999, 9999 ) : null;
				var argDegree = ( args.length >= 4 ) ? getArgNumber( args[3], -360, 360 ) : 0;
				// 発射データ登録
				addShootData( argBulletId, argStartX, argStartY, argDegree );
				break;
			case 'SHOOT_TO_POINT':
			case '位置指定発射':
				// パラメータ取得
				var argBulletId = ( args.length >= 1 ) ? getArgNumber( args[0], 1, 9999 ) : null;
				var argStartX = ( args.length >= 2 ) ? getArgNumber( args[1], -9999, 9999 ) : null;
				var argStartY = ( args.length >= 3 ) ? getArgNumber( args[2], -9999, 9999 ) : null;
				var argEndX = ( args.length >= 4 ) ? getArgNumber( args[3], -9999, 9999 ) : null;
				var argEndY = ( args.length >= 5 ) ? getArgNumber( args[4], -9999, 9999 ) : null;
				// 角度取得
				var degree = getDegree( argStartX, argStartY, argEndX, argEndY );
				// 発射データ登録
				addShootData( argBulletId, argStartX, argStartY, degree );
			case 'DELETE_BULLET':
			case '弾丸削除':
				// パラメータ取得
				var argBulletIndex = ( args.length >= 1 ) ? getArgNumber( args[0], 0, 9999 ) : null;
				if( argBulletIndex == null ) {
					throw new Error( "Index値 が指定されていません。" );
				}
				// 弾データ削除
				var bulletSprite = $gameTemp.shooterManager.bullets()[argBulletIndex];
				if( bulletSprite == null ) {
					return;
				}
				var bullet = bulletSprite._bullet;
				var spriteBullets = SceneManager._scene._spriteset.getCorrespondedBullets( bullet );
				spriteBullets.removeChild( bulletSprite );
				$gameTemp.shooterManager.removeBullet( bulletSprite );
				break;
		}
	};

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    //-----------------------------------------------------------------------------
    // ShooterManager
    //
    // 発射処理全般を管理します。
    //-----------------------------------------------------------------------------
	function ShooterManager() {
		this.initialize.apply( this, arguments );
	};

	//-----------------------------------------------------------------------------
    // 発射管理マネージャの初期化処理を行います。
    //-----------------------------------------------------------------------------
	ShooterManager.prototype.initialize = function() {
		this._maxBulletCount = getParamNumber( ["最大弾数", "maxBulletCount"], 1, 9999 );
        this._pointerOfBulletIndex = getParamNumber( ["PointerOfBulletIndex"], 0, 5000 );
		this._bulletDatas = new Array( this._maxBulletCount );
		this._indexes = new Array( this._maxBulletCount );
		for( var i = 0; i < this._indexes.length; i++ ) {
			this._indexes[i] = i;
		}
		this._bullets = new Array( this._maxBulletCount );
	};

	//-----------------------------------------------------------------------------
    // 最大弾数を取得します。
    //-----------------------------------------------------------------------------
	ShooterManager.prototype.maxBulletCount = function() {
		return this._maxBulletCount;
	};

	//-----------------------------------------------------------------------------
    // 弾データ管理配列を取得します。
    //-----------------------------------------------------------------------------
	ShooterManager.prototype.bulletDatas = function() {
		return this._bulletDatas;
	};

	//-----------------------------------------------------------------------------
    // 弾スプライト管理配列を取得します。
    //-----------------------------------------------------------------------------
	ShooterManager.prototype.bullets = function() {
		return this._bullets;
	};

	//-----------------------------------------------------------------------------
    // 空いている弾スプライト管理配列のインデックス値を管理配列から取り出します。
    //-----------------------------------------------------------------------------
	ShooterManager.prototype.dequeueIndex = function() {
		return this._indexes.shift();
	};

	//-----------------------------------------------------------------------------
    // 空いた弾スプライト管理配列のインデックス値を管理配列に入れ戻します。
    //-----------------------------------------------------------------------------
	ShooterManager.prototype.inqueueIndex = function( index ) {
		this._indexes.push( index );
	};

	//-----------------------------------------------------------------------------
    // 指定した弾スプライトを弾スプライト管理配列に追加します。
    //-----------------------------------------------------------------------------
	ShooterManager.prototype.addBullet = function( bullet ) {
		if( bullet == null ) {
			return;
		}
		bullet.setIndex( this.dequeueIndex() );
		this._bullets[bullet.index()] = bullet;
	};
	
	//-----------------------------------------------------------------------------
    // 指定した弾スプライトを弾スプライト管理配列から除外します。
    //-----------------------------------------------------------------------------
	ShooterManager.prototype.removeBullet = function( bullet ) {
		if( bullet == null ) {
			return;
		}
		this.inqueueIndex( bullet.index() );
		this._bullets[bullet.index()] = null;
	};

	//-----------------------------------------------------------------------------
    // 弾オブジェクトインデックス格納変数を初期化します。
    //-----------------------------------------------------------------------------
	ShooterManager.prototype.clearShootIndexVariable = function() {
		var pointer = this._pointerOfBulletIndex;
		if( pointer > 0 ) {
			$gameVariables._data[pointer] = -1;
		}
	};

	//-----------------------------------------------------------------------------
    // 空いているインデックス値を弾オブジェクトインデックス格納変数に格納します。
    //-----------------------------------------------------------------------------
	ShooterManager.prototype.setupShootIndexVariable = function() {
		var pointer = this._pointerOfBulletIndex;
		if( pointer > 0 && this._indexes.length > 0 ) {
			$gameVariables._data[pointer] = this._indexes[0];
		}
	};

	//-----------------------------------------------------------------------------
    // 指定した弾スプライトを弾スプライト管理配列に追加します。
    //-----------------------------------------------------------------------------
	ShooterManager.prototype.isExistMargin = function() {
		return this._indexes.length > 0;
	};
    // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// RandomRange
	// 
	// 指定範囲の乱数値を出力します。
	//-----------------------------------------------------------------------------
	function RandomRange() {
		this.initialize.apply( this, arguments );
	}

	//-----------------------------------------------------------------------------
	// 指定された乱数範囲でこのオブジェクトを初期化します。
	//
	// 引数
	// ・value：
	// 　　基準値
	// ・min：
	// 　　乱数最小値
	// ・max：
	// 　　乱数最大値
	//-----------------------------------------------------------------------------
	RandomRange.prototype.initialize = function( value, min, max ) {
		if( !isFinite( value ) ) {
			throw Error( "RandomRangeのコンストラクタ引数に渡されたvalueが不正です。（value：" + value + "）" );
		}
		if( !isFinite( min ) ) {
			throw Error( "RandomRangeのコンストラクタ引数に渡されたminが不正です。（min：" + min + "）" );
		}
		if( !isFinite( max ) ) {
			throw Error( "RandomRangeのコンストラクタ引数に渡されたmaxが不正です。（max：" + max + "）" );
		}
		this.value = value;
		this.min = min;
		this.max = max;
	}

	//-----------------------------------------------------------------------------
	// 乱数値を取得します。
	//-----------------------------------------------------------------------------
	RandomRange.prototype.get = function() {
		return this.value + ( Math.floor( Math.random() * ( this.max + 1 - this.min) ) + this.min );
	}
    // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// Point_Corrected
	// 
	// 座標の補正値を管理します。
	//-----------------------------------------------------------------------------
	function Point_Corrected() {
		this.initialize.apply( this, arguments );
	}

	//-----------------------------------------------------------------------------
	// 指定された乱数範囲でPoint_Correctedインスタンスを初期化します。
	//
	// 引数
	// ・isFixation：
	// 　　補正無効フラグ（true：補正無効 false：補正有効）
	// ・rrX：
	// 　　乱数補正X座標（RandomRangeクラスで管理されていることを前提とします。）
	// ・rrY：
	// 　　乱数補正Y座標（RandomRangeクラスで管理されていることを前提とします。）
	// ・radius：
	// 　　発射角度に対する座標までの半径
	//-----------------------------------------------------------------------------
	Point_Corrected.prototype.initialize = function( isFixation, rrX, rrY, radius ) {
		this._isFixation = isFixation;
		this._rrX = rrX;
		this._rrY = rrY;
		this._radius = radius;
	}

	//-----------------------------------------------------------------------------
	// 補正無効フラグを取得し、当該オブジェクトから取得する値が補正無効か否かを判定します。
	//-----------------------------------------------------------------------------
	Point_Corrected.prototype.isFixation = function() {
		return this._isFixation;
	}

	//-----------------------------------------------------------------------------
	// 乱数補正のかかったX座標を取得します。
	// isFixationがtrueの場合は補正値を考慮しません。
	//
	// 引数
	// 　・correct：
	// 　　発射座標 補正値
	//-----------------------------------------------------------------------------
	Point_Corrected.prototype.x = function( correct ) {
		var result = this._rrX.get();
		if( !this.isFixation() ) {
			result += correct;
		}
		return result;
	}
	
	//-----------------------------------------------------------------------------
	// 乱数補正のかかったY座標を取得します。
	// isFixationがtrueの場合は補正値を考慮しません。
	//
	// 引数
	// 　・correct：
	// 　　発射座標 補正値
	//-----------------------------------------------------------------------------
	Point_Corrected.prototype.y = function( correct ) {
		var result = this._rrY.get();
		if( !this.isFixation() ) {
			result += correct;
		}
		return result;
	}

	//-----------------------------------------------------------------------------
	// 発射角度に対する発射座標を取得します。
	// フォーマットは下記の通りです。
	// { x, y }
	//
	// 引数
	// 　・x：
	// 　　発射X座標
	// 　・y：
	// 　　発射Y座標
	// 　・degree：
	// 　　発射角度
	//-----------------------------------------------------------------------------
	Point_Corrected.prototype.rotatedPoint = function( x, y, degree ) {
		var r = this._radius;
		var radian = degree * ( Math.PI / 180 );
		return {
			"x": ( 0 * Math.cos( radian ) + ( 0 + r ) * Math.sin( radian ) ) + this.x( x ), 
			"y": ( 0 * Math.sin( radian ) + -( 0 + r ) * Math.cos( radian ) ) + this.y( y ) 
		};
	}

    // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// Degree_Corrected
	// 
	// 乱数補正値がかかる角度を管理します。
	//-----------------------------------------------------------------------------
	function Degree_Corrected() {
		this.initialize.apply( this, arguments );
	}

	//-----------------------------------------------------------------------------
	// 指定された乱数範囲でDegree_Correctedインスタンスを初期化します。
	//
	// 引数
	// 　・isFixation：
	// 　　補正無効フラグ（true：補正無効 false：補正有効）
	// 　・rrD：
	// 　　乱数補正角度
	//-----------------------------------------------------------------------------
	Degree_Corrected.prototype.initialize = function( isFixation, rrD ) {
		this._isFixation = isFixation;
		this._rrD = rrD;
	}

	//-----------------------------------------------------------------------------
	// 固定値フラグを取得し、当該オブジェクトから取得する値が補正無効か否かを判定します。
	//-----------------------------------------------------------------------------
	Degree_Corrected.prototype.isFixation = function() {
		return this._isFixation;
	}

	//-----------------------------------------------------------------------------
	// 乱数補正のかかった角度を取得します。
	// isFixationがtrueの場合は補正値を考慮しません。
	//
	// 引数
	// 　・correct：
	// 　　発射角度 補正値
	//-----------------------------------------------------------------------------
	Degree_Corrected.prototype.get = function( correct ) {
		var result = this._rrD.get();
		if( !this.isFixation() ) {
			result += correct;
		}
		return this.adjust( result );
	}

	//-----------------------------------------------------------------------------
	// 指定した角度を-360°～360°の範囲に収まるように調整し返却します。
	//-----------------------------------------------------------------------------
	Degree_Corrected.prototype.adjust = function( degree ) {
		while( degree < -360 || degree > 360 ) {
			if( degree < -360 ) {
				degree += 360;
			}
			if( degree > 360 ) {
				degree += -360;
			}
		}
		return degree;
	}
    // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// SubShoot
	// 
	// 弾から弾を発射するサブ発射情報を管理します。
	//-----------------------------------------------------------------------------
	function SubShoot() {
		this.initialize.apply( this, arguments );
	}
	
	//-----------------------------------------------------------------------------
	// 指定された発射データでSubShootインスタンスを初期化します。
	//
	// 引数
	// ・bulletId：
	// 　　弾ID
	// ・frame：
	// 　　発射までのフレーム数
	// ・point：
	// 　　発射座標（Point_Correctedクラスで管理されていることを前提とします。）
	// ・degree：
	// 　　発射座標（Degree_Correctedクラスで管理されていることを前提とします。）
	//-----------------------------------------------------------------------------
	SubShoot.prototype.initialize = function( bulletId, frame, point, degree ) {
		this.bulletId = bulletId;
		this.frame = frame;
		this._point = point;
		this._degree = degree;
	}

	//-----------------------------------------------------------------------------
	// サブ弾発射X座標を取得します。
	//
	// 引数
	// 　・correct：
	// 　　発射座標 補正値
	//-----------------------------------------------------------------------------
	SubShoot.prototype.x = function( correct ) {
		return this._point.x.get( correct );
	}

	//-----------------------------------------------------------------------------
	// サブ弾発射Y座標を取得します。
	//
	// 引数
	// 　・correct：
	// 　　発射座標 補正値
	//-----------------------------------------------------------------------------
	SubShoot.prototype.y = function( correct ) {
		return this._point.y.get( correct );
	}

	//-----------------------------------------------------------------------------
	// サブ弾発射角度を取得します。
	//
	// 引数
	// 　・correct：
	// 　　発射角度 補正値
	//-----------------------------------------------------------------------------
	SubShoot.prototype.degree = function( correct ) {
		return this._degree.get( correct );
	}
	
	//-----------------------------------------------------------------------------
	// サブ弾の発射判定を行い、可能ならば発射を行います。
	//
	// 引数
	// 　・frame：
	// 　　親の現在フレーム数
	// 　・x：
	// 　　親のX座標
	// 　・y：
	// 　　親のY座標
	// 　・degree：
	// 　　親の角度
	//-----------------------------------------------------------------------------
	SubShoot.prototype.shoot = function( frame, x, y, degree ) {
		if( frame != this.frame ) {
			return;
		}
		var shootDegree = this.degree( degree );
		var point = this._point.rotatedPoint( x, y, degree );
		var argsShootToDegree = new Array( String( this.bulletId ), String( point.x ), String( point.y ), String( shootDegree ) );
		$gameMap._interpreter.pluginCommand( "SHOOT_TO_DEGREE", argsShootToDegree );
	}
    // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// Acceleration
	// 
	// 弾の加速度を管理します。
	//-----------------------------------------------------------------------------
	function Acceleration() {
		this.initialize.apply( this, arguments );
	}

	//-----------------------------------------------------------------------------
	// 指定された加速度データでAccelerationインスタンスを初期化します。
	//
	// 引数
	// 　・value：
	// 　　加速度
	// 　・degree：
	// 　　発射角度（Degree_Correctedクラスで管理されていることを前提とします。）
	// 　・startFrame：
	// 　　加速開始フレーム数
	// 　・endFrame：
	// 　　加速終了フレーム数
	//-----------------------------------------------------------------------------
	Acceleration.prototype.initialize = function( value, degree, startFrame, endFrame ) {
		this.value = value;
		this.degree = degree;
		this.startFrame = startFrame;
		this.endFrame = endFrame;
	}

	//-----------------------------------------------------------------------------
	// 指定した角度にをもとに、X方向に対する加速値を取得します。
	//
	// 引数
	// 　・correct：
	// 　　発射角度 補正値
	//-----------------------------------------------------------------------------
	Acceleration.prototype.increaseX = function( correct ) {
		var xDegree = this.degree.get( correct );
		return this.value * Math.sin( xDegree * ( Math.PI / 180 ) );
	}

	//-----------------------------------------------------------------------------
	// 指定した角度にをもとに、Y方向に対する加速値を取得します。
	//
	// 引数
	// 　・correct：
	// 　　発射角度 補正値
	//-----------------------------------------------------------------------------
	Acceleration.prototype.increaseY = function( correct ) {
		var yDegree = this.degree.get( correct ) - 90;
		return this.value * Math.sin( yDegree * ( Math.PI / 180 ) );
	}

	//-----------------------------------------------------------------------------
	// 指定されたフレーム時点で現在の加速度情報が有効か否かを判定します。
	//
	// 引数
	// 　・frame：
	// 　　現在のフレーム数
	//-----------------------------------------------------------------------------
	Acceleration.prototype.isEnable = function( frame ) {
		return ( this.startFrame <= frame ) && ( frame <= this.endFrame);
	}
	// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
	
	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// Sprite_Bullets
	//
	// 弾スプライトを一元管理するスプライト情報です。
	//-----------------------------------------------------------------------------
	function Sprite_Bullets() {
		this.initialize.apply( this, arguments );
	}
	Sprite_Bullets.prototype = Object.create( Sprite.prototype );
	Sprite_Bullets.prototype.constructor = Sprite_Bullets;

	//-----------------------------------------------------------------------------
	// Sprite_Bulletsインスタンスを初期化します。
	//-----------------------------------------------------------------------------
	Sprite_Bullets.prototype.initialize = function() {
		Sprite.prototype.initialize.call( this );
		this._endLayBullets = new Array();
	}

	//-----------------------------------------------------------------------------
	// 現在有効な弾スプライトの状態を全て更新します。
	//-----------------------------------------------------------------------------
	Sprite_Bullets.prototype.update = function() {
		for( var i = 0; i < this.children.length; i++ ) {
			var target = this.children[i];
			if( target.isEnd() ) {
				if( target._bullet.isLay ) {
					target.opacity = target.opacity - 20;
					if( target.opacity <= 0 ) {
						this.removeChild( target );
						$gameTemp.shooterManager.removeBullet( target );
						i = i - 1;
					}
				} else {
					this.removeChild( target );
					$gameTemp.shooterManager.removeBullet( target );
					i = i - 1;
				}
			} else {
				target.update();
			}
		}
	}
	// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// AudioFile
	// 
	// 音声情報を管理します。
	//-----------------------------------------------------------------------------
	function AudioFile() {
		this.initialize.apply( this, arguments );
	}
	
	//-----------------------------------------------------------------------------
	// 音声情報でAudioFileインスタンスを初期化します。
	//
	// 引数
	// ・name：
	// 　　音声ファイル名
	// ・volume：
	// 　　音量
	// ・pitch：
	// 　　ピッチ
	// ・pan：
	// 　　位相
	//-----------------------------------------------------------------------------
	AudioFile.prototype.initialize = function( name, volume, pitch, pan ) {
		this.name = name;
		this.volume = volume;
		this.pitch = pitch;
		this.pan = pan;
	}
	// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// Animation
	// 
	// アニメーション情報を管理します。
	//-----------------------------------------------------------------------------
	function Animation() {
		this.initialize.apply( this, arguments );
	}
	
	//-----------------------------------------------------------------------------
	// アニメーション情報でAnimationインスタンスを初期化します。
	//
	// 引数
	// ・isEnable：
	// 　　アニメーションフラグ
	// ・frameRate：
	// 　　フレームレート
	// ・frameWidth：
	// 　　弾画像スプライトシートの1フレームの横幅
	// ・frameHeight：
	// 　　弾画像スプライトシートの1フレームの縦幅
	//-----------------------------------------------------------------------------
	Animation.prototype.initialize = function( isEnable, frameRate, frameWidth, frameHeight ) {
		this.isEnable = isEnable;
		this.frameRate = frameRate;
		this.frameWidth = frameWidth;
		this.frameHeight = frameHeight;
	}
	// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// Sprite_Bullet
	//
	// 弾のスプライト情報を管理します。
	//-----------------------------------------------------------------------------
	function Sprite_Bullet() {
		this.initialize.apply( this, arguments );
	}
	Sprite_Bullet.prototype = Object.create( Sprite.prototype );
	Sprite_Bullet.prototype.constructor = Sprite_Bullet;

	//-----------------------------------------------------------------------------
	// 指定された弾情報でSprite_Bulletインスタンスを初期化します。
	//
	// 引数
	// 　・bulletId：
	// 　　弾ID
	// 　・x：
	// 　　発射座標X
	// 　・y：
	// 　　発射座標Y
	// 　・degree：
	// 　　発射角度
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.initialize = function( bulletId, x, y, degree ) {
		Sprite.prototype.initialize.call( this );
		var bullet = $gameTemp.shooterManager.bulletDatas()[bulletId - 1];
		if( bullet == null ) {
			throw new Error( "指定された弾IDから弾情報を取得できませんでした。" + "（" + "弾ID：" + bulletId + "）");
		}

		//   0°：↑
		//  90°：→
		// 180°：↓
		// 270°：←
		this._bullet = bullet
		this._bulletId  = bulletId;
		var point = this._bullet.point.rotatedPoint( x, y, degree );
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
		this.rotation = 0;
		this._areaIndex = -1;
		this._doneFrame = -1;
		this._increaseX = 0; 
		this._increaseY = 0;
		this._accelerationX = 0;
		this._accelerationY = 0;
		this._enlargeIncrease = this._bullet.enlargeSpeed;
		this._rotationIncrease= this._bullet.rotationSpeed;
		this._rotationDegree = 0;
		this.x = point.x;
		this.y = point.y;
		this.setupDisplay();
		this.setDegree( bullet.degree.get( degree ) );
		this.setupManager();
	};

	//-----------------------------------------------------------------------------
	// 弾スプライトの表示情報のセットアップを行います。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.setupDisplay = function() {
		this.loadBitmap();
		// スプライトサイズを弾の大きさに合わせる
		if( this._bullet.isAnimation ) {
			this._frameTime = 9999;
			this._frameIndex = 0;
			this.updateFrame();
		} else {
			this.setFrame( 0, 0, this.bitmap.width, this.bitmap.height );
			this.width = this.bitmap.width;
			this.height = this.bitmap.height;
		}
	};

	//-----------------------------------------------------------------------------
	// 弾スプライトをShooterManagerの管理に登録します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.setupManager = function() {
		$gameTemp.shooterManager.addBullet( this );
	};

	//-----------------------------------------------------------------------------
	// 弾スプライトの角度を取得します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.degree = function() {
		return this._degree;
	};

	//-----------------------------------------------------------------------------
	// 弾スプライトの角度を設定します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.setDegree = function( degree ) {
		this._degree = degree
		if( this._bullet.isLinear || this._bullet.isLay ) {
			this._rotationDegree = degree;
		}
		// 角度の変更に伴うXY座標への加速度を更新
		var xDegree = this._degree;
		var yDegree = this._degree - 90;
		if( yDegree < 0 ) yDegree += 360;
		this._increaseX = this._bullet.speed.value * Math.sin( xDegree * ( Math.PI / 180 ) );
		this._increaseY = this._bullet.speed.value * Math.sin( yDegree * ( Math.PI / 180 ) );
		this._increaseX += this._accelerationX;
		this._increaseY += this._accelerationY;
		// 画像の回転表示角度を更新
		this.updateRotation();
	};

	//-----------------------------------------------------------------------------
	// 弾スプライトの状態を更新します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.update = function() {
		Sprite.prototype.update.call( this );
		this.updateDegree();
		this.updateAcceleration();
		this.updateFrame();
		this.updateScale();
		this.updateSubShoot();
		this.updatePosition();
		this._doneFrame ++
	};

	//-----------------------------------------------------------------------------
	// 弾スプライトの角度を更新します。
	// 弾が線状でない場合は、画像の回転表示状態のみを更新します。
	// 弾が線状の場合は、弾の発射角を含めて更新します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.updateDegree = function() {
		var rrD = new RandomRange( this._rotationDegree, 0, 0 );
		var cD = new Degree_Corrected( false, rrD );
		this._rotationDegree = cD.get( this._rotationIncrease );

		if( this._bullet.isLinear || this._bullet.isLay ) {
			this.setDegree( this._rotationDegree );
		} else {
			this.updateRotation( this._rotationDegree );
		}
	}

	//-----------------------------------------------------------------------------
	// 弾スプライトの回転表示状態を更新します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.updateRotation = function() {
		this.rotation = this._rotationDegree * ( Math.PI / 180 );
	};

	//-----------------------------------------------------------------------------
	// 弾スプライトの加速度を更新します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.updateAcceleration = function() {
		//　初期化状態または終了状態のときも処理しない
		if( !this.isInitialized() || this.isEnd() ) {
			return;
		}
		var accelerationList = this._bullet.getAccelerationByFrame( this._doneFrame );
		for( var i = 0; i < accelerationList.length; i++ ) {
			var accelerationX = accelerationList[i].increaseX( this._degree );
			var accelerationY = accelerationList[i].increaseY( this._degree );
			this._increaseX += accelerationX; 
			this._increaseY += accelerationY;
			this._accelerationX += accelerationX; 
			this._accelerationY += accelerationY;
		}
		var enlargeList = this._bullet.getEnlargeIncreaseByFrame( this._doneFrame );
		for( var i = 0; i < enlargeList.length; i++ ) {
			this._enlargeIncrease += enlargeList[i].value;
		}
		var rotationList = this._bullet.getRotationIncreaseByFrame( this._doneFrame );
		for( var i = 0; i < rotationList.length; i++ ) {
			this._rotationIncrease += rotationList[i].value;
		}
	}

	//-----------------------------------------------------------------------------
	// 弾スプライトの表示フレーム情報を更新します。
	// この処理はアニメーションが有効な弾スプライトに対してのみ行われます。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.updateFrame = function() {
		// アニメーション無効なら処理しない
		if( !this._bullet.isAnimation ) {
			return;
		}
		//　初期化状態または終了状態のときも処理しない
		if( this._doneFrame >= this._bullet.aliveTime ) {
			return;
		}
		if( this.isEnd() ) {
			return;
		}
		if( !this.isInitialized() ) {
			this.width = this._bullet.animationFrameWidth;
			this.height = this._bullet.animationFrameHeight;
			this.setFrame( 0, 0, this.width, this.height );
			return;
		}
		// アニメーション更新時間でなければ、時間のカウントアップのみを行い、処理しない
		this._frameTime ++;
		if( this._frameTime < this._bullet.animationFrameRate ) {
			return;
		}
		// アニメーションの表示フレーム情報を更新する
		this.width = this._bullet.animationFrameWidth;
		this.height = this._bullet.animationFrameHeight;
		var sw = this._frameIndex * this.width;
		var sh = 0;
		this.setFrame( sw, sh, this.width, this.height );
		// 内部情報の初期化
		this._frameTime = 0;
		this._frameIndex ++;
		if( this._bullet.frameLength <= this._frameIndex ) {
			this._frameIndex = 0;
		}
	};

	//-----------------------------------------------------------------------------
	// 弾スプライトの拡縮状態を更新します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.updateScale = function() {
		this.scale.x += this._enlargeIncrease;
		this.scale.y += this._enlargeIncrease;
	};

	//-----------------------------------------------------------------------------
	// 弾スプライトからの弾発射情報を更新します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.updateSubShoot = function() {
		//　初期化状態または終了状態のときも処理しない
		if( !this.isInitialized() || this.isEnd() ) {
			return;
		}
		var subShootList = this._bullet.getSubShootByFrame( this._doneFrame );
		for( var i = 0; i < subShootList.length; i++ ) {
			subShootList[i].shoot( this._doneFrame, this.x, this.y, this._degree );
		}
	}

	//-----------------------------------------------------------------------------
	// 弾スプライトの座標を更新します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.updatePosition = function() {
		this.x += this._increaseX;
		this.y += this._increaseY;
	};

	//-----------------------------------------------------------------------------
	// 弾スプライトがレーザーか否かを取得します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.isLay = function() {
		return this._bullet.isLay;
	};

	//-----------------------------------------------------------------------------
	// 弾スプライトが初期化済状態か否かを判定します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.isInitialized = function() {
		return this._doneFrame >= 0;
	};

	//-----------------------------------------------------------------------------
	// 弾スプライトが終了状態か否かを判定します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.isEnd = function() {
		return this._bullet.aliveTime < this._doneFrame;
	};

	//-----------------------------------------------------------------------------
	// 予め読み込んでおいたビットマップ画像を弾スプライトに反映します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.loadBitmap = function() {
		this.bitmap = this._bullet.bitmap;
	};

	//-----------------------------------------------------------------------------
	// 弾を管理する配列上のインデックス値を取得します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.index = function(  ) {
		if( this._index == null ) {
			throw new Exception( "Sprite_Bullet.prototype.index()が初期化されていません。" )
		}
		return this._index;
	};

	//-----------------------------------------------------------------------------
	// 弾を管理する配列上のインデックス値を設定します。
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.setIndex = function( index ) {
		this._index = index;
	};

	//-----------------------------------------------------------------------------
	// スプライトの直前の移動前の座標を取得します。
	// フォーマットは下記のような形式となります。
	// 結果 = [x, y]
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.moveBefore = function() {
		var n = Number( this._doneFrame == 0 );
		var beforeList = [[this.x - this._increaseX, this.y - this._increaseY], [this.x, this.y]];
		return beforeList[n];
	};

	//-----------------------------------------------------------------------------
	// スプライトの直前の移動後の座標を取得します。
	// フォーマットは下記のような形式となります。
	// 結果 = [x, y]
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.moveAfter = function() {
		return [this.x, this.y];
	};
		
	//-----------------------------------------------------------------------------
	// 弾スプライトが空間全体に含まれるか否かの下記判定を行います。
	// ・レーザー
	//-----------------------------------------------------------------------------
	Sprite_Bullet.prototype.isCollisionAreaAll = function() {
		return this.isLay();
	};
	// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// Sprite_LayBullet
	//
	// レーザー弾の親スプライト情報を管理します。
	//-----------------------------------------------------------------------------
	function Sprite_LayBullet() {
		this.initialize.apply( this, arguments );
	}
	Sprite_LayBullet.prototype = Object.create( Sprite_Bullet.prototype );
	Sprite_LayBullet.prototype.constructor = Sprite_LayBullet;

	//-----------------------------------------------------------------------------
	// レーザー弾親スプライトの座標を更新します。
	// ※レーザー弾の親は動かず、子レーザーを座標をずらしながら生成することで移動を表現します。
	//-----------------------------------------------------------------------------
	Sprite_LayBullet.prototype.updatePosition = function() {
		for( var i = 0; i < this._speedCount; i++ ) {
			var bullet = new Sprite_LayChildBullet( this._bulletId, 0, 0, 0, false, this );
			bullet.x = this._increaseX * this.children.length;
			bullet.y = this._increaseY * this.children.length;
			bullet._increaseX = 0;
			bullet._increaseY = 0;
			this.addChild( bullet );
			this.height += this._increaseY;
		}
	};

	//-----------------------------------------------------------------------------
	// レーザー弾親スプライトの表示情報のセットアップを行います。
	//-----------------------------------------------------------------------------
	Sprite_LayBullet.prototype.setupDisplay = function() {
		this.updatePosition();
	};

	//-----------------------------------------------------------------------------
	// レーザー弾親スプライトの表示情報のセットアップを行います。
	// ※レーザー弾は画像の大きさで速度が決まるので、ここで移動量などを決めます。
	//-----------------------------------------------------------------------------
	var _Sprite_Bullet_setupDisplay = Sprite_Bullet.prototype.setupDisplay;
	Sprite_LayBullet.prototype.setupDisplay = function() {
		_Sprite_Bullet_setupDisplay.apply( this, arguments );
		// 画像幅をもとに基本移動量を算出
		// var imageWidth = this._bullet.bitmap.width;
		// var imageHeight = this._bullet.bitmap.height;
		// this._lineSpeed = ( imageWidth > imageHeight ) ? imageWidth : imageHeight;
		// // 弾速をもとに1フレームあたりの移動回数を算出
		// this._speedCount = this._bullet.speed.value / this._lineSpeed;
		// if( this._bullet.speed.value % this._lineSpeed > 0 ) {
		// 	this._speedCount += 1;
		// }
		this._lineSpeed = this._bullet.speed.value;
		this._speedCount = 1;
	};

	//-----------------------------------------------------------------------------
	// レーザー弾親スプライトの角度を設定します。
	// 角度の変更に伴い、レーザー弾のXY方向に対する増加量を更新します。
	//-----------------------------------------------------------------------------
	var _Sprite_Bullet_setDegree = Sprite_Bullet.prototype.setDegree;
	Sprite_LayBullet.prototype.setDegree = function( degree ) {
		_Sprite_Bullet_setDegree.apply( this, arguments );
		this._increaseX = this._lineSpeed * Math.sin( 0 * ( Math.PI / 180 ) );
		this._increaseY = this._lineSpeed * Math.sin( 270 * ( Math.PI / 180 ) );
	};

	//-----------------------------------------------------------------------------
	// レーザー弾スプライトの直前の移動前の座標を取得します。
	// フォーマットは下記のような形式となります。
	// 結果 = [x, y]
	//-----------------------------------------------------------------------------
	Sprite_LayBullet.prototype.moveBefore = function() {
		if( this.children.length == 0 ) {
			return [0, 0];
		}
		var x = this.children[0].x + this.x;
		var y = this.children[0].y + this.y;
		return [x, y];
	};

	//-----------------------------------------------------------------------------
	// レーザー弾スプライトの直前の移動後の座標を取得します。
	// フォーマットは下記のような形式となります。
	// 結果 = [x, y]
	//-----------------------------------------------------------------------------
	Sprite_LayBullet.prototype.moveAfter = function() {
		if( this.children.length == 0 ) {
			return [0, 0];
		}
		var i = this.children.length - 1;
		var r = this.rotation;
		var x = this.children[i].x;
		var y = this.children[i].y;
		return  [Math.floor( x * Math.cos( r ) - y * Math.sin( r )  + this.x ), Math.floor( x * Math.sin( r ) + y * Math.cos( r )  + this.y )];
	};
	// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// Sprite_LayChildBullet
	//
	// レーザー弾の子スプライト情報を管理します。
	//-----------------------------------------------------------------------------
	function Sprite_LayChildBullet() {
		this.initialize.apply( this, arguments );
	}
	Sprite_LayChildBullet.prototype = Object.create( Sprite_Bullet.prototype );
	Sprite_LayChildBullet.prototype.constructor = Sprite_LayChildBullet;

	Sprite_LayChildBullet.prototype.updatePosition = function() {
	};

	//-----------------------------------------------------------------------------
	// 弾スプライトをShooterManagerの管理に登録する処理ですが、
	// 親レーザー弾をShooterManagerの管理に登録するので、ここではshooterManagerに登録しません。
	//-----------------------------------------------------------------------------
	Sprite_LayChildBullet.prototype.setupManager = function() {
	};

	//-----------------------------------------------------------------------------
	// 弾スプライトの回転表示状態を更新する処理ですが、
	// 親レーザー弾の角度変更によって子レーザー弾の角度も変わるので、ここでは角度を変更しません。
	//-----------------------------------------------------------------------------
	Sprite_LayChildBullet.prototype.updateRotation = function() {
	};
	// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// Game_Temp.initialize()
	//
	// ShooterManagerを初期化し、
	// プラグインパラメータとして登録された弾データ情報をShooterManagerに登録します。
	//-----------------------------------------------------------------------------
	var _Game_Temp_initialize = Game_Temp.prototype.initialize;
	Game_Temp.prototype.initialize = function() {
		_Game_Temp_initialize.apply( this, arguments );
		this.shooterManager = new ShooterManager();

		// プラグインパラメータの読込
		var parameters = PluginManager.parameters( pluginName );
		var bulletDatas = paramParse( parameters['bulletDataList'] );
		var _waiterArray = new Array();

		// プラグインパラメータから弾情報を読み込み、Bullet_Dataを生成／管理情報に登録する
		var registerBullet = function( index ) {
			if( !ImageManager.isReady() ) {
				return;
			}
			// 指定したインデックスの弾パラメータ情報を吸い上げる
			var bulletId = ( index + 1 );
			var fileName = bulletDatas[index].fileName;
			var aliveTime = bulletDatas[index].aliveTime;
			var speed = bulletDatas[index].speed;
			var enlargeSpeed = bulletDatas[index].enlargeSpeed;
			var rotationSpeed = bulletDatas[index].rotationSpeed;
			var subShootList = new Array();
			if( bulletDatas[index].subShootList.length > 0 ) {
				bulletDatas[index].subShootList.forEach( function( ss ) {
					var ssX = ss.point.x;
					var ssRrX = new RandomRange( ssX.value, ssX.min, ssX.max );
					var ssY = ss.point.y;
					var ssRrY = new RandomRange( ssY.value, ssY.min, ssY.max );
					var ssR = ss.point.radius;
					var ssPoint = new Point_Corrected( ss.isFixationPoint, ssRrX, ssRrY, ssR );
					var ssD = ss.degree;
					var ssRrD = new RandomRange( ssD.value, ssD.min, ssD.max );
					var ssDegree = new Degree_Corrected( ss.isFixationDegree, ssRrD );
					subShootList.push( new SubShoot( ss.bulletId, ss.frame, ssPoint, ssDegree ) );
				} );
			}
			var x = bulletDatas[index].point.x;
			var rrX = new RandomRange( x.value, x.min, x.max );
			var y = bulletDatas[index].point.y;
			var rrY = new RandomRange( y.value, y.min, y.max );
			var r = bulletDatas[index].point.radius;
			var point = new Point_Corrected( bulletDatas[index].isFixationPoint, rrX, rrY, r );

			var d = bulletDatas[index].degree;
			var rrD = new RandomRange( d.value, d.min, d.max );
			var degree = new Degree_Corrected( bulletDatas[index].isFixationDegree, rrD );

			var sound = bulletDatas[index].sound;
			var audioFile = new AudioFile( sound.name, sound.volume, sound.pitch, sound.pan );
			var isLowerPicture = bulletDatas[index].isLowerPicture;
			var anime = bulletDatas[index].animation;
			console.log(fileName);
			var animation = new Animation( anime.isAnimation, anime.animationFrameRate, anime.frameWidth, anime.frameHeight );
			var isLinear = bulletDatas[index].isLinear;
			var isLay = bulletDatas[index].isLay;

			console.info( "弾画像を登録します。" + "（" + "弾ID：" + bulletId + "," + "弾画像ファイル名：" + fileName + "）" );
			this.shooterManager.bulletDatas()[index] = new Data_Bullet( bulletId, fileName, aliveTime, speed, enlargeSpeed, rotationSpeed, subShootList, point, degree, audioFile, isLowerPicture, animation, isLinear, isLay );

			console.info( "弾画像を登録しました。" + "（" + "弾ID：" + bulletId + "," + "弾画像ファイル名：" + fileName + "）" );
			clearInterval( _waiterArray[index] );
		};

		for( var i = 0; i < bulletDatas.length; i++ ) {
			// ファイル名が取得できない場合は無視
			var bulletFileName = bulletDatas[i].fileName;
			if( !bulletFileName) {
				continue;
			}
			// ピクチャ読み込み完了後に弾情報を登録する
			ImageManager.setBulletImageByPicture( bulletFileName );
			_waiterArray[i] = setInterval( registerBullet.bind( this, i ), 100 );
		}
	};
	// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// Data_Bullet
	//
	// 弾の情報を管理するオブジェクトです。
	// このオブジェクトはゲーム起動時に生成され、
	// Sprite_Bulletから参照されることを想定してツクられています。
	//
	// 引数
	// 　・bulletId：
	// 　　弾ID
	// 　・fileName：
	// 　　弾画像ファイル名
	// 　・aliveTime：
	// 　　弾の有効時間
	// 　・speed：
	// 　　速度
	// 　・enlargeSpeed：
	// 　　拡大速度
	// 　・rotationSpeed：
	// 　　回転速度
	// 　・subShootList：
	// 　　サブ発射情報一覧
	// 　・point：
	// 　　発射座標（Point_Correctedクラスで管理されていることを前提とします。）
	// 　・degree：
	// 　　発射角度（Degree_Correctedクラスで管理されていることを前提とします。）
	// 　・sound：
	// 　　発射音声（AudioFileクラスで管理されていることを前提とします。）
	// 　・isLowerPicture：
	// 　　ピクチャの下側に弾を表示するか否かのフラグ
	// 　・isAnimation：
	// 　　アニメーションするか否かのフラグ
	// 　・animationFrameRate：
	// 　　アニメーションする際のフレームレート
	// 　・isLinear：
	// 　　線状フラグ
	// 　・isLay：
	// 　　レーザーフラグ
	//-----------------------------------------------------------------------------
	function Data_Bullet( bulletId, fileName, aliveTime, speed, enlargeSpeed, rotationSpeed, subShootList, point, degree, sound, isLowerPicture, animation, isLinear, isLay ) {
		this.bulletId = bulletId;
		this.fileName = fileName;
		this.aliveTime = aliveTime;
		this.speed = speed;
		this.enlargeSpeed = enlargeSpeed.value;
		this.rotationSpeed = rotationSpeed.value;
		this.point = point;
		this.degree = degree;
		this.sound = sound;
		this.isLowerPicture = isLowerPicture;
		this.isAnimation = animation.isEnable;
		this.animationFrameRate = animation.frameRate;
		this.animationFrameWidth = animation.frameWidth;
		this.animationFrameHeight = animation.frameHeight;
		this.isLinear = isLinear;
		this.isLay = isLay;

		var accelerationList = new Array();
		for( var i = 0; i < speed.accelerationList.length; i++ ) {
			var a = speed.accelerationList[i];
			var d = new Degree_Corrected( a.isFixationDegree, new RandomRange( a.degree, 0, 0 ) );
			accelerationList.push( new Acceleration( a.value, d, a.startFrame, a.endFrame ) );
		}
		this._accelerationList = accelerationList;
		this._enlargeIncreaseList = enlargeSpeed.increaseList;
		this._rotationIncreaseList = rotationSpeed.increaseList;
		this._subShootList = subShootList;

		this.loadImageFile();
		this.setupAccelerationAccessor();
		this.setupEnlargeIncreaseAccessor();
		this.setupRotationIncreaseAccessor();
		this.setupSubShootAccessor();
		this.setupFrameData();
	};

	//-----------------------------------------------------------------------------
	// 設定された弾画像ファイル名にて弾画像を読み込みます。
	//-----------------------------------------------------------------------------
	Data_Bullet.prototype.loadImageFile = function() {
		var bitmap = ImageManager.getBulletImage( this.fileName );
		if( bitmap == null ) {
			console.warn( "弾画像の読み込みに失敗しました。" + "（" + "弾画像ファイル名：" + this.fileName + "）" );
			return;
		}
		this.bitmap = bitmap;
	};

	//-----------------------------------------------------------------------------
	// 設定された加速度情報一覧をもとに、加速度情報をフレーム指定参照できるアクセサを準備します。
	//-----------------------------------------------------------------------------
	Data_Bullet.prototype.setupAccelerationAccessor = function() {
		this._accelerationAccessorByFrame = this.createAccessor( this._accelerationList );
	};

	//-----------------------------------------------------------------------------
	// 指定したフレームに対応する加速度情報一覧を取得します。
	//-----------------------------------------------------------------------------
	Data_Bullet.prototype.getAccelerationByFrame = function( frame ) {
		return this._accelerationAccessorByFrame[frame];
	};

	//-----------------------------------------------------------------------------
	// 設定された回転速度情報一覧をもとに、回転速度情報をフレーム指定参照できるアクセサを準備します。
	//-----------------------------------------------------------------------------
	Data_Bullet.prototype.setupEnlargeIncreaseAccessor = function() {
		this._enlargeIncreaseAccessorByFrame = this.createAccessor( this._enlargeIncreaseList );
	};

	//-----------------------------------------------------------------------------
	// 指定したフレームに対応する拡縮速度情報一覧を取得します。
	//-----------------------------------------------------------------------------
	Data_Bullet.prototype.getEnlargeIncreaseByFrame = function( frame ) {
		return this._enlargeIncreaseAccessorByFrame[frame];
	};

	//-----------------------------------------------------------------------------
	// 設定された拡縮速度情報一覧をもとに、拡縮速度情報をフレーム指定参照できるアクセサを準備します。
	//-----------------------------------------------------------------------------
	Data_Bullet.prototype.setupRotationIncreaseAccessor = function() {
		this._rotationIncreaseAccessorByFrame = this.createAccessor( this._rotationIncreaseList );
	};
	
	//-----------------------------------------------------------------------------
	// 指定したフレームに対応する回転速度情報一覧を取得します。
	//-----------------------------------------------------------------------------
	Data_Bullet.prototype.getRotationIncreaseByFrame = function( frame ) {
		return this._rotationIncreaseAccessorByFrame[frame];
	};

	//-----------------------------------------------------------------------------
	// 設定された拡縮速度情報一覧をもとに、拡縮速度情報をフレーム指定参照できるアクセサを準備します。
	//-----------------------------------------------------------------------------
	Data_Bullet.prototype.setupSubShootAccessor = function() {
		this._subShootAccessorByFrame = this.createAccessor( this._subShootList );
	};
	
	//-----------------------------------------------------------------------------
	// 指定したフレームに対応するサブ発射情報一覧を取得します。
	//-----------------------------------------------------------------------------
	Data_Bullet.prototype.getSubShootByFrame = function( frame ) {
		return this._subShootAccessorByFrame[frame];
	};

	//-----------------------------------------------------------------------------
	// 指定した情報一覧をもとに、情報をフレーム指定参照できるアクセサを取得します。
	//-----------------------------------------------------------------------------
	Data_Bullet.prototype.createAccessor = function( targetList ) {
		var accessor = new Array( this.aliveTime );
		for( var i = 0; i <= this.aliveTime; i++ ) {
			accessor[i] = new Array();
		}
		targetList.forEach( function( item ) {
			if( item.frame != null ) {
				accessor[item.frame].push( item );
			} else {
				for( var i = item.startFrame; i <= item.endFrame; i++ ) {
					accessor[i].push( item );
				}
			}
		} );
		return accessor;
	};

	//-----------------------------------------------------------------------------
	// 弾画像の表示フレーム情報を準備します。
	//-----------------------------------------------------------------------------
	Data_Bullet.prototype.setupFrameData = function() {
		this.frameLength = 1;
		if( !this.isAnimation ) {
			return;
		}
		var image = this.bitmap;
		if( image == null ) {
			return;
		} 
		this.frameLength = Math.floor( image.width / this.animationFrameWidth );
	};

	//-----------------------------------------------------------------------------
	// 乱数補正のかかったX座標を取得します。
	// point.isFixationがtrueの場合は補正値を考慮しません。
	//
	// 引数
	// 　・correct：
	// 　　発射座標 補正値
	//-----------------------------------------------------------------------------
	Data_Bullet.prototype.x = function( correct ) {
		return this.point.x( correct );
	}
	
	//-----------------------------------------------------------------------------
	// 乱数補正のかかったY座標を取得します。
	// point.isFixationがtrueの場合は補正値を考慮しません。
	//
	// 引数
	// 　・correct：
	// 　　発射座標 補正値
	//-----------------------------------------------------------------------------
	Data_Bullet.prototype.y = function( correct ) {
		return this.point.y( correct );
	}
	// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    // --------------------------------------------------
	// Spriteset_Base.createUpperLayer()
	//
	// ピクチャレイヤーの上層／下層にそれぞれ弾レイヤーを生成します。
	// --------------------------------------------------
	var _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
	Spriteset_Base.prototype.createUpperLayer = function() {
		// ピクチャより下側の銃弾レイヤ
		this._lowerBulletContainer = this.createBullets();
		this.addChild( this._lowerBulletContainer );
		// ピクチャ等のレイヤ
		_Spriteset_Base_createUpperLayer.apply( this, arguments );
		// ピクチャより上側の銃弾レイヤ
		this._upperBulletContainer = this.createBullets();
		this.addChild( this._upperBulletContainer );
		// 当たり判定プラグインが有効な場合は当たり判定チェック対象にレイヤを追加する
        if( $gameTemp.collisionManager != null ) {
            $gameTemp.collisionManager.addCheckTargets( this._lowerBulletContainer.children );
			$gameTemp.collisionManager.addCheckTargets( this._upperBulletContainer.children );
        }
	};
    // --------------------------------------------------
	// 指定した弾データが所属するべき弾レイヤーを取得します。
	// --------------------------------------------------
	Spriteset_Base.prototype.getCorrespondedBullets = function( bullet ) {
		return bullet.isLowerPicture ? this._lowerBulletContainer : this._upperBulletContainer;
	};

    // --------------------------------------------------
	// 弾スプライトを管理するSprite_Bulletsを生成します。
	// --------------------------------------------------
	Spriteset_Base.prototype.createBullets = function() {
		var width = Graphics.boxWidth;
		var height = Graphics.boxHeight;
		var x = ( Graphics.width - width ) / 2;
		var y = ( Graphics.height - height ) / 2;
		var bullets = new Sprite_Bullets();
		bullets.setFrame( x, y, width, height );
		return bullets;
	};
	// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// 指定した弾画像ファイル名に対応する弾画像ビットマップデータを取得します。
	//
	// 引数
	// 　・fileName：
	// 　　弾画像ファイル名
	//-----------------------------------------------------------------------------
    ImageManager.getBulletImage = function( fileName ) {
		var cache = this.bulletCache();
		return cache[fileName];
	};
	//-----------------------------------------------------------------------------
	// 指定した弾画像ファイル名をキーとして、ピクチャとして読み込んだ弾ビットマップデータをキャッシュに設定します。
	//
	// 引数
	// 　・fileName：
	// 　　弾画像ファイル名
	//-----------------------------------------------------------------------------
	ImageManager.setBulletImageByPicture = function( fileName ) {
		this.setBulletImageByBitmap( fileName, ImageManager.loadPicture( fileName ) );
	};
	//-----------------------------------------------------------------------------
	// 指定した弾画像ファイル名をキーとして、指定した弾ビットマップデータをキャッシュに設定します。
	//
	// 引数
	// 　・fileName：
	// 　　弾画像ファイル名
	// 　・bitmap：
	// 　　弾ビットマップデータ
	//-----------------------------------------------------------------------------
    ImageManager.setBulletImageByBitmap = function( fileName, bitmap ) {
		var cache = this.bulletCache();
		cache[fileName] = bitmap;
	};
	//-----------------------------------------------------------------------------
	// 弾画像キャッシュを取得します。
	//-----------------------------------------------------------------------------
    ImageManager.bulletCache = function() {
        if( this._bulletCache == null ) {
            this._bulletCache = new ImageCache();
        }
        return this.bulletCache;
    };
	// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
})();