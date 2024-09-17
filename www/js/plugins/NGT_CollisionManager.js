//=============================================================================
// NGT_CollisionManager.js
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
 * @plugindesc ピクチャまたはNGT_Shooter.jsを用いて生成された弾に
 * 当たり判定を実装します。
 * 
 * @help このプラグインの使い方は下記のサンプルゲームにて紹介しています。
 * https://game.nicovideo.jp/atsumaru/games/gm9334 
 * 
 * ▼簡単な使い方---------------------------------------------------------------
 * 1.プラグインパラメータ：〇〇格納変数番号 を設定して、
 *   当たり判定の結果を変数で受け取れるようにする。
 * 2.プラグインパラメータ：collisionDatas を設定して、
 *   当たり判定を行うオブジェクトの設定を行う。
 * 3.プラグインコマンド：COLLISION_CHECK_START を実行し、
 *   当たり判定を開始する。
 * 4.自動実行または並列処理のイベントにて、
 *   プラグインコマンド：COLLISION_RESULT_GET を実行し、
 *   当たり判定の結果を取得／処理を行う。
 * 5.プラグインコマンド：COLLISION_CHECK_STOP を実行し、
 *   当たり判定を終了する。
 * -----------------------------------------------------------------------------
 *   
 * ▼プラグインコマンド---------------------------------------------------------
 * 1.当たり判定を開始する場合
 * ・COLLISION_CHECK_START
 * ・当たり判定_開始
 * 
 * 当たり判定処理を開始し、毎フレーム当たり判定を行います。
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
 * @param collisionDatas
 * @desc 画像の当たり判定情報を指定します。
 * @type struct<collisionData>[]
 * @default []
 *
 * @param 判定結果（対象オブジェクト インデックス） 格納変数番号
 * @desc 当たり判定結果のうち、判定対象オブジェクトの管理配列インデックス値を格納する変数番号を指定します。
 * @type number
 * @default 0
 * @min 0
 * @max 5000
 * 
 * @param 判定結果（対象オブジェクト 画像ファイル名） 格納変数番号
 * @desc 当たり判定結果のうち、判定対象オブジェクトの画像ファイル名を格納する変数番号を指定します。
 * @type number
 * @default 0
 * @min 0
 * @max 5000
 * 
 * @param 判定結果（衝突オブジェクト インデックス） 格納変数番号
 * @desc 当たり判定結果のうち、判定対象に衝突したオブジェクトの管理配列インデックス値を格納する変数番号を指定します。
 * @type number
 * @default 0
 * @min 0
 * @max 5000
 * 
 * @param 判定結果（衝突オブジェクト 画像ファイル名） 格納変数番号
 * @desc 当たり判定結果のうち、判定対象に衝突したオブジェクトの画像ファイル名を格納する変数番号を指定します。
 * @type number
 * @default 0
 * @min 0
 * @max 5000
 * 
 * @param 判定結果（衝突 X座標） 格納変数番号
 * @desc 当たり判定結果のうち、衝突した位置のX座標を格納する変数番号を指定します。
 * @type number
 * @default 0
 * @min 0
 * @max 5000
 * 
 * @param 判定結果（衝突 Y座標） 格納変数番号
 * @desc 当たり判定結果のうち、衝突した位置のY座標を格納する変数番号を指定します。
 * @type number
 * @default 0
 * @min 0
 * @max 5000
 * 
 * @param 判定結果（衝突 角度） 格納変数番号
 * @desc 当たり判定結果のうち、衝突した角度を格納する変数番号を指定します。
 * @type number
 * @default 0
 * @min 0
 * @max 5000
 * 
 * @param 判定結果（めり込み量 X軸） 格納変数番号
 * @desc 当たり判定結果のうち、衝突した相手に対してX軸方向にめり込んでいる長さを格納する変数番号を指定します。
 * @type number
 * @default 0
 * @min 0
 * @max 5000
 * 
 * @param 判定結果（めり込み量 Y軸） 格納変数番号
 * @desc 当たり判定結果のうち、衝突した相手に対してY軸方向にめり込んでいる長さを格納する変数番号を指定します。
 * @type number
 * @default 0
 * @min 0
 * @max 5000
 */
/*~struct~collisionData:ja
 * @param fileName
 * @desc 当たり判定を行う画像ファイル名を指定します。
 * @type string
 * @default 
 * 
 * @param collisionTargets
 * @desc 当該画像への衝突対象一覧を指定します。
 * @type struct<collisionTarget>[]
 * @default []
 * 
 * @param rectangle
 * @desc 当該画像の当たり判定矩形一覧を指定します。
 * @type struct<rectangle>
 * @default {"x":"0","y":"0","width":"0","height":"0"}
 * 
 * @param isResponse
 * @desc trueの場合、衝突応答処理（めりこみ量算出）を行い、
 * 「めり込み量 X軸」「めり込み量 Y軸」に値が格納されます。
 * @type boolean
 * @default false
*/
/*~struct~collisionTarget:ja
 * @param fileName
 * @desc 当たり判定を行う画像ファイル名を指定します。
 * @type string
 * @default 
 * 
 * @commented_param setSwitchNumber
 * @commented_desc 当たり判定時にONにするスイッチの番号です。
 * 0の場合はスイッチをONにしません。
 * @commented_type number
 * @commented_default 0
 * @commented_min 0
 * @commented_max 9999
 * 
 * @commented_param commonEventNumber
 * @commented_desc 当たり判定時に実行するコモンイベントの番号です。
 * 0の場合はコモンイベントを実行しません。
 * @commented_type number
 * @commented_default 0
 * @commented_min 0
 * @commented_max 9999
*/
/*~struct~rectangle:ja
 * @param x
 * @desc 当たり判定矩形の左上X座標を指定します。
 * @type number
 * @default 0
 * @min -9999
 * @max 9999
 * 
 * @param y
 * @desc 当たり判定矩形の左上Y座標を指定します。
 * @type number
 * @default 0
 * @min -9999
 * @max 9999
 * 
 * @param width
 * @desc 当たり判定矩形の横幅を指定します。
 * @type number
 * @default 0
 * @min 0
 * @max 9999
 * 
 * @param height
 * @desc 当たり判定矩形の縦幅を指定します。
 * @type number
 * @default 0
 * @min 0
 * @max 9999
*/

( function() {
    'use strict';
    var pluginName = 'NGT_CollisionManager';
	
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

    // --------------------------------------------------
    // ローカル関数
    // 参考：フトコロ殿の各種プラグインファイル
    // --------------------------------------------------
	var getParsedParam = function( obj ) {
        var paramReplace = function( key, value ) {
            try {
                return JSON.parse( value || null );
            } catch ( e ) {
                return value;
            }
        };
        return JSON.parse( JSON.stringify( obj, paramReplace ) );
    };

	// --------------------------------------------------
    // プラグインコマンド追加　　　　
    // --------------------------------------------------
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function( command, args ) {
		_Game_Interpreter_pluginCommand.apply( this, arguments );
		
		var commandName = command.toUpperCase();
        var startInfo = "（引数：" + args + "）";
        switch( commandName ) {
            case 'COLLISION_CHECK_START':
            case '当たり判定_開始':
                // 処理実行
                $gameTemp.collisionManager.setIsCheckStart( true );
                break;

            case 'COLLISION_CHECK_STOP':
            case '当たり判定_終了':
                // 処理実行
                $gameTemp.collisionManager.setIsCheckStart( false );
                break;

            case 'COLLISION_RESULT_GET':
            case '当たり判定_結果_取得':
                // 処理実行
                $gameTemp.collisionManager.setupResultToVariables();
                break;
                
            case 'COLLISION_INVINCIBLE_ADD':
            case '当たり判定_無敵_追加':
                // パラメータ取得
                var targetIndex = ( args.length >= 1 ) ? getArgNumber( args[0], 0, 9999 ) : -1;
                var outsiderIndex = ( args.length >= 2 ) ? getArgNumber( args[1], 0, 9999 ) : -1;
                var frame = ( args.length >= 3 ) ? getArgNumber( args[2], 0, 9999 ) : 0;
                // パラメータチェック
                if( targetIndex == -1 ) {
                    throw new Error( "対象オブジェクト インデックス値 が指定されていません。" );
                }
                if( outsiderIndex == -1 ) {
                    throw new Error( "衝突オブジェクト インデックス値 が指定されていません。" );
                }
                // 処理実行
                $gameTemp.collisionManager.addInvincible( targetIndex, outsiderIndex, frame );
                break;
		}
    };

    // MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    //-----------------------------------------------------------------------------
    // CollisionManager
    //
    // 当たり判定全般を管理します。
    //-----------------------------------------------------------------------------
    function CollisionManager() {
		this.initialize.apply( this, arguments );
    }

    //-----------------------------------------------------------------------------
    // 当たり判定管理マネージャの初期化処理を行います。
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.initialize = function() {
        // 当たり判定結果を格納する変数番号を準備
        this._pointerOfResultTargetIndex = getParamNumber( ["判定結果（対象オブジェクト インデックス） 格納変数番号", "pointerOfResultTargetId"], 0, 5000 );
        this._pointerOfResultTargetFileName = getParamNumber( ["判定結果（対象オブジェクト 画像ファイル名） 格納変数番号", "pointerOfResultTargetFileName"], 0, 5000 );
        this._pointerOfResultOutsiderIndex = getParamNumber( ["判定結果（衝突オブジェクト インデックス） 格納変数番号", "pointerOfResultOutsiderId"], 0, 5000 );
        this._pointerOfResultOutsiderFileName = getParamNumber( ["判定結果（衝突オブジェクト 画像ファイル名） 格納変数番号", "pointerOfResultOutsiderFileName"], 0, 5000 );
        this._pointerOfResultCollisionX = getParamNumber( ["判定結果（衝突 X座標） 格納変数番号", "pointerOfResultCollisionX"], 0, 5000 );
        this._pointerOfResultCollisionY = getParamNumber( ["判定結果（衝突 Y座標） 格納変数番号", "pointerOfResultCollisionY"], 0, 5000 );
        this._pointerOfResultCollisionDegree = getParamNumber( ["判定結果（衝突 角度） 格納変数番号", "pointerOfResultCollisionDegree"], 0, 5000 );
        this._pointerOfResultSinkingLengthX = getParamNumber( ["判定結果（めり込み量 X軸） 格納変数番号", "pointerOfResultSinkingLengthX"], 0, 5000 );
        this._pointerOfResultSinkingLengthY = getParamNumber( ["判定結果（めり込み量 Y軸） 格納変数番号", "pointerOfResultSinkingLengthY"], 0, 5000 );

        // 空間分割した各エリアの配列を準備
        this.initializeCollisionAreas();
        this._collisionAreas = new Array();
        this._collisionDatas = new Array();
        this._collisionDataAccessor = new Array();
        this._collisionSpriteAccessor = new Array();
        this._results = new Array();
        this._invincibleList = new Array();

        // プラグインパラメータで指定された当たり判定情報を準備
		var parameters = PluginManager.parameters( pluginName );
        var collisionParams = getParsedParam( parameters['collisionDatas'] );

        for( var i = 0; i < collisionParams.length; i++ ) {
            var collisionParam = collisionParams[i];
            var fileName = collisionParam.fileName;
            var collisionTargets = collisionParam.collisionTargets;
            var isResponse = collisionParam.isResponse;
            let rectangle = new Rectangle( 0, 0, 0, 0 );
            // if( collisionParam.isCollisionAll ) {
            //     var bitmap = ImageManager.loadPicture( fileName );
            //     if( !bitmap.isReady() ) {
            //         var manager = this;
            //         bitmap.addLoadListener( function( image ) {
            //             rectangle = new Rectangle( 0, 0, image.width, image.height );
            //             var collisionData = new Collision_Data( fileName, collisionTargets, rectangle, isResponse );
            //             manager._collisionDatas.push( collisionData );
            //             manager._collisionDataAccessor[fileName] = collisionData;
            //             console.log( fileName );
            //         } );
            //     } else {
            //         rectangle = new Rectangle( 0, 0, image.width, image.height );
            //         var collisionData = new Collision_Data( fileName, collisionTargets, rectangle, isResponse );
            //         this._collisionDatas.push( collisionData );
            //         this._collisionDataAccessor[fileName] = collisionData;
            //     }
            // } else {
            // }
            var cr = collisionParam.rectangle;
            rectangle = new Rectangle( cr.x, cr.y, cr.width, cr.height );
            var collisionData = new Collision_Data( fileName, collisionTargets, rectangle, isResponse );
            this._collisionDatas.push( collisionData );
            this._collisionDataAccessor[fileName] = collisionData;
        }

        // チェック対象のスプライト管理配列を準備
        this._checkTargets = new Array();

        // その他変数を準備
        this._isCheckStart = false;
    };

    //-----------------------------------------------------------------------------
    // 指定されたスプライトリストを当たり判定チェック対象に追加します。
    // 引数
    // ・sprites
    // 　　スプライトリスト
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.addCheckTargets = function( sprites ) {
        this._checkTargets.push( sprites );
    };

    //-----------------------------------------------------------------------------
    // 指定された判定対象スプライトファイル名に対応する当たり判定データを取得します。
    // 引数
    // fileName
    // 　　判定対象スプライトファイル名
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.getCollisionData = function( fileName ) {
        if( !this._collisionDataAccessor[fileName] ) {
            // throw new Exception( "指定した判定対象スプライトファイル名に対応する当たり判定情報が存在しません。（判定対象スプライトファイル名：" + targetId + "）" );
            return null;
        }
        return this._collisionDataAccessor[fileName];
    };

    //-----------------------------------------------------------------------------
    // 当たり判定結果をプラグインパラメータで指定された変数に格納します。
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.setupResultToVariables = function() {
        $gameVariables._data[this._pointerOfResultTargetIndex] = -1;
        $gameVariables._data[this._pointerOfResultTargetFileName] = -1;
        $gameVariables._data[this._pointerOfResultOutsiderIndex] = -1;
        $gameVariables._data[this._pointerOfResultOutsiderFileName] = -1;
        $gameVariables._data[this._pointerOfResultCollisionX] = -1;
        $gameVariables._data[this._pointerOfResultCollisionY] = -1;
        $gameVariables._data[this._pointerOfResultCollisionDegree] = -1;
        $gameVariables._data[this._pointerOfResultSinkingLengthX] = -1;
        $gameVariables._data[this._pointerOfResultSinkingLengthY] = -1;
        var result = this.dequeueResult();
        if( result == null ) {
            return false;
        }
        $gameVariables._data[this._pointerOfResultTargetIndex] = result.targetIndex;
        $gameVariables._data[this._pointerOfResultTargetFileName] = result.targetId;
        $gameVariables._data[this._pointerOfResultOutsiderIndex] = result.outsiderIndex;
        $gameVariables._data[this._pointerOfResultOutsiderFileName] = result.outsiderId;
        $gameVariables._data[this._pointerOfResultCollisionX] = result.x;
        $gameVariables._data[this._pointerOfResultCollisionY] = result.y;
        $gameVariables._data[this._pointerOfResultCollisionDegree] = result.degree;
        $gameVariables._data[this._pointerOfResultSinkingLengthX] = result.sinkingLengthX;
        $gameVariables._data[this._pointerOfResultSinkingLengthY] = result.sinkingLengthY;
        return true;
    };

    //-----------------------------------------------------------------------------
    // 空間分割したエリアの所属情報を全てクリアします。
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.initializeCollisionAreas = function() {
        this._collisionSpriteAccessor = new Array();
        this._collisionAreas = new Array();
        for( var i = 0; i < ( 1 + 4 + 16 + 64); i++ ) {
            this._collisionAreas.push( new Array() );
        }
    };

    //-----------------------------------------------------------------------------
    // 指定されたIDの判定対象スプライトについて、
    // 指定した衝突スプライトに対する無敵判定を管理対象として追加します。
    // 引数
    // ・targetIndex
    // 　　対象オブジェクト インデックス値
    // ・outsiderIndex
    // 　　衝突オブジェクト インデックス値
    // ・frame：
    // 　　無敵フレーム数
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.addInvincible = function( targetIndex, outsiderIndex, frame ) {
        this._invincibleList.push( new Collision_Invincible( targetIndex, outsiderIndex, frame ) );
    };

    //-----------------------------------------------------------------------------
    // 管理対象の無敵判定一覧を更新します。
    // 無敵フレーム数を超過した無敵判定情報は管理対象から除外します。
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.refreshInvincible = function() {
        for( var i = 0; i < this._invincibleList.length; i++ ) {
            this._invincibleList[i].incrementFrame();
            if( this._invincibleList[i].isEnd() ) {
                this._invincibleList.splice( i, 1 );
                i = i - 1;
            }
        }
    };

    //-----------------------------------------------------------------------------
    // 指定したスプライトが判定スプライトが否かを判定します。
    // 引数
    // ・sprite：
    // 　　判定スプライト
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.isTarget = function( sprite ) {
        return this._collisionDatas.some( function( cd ) {
            return cd.collisionKey() == sprite.collisionKey();
        } );
    };

    //-----------------------------------------------------------------------------
    // 指定したスプライトが衝突スプライトが否かを判定します。
    // 引数
    // ・sprite：
    // 　　衝突スプライト
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.isOutsider = function( sprite ) {
        return this._collisionDatas.some( function( cd ) {
            return cd.collisionTargets.some( function( ct ) {
                return ct.fileName == sprite.collisionKey();
            } );
        } );
    };

    //-----------------------------------------------------------------------------
    // 当たり判定を行うか否かを判定します。
    // なお、以下の場合は当たり判定を行いません。
    // ・判定対象スプライトと衝突スプライトが同一
    // ・判定対象スプライトに対する衝突スプライトが現在無敵状態
    // ・判定対象スプライトに対する衝突スプライトに含まれていない
    // 引数
    // ・target：
    // 　　判定スプライト
    // ・outsider：
    // 　　衝突スプライト
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.isTargetOutsiderPair = function( target, outsider ) {
        if( target == outsider ) {
            return false;
        }
        if( this.isInvincible( target, outsider ) ) {
            return false;
        }
        var targetKey = target.collisionKey();
        var outsiderKey = outsider.collisionKey();
        var targetCollisionData = this.getCollisionData( targetKey );
        return targetCollisionData.collisionTargets.some( function( ct ) {
            return ( ct.fileName == outsiderKey );
        } );
    };

    //-----------------------------------------------------------------------------
    // 指定した判定対象スプライトと衝突スプライトが無敵状態か否かを判定します。
    // 引数
    // ・target：
    // 　　判定スプライト
    // ・outsider：
    // 　　衝突スプライト
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.isInvincible = function( target, outsider ) {
        return this._invincibleList.some( function( invincible ) {
            return invincible.isEnabled( target.index(), outsider.index() ) 
        } );
    };

    //-----------------------------------------------------------------------------
    // 指定したスプライトを対象にエリア更新を行う。
    // 引数
    // ・target：
    // 　　判定スプライト
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.setupSpriteCollision = function( target ) {
        // 左上と右下の空間番号を取得する
        var leftTop = target.leftTopPoint();
        var leftTopNumber = this.get2dMortonNumber( this.getSeparatedNumberByX( leftTop.x ), this.getSeparatedNumberByY( leftTop.y ) );
        var rightBottom = target.rightBottomPoint();
        var rightBottomNumber = this.get2dMortonNumber( this.getSeparatedNumberByX( rightBottom.x ), this.getSeparatedNumberByY( rightBottom.y ) );
        // スプライトの表示位置が画面全体に及ぶ場合をチェック
        if( target.isCollisionAreaAll() 
        || ( leftTopNumber < 0 || 63 < leftTopNumber )
        || ( rightBottomNumber < 0 || 63 < rightBottomNumber ) ) {
            leftTopNumber = 0;
            rightBottomNumber = 63;
        }
        // 取得した空間番号をもとにスプライトの所属空間を割り出す
        var xorNumber = leftTopNumber ^ rightBottomNumber;
        var shiftCount = 0;
        var targetShiftCount = 0;
        var targetLv = 0;
        while( xorNumber > 0 ) {
            shiftCount ++;
            if( ( xorNumber & 3 ) > 0 ) {
                targetShiftCount = shiftCount;
                targetLv = shiftCount;
            }
            xorNumber = xorNumber >> 2;
        }
        var targetAreaNum = rightBottomNumber >> ( targetShiftCount * 2 );
        var targetAreaIndex = targetAreaNum + this.getAreaArrayIndex( targetLv );
        this._collisionAreas[targetAreaIndex].push( target );
        this._collisionSpriteAccessor.push( target );
        target.setAreaIndex( targetAreaIndex );
    };

    //-----------------------------------------------------------------------------
    // 指定された空間番号に対応する空間所属スプライト配列を全て取得します。
    // 引数
    // ・targetAreaIndex：
    // 　　空間番号
    // ・areaLv：
    // 　　空間レベル（再起呼び出し時に指定されます）
    // ・isUp：
    // 　　上位レベル検索フラグ（再起呼び出し時に指定されます）
    // ・isDown：
    // 　　下位レベル検索フラグ（再起呼び出し時に指定されます）
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.getCollisionAreas = function( targetAreaIndex, areaLv, isUp, isDown ) {
        // 再帰的な空間番号チェック終了チェック
        if( targetAreaIndex == -1 ) {
            return new Array();
        }
        // 指定された空間番号の空間レベル取得
        var areaArrayIndexes = this.getAreaArrayIndexes();
        if( areaLv == null ) {
            areaLv = 3;
            for( var i = 0; i < areaArrayIndexes.length; i++ ) {
                if( targetAreaIndex / areaArrayIndexes[i] >= 1 ) {
                    areaLv = i;
                    break;
                }          
            }
        }
        // 指定された空間番号の空間所属スプライト配列を取得
        var targets = new Array();
        targets.push( this._collisionAreas[targetAreaIndex] );
        // 上位検索が必要な場合は上位レベルの空間を検索する
        if( isUp == null || isUp ) {
            var nowLv = areaLv + 1;
            if( nowLv <= 3 ) {
                var n = areaArrayIndexes[nowLv] + Math.floor( ( targetAreaIndex - areaArrayIndexes[areaLv] ) / 4 );
                var w = this.getCollisionAreas( n, nowLv, true, false );
                for( var x = 0 ; x < w.length; x++ ) {
                    targets.push( w[x] );
                }
            }
        }
        // 下位検索が必要な場合は下位レベルの空間を検索する
        if( isDown == null || isDown ) {
            var nowLv = areaLv - 1;
            if( nowLv >= 0 ) {
                for( var i = 0; i< 4; i ++ ) {
                    var n = ( 4 * targetAreaIndex ) + i + 1;
                    var w = this.getCollisionAreas( n, nowLv, false, true );
                    for( var x = 0 ; x < w.length; x++ ) {
                        targets.push( w[x] );
                    }
                }
            }
        }
        return targets;
    };

    //-----------------------------------------------------------------------------
    // CollisionManagerで管理しているスプライトについて、
    // 現在位置とサイズから所属する空間番号を割振ります。
    // デフォルトで管理しているスプライトは下記の通りです。
    // ・Sprite_Picture：RPGツクールMVのピクチャ
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.update = function() {
        this.initializeCollisionAreas();
        for( var i = 0; i < this._checkTargets.length; i++ ) {
            for( var j = 0; j < this._checkTargets[i].length; j++ ) {
                var sprite = this._checkTargets[i][j];
                sprite.setAreaIndex( -1 );
                if( !sprite.isCollisionCheckable() ) {
                    continue;
                }
                if( !this.isTarget( sprite ) && !this.isOutsider( sprite ) ) {
                    continue;
                }
                this.setupSpriteCollision( sprite );
            }
        }
    };

    //-----------------------------------------------------------------------------
    // 判定対象のスプライトについて当たり判定を行います。
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.check = function() {
        for( var i = 0; i < this._collisionSpriteAccessor.length; i++ ) {
            var target = this._collisionSpriteAccessor[i];
            if( !this.isTarget( target ) ) {
                continue;
            }
            var targetCollisionAreas = this.getCollisionAreas( target.areaIndex() );
            for( var j = 0; j < targetCollisionAreas.length; j++ ) {
                var collisionArea = targetCollisionAreas[j];
                for( var k = 0; k < collisionArea.length; k++ ) {
                    var outsider = collisionArea[k];
                    if( !this.isTargetOutsiderPair( target, outsider ) ) {
                        continue;
                    }
                    var crossedPoint = this.getCrossedPoint( target, outsider );
                    if( crossedPoint != null ) {
                        var sinkingLength = this.getSinkingLength( target, outsider );
                        this.inqueueResult( new Collision_ResultData( target.index(), target.collisionKey(), outsider.index(), outsider.collisionKey(), crossedPoint.x, crossedPoint.y, outsider.degree(), sinkingLength.x, sinkingLength.y ) );
                        continue;
                    }
                    var insidePoint = this.getInsidePoint( target, outsider );
                    if( insidePoint != null ) {
                        var sinkingLength = this.getSinkingLength( target, outsider );
                        this.inqueueResult( new Collision_ResultData( target.index(), target.collisionKey(), outsider.index(), outsider.collisionKey(), insidePoint.x, insidePoint.y, outsider.degree(), sinkingLength.x, sinkingLength.y ) );
                        continue;
                    }
                }
            }
        }
    };

    //-----------------------------------------------------------------------------
    // 指定された当たり判定対象オブジェクトに対して、
    // 衝突オブジェクトの四隅が当たり判定対象オブジェクトに含まれているかを判定し、衝突した座標を返却します。
	// 衝突していない場合は null が返却されます。
	// フォーマットは下記のような形式となります。
    // 座標 = {
    //     x:
    //     y:
    // }
    // 引数
    // ・target：
    // 　　判定スプライト
    // ・outsider：
    // 　　衝突スプライト
	//-----------------------------------------------------------------------------
    CollisionManager.prototype.getInsidePoint = function( target, outsider ) {
        var targetCollisionData = this.getCollisionData( target.collisionKey() );
        var targetCorner = ( targetCollisionData != null ) ? targetCollisionData.rectangle.getCornerPoints( target ) : target.getCornerPointsRotated();
        var outsiderCollisionData = this.getCollisionData( outsider.collisionKey() );
        var outsiderCorner = ( outsiderCollisionData != null ) ? outsiderCollisionData.rectangle.getCornerPoints( outsider ) : outsider.getCornerPointsRotated();
        // TODO：rectangleが設定されている場合は中心点を出すべき
        // console.log( "tc[0]:" + targetCorner[0].x + "," + targetCorner[0].y );
        // console.log( "tc[1]:" + targetCorner[1].x + "," + targetCorner[1].y );
        // console.log( "tc[2]:" + targetCorner[2].x + "," + targetCorner[2].y );
        // console.log( "tc[3]:" + targetCorner[3].x + "," + targetCorner[3].y );
        // console.log( "oc[0]:" + outsiderCorner[0].x + "," + outsiderCorner[0].y );
        // console.log( "oc[1]:" + outsiderCorner[1].x + "," + outsiderCorner[1].y );
        // console.log( "oc[2]:" + outsiderCorner[2].x + "," + outsiderCorner[2].y );
        // console.log( "oc[3]:" + outsiderCorner[3].x + "," + outsiderCorner[3].y );

        var checkPoints = [{ x: target.x, y: target.y }, targetCorner[0], targetCorner[1], targetCorner[2], targetCorner[3], { x: outsider.x, y: outsider.y }, outsiderCorner[0], outsiderCorner[1], outsiderCorner[2], outsiderCorner[3]];
        var corresponds = [outsiderCorner, outsiderCorner, outsiderCorner, outsiderCorner, outsiderCorner, targetCorner, targetCorner, targetCorner, targetCorner, targetCorner];
        for( var i = 0; i < checkPoints.length; i++ ) {
            var checkPoint = checkPoints[i];
            var correspond = corresponds[i];
            if( this.isInside( correspond, checkPoint ) ) {
                // console.log( "checkPoint[" + i + "]:" + checkPoint.x + "," + checkPoint.y );
                // console.log( "tg[0]：" + targetCorner[0].x + "," + targetCorner[0].y );
                // console.log( "tg[1]：" + targetCorner[1].x + "," + targetCorner[1].y );
                // console.log( "tg[2]：" + targetCorner[2].x + "," + targetCorner[2].y );
                // console.log( "tg[3]：" + targetCorner[3].x + "," + targetCorner[3].y );
                return checkPoint;
            }
        }
        return null;
    };

    //-----------------------------------------------------------------------------
    // 指定された判定スプライトに対して、
    // 衝突スプライトの移動により生成されたベクトルが交差しているか否かを判定し、衝突した座標を返却します。
	// 衝突していない場合は null が返却されます。
	// フォーマットは下記のような形式となります。
    // 座標 = {
    //     x:
    //     y:
    // }
    // 引数
    // ・target：
    // 　　判定スプライト
    // ・outsider：
    // 　　衝突スプライト
	//-----------------------------------------------------------------------------
    CollisionManager.prototype.getCrossedPoint = function( target, outsider ) {
        var targetCollisionData = this.getCollisionData( target.collisionKey() );
        var targetCorner = ( targetCollisionData != null ) ? targetCollisionData.rectangle.getCornerPoints( target ) : target.getCornerPointsRotated();
        var outsiderCollisionData = this.getCollisionData( outsider.collisionKey() );
        var outsiderCorner = ( outsiderCollisionData != null ) ? outsiderCollisionData.rectangle.getCornerPoints( outsider ) : outsider.getCornerPointsRotated();

        var outsiderA = outsider.moveBefore();
        var outsiderB = outsider.moveAfter();
        var tg_os_order = this.getCheckOrder( target, outsider );
        for( var i = 0; i < 4; i++ ) {
            var targetA = targetCorner[( i + tg_os_order + 0 ) & 0xfffffffb];
            var targetB = targetCorner[( i + tg_os_order + 1 ) & 0xfffffffb];
            if( this.isCrossed( outsiderA.x, outsiderA.y, outsiderB.x, outsiderB.y, targetA.x, targetA.y, targetB.x, targetB.y ) ) {
                return this.getCrossedPointByVector( outsiderA.x, outsiderA.y, outsiderB.x, outsiderB.y, targetA.x, targetA.y, targetB.x, targetB.y );
            }
        }

        var _targetA = target.moveBefore();
        var _targetB = target.moveAfter();
        var os_tg_order = this.getCheckOrder( outsider, target );
        for( var i = 0; i < 4; i++ ) {
            var _outsiderA = outsiderCorner[( i + os_tg_order + 0 ) & 0xfffffffb];
            var _outsiderB = outsiderCorner[( i + os_tg_order + 1 ) & 0xfffffffb];
            if( this.isCrossed( _targetA.x, _targetA.y, _targetB.x, _targetB.y, _outsiderA.x, _outsiderA.y, _outsiderB.x, _outsiderB.y ) ) {
                return this.getCrossedPointByVector( _targetA.x, _targetA.y, _targetB.x, _targetB.y, _outsiderA.x, _outsiderA.y, _outsiderB.x, _outsiderB.y );
            }
        }
        return null;
    };

    //-----------------------------------------------------------------------------
    // 指定された当たり判定対象オブジェクトが衝突オブジェクトに対して、
    // どれくらいめりこんでいるのかを判定し、その結果を返します。
	// めりこんでいない場合はnullを返します。
	// フォーマットは下記のような形式となります。
    // {
    //     x:
    //     y:
    // }
    // 引数
    // ・target：
    // 　　判定スプライト
    // ・outsider：
    // 　　衝突スプライト
	//-----------------------------------------------------------------------------
    CollisionManager.prototype.getSinkingLength = function( target, outsider ) {
        var result = {
            x: 0,
            y: 0
        };
        var targetCollisionData = this.getCollisionData( target.collisionKey() );
        var outsiderCollisionData = this.getCollisionData( outsider.collisionKey() );
        if( targetCollisionData == null && !targetCollisionData.isResponse ) {
            return result;
        }
        const LT = 0; // 左上 - Left  - Top
        const RB = 2; // 右下 - Right - Bottom
        var targetCorner = ( targetCollisionData != null ) ? targetCollisionData.rectangle.getCornerPoints( target ) : target.getCornerPointsRotated();
        var targetRange = {
            minX: targetCorner[LT].x,
            maxX: targetCorner[RB].x,
            minY: targetCorner[LT].y,
            maxY: targetCorner[RB].y
        };
        var outsiderCorner = ( outsiderCollisionData != null ) ? outsiderCollisionData.rectangle.getCornerPoints( outsider ) : outsider.getCornerPointsRotated();
        var outsiderRange = {
            minX: outsiderCorner[LT].x,
            maxX: outsiderCorner[RB].x,
            minY: outsiderCorner[LT].y,
            maxY: outsiderCorner[RB].y
        };
        var rightSink = targetRange.maxX - outsiderRange.minX;
        var leftSink = targetRange.minX - outsiderRange.maxX;
        var bottomSink = targetRange.maxY - outsiderRange.minY;
        var topSink = targetRange.minY - outsiderRange.maxY;
        result.x = Math.abs( rightSink ) <= Math.abs( leftSink ) ? rightSink : leftSink;
        result.y = Math.abs( bottomSink ) <= Math.abs( topSink ) ? bottomSink : topSink;
        return result;
    };

    //-----------------------------------------------------------------------------
    // 指定された判定スプライトに対して、
    // 衝突オブジェクトの移動により生成されたベクトルが交差しているか否かを判定する際の
    // チェックする順番の先頭インデックスを取得します。
    // 順番
    // 　0：左上
    // 　1：右上
    // 　2：右下
    // 　3：左下
    // 引数
    // ・target：
    // 　　判定スプライト
    // ・outsider：
    // 　　衝突スプライト
	//-----------------------------------------------------------------------------
    CollisionManager.prototype.getCheckOrder = function( target, outsider ) {
        var tgX = target.x;
        var tgY = target.y;
        var osX = outsider.x;
        var osY = outsider.y;

        const orders = [0, 0, 2, null, 1, 0, 1, null, 3, 3, 2];
        var i = Number( ( tgX - osX ) == 0 ) * 0;
        i += Number( ( tgX - osX ) >  0 ) * 1;
        i += Number( ( tgX - osX ) <  0 ) * 2;
        i += Number( ( tgY - osY ) == 0 ) * 0;
        i += Number( ( tgY - osY ) >  0 ) * 4;
        i += Number( ( tgY - osY ) <  0 ) * 8;
        
        return orders[i];
    };

    //-----------------------------------------------------------------------------
    // 指定されたベクトル同士が交差しているか否かを判定します。
    // 引数
    // ・ax, ay：
    // 　　ベクトルABの始点
    // ・bx, by：
    // 　　ベクトルABの終点
    // ・cx, cy：
    // 　　ベクトルCDの始点
    // ・dx, dy：
    // 　　ベクトルCDの終点
	//-----------------------------------------------------------------------------
    CollisionManager.prototype.isInside = function( cornerPoints, targetPoint ) {
        var minusCount = 0;
        for( var i = 0; i < 4; i++ ) {
            var pointA = cornerPoints[( i + 0 ) & 0xfffffffb];
            var pointB = cornerPoints[( i + 1 ) & 0xfffffffb];
            
            var abX = ( pointB.x - pointA.x );
            var abY = ( pointB.y - pointA.y );
            var btX = ( targetPoint.x - pointB.x );
            var btY = ( targetPoint.y - pointB.y );
            if( ( abX * btY - abY * btX ) < 0 ) {
                minusCount += 1;
            }
            if( ( abX * btY - abY * btX ) > 0 ) {
                minusCount -= 1;
            }
        }
        return ( minusCount == 4 ) || ( minusCount == -4 );
    };

    //-----------------------------------------------------------------------------
    // 指定されたベクトル同士が交差しているか否かを判定します。
    // 引数
    // ・ax, ay：
    // 　　ベクトルABの始点
    // ・bx, by：
    // 　　ベクトルABの終点
    // ・cx, cy：
    // 　　ベクトルCDの始点
    // ・dx, dy：
    // 　　ベクトルCDの終点
	//-----------------------------------------------------------------------------
    CollisionManager.prototype.isCrossed = function( ax, ay, bx, by, cx, cy, dx, dy ) {
        if( ( ax - ay ) * ( bx - by ) * ( cx - cy ) * ( dx - dy ) == 0  ) {
            return false;
        }
        var ta = ( cx - dx ) * ( ay - cy) + ( cy - dy ) * ( cx - ax );
        var tb = ( cx - dx ) * ( by - cy) + ( cy - dy ) * ( cx - bx );
        var tc = ( ax - bx ) * ( cy - ay) + ( ay - by ) * ( ax - cx );
        var td = ( ax - bx ) * ( dy - ay) + ( ay - by ) * ( ax - dx );
      
        // 端点を含む場合
        return tc * td <= 0 && ta * tb <= 0;
        //// 端点を含まない場合
        // return tc * td < 0 && ta * tb < 0;
    };

    //-----------------------------------------------------------------------------
    // 指定されたベクトル同士が交差しているか否かを判定します。
    // 引数
    // ・ax, ay：
    // 　　ベクトルABの始点
    // ・bx, by：
    // 　　ベクトルABの終点
    // ・cx, cy：
    // 　　ベクトルCDの始点
    // ・dx, dy：
    // 　　ベクトルCDの終点
	//-----------------------------------------------------------------------------
    CollisionManager.prototype.getCrossedPointByVector = function( ax, ay, bx, by, cx, cy, dx, dy ) {
        var d = ( bx - ax ) * ( dy - cy ) - ( by - ay ) * ( dx - cx );
        if( d == 0 )
            return null;

        var u = ( ( cx - ax ) * ( dy - cy ) - ( cy - ay ) * ( dx - cx ) ) / d;
        var v = ( ( cx - ax ) * ( by - ay ) - ( cy - ay ) * ( bx - ax ) ) / d;
        if( u < 0.0 || u > 1.0 )
            return null;

        if( v < 0.0 || v > 1.0 )
            return null;

        var x = ax + u * ( bx - ax );
        var y = ay + u * ( by - ay );
        
        return {
            x: Math.floor( x ),
            y: Math.floor( y )
        };
    };

    //-----------------------------------------------------------------------------
    // 指定した空間レベルと分割空間数の対応表を取得します。
    // 
    // 参考サイト
    // ・ゲームつくろー！
    //   http://marupeke296.com/GameMain.html
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.getAreaArrayIndexes = function() {
        const areaStartIndexes = [21, 5, 1, 0];
        return areaStartIndexes;
    };

    //-----------------------------------------------------------------------------
    // 指定した空間レベルに対する分割空間数を取得します。
    // 
    // 参考サイト
    // ・ゲームつくろー！
    //   http://marupeke296.com/GameMain.html
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.getAreaArrayIndex = function( areaLv ) {
        return this.getAreaArrayIndexes()[areaLv];
    };

    //-----------------------------------------------------------------------------
    // 指定された値を★TODO：なんて書けばいいんだこれ
    // 
    // 参考サイト
    // ・ゲームつくろー！
    //   http://marupeke296.com/GameMain.html
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.separate32bit = function( n ) {
        n = ( n | ( n << 8 ) ) & 0x00ff00ff;
        n = ( n | ( n << 4 ) ) & 0x0f0f0f0f;
        n = ( n | ( n << 2 ) ) & 0x33333333;
        return ( n | ( n << 1 ) ) & 0x55555555;
    };

    //-----------------------------------------------------------------------------
    // 指定されたXY座標からモートン順序で割り振られた空間番号を取得します。
    // 
    // 参考サイト
    // ・ゲームつくろー！
    //   http://marupeke296.com/GameMain.html
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.get2dMortonNumber = function( x, y ) {
        return ( this.separate32bit( x ) | ( this.separate32bit( y ) << 1 ) );
    };

    //-----------------------------------------------------------------------------
    // 指定されたX座標に対する分割空間位置の横番号を取得します。
    // 
    // 参考サイト
    // ・ゲームつくろー！
    //   http://marupeke296.com/GameMain.html
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.getSeparatedNumberByX = function( n ) {
        // u = 102
        const u = 816 / ( 2 * 2 * 2 );
        return Math.floor( n / u );
    };

    //-----------------------------------------------------------------------------
    // 指定されたY座標に対する分割空間位置の縦番号を取得します。
    // 
    // 参考サイト
    // ・ゲームつくろー！
    //   http://marupeke296.com/GameMain.html
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.getSeparatedNumberByY = function( n ) {
        // u = 78
        const u = 624 / ( 2 * 2 * 2 );
        return Math.floor( n / u );
    };

    //-----------------------------------------------------------------------------
    // 当たり判定結果一覧を取得します。
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.results = function() {
        return this._results
    };

    //-----------------------------------------------------------------------------
    // 当たり判定結果一覧に当たり判定情報を追加します。
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.inqueueResult = function( value ) {
        this._results.push( value );
    };

    //-----------------------------------------------------------------------------
    // 当たり判定結果一覧から当たり判定情報を一つ取得します。
    // 取得した情報は結果一覧から除去されます。
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.dequeueResult = function() {
        if( this._results.length <= 0 ) {
            return null;
        }
        return this._results.shift();
    };

    //-----------------------------------------------------------------------------
    // 当たり判定開始フラグを取得します。
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.isCheckStart = function() {
        if( this._isCheckStart == null ) {
            this._isCheckStart = false;
        }
        return this._isCheckStart;
    };

    //-----------------------------------------------------------------------------
    // 当たり判定開始フラグを取得します。
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.setIsCheckStart = function( isCheckStart ) {
        this._isCheckStart = isCheckStart
    };

    //-----------------------------------------------------------------------------
    // NGT_Shooterプラグインの有効可否を取得します。
    //-----------------------------------------------------------------------------
    CollisionManager.prototype.isEnabledShooterPlugin = function() {
        return $gameTemp.shooterManager != null;
    };
    // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

    // MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    //-----------------------------------------------------------------------------
    // Collision_ResultData
    //
    // 当たり判定結果データを表現するクラスです。
    //-----------------------------------------------------------------------------
    function Collision_ResultData( targetIndex, targetId, outsiderIndex, outsiderId, x, y, degree, sinkingLengthX, sinkingLengthY ) {
        this.targetIndex = targetIndex;
        this.targetId = targetId;
        this.outsiderIndex = outsiderIndex;
        this.outsiderId = outsiderId;
        this.x = x;
        this.y = y;
        this.degree = degree;
        this.sinkingLengthX = sinkingLengthX;
        this.sinkingLengthY = sinkingLengthY;
    }
    // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

    // MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    //-----------------------------------------------------------------------------
    // Collision_Data
    //
    // 衝突対象データを表現するクラスです。
    //-----------------------------------------------------------------------------
    function Collision_Data( fileName, collisionTargets, rectangle, isResponse ) {
        this.fileName = fileName;
        this.collisionTargets = collisionTargets;
        this.rectangle = rectangle;
        this.isResponse = isResponse;
    };
    //-----------------------------------------------------------------------------
    // スプライトの衝突対象データを取得するキー値を取得します。
    //-----------------------------------------------------------------------------
    Collision_Data.prototype.collisionKey = function() {
		return this.fileName;
	};
    // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

    // MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    //-----------------------------------------------------------------------------
    // Collision_Invincible
    //
    // 無敵判定対象データを表現するクラスです。
    //-----------------------------------------------------------------------------
    function Collision_Invincible( targetIndex, outsiderIndex, frame ) {
        this.targetIndex = targetIndex;
        this.outsiderIndex = outsiderIndex;
        this.frame = frame;
        this.nowFrame = 0;
    };
    // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

    //-----------------------------------------------------------------------------
    // 指定した無敵対象IDと衝突対象IDのペアで
    // 当該無敵判定が行われているか否かを取得します。
    //-----------------------------------------------------------------------------
    Collision_Invincible.prototype.isEnabled = function( targetIndex, outsiderIndex ) {
        return ( this.targetIndex == targetIndex ) && ( this.outsiderIndex == outsiderIndex );
    };

    //-----------------------------------------------------------------------------
    // 当該無敵判定が終了しているか否かを取得します。
    //-----------------------------------------------------------------------------
    Collision_Invincible.prototype.isEnd = function() {
        return this.nowFrame >= this.frame;
    };

    //-----------------------------------------------------------------------------
    // 当該無敵判定が終了しているか否かを取得します。
    //-----------------------------------------------------------------------------
    Collision_Invincible.prototype.incrementFrame = function() {
        this.nowFrame ++;
    };
    // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

	//-----------------------------------------------------------------------------
	// 四角形の四隅の座標を取得します。
	// この四隅の座標はスプライトの角度変化を考慮しています。
	// フォーマットは下記のような形式となります。
	// 結果 = [ [座標(左上)], [座標(右上)], [座標(右下)], [座標(左下)] ]
    // 座標 = {
    //     x:
    //     y:
    // }
    //
    // 引数
    // ・parent：親スプライト
	//-----------------------------------------------------------------------------
	Rectangle.prototype.getCornerPoints = function( parent ) {
        return Rectangle.getCornerPoints( this.x, this.y, this.width, this.height, parent );
    }

    //-----------------------------------------------------------------------------
	// 四角形の四隅の座標を取得します。
	// この四隅の座標はスプライトの角度変化を考慮しています。
	// フォーマットは下記のような形式となります。
	// 結果 = [ [座標(左上)], [座標(右上)], [座標(右下)], [座標(左下)] ]
    // 座標 = {
    //     x:
    //     y:
    // }
    //
    // 引数
    // ・parent：親スプライト
	//-----------------------------------------------------------------------------
	Rectangle.getCornerPoints = function( x, y, width, height, parent ) {
        // var actualX = parent.x + x;
        // var actualY = parent.y + y;
        // var actualHW = ( width * parent.scale.x ) / 2;
        // var actualHH = ( height * parent.scale.y ) / 2;
		// var cornerPoints = [
        //     { x: actualX - actualHW, y: actualY - actualHH },
        //     { x: actualX + actualHW, y: actualY - actualHH },
        //     { x: actualX + actualHW, y: actualY + actualHH },
        //     { x: actualX - actualHW, y: actualY + actualHH }
        // ];
        var cornerPoints = null;
        if( parent.anchor.x === 0.5 && parent.anchor.y === 0.5 ) {
            var actualX = parent.x - ( ( parent.width * parent.scale.x ) / 2 ) + x;
            var actualY = parent.y - ( ( parent.height * parent.scale.y ) / 2 ) + y;
            var actualW = width * parent.scale.x;
            var actualH = height * parent.scale.y;
            var cornerPoints = [
                { x: actualX, y: actualY },
                { x: actualX + actualW, y: actualY },
                { x: actualX + actualW, y: actualY + actualH },
                { x: actualX, y: actualY + actualH }
            ];
        } else {
            var actualX = parent.x + x;
            var actualY = parent.y + y;
            var actualW = width * parent.scale.x;
            var actualH = height * parent.scale.y;
            var cornerPoints = [
                { x: actualX, y: actualY },
                { x: actualX + actualW, y: actualY },
                { x: actualX + actualW, y: actualY + actualH },
                { x: actualX, y: actualY + actualH }
            ];
        }
        // console.log( "1---" + cornerPoints[0].x + ":" + cornerPoints[0].y );
        // console.log( "2---" + cornerPoints[1].x + ":" + cornerPoints[1].y );
        // console.log( "3---" + cornerPoints[2].x + ":" + cornerPoints[2].y );
        // console.log( "4---" + cornerPoints[3].x + ":" + cornerPoints[3].y );
        
        var r = parent.rotation;
        for( var i = 0; i < cornerPoints.length; i++ ) {
            var vx = cornerPoints[i].x - parent.x;
            var vy = cornerPoints[i].y - parent.y;
            cornerPoints[i].x = parent.x + Math.floor( vx * Math.cos( r ) - vy * Math.sin( r ) );
            cornerPoints[i].y = parent.y + Math.floor( vx * Math.sin( r ) + vy * Math.cos( r ) );
        }
        return cornerPoints;
    }

    // MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    //-----------------------------------------------------------------------------
	// スプライトの存在エリアを初期化します。
	//-----------------------------------------------------------------------------
    var _Sprite_initialize = Sprite.prototype.initialize;
    Sprite.prototype.initialize = function() {
        _Sprite_initialize.apply( this, arguments );
        this._beforeX = this.x;
        this._beforeY = this.y;
        this._afterX = this.x;
        this._afterY = this.y;
        this.setAreaIndex( -1 );
    };

    //-----------------------------------------------------------------------------
	// スプライトの表示更新を行います。
	//-----------------------------------------------------------------------------
    var _Sprite_update = Sprite.prototype.update;
    Sprite.prototype.update = function() {
        this._beforeX = this.x;
        this._beforeY = this.y;
        _Sprite_update.apply( this, arguments );
        this._afterX = this.x;
        this._afterY = this.y;
    };

    //-----------------------------------------------------------------------------
	// スプライトの移動により生成されるベクトルを取得します。
	// このメソッドはSprite_Bulletにより上書きされることを想定しています。
	// フォーマットは下記のような形式となります。
	// 結果 = {
    //    x:
    //    y:
    // }
	//-----------------------------------------------------------------------------
	Sprite.prototype.getMoveVector = function() {
        var before = this.moveBefore();
        var after = this.moveAfter();
        return {
            x: ( after.x - before.x ),
            y: ( after.y - before.y )
        };
    }

    //-----------------------------------------------------------------------------
	// スプライトの直前の移動前の座標を取得します。
	// フォーマットは下記のような形式となります。
	// 結果 = {
    //    x:
    //    y:
    // }
	//-----------------------------------------------------------------------------
	Sprite.prototype.moveBefore = function() {
		return {
            x: this._beforeX,
            y: this._beforeY
        };
    };
    
    //-----------------------------------------------------------------------------
	// スプライトの直前の移動後の座標を取得します。
	// フォーマットは下記のような形式となります。
	// 結果 = {
    //    x:
    //    y:
    // }
	//-----------------------------------------------------------------------------
	Sprite.prototype.moveAfter = function() {
		return {
            x: this._afterX,
            y: this._afterY
        };
    };
    
    //-----------------------------------------------------------------------------
	// スプライトの四隅の座標を取得します。
	// この四隅の座標はスプライトの角度変化を考慮しています。
	// フォーマットは下記のような形式となります。
	// 結果 = [ [座標(左上)], [座標(右上)], [座標(右下)], [座標(左下)] ]
	// 座標 = {
    //    x:
    //    y:
    // }
    //-----------------------------------------------------------------------------]
	Sprite.prototype.getCornerPointsRotated = function() {
        return Rectangle.getCornerPoints( 0, 0, this.width, this.height, this );
	}

	//-----------------------------------------------------------------------------
	// 現在の角度を計算に入れたスプライトの左上の座標を取得します。
	// フォーマットは下記のような形式となります。
	// 座標 = {
    //    x:
    //    y:
    // }
	//-----------------------------------------------------------------------------
	Sprite.prototype.leftTopPoint = function() {
        var cornerPoints = this.getCornerPointsRotated();
        var leftTop = {
            x: 9999,
            y: 9999
        };
        for( var i = 0; i < cornerPoints.length; i++ ) {
            if( leftTop.x > cornerPoints[i].x ) {
                leftTop.x = cornerPoints[i].x;
            }
            if( leftTop.y > cornerPoints[i].y ) {
                leftTop.y = cornerPoints[i].y;
            }
        }
        return leftTop;
	};
	
	//-----------------------------------------------------------------------------
	// 現在の角度を計算に入れたスプライトの右下の座標を取得します。
	// フォーマットは下記のような形式となります。
	// 座標 = {
    //    x:
    //    y:
    // }
	//-----------------------------------------------------------------------------
	Sprite.prototype.rightBottomPoint = function() {
        var cornerPoints = this.getCornerPointsRotated();
        var rightBottom = {
            x: -9999,
            y: -9999
        };
        for( var i = 0; i < cornerPoints.length; i++ ) {
            if( rightBottom.x < cornerPoints[i].x ) {
                rightBottom.x = cornerPoints[i].x;
            }
            if( rightBottom.y < cornerPoints[i].y ) {
                rightBottom.y = cornerPoints[i].y;
            }
        }
        return rightBottom;
    };
    
    //-----------------------------------------------------------------------------
	// スプライトの回転角度を度数法で取得します。
	//-----------------------------------------------------------------------------
	Sprite.prototype.degree = function() {
		return this.rotation;
	};
    
    //-----------------------------------------------------------------------------
	// スプライトの回転角度を度数法で設定します。
	//-----------------------------------------------------------------------------
	Sprite.prototype.setDegree = function( rotation ) {
		this.rotation = rotation;
    };
    
    //-----------------------------------------------------------------------------
	// スプライトの画像ファイル名を取得します。
	//-----------------------------------------------------------------------------
	Sprite.prototype.fileName = function() {
		if( this.bitmap == null ) {
            return "";
        }
        const regexFileName = ".+/(.+?)\.[a-z]+([\?#;].*)?$";
        return this.bitmap.url.match( regexFileName )[1];
    };
    
    //-----------------------------------------------------------------------------
	// スプライトの衝突対象データを取得するキー値を取得します。
	//-----------------------------------------------------------------------------
	Sprite.prototype.collisionKey = function() {
		return this.fileName();
	};
    
    //-----------------------------------------------------------------------------
	// スプライトの衝突判定を行うか否かの前提条件をチェックします。
	//-----------------------------------------------------------------------------
	Sprite.prototype.isCollisionCheckable = function() {
		return true;
	};
    
    //-----------------------------------------------------------------------------
    // ピクチャの衝突判定を行うか否かの下記前提条件をチェックします。
    // ・ピクチャの表示準備ができていること
    // ・表示されていること
	//-----------------------------------------------------------------------------
	Sprite_Picture.prototype.isCollisionCheckable = function() {
		return ( this.picture() && this.visible );
	};
    
    //-----------------------------------------------------------------------------
	// スプライトが空間全体に含まれるか否かの判定を行います
	//-----------------------------------------------------------------------------
	Sprite.prototype.isCollisionAreaAll = function() {
		return false;
	};
    
    //-----------------------------------------------------------------------------
	// スプライトを管理する配列上のインデックス値を取得します。
	//-----------------------------------------------------------------------------
	Sprite.prototype.index = function() {
        return this.parent.getChildIndex( this );
    };
    
    //-----------------------------------------------------------------------------
	// ピクチャスプライトのインデックス値としてピクチャID取得します。
	//-----------------------------------------------------------------------------
	Sprite_Picture.prototype.index = function() {
        return this._pictureId;
	};
    
    //-----------------------------------------------------------------------------
	// スプライトの存在エリアのインデックス値を取得します。
	//-----------------------------------------------------------------------------
	Sprite.prototype.areaIndex = function() {
        if( this._areaIndex == null ) {
            this._areaIndex = -1;
        }
		return this._areaIndex;
	};
	
    //-----------------------------------------------------------------------------
	// スプライトの存在エリアのインデックス値を設定します。
	//-----------------------------------------------------------------------------
	Sprite.prototype.setAreaIndex = function( areaIndex ) {
		this._areaIndex = areaIndex;
    };
    // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

    // MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
	//-----------------------------------------------------------------------------
	// Game_Temp.initialize()
	//
	// CollisionManagerを初期化し、
	// プラグインパラメータとして登録された当たり判定情報をCollisionManagerに登録します。
	//-----------------------------------------------------------------------------
	var _Game_Temp_initialize = Game_Temp.prototype.initialize;
	Game_Temp.prototype.initialize = function() {
		_Game_Temp_initialize.apply( this, arguments );
		this.collisionManager = new CollisionManager();
	};
	// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

    // MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    //-----------------------------------------------------------------------------
    // Map更新時、CollisionManagerにて下記処理を実行します。
    // １：対象スプライトの存在エリア更新
    // ２：対象スプライトの当たり判定
    // ３：対象スプライトの無敵状態更新
	//-----------------------------------------------------------------------------
    var _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function() {
        _Game_Map_update.apply( this, arguments );
        if( $gameTemp.collisionManager.isCheckStart() ) {
            $gameTemp.collisionManager.update();
            $gameTemp.collisionManager.check();
            $gameTemp.collisionManager.refreshInvincible();
        }
    };
    // WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
    // MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    // --------------------------------------------------
	// Spriteset_Base.createUpperLayer()
	//
	// ピクチャレイヤーを当たり判定対象に追加します。
	// --------------------------------------------------
	var _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
	Spriteset_Base.prototype.createUpperLayer = function() {
		_Spriteset_Base_createUpperLayer.apply( this, arguments );
        $gameTemp.collisionManager.addCheckTargets( this._pictureContainer.children );
	};
	// WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
})();