//=============================================================================
// MPP_MessageEX.js
//=============================================================================
// Copyright (c) 2019 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.2.3】文章表示の機能を拡張したり表示の演出を追加します。
 * @author 木星ペンギン
 * @help [文章の表示]の制御文字:
 *   \sp[n]        # 文章の表示速度(秒間描写文字数n) / 0で瞬間表示
 *   \at[n]        # アニメーションタイプをn番に変更(※1)
 *   \set[n]       # 設定した文字列に変換(※2)
 *   \co[s]        # 文字列sを１文字として表示
 *   \rb[s,r]      # 文字列sにルビrを付けて表示(※3)
 *   \px[n]        # 次に表示する文字のX座標をnピクセルずらす
 *   \py[n]        # 次に表示する文字のY座標をnピクセルずらす
 *   \tx[n]        # 次に表示する文字のX座標をnに変更
 *   \ty[n]        # 次に表示する文字のY座標をnに変更
 *   \sw[n]        # スイッチn番をONにする
 *   \se[n]        # 文字SEをn番に変更 / 0でSEなし
 *   \sn[n]        # スキルID n 番の名前に置き換える
 *   \sin[n]       # スキルID n 番のアイコンと名前に置き換える
 *   \in[n]        # アイテムID n 番の名前に置き換える
 *   \iin[n]       # アイテムID n 番のアイコンと名前に置き換える
 *   \wn[n]        # 武器ID n 番の名前に置き換える
 *   \win[n]       # 武器ID n 番のアイコンと名前に置き換える
 *   \an[n]        # 防具ID n 番の名前に置き換える
 *   \ain[n]       # 防具ID n 番のアイコンと名前に置き換える
 *   \we           # イベントの演出が終了するまでウェイト(※4)
 *   
 *   \c[r,g,b]     # 文字色をRGBで指定
 *   \fs[n]        # 文字サイズをnに変更 / デフォルト値は28
 *   \op[n]        # 文字の不透明度(0～255) / デフォルト値は255
 *   \oc[n]        # 文字の縁の色をn番に変更 / 0でデフォルト(黒)
 *   \oc[r,g,b]    # 文字の縁の色をRGBで指定
 *   \oc[r,g,b,a]  # 文字の縁の色をRGBAで指定(※5)
 *   \ow[n]        # 文字の縁の太さを変更 / デフォルト値は4
 *   \rc[n]        # ルビの色をn番に変更 / 0でデフォルト
 *   \rc[r,g,b]    # ルビの色をRGBで指定
 *   \rs[n]        # ルビの文字サイズをnに変更
 *   \rw[n]        # ルビの縁の太さを変更 / デフォルト値は4
 *   
 *   \df           # 文章表示の設定をデフォルト値に戻す(※6)
 *   \sv           # 現在の文章表示の設定を記憶(※6)
 *   \ld           # \svで記憶した設定の呼び出し(※6)
 *
 *  以下は文章内に含まれていた場合に適用
 *   \a            # 決定キーやシフトキーによる瞬間表示の禁止
 *   \nw[s]        # 文字列sを名前ウィンドウに表示
 *   \nc[n]        # 名前ウィンドウの文字色をn番に変更
 *   \fr           # 顔グラフィックを右側に表示
 *   \fm           # 顔グラフィックを左右反転
 *   \fw[n]        # 顔グラフィックを別ウィンドウでnフレームかけて表示(※7)
 *   \es           # イベントの演出のスキップを一時的に有効にする(※8)
 *  
 *  すべての制御文字は大文字小文字どちらでも可能
 * 
 * プラグインコマンド:
 *   SetMesRow n                  # メッセージウィンドウの表示行数を変更
 *   SetMesFadeOut n s            # フェードアウトタイプを変更
 *   SetMesCharSe n               # 文字SEをn番に変更
 *   SetEffectSkip true/false     # イベントの演出のスキップの有効/無効を変更
 * 
 * プラグインコマンド(オリジナルアニメーション用):
 *   SetCharaAngle n              # 画像の回転角度をn度にする
 *   MoveCharaFrame x y w h d b   # dフレームかけて文字の表示範囲を変更
 * 
 * ================================================================
 * ▼制御文字詳細
 * --------------------------------
 *  ※1: \at[n] (アニメーションタイプをn番に変更)
 *   アニメーションタイプは以下のようになります。
 *    0:アニメーションなし
 *    1:文字が右にスライドしながら浮かび上がる
 *    2:文字が横に広がりながら表示される
 *    3:文字が拡大しながら表示される
 *    4:文字を左側から表示する(表示速度6推奨)
 *   
 *   5番以降はプラグインパラメータ[Anime Commons]で読み込むコモンイベントを
 *   指定してください。
 *  
 * --------------------------------
 *  ※2: \set[n] (設定した文字列に変換)
 *   プラグインパラメータ[Text Set]で指定した文字列に変換します。
 *   制御文字も設定可能です。
 *  
 * --------------------------------
 *  ※3: \rb[s,r] (文字列sにルビrを付けて表示)
 *   ルビを振った文字列は一文字ずつではなくまとめて表示されます。
 * 
 * --------------------------------
 *  ※4: \we (演出が終了するまでウェイト)
 *   プラグインパラメータ[Wait Effects]で設定したイベントの演出が終了するまで
 *   ウェイトを行います。
 *   
 *   文章のスキップを行ってもウェイトがかかります。
 * 
 * --------------------------------
 *  ※5: \oc[r,g,b,a] (文字の縁の色をRGBAで指定)
 *   アルファ値(a)は0.0～1.0で指定してください。
 * 
 * --------------------------------
 *  ※6: \df, \sv, \ld (文章表示の設定を初期化/保存/呼び出し)
 *   プラグインパラメータ[Text Informations]で対象となる情報を指定してください。
 * 
 * --------------------------------
 *  ※7: \fw[n] (顔グラフィックを別ウィンドウでnフレームかけて表示)
 *   顔グラフィックウィンドウはメッセージウィンドウの上もしくは下に表示されます。
 *   表示にかかる時間は、画面の外側から内側へ移動するまでの時間です。
 *  
 * --------------------------------
 *  ※8: \es (イベントの演出のスキップを一時的に有効にする)
 *   詳細はプラグインコマンドの SetEffectSkip を参照。
 * 
 * 
 * ================================================================
 * ▼オリジナルアニメーションの作成
 * --------------------------------
 *  アニメーションタイプ5番以降はコモンイベントを読み込むことで作成できます。
 *  
 *  コモンイベントに設定された[ピクチャの表示][ピクチャの移動][ピクチャの回転]
 *  [ピクチャの色調変更][ウェイト][プラグインコマンド]を読み込み、
 *  設定された数値でアニメーションが作成されます。
 *  
 *  ※注意点
 *   ・ピクチャ番号と画像名は無視されます。
 *   ・[変数で指定]は使用できません。
 *   ・[合成方法]は通常で固定されてます。
 *   ・基準となる座標はX:0,Y:0です。原点は関係ありません。
 *   ・アニメーションが終了した時点で通常の描写がされます。
 *   ・最終的な座標や拡大率、回転角度などはすべて無視されます。
 * 
 * 
 * ================================================================
 * ▼プラグインコマンド詳細
 * --------------------------------
 *  〇 SetMesRow n
 *      n : メッセージウィンドウの行数
 *  
 *   メッセージウィンドウの表示行数をn行に変更します。
 *    
 * --------------------------------
 *  〇 SetMesFadeOut n s
 *      n : フェードアウトのタイプ
 *      s : フェードアウトにかける時間
 *  
 *   フェードアウトのタイプを変更します。
 *   
 *   指定するタイプは以下のようになっています。
 *    0:なし(瞬時に消える)
 *    1:徐々に消える
 *    2:上にスクロール
 * 
 *    時間はフレーム数ではありません。
 *    タイプによって時間が変わります。
 * 
 * --------------------------------
 *  〇 SetMesCharSe n
 *      n : 文字SEの番号
 *  
 *   鳴らす文字SEをn番に変更します。
 *   0で無音、1以上でプラグインパラメータにて設定したSEが適用されます。
 *   
 *   制御文字\seは一時的なものですが、こちらはデフォルト値の変更です。
 * 
 * --------------------------------
 *  〇 SetEffectSkip bool
 *      bool : trueで有効, falseで無効
 *  
 *   文章のスキップを行った際、演出のスキップをするかどうかを変更できます。
 *   初期設定は無効です。
 *   
 *   スキップする演出はプラグインパラメータ[Skip Effects]にて設定できます。
 *   プラグインコマンドからの個別の設定変更はできません。
 *   
 *   制御文字\esは一時的なものですが、こちらはコマンド実行後全ての文章の表示に
 *   適用されます。
 * 
 * --------------------------------
 *  〇 SetCharaAngle n
 *      n : 角度
 *  
 *   画像の回転角度をn度にします。
 *    
 * --------------------------------
 *  〇 MoveCharaFrame x y w h d b
 *      x,y,w,h : 表示範囲
 *      d       : 変化までのフレーム数
 *      b       : [完了するまでウェイト]するかどうか
 *  
 *   文字の表示範囲を変更します。
 *   
 *   表示範囲は画像の左端をX0.0、右端をX1.0、上端をY0.0、下端をY1.0とし、
 *   xは左、yは上、wは右、hは下の位置を指定します。
 *   
 *   bの[完了するまでウェイト]はtrueを入れると有効になります。
 *   未設定の場合はfalseとなります。
 * 
 * 
 * ================================================================
 * ▼プラグインパラメータ詳細
 * --------------------------------
 *  〇 Skip Effects (文章のスキップをした際、同時にスキップを行う演出)
 *  
 *   有効となっている演出が終了するまでマップの更新を行います。
 *   メイン処理全てを更新するので、有効となっていない演出も早送りされます。
 *   
 *   この処理はプラグインコマンド[SetEffectSkip]にて有効に設定する、
 *   または制御文字\esを使用することで機能します。
 *  
 * --------------------------------
 *  〇 Plugin Commands (プラグインコマンド名)
 * 
 *   プラグインコマンド名を変更できます。
 *   コマンドを短くしたり日本語化等が可能です。
 *   
 *   コマンド名を変更しても、デフォルトのコマンドは使用できます。
 * 
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param Anime Commons
 * @type common_event[]
 * @desc オリジナルアニメーションとして読み込むコモンイベントIDの配列
 * (上から \at[5],\at[6]... となります)
 * @default []
 *
 * @param Text Set
 * @type string[]
 * @desc \setにて呼び出す文字列のセットの配列
 * (上から \set[1],\set[2]... となります)
 * @default []
 *
 * @param Text Informations
 * @type struct<Informations>
 * @desc \df,\sv,\ldを実行した際に操作する情報
 * @default {"Speed":"true","Anime Type":"true","Text Color":"true","Text Size":"true","Text Opacity":"true","Outline Color":"true","Outline Width":"true","Ruby Color":"true","Ruby Size":"true","Ruby Width":"true"}
 *
 * @param Wait Effects
 * @type struct<WaitEffects>
 * @desc \we実行時に終了待ちをする演出
 * @default {"Scroll Map":"true","Set Movement Route":"true","Show Animation":"true","Show Balloon Icon":"true","Move Picture":"true","Tint Picture":"true","Tint Screen":"true","Flash Screen":"true","Shake Screen":"false","Set Weather Effect":"false","Fadeout BGM":"false","Fadeout BGS":"false","Play ME":"false"}
 *
 * @param Skip Effects
 * @type struct<SkipEffects>
 * @desc 文章のスキップをした際、同時にスキップを行う演出
 * @default {"Scroll Map":"true","Set Movement Route":"true","Move Picture":"true","Tint Picture":"true","Tint Screen":"false","Flash Screen":"false","Shake Screen":"false","Set Weather Effect":"false"}
 *
 * @param Skip Effects Timing
 * @type number
 * @max 1
 * @desc 演出スキップを行うタイミング
 * (0:スキップ時, 1:文章の表示終了時)
 * @default 0
 * @parent Skip Effects
 *
 *
 * @param === Char SE ===
 * 
 * @param Character SEs
 * @type struct<SE>[]
 * @desc 文字を表示する際に鳴らすSEの配列
 * @default []
 * @parent === Char SE ===
 * 
 * @param Char SE Interval
 * @type number
 * @min 1
 * @desc 文字を表示する際にSEを鳴らす間隔
 * @default 4
 * @parent === Char SE ===
 * 
 * @param Stop SE When Skip
 * @type boolean
 * @desc スキップしたときにSEの停止を行うかどうか
 * @default true
 * @parent === Char SE ===
 * 
 *
 * @param === Default ===
 * 
 * @param Default Message Row
 * @type number
 * @min 1
 * @desc [メッセージウィンドウの表示行数]のデフォルト値
 * @default 4
 * @parent === Default ===
 *
 * @param Default FadeOut Type
 * @type number
 * @max 2
 * @desc [フェードアウトタイプ]のデフォルト値
 * @default 0
 * @parent === Default ===
 *
 * @param Default FadeOut Speed
 * @type number
 * @desc [フェードアウト速度]のデフォルト値
 * @default 5
 * @parent === Default ===
 *
 * @param Default Speed
 * @type number
 * @desc [文章の表示速度]のデフォルト値
 * @default 60
 * @parent === Default ===
 *
 * @param Default Anime Type
 * @type number
 * @desc [アニメーションタイプ]のデフォルト値
 * @default 1
 * @parent === Default ===
 *
 * @param Default Ruby Color
 * @desc [ルビの色]のデフォルト値(RGBで指定)
 * @default 255,255,255
 * @parent === Default ===
 *
 * @param Default Ruby Size
 * @type number
 * @desc [ルビの文字サイズ]のデフォルト値
 * @default 14
 * @parent === Default ===
 *
 * @param Default Ruby Outline
 * @type number
 * @desc [ルビの縁の太さ]のデフォルト値
 * @default 2
 * @parent === Default ===
 *
 * @param Default Char SE Index
 * @type number
 * @desc [文字SE]のデフォルト値
 * @default 0
 * @parent === Default ===
 *
 *
 * @param === Window ===
 * 
 * @param Name Window
 * @type struct<NameWindow>
 * @desc 名前ウィンドウのパラメータ
 * @default {"x":"0","y":"-56","Windowskin":"Window","Default Color":"0"}
 * @parent === Window ===
 * 
 * @param Face Window
 * @type struct<FaceWindow>
 * @desc 顔グラフィックウィンドウのパラメータ
 * @default {"Padding X":"0","Padding Y":"0","Windowskin":"Window"}
 * @parent === Window ===
 * 
 * 
 * @param === Command ===
 * 
 * @param Plugin Commands
 * @type struct<Plugin>
 * @desc プラグインコマンド名
 * @default {"SetMesRow":"SetMesRow","SetMesFadeOut":"SetMesFadeOut","SetMesCharSe":"SetMesCharSe","SetEffectSkip":"SetEffectSkip","SetCharaAngle":"SetCharaAngle","MoveCharaFrame":"MoveCharaFrame"}
 * @parent === Command ===
 * 
 */

/*~struct~Informations:
 * @param Speed
 * @type boolean
 * @desc 文章の表示速度
 *
 * @param Anime Type
 * @type boolean
 * @desc アニメーションタイプ
 *
 * @param Text Color
 * @type boolean
 * @desc 文字色
 *
 * @param Text Size
 * @type boolean
 * @desc 文字サイズ
 *
 * @param Text Opacity
 * @type boolean
 * @desc 文字の不透明度
 *
 * @param Outline Color
 * @type boolean
 * @desc 文字の縁の色
 * @default true
 *
 * @param Outline Width
 * @type boolean
 * @desc 文字の縁の太さ
 *
 * @param Ruby Color
 * @type boolean
 * @desc ルビの色
 *
 * @param Ruby Size
 * @type boolean
 * @desc ルビの文字サイズ
 *
 * @param Ruby Width
 * @type boolean
 * @desc ルビの縁の太さ
 */

/*~struct~WaitEffects:
 * @param Scroll Map
 * @type boolean
 * @desc [マップのスクロール]
 *
 * @param Set Movement Route
 * @type boolean
 * @desc [移動ルートの設定]
 * ([動作を繰り返す]は除く)
 *
 * @param Show Animation
 * @type boolean
 * @desc [アニメーションの表示]
 *
 * @param Show Balloon Icon
 * @type boolean
 * @desc [フキダシアイコンの表示]
 *
 * @param Move Picture
 * @type boolean
 * @desc [ピクチャの移動]
 *
 * @param Tint Picture
 * @type boolean
 * @desc [ピクチャの色調変更]
 *
 * @param Tint Screen
 * @type boolean
 * @desc [画面の色調変更]
 *
 * @param Flash Screen
 * @type boolean
 * @desc [画面のフラッシュ]
 *
 * @param Shake Screen
 * @type boolean
 * @desc [画面のシェイク]
 *
 * @param Set Weather Effect
 * @type boolean
 * @desc [天候の設定]
 * 
 * @param Fadeout BGM
 * @type boolean
 * @desc [BGMのフェードアウト]
 *
 * @param Fadeout BGS
 * @type boolean
 * @desc [BGSのフェードアウト]
 *
 * @param Play ME
 * @type boolean
 * @desc [MEの演奏]
 *
 *
 */

/*~struct~SkipEffects:
 * @param Scroll Map
 * @type boolean
 * @desc [マップのスクロール]
 *
 * @param Set Movement Route
 * @type boolean
 * @desc [移動ルートの設定]
 * ([動作を繰り返す]は除く)
 *
 * @param Move Picture
 * @type boolean
 * @desc [ピクチャの移動]
 *
 * @param Tint Picture
 * @type boolean
 * @desc [ピクチャの色調変更]
 *
 * @param Tint Screen
 * @type boolean
 * @desc [画面の色調変更]
 *
 * @param Flash Screen
 * @type boolean
 * @desc [画面のフラッシュ]
 *
 * @param Shake Screen
 * @type boolean
 * @desc [画面のシェイク]
 *
 * @param Set Weather Effect
 * @type boolean
 * @desc [天候の設定]
 * 
 *
 */

/*~struct~NameWindow:
 * @param x
 * @type number
 * @min -3000
 * @desc X座標
 * @default 0
 *
 * @param y
 * @type number
 * @min -3000
 * @desc Y座標
 * @default -56
 *
 * @param Windowskin
 * @type file
 * @require 1
 * @dir img/system
 * @desc ウィンドウのウィンドウスキン名
 * @default Window
 *
 * @param Default Color
 * @type number
 * @desc 文字色のデフォルト値(番号で指定)
 * @default 0
 */

/*~struct~FaceWindow:
 * @param Padding X
 * @type number
 * @desc X軸の余白
 * @default 0
 *
 * @param Padding Y
 * @type number
 * @desc Y軸の余白
 * @default 0
 *
 * @param Windowskin
 * @type file
 * @require 1
 * @dir img/system
 * @desc ウィンドウのウィンドウスキン名
 * @default Window
 */

/*~struct~SE:
 * @param Name
 * @desc ファイル名
 * @default 
 * @require 1
 * @dir audio/se
 * @type file
 *
 * @param Volume
 * @type number
 * @max 100
 * @desc 音量
 * @default 90
 *
 * @param Pitch
 * @type number
 * @min 50
 * @max 150
 * @desc ピッチ
 * @default 100
 *
 * @param Pan
 * @type number
 * @min -100
 * @max 100
 * @desc 位相
 * @default 0
 *
 */

/*~struct~Plugin:
 * @param SetMesRow
 * @desc メッセージウィンドウの表示行数を変更
 * @default SetMesRow
 * 
 * @param SetMesFadeOut
 * @desc フェードアウトタイプを変更
 * @default SetMesFadeOut
 * 
 * @param SetMesCharSe
 * @desc 文字SEをn番に変更
 * @default SetMesCharSe
 * 
 * @param SetEffectSkip
 * @desc イベントの演出のスキップの有効/無効を変更
 * @default SetEffectSkip
 * 
 * @param SetCharaAngle
 * @desc 画像の回転角度をn度にする
 * @default SetCharaAngle
 * 
 * @param MoveCharaFrame
 * @desc dフレームかけて文字の表示範囲を変更
 * @default MoveCharaFrame
 * 
 */

(function() {

var MPPlugin = {};

(function() {
    
    MPPlugin.contains = {};
    MPPlugin.contains['Patch'] = $plugins.some(function(plugin) {
        return (plugin.name === 'MPP_Patch' && plugin.status);
    });
    
    var parameters = PluginManager.parameters('MPP_MessageEX');
    
    var paramRevive = function(key, value) {
        try {
            return eval(value);
        } catch (e) {
            return value;
        }
    };
    
    MPPlugin.animeCommons = JSON.parse(parameters['Anime Commons'] || "[]");
    MPPlugin.textSet = JSON.parse(parameters['Text Set'] || "[]");
    MPPlugin.textInformations = JSON.parse(parameters['Text Informations'] || "{}", paramRevive);
    MPPlugin.WaitEffects = JSON.parse(parameters['Wait Effects'] || "[]", paramRevive);
    MPPlugin.SkipEffects = JSON.parse(parameters['Skip Effects'] || "[]", paramRevive);
    MPPlugin.SkipEffectsTiming = Number(parameters['Skip Effects Timing'] || "0");
    
    // === Char SE ===
    var charSEs = JSON.parse(parameters['Character SEs'] || "[]");
    for (var i = 0; i < charSEs.length; i++) {
        var se = JSON.parse(charSEs[i]);
        if (se) {
            charSEs[i] = {
                name:se.Name || "",
                volume:Number(se.Volume || 90),
                pitch:Number(se.Pitch || 100),
                pan:Number(se.Pan || 0)
            };
        }
    }
    MPPlugin.CharacterSEs = charSEs;
    MPPlugin.CharSeInterval = Number(parameters['Char SE Interval'] || 3);
    MPPlugin.StopSeWhenSkip = !!eval(parameters['Stop SE When Skip']);
    
    // === Default ===
    MPPlugin.defaultMessageRow = Number(parameters['Default Message Row']);
    MPPlugin.defaultFadeOutType = Number(parameters['Default FadeOut Type']);
    MPPlugin.defaultFadeOutSpeed = Number(parameters['Default FadeOut Speed']);
    MPPlugin.defaultSpeed = Number(parameters['Default Speed']);
    MPPlugin.defaultAnimeType = Number(parameters['Default Anime Type']);
    MPPlugin.defaultRubyColor = 'rgb(%1)'.format(parameters['Default Ruby Color'] || '255,255,255');
    MPPlugin.defaultRubySize = Number(parameters['Default Ruby Size'] || 14);
    MPPlugin.defaultRubyOutline = Number(parameters['Default Ruby Outline']);
    MPPlugin.DefaultCharSeIndex = Number(parameters['Default Char SE Index'] || 1);
    
    var paramReviveNumber = function(key, value) {
        if (/^\-?\d+$/.test(value)){
            return Number(value);
        } else {
            return value;
        }
    };
    
    MPPlugin.nameWindow = JSON.parse(parameters['Name Window'] || "{}", paramReviveNumber);
    MPPlugin.faceWindow = JSON.parse(parameters['Face Window'] || "{}", paramReviveNumber);
    
    // === Command ===
    MPPlugin.PluginCommands = JSON.parse(parameters['Plugin Commands']);
    
    // MPP_Patch.js
    if (MPPlugin.contains['Patch']) {
        parameters = PluginManager.parameters('MPP_Patch');
        MPPlugin.Patch6 = !!eval(parameters['Patch6 enabled?']);
    } else {
        MPPlugin.Patch6 = false;
    }
    
    
    
})();


var Alias = {};

var TextAnimation = [];

//-----------------------------------------------------------------------------
// WebAudio

WebAudio.prototype.realVolume = function() {
    if (this._gainNode) {
        return this._gainNode.gain.value;
    } else {
        return 0;
    }
};

//-----------------------------------------------------------------------------
// Html5Audio

Html5Audio.realVolume = function() {
    if (this._audioElement) {
        return this._audioElement.volume;
    } else {
        return 0;
    }
};

//-----------------------------------------------------------------------------
// AudioManager

AudioManager.isBgmFadeOuting = function() {
    return (this._bgmBuffer && !this._currentBgm && this._bgmBuffer.realVolume() > 0);
};

AudioManager.isBgsFadeOuting = function() {
    return (this._bgsBuffer && !this._currentBgs && this._bgsBuffer.realVolume() > 0);
};

AudioManager.isMePlaying = function() {
    return (this._meBuffer && this._meBuffer.isPlaying());
};

//-----------------------------------------------------------------------------
// Game_Character

Game_Character.prototype.isMoveRouteForcingNr = function() {
    return this.isMoveRouteForcing() && !this._moveRoute.repeat;
};

//-----------------------------------------------------------------------------
// Game_Map

Game_Map.prototype.isAnyMoveRouteForcingNr = function() {
    var events = this.events();
    for (var i = 0; i < events.length; i++) {
        if (events[i].isMoveRouteForcingNr()) return true;
    }
    return $gamePlayer.isMoveRouteForcingNr();
};

Game_Map.prototype.isAnyAnimationPlaying = function() {
    var events = this.events();
    for (var i = 0; i < events.length; i++) {
        if (events[i].isAnimationPlaying()) return true;
    }
    return $gamePlayer.isAnimationPlaying();
};

Game_Map.prototype.isAnyBalloonPlaying = function() {
    var events = this.events();
    for (var i = 0; i < events.length; i++) {
        if (events[i].isBalloonPlaying()) return true;
    }
    return $gamePlayer.isBalloonPlaying();
};

//-----------------------------------------------------------------------------
// Game_Screen

Game_Screen.prototype.isAnyPictureMoving = function() {
    return this._pictures.some(function(picture) {
        return picture && picture.isMoving();
    });
};

Game_Screen.prototype.isAnyPictureTinting = function() {
    return this._pictures.some(function(picture) {
        return picture && picture.isTinting();
    });
};

Game_Screen.prototype.isTinting = function() {
    return this._toneDuration > 0;
};

Game_Screen.prototype.isFlashing = function() {
    return this._flashDuration > 0;
};

Game_Screen.prototype.isShaking = function() {
    return this._shakeDuration > 0;
};

Game_Screen.prototype.isWeatherChanging = function() {
    return this._weatherDuration > 0;
};

//-----------------------------------------------------------------------------
// Game_Picture

Game_Picture.prototype.isMoving = function() {
    return this._duration > 0;
};

Game_Picture.prototype.isTinting = function() {
    return this._toneDuration > 0;
};

//-----------------------------------------------------------------------------
// Game_Message

//11
Alias.GaMe_initialize = Game_Message.prototype.initialize;
Game_Message.prototype.initialize = function() {
    Alias.GaMe_initialize.apply(this, arguments);
    this._messageRow = MPPlugin.defaultMessageRow;
    this._fadeOutType = MPPlugin.defaultFadeOutType;
    this._fadeOutSpeed = MPPlugin.defaultFadeOutSpeed;
    this.charSeIndex = MPPlugin.DefaultCharSeIndex;
    this.effectSkip = false;
};

//-----------------------------------------------------------------------------
// Game_Interpreter

//1722
Alias.GaIn_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Alias.GaIn_pluginCommand.call(this, command, args);
    switch (command) {
        case MPPlugin.PluginCommands.SetMesRow:
        case 'SetMesRow':
            $gameMessage._messageRow = Math.max(Number(args[0]), 1);
            break;
        case MPPlugin.PluginCommands.SetMesFadeOut:
        case 'SetMesFadeOut':
            $gameMessage._fadeOutType = Number(args[0]);
            $gameMessage._fadeOutSpeed = Number(args[1]);
            break;
        case MPPlugin.PluginCommands.SetMesCharSe:
        case 'SetMesCharSe':
            $gameMessage.charSeIndex = Number(args[0]);
            break;
        case MPPlugin.PluginCommands.SetEffectSkip:
        case 'SetEffectSkip':
            $gameMessage.effectSkip = !!eval(args[0]);
            break;
    }
};

//-----------------------------------------------------------------------------
// Sprite_TextCharacter

function Sprite_TextCharacter() {
    this.initialize.apply(this, arguments);
}

Sprite_TextCharacter.prototype = Object.create(Sprite.prototype);
Sprite_TextCharacter.prototype.constructor = Sprite_TextCharacter;

Sprite_TextCharacter.prototype.initialize = function(bitmap, x, y, rect, list) {
    Sprite.prototype.initialize.call(this);
    this.bitmap = bitmap;
    this._baseX = x;
    this._baseY = y;
    this._rect = rect;
    this._list = list;
    this._index = -1;
    this._waitCount = 0;
    this.initBasic();
    this.initTarget();
    this.initTone();
    this.initRotation();
    this.initFrame();
    this.update();
};

Sprite_TextCharacter.prototype.initBasic = function() {
    this._origin = 0;
    this._offsetX = 0;
    this._offsetY = 0;
};

Sprite_TextCharacter.prototype.initTarget = function() {
    this._targetX = this._baseX;
    this._targetY = this._baseY;
    this._targetScaleX = 1;
    this._targetScaleY = 1;
    this._targetOpacity = 255;
    this._moveDuration = 0;
};

Sprite_TextCharacter.prototype.initTone = function() {
    this._tone = null;
    this._toneTarget = null;
    this._toneDuration = 0;
};

Sprite_TextCharacter.prototype.initRotation = function() {
    this._angle = 0;
    this._rotationSpeed = 0;
};

Sprite_TextCharacter.prototype.initFrame = function() {
    var bitmap = this._bitmap;
    if (bitmap) {
        this.setFrame(0, 0, bitmap.width, bitmap.height);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
    this._frame2 = null;
    this._frame2Target = null;
    this._frame2Duration = 0;
};

Sprite_TextCharacter.prototype.isPlaying = function() {
    return !!this._list;
};

Sprite_TextCharacter.prototype.drawX = function() {
    return this._baseX - this._rect.x;
};

Sprite_TextCharacter.prototype.drawY = function() {
    return this._baseY - this._rect.y;
};

Sprite_TextCharacter.prototype.show = function(cmd) {
    this._origin = cmd.origin;
    this._offsetX = cmd.x;
    this._offsetY = cmd.y;
    this.scale.x = cmd.sx / 100;
    this.scale.y = cmd.sy / 100;
    this.opacity = cmd.o;
    this.initTarget();
    this.initTone();
    this.initRotation();
    this.initFrame();
};

Sprite_TextCharacter.prototype.move = function(cmd) {
    this._origin = cmd.origin;
    this._targetX = cmd.x;
    this._targetY = cmd.y;
    this._targetScaleX = cmd.sx / 100;
    this._targetScaleY = cmd.sy / 100;
    this._targetOpacity = cmd.o;
    this._moveDuration = cmd.d;
    if (cmd.wait) this.wait(this._moveDuration);
};

Sprite_TextCharacter.prototype.rotate = function(cmd) {
    this._rotationSpeed = cmd.r;
};

Sprite_TextCharacter.prototype.tint = function(cmd) {
    if (!this._tone) {
        this._tone = [0, 0, 0, 0];
    }
    this._toneTarget = cmd.t.clone();
    this._toneDuration = cmd.d;
    if (this._toneDuration === 0) {
        this._tone = this._toneTarget.clone();
        this.setColorTone(this._tone);
    }
    if (cmd.wait) this.wait(this._toneDuration);
};

Sprite_TextCharacter.prototype.frame = function(cmd) {
    if (!this._frame2) {
        this._frame2 = [0, 0, 1, 1];
    }
    this._frame2Target = [cmd.x, cmd.y, cmd.w, cmd.h];
    this._frame2Duration = cmd.d;
    if (this._frame2Duration === 0) {
        this._frame2 = this._frame2Target.clone();
        this.setFrame2();
    }
    if (cmd.wait) this.wait(this._frame2Duration);
};

Sprite_TextCharacter.prototype.wait = function(count) {
    this._waitCount = count;
};

Sprite_TextCharacter.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (!this.isPlaying() || !this.updateCommand()) return;
    this.updateMove();
    this.updateTone();
    this.updateRotation();
    this.updateFrame();
};

Sprite_TextCharacter.prototype.updateCommand = function() {
    for (;;) {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        this._index++;
        var cmd = this._list[this._index];
        if (cmd) {
            switch (cmd.code) {
                case 0:
                    this.show(cmd);
                    break;
                case 1:
                    this.move(cmd);
                    break;
                case 2:
                    this.rotate(cmd);
                    break;
                case 3:
                    this.tint(cmd);
                    break;
                case 4:
                    this._angle = cmd.a;
                    break;
                case 5:
                    this.frame(cmd);
                    break;
                case 6:
                    this.wait(cmd.d);
                    break;
            }
        } else {
            this._list = null;
            this.visible = false;
            return false;
        }
    }
};

Sprite_TextCharacter.prototype.updateMove = function() {
    if (this._moveDuration > 0) {
        var d = this._moveDuration;
        this._offsetX = (this._offsetX * (d - 1) + this._targetX) / d;
        this._offsetY = (this._offsetY * (d - 1) + this._targetY) / d;
        this.scale.x  = (this.scale.x  * (d - 1) + this._targetScaleX)  / d;
        this.scale.y  = (this.scale.y  * (d - 1) + this._targetScaleY)  / d;
        this.opacity  = (this.opacity  * (d - 1) + this._targetOpacity) / d;
        this._moveDuration--;
    }
    this.x = this._baseX + this._offsetX;
    this.y = this._baseY + this._offsetY;
    if (this._origin === 1) {
        this.x += this._rect.width / 2;
        this.y += this._rect.height / 2;
    }
};

Sprite_TextCharacter.prototype.updateTone = function() {
    if (this._toneDuration > 0) {
        var d = this._toneDuration;
        for (var i = 0; i < 4; i++) {
            this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
        }
        this._toneDuration--;
    }
    if (this._tone) this.setColorTone(this._tone);
};

Sprite_TextCharacter.prototype.updateRotation = function() {
    if (this._rotationSpeed !== 0) {
        this._angle += this._rotationSpeed / 2;
    }
    this.rotation = this._angle * Math.PI / 180;
};

Sprite_TextCharacter.prototype.updateFrame = function() {
    if (this._frame2Duration > 0) {
        var d = this._frame2Duration;
        for (var i = 0; i < 4; i++) {
            this._frame2[i] = (this._frame2[i] * (d - 1) + this._frame2Target[i]) / d;
        }
        this._frame2Duration--;
    }
    this.setFrame2();
};

Sprite_TextCharacter.prototype.setFrame2 = function() {
    if (this.bitmap && this._frame2) {
        var bw = this.bitmap.width;
        var bh = this.bitmap.height;
        var fx = Math.floor(bw * this._frame2[0]);
        var fy = Math.floor(bh * this._frame2[1]);
        var fw = Math.ceil(bw * this._frame2[2]);
        var fh = Math.ceil(bh * this._frame2[3]);
        this.setFrame(fx, fy, fw, fh);
    }
    var ox = this._rect.x;
    var oy = this._rect.y;
    if (this._origin === 1) {
        ox += this._rect.width / 2;
        oy += this._rect.height / 2;
    }
    this.anchor.x = ox / this.width;
    this.anchor.y = oy / this.height;
};

//-----------------------------------------------------------------------------
// Window_Message

//274
Alias.WiBa_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = Alias.WiBa_convertEscapeCharacters.apply(this, arguments);
    text = text.replace(/\x1bSET\[(\d+)\]/gi, function() {
        var index = parseInt(arguments[1] || 0);
        var setText = index > 0 ? MPPlugin.textSet[index - 1] : null;
        return setText ? this.convertEscapeCharacters(setText) : '';
    }.bind(this));
    text = text.replace(/\x1b([SIWA])(I?)N\[(\d+)\]/gi, function() {
        return this.mppConvertItemName(arguments[1], !!arguments[2], parseInt(arguments[3]));
    }.bind(this));
    return text;
};

Window_Base.prototype.mppConvertItemName = function(type, icon, itemId) {
    var text = '';
    var item;
    switch (type.toUpperCase()) {
        case 'S':
            item = $dataSkills[itemId];
            break;
        case 'I':
            item = $dataItems[itemId];
            break;
        case 'W':
            item = $dataWeapons[itemId];
            break;
        case 'A':
            item = $dataArmors[itemId];
            break;
    }
    if (item) {
        if (icon)
            text += '\x1bI[' + item.iconIndex + ']';
        text += item.name;
    }
    return text;
};

//-----------------------------------------------------------------------------
// Window_Message

//13
Alias.WiMe_initialize = Window_Message.prototype.initialize;
Window_Message.prototype.initialize = function() {
    this._messageRow = $gameMessage._messageRow;
    this._textInfo = [];
    this._rubyBitmap = new Bitmap();
    Alias.WiMe_initialize.apply(this, arguments);
    this._characterSprite = new Sprite();
    //this._characterSprite.x = this.standardPadding();
    //this._characterSprite.y = this.standardPadding();
    this.addChild(this._characterSprite);
    this.effectHandler = null;
    this._waitEffect = false;
};

if (Window_Message.prototype.hasOwnProperty('resetFontSettings')) {
    Alias.WiMe_resetFontSettings = Window_Message.prototype.resetFontSettings;
}    
Window_Message.prototype.resetFontSettings = function() {
    if (Alias.WiMe_resetFontSettings) {
        Alias.WiMe_resetFontSettings.apply(this, arguments);
    } else {
        Window_Base.prototype.resetFontSettings.apply(this, arguments);
    }
    this.contents.paintOpacity = 255;
    this._paintOpacity = 255;
    this.contents.outlineColor = 'rgba(0, 0, 0, 0.5)';
    this.contents.outlineWidth = 4;
    this._rubyBitmap.textColor = MPPlugin.defaultRubyColor;
    this._rubyBitmap.fontSize = MPPlugin.defaultRubySize;
    this._rubyBitmap.outlineWidth = MPPlugin.defaultRubyOutline;
};

//24
Alias.WiMe_initMembers = Window_Message.prototype.initMembers;
Window_Message.prototype.initMembers = function() {
    Alias.WiMe_initMembers.apply(this, arguments);
    this.clearFlags_MppMesEx();
};

//34
Alias.WiMe_subWindows = Window_Message.prototype.subWindows;
Window_Message.prototype.subWindows = function() {
    return Alias.WiMe_subWindows.apply(this, arguments).concat(this._nameWindow);
};

//39
Alias.WiMe_createSubWindows = Window_Message.prototype.createSubWindows;
Window_Message.prototype.createSubWindows = function() {
    Alias.WiMe_createSubWindows.apply(this, arguments);
    this._faceWindow = new Window_MessageFace(this);
    this._nameWindow = new Window_MessageName(this);
    this.addChild(this._faceWindow);
};

//56
Alias.WiMe_clearFlags = Window_Message.prototype.clearFlags;
Window_Message.prototype.clearFlags = function() {
    Alias.WiMe_clearFlags.apply(this, arguments);
    this._speed = MPPlugin.defaultSpeed;
    this._animeType = MPPlugin.defaultAnimeType;
    this._fadeOutType = 0;
    this._fadeOutSpeed = 0;
    this._lastBottomY = 0;
    this._messageCount = 0;
    this._charSeIndex = $gameMessage.charSeIndex || 0;
    this._charSeCount = MPPlugin.CharSeInterval;
};

Window_Message.prototype.clearFlags_MppMesEx = function() {
    this._auto = false;
    this._faceDuration = -1;
    this._faceRight = false;
    this._faceMirror = false;
    this._name = null;
    this._nameColorIndex = MPPlugin.nameWindow['Default Color'];
    this._effectSkip = $gameMessage.effectSkip;
};

//62
Window_Message.prototype.numVisibleRows = function() {
    return this._messageRow;
};

//66
Alias.WiMe_update = Window_Message.prototype.update;
Window_Message.prototype.update = function() {
    Alias.WiMe_update.apply(this, arguments);
    var sprites = this._characterSprite.children.clone();
    for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];
        if (this._showFast || !sprite.isPlaying()) {
            var bitmap = sprite.bitmap;
            this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height,
                sprite.drawX(), sprite.drawY());
            this._characterSprite.removeChild(sprite);
        }
    }
};

if (Window_Message.prototype.hasOwnProperty('convertEscapeCharacters')) {
    Alias.WiMe_convertEscapeCharacters = Window_Message.prototype.convertEscapeCharacters;
}
Window_Message.prototype.convertEscapeCharacters = function(text) {
    var _super = Alias.WiMe_convertEscapeCharacters ||
            Window_Base.prototype.convertEscapeCharacters;
    text = _super.apply(this, arguments);
    text = text.replace(/\x1bA(?:[^NIT]|$)/gi, function() {
        this._auto = true;
        return '';
    }.bind(this));
    text = text.replace(/\x1bFW\[(\d+)\]/gi, function() {
        this._faceDuration = parseInt(arguments[1]);
        return '';
    }.bind(this));
    text = text.replace(/\x1bFR/gi, function() {
        this._faceRight = true;
        return '';
    }.bind(this));
    text = text.replace(/\x1bFM/gi, function() {
        this._faceMirror = true;
        return '';
    }.bind(this));
    text = text.replace(/\x1bNW\[([^\]]+)\]/gi, function() {
        this._name = arguments[1];
        return '';
    }.bind(this));
    text = text.replace(/\x1bNC\[(\d+)\]/gi, function() {
        this._nameColorIndex = parseInt(arguments[1]);
        return '';
    }.bind(this));
    text = text.replace(/\x1bES/gi, function() {
        this._effectSkip = true;
        return '';
    }.bind(this));
    return text;
};

//99
Alias.WiMe_startMessage = Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function() {
    this.clearFlags_MppMesEx();
    this._messageRow = $gameMessage._messageRow;
    this.height = this.windowHeight();
    Alias.WiMe_startMessage.apply(this, arguments);
    this.createContents();
    this._characterSprite.x = this.standardPadding();
    this._characterSprite.y = this.standardPadding();
    if (this._name) this._nameWindow.setName(this._name, this._nameColorIndex);
};

//120
Alias.WiMe_terminateMessage = Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function(close) {
    if (close || !$gameMessage._fadeOutType || !$gameMessage._fadeOutSpeed) {
        Alias.WiMe_terminateMessage.apply(this, arguments);
        this._faceWindow.close();
        this._nameWindow.close();
        if (MPPlugin.SkipEffectsTiming === 1)
            this.sceneEffectSkip = this._effectSkip;
    } else {
        this._fadeOutType = $gameMessage._fadeOutType;
        this._fadeOutSpeed = $gameMessage._fadeOutSpeed;
    }
};

//126
Alias.WiMe_updateWait = Window_Message.prototype.updateWait;
Window_Message.prototype.updateWait = function() {
    if (Alias.WiMe_updateWait.apply(this, arguments)) {
        return true;
    } else if (this._waitEffect) {
        if (MPPlugin.Patch6)
            this.updateShowFast();
        this._waitEffect = this.effectHandler(MPPlugin.WaitEffects);
        return this._waitEffect;
    }
    return false;
};

//172
Alias.WiMe_updateMessage = Window_Message.prototype.updateMessage;
Window_Message.prototype.updateMessage = function() {
    if (this.updateFadeOut()) {
        return true;
    }
    if (this._textState) {
        this.updateShowFast();
        if (this._name && !this._nameWindow.isOpen()) {
            return true;
        }
        this._messageCount += this._speed;
        while (this._messageCount >= 60 || this._speed === 0) {
            if (Alias.WiMe_updateMessage.apply(this, arguments)) {
                this._messageCount = Math.max(this._messageCount - 60, 0);
            } else {
                break;
            }
        }
        if (this._charSeIndex > 0) {
            var se = MPPlugin.CharacterSEs[this._charSeIndex - 1];
            if (se && this._charSeCount > MPPlugin.CharSeInterval) {
                AudioManager.playSe(se);
                this._charSeCount = 0;
            }
        }
        return true;
    } else {
        return this._characterSprite.children.length > 0;
    }
};

Window_Message.prototype.updateFadeOut = function() {
    if (this._fadeOutType > 0) {
        var finish = true;
        switch (this._fadeOutType) {
            case 1:
                this.contentsOpacity -= this._fadeOutSpeed;
                finish = (this.contentsOpacity === 0);
                break;
            case 2:
                this.origin.y += this._fadeOutSpeed;
                finish = (this.origin.y >= this._lastBottomY);
                break;
        }
        if (finish) {
            this._fadeOutType = 0;
            this.terminateMessage(true);
        }
        return true;
    } else {
        return false;
    }
};

//232
Alias.WiMe_areSettingsChanged = Window_Message.prototype.areSettingsChanged;
Window_Message.prototype.areSettingsChanged = function() {
    return (Alias.WiMe_areSettingsChanged.apply(this, arguments) ||
            this._messageRow !== $gameMessage._messageRow);
};

//237
Alias.WiMe_updateShowFast = Window_Message.prototype.updateShowFast;
Window_Message.prototype.updateShowFast = function() {
    var lastShowFast = this._showFast;
    if (!this._auto) Alias.WiMe_updateShowFast.apply(this, arguments);
    if (!lastShowFast && this._showFast) {
        if (MPPlugin.SkipEffectsTiming === 0) 
            this.sceneEffectSkip = this._effectSkip;
        if (MPPlugin.StopSeWhenSkip)
            AudioManager.stopSe();
    }
};

//243
Alias.WiMe_newPage = Window_Message.prototype.newPage;
Window_Message.prototype.newPage = function(textState) {
    var sprites = this._characterSprite.children.clone();
    for (var i = 0; i < sprites.length; i++) {
        this._characterSprite.removeChild(sprites[i]);
    }
    Alias.WiMe_newPage.apply(this, arguments);
    this.contentsOpacity = 255;
    this.origin.y = 0;
    this._faceWindow.visible = false;
    textState.rubyHeight = this.calcRubyHeight(textState);
    textState.y += textState.rubyHeight;
    this._lastBottomY = textState.y + textState.height;
};

Window_Message.prototype.calcRubyHeight = function(textState) {
    var rubyHeight = 0;
    var lines = textState.text.slice(textState.index).split('\n');
    
    var rubySize = this._rubyBitmap.fontSize;
    var regExp1 = /\x1bRS\[(\d+)\]/gi;
    var regExp2 = /\x1bRB\[[^\]]+\]/gi;
    for (;;) {
        var array1 = regExp1.exec(lines[0]);
        var array2 = regExp2.exec(lines[0]);
        if (array1) {
            rubySize = parseInt(array1[1]);
        } else if (array2 && rubyHeight < rubySize) {
            rubyHeight = rubySize;
        } else {
            break;
        }
    }
    
    return rubyHeight;
};

//258
Window_Message.prototype.drawMessageFace = function() {
    var window = this._faceWindow;
    var faceName = $gameMessage.faceName();
    var faceIndex = $gameMessage.faceIndex();
    var duration = this._faceDuration;
    var right = this._faceRight;
    var mirror = this._faceMirror;
    var ch = this.contentsHeight();
    var fh = Window_Base._faceHeight;
    var height = duration >= 0 ? fh : Math.min(ch, fh);
    window.setFace(faceName, faceIndex, height, mirror);
    window.padding = this.padding;
    
    var fx, fy, moveX;
    if (duration < 0) {
        fx = right ? this.width - window.width : 0;
        fy = (ch - height) / 2;
        moveX = fx;
        duration = 0;
        window.setBackgroundType(2);
    } else {
        var px = MPPlugin.faceWindow['Padding X'];
        var py = MPPlugin.faceWindow['Padding Y'];
        fx = right ? Graphics.boxWidth : -window.width;
        if ($gameMessage.positionType() === 0) {
            fy = this.height + py;
        } else {
            fy = -window.height - py;
        }
        moveX = right ? this.width - window.width - px : px;
        this._faceWindow.setBackgroundType($gameMessage.background());
    }
    this._faceWindow.app(fx, fy, moveX, duration);
};

//263
Alias.WiMe_newLineX = Window_Message.prototype.newLineX;
Window_Message.prototype.newLineX = function() {
    if (this._faceRight || this._faceDuration >= 0) {
        return 0;
    } else {
        return Alias.WiMe_newLineX.call(this);
    }
};

if (Window_Message.prototype.hasOwnProperty('processCharacter')) {
    Alias.WiMe_processCharacter = Window_Message.prototype.processCharacter;
}
Window_Message.prototype.processCharacter = function(textState) {
    if (Alias.WiMe_processCharacter) {
        Alias.WiMe_processCharacter.apply(this, arguments);
    } else {
        Window_Base.prototype.processCharacter.apply(this, arguments);
    }
    this._lastBottomY = textState.y + textState.height;
};

//267
Alias.WiMe_processNewLine = Window_Message.prototype.processNewLine;
Window_Message.prototype.processNewLine = function(textState) {
    Alias.WiMe_processNewLine.apply(this, arguments);
    textState.rubyHeight = this.calcRubyHeight(textState);
    textState.y += textState.rubyHeight;
    if (this.needsNewPage(textState)) {
        this.startPause();
    }
};

//293
Alias.WiMe_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case 'SP':
        this._speed = this.obtainEscapeParam(textState);
        break;
    case 'AT':
        this._animeType = this.obtainEscapeParam(textState);
        break;
    case 'CO':
        this.processGroupCharacter(textState, this.obtainEscapeTexts(textState));
        break;
    case 'RB':
        this.processRubyCharacter(textState, this.obtainEscapeTexts(textState));
        break;
    case 'PX':
        textState.x += this.obtainEscapeParam2(textState);
        break;
    case 'PY':
        textState.y += this.obtainEscapeParam2(textState);
        break;
    case 'TX':
        textState.x = this.obtainEscapeParam(textState);
        break;
    case 'TY':
        textState.y = this.obtainEscapeParam(textState);
        break;
    case 'SW':
        $gameSwitches.setValue(this.obtainEscapeParam(textState), true);
        break;
    case 'SE':
        this._charSeIndex = this.obtainEscapeParam(textState);
        break;
    case 'WE':
        if (this.effectHandler(MPPlugin.WaitEffects)) {
            this._waitEffect = true;
            this._waitCount = 1;
        }
        break;
    case 'C':
        this.contents.textColor = this.obtainEscapeColor(textState);
        break;
    case 'FS':
        this.contents.fontSize = this.obtainEscapeParam(textState);
        break;
    case 'OP':
        this._paintOpacity = this.obtainEscapeParam(textState);
        break;
    case 'OC':
        this.contents.outlineColor = this.obtainEscapeColor(textState, 'rgba(0,0,0,0.5)');
        break;
    case 'OW':
        this.contents.outlineWidth = this.obtainEscapeParam(textState);
        break;
    case 'RC':
        this._rubyBitmap.textColor = this.obtainEscapeColor(textState, MPPlugin.defaultRubyColor);
        break;
    case 'RS':
        this._rubyBitmap.fontSize = this.obtainEscapeParam(textState);
        break;
    case 'RW':
        this._rubyBitmap.outlineWidth = this.obtainEscapeParam(textState);
        break;
    case 'DF':
        this.defaultTextInfo();
        break;
    case 'SV':
        this.saveTextInfo();
        break;
    case 'LD':
        this.loadTextInfo();
        break;
    default:
        Alias.WiMe_processEscapeCharacter.apply(this, arguments);
        break;
    }
};

Window_Message.prototype.obtainEscapeParam2 = function(textState) {
    var arr = /^\[-?\d+\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return parseInt(arr[0].slice(1));
    } else {
        return '';
    }
};

Window_Message.prototype.obtainEscapeTexts = function(textState) {
    var arr = /^\[([^\]]+)\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return arr[1].split(',');
    } else {
        return [];
    }
};

Window_Message.prototype.obtainEscapeColor = function(textState, defaultColor) {
    defaultColor = defaultColor || this.textColor(0);
    var arr = /^\[([\d\s,\.]+)\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        switch (arr[1].split(',').length) {
            case 1:
                var n = parseInt(arr[1]);
                return (n === 0 ? defaultColor : this.textColor(n));
            case 3:
                return 'rgb(%1)'.format(arr[1]);
            case 4:
                return 'rgba(%1)'.format(arr[1]);
        }
    }
    return '';
};

Window_Message.prototype.defaultTextInfo = function() {
    var info = MPPlugin.textInformations;
    if (info['Speed'])         this._speed = MPPlugin.defaultSpeed;
    if (info['Anime Type'])    this._animeType = MPPlugin.defaultAnimeType;
    if (info['Text Color'])    this.resetTextColor();
    if (info['Text Size'])     this.contents.fontSize = this.standardFontSize();
    if (info['Text Opacity'])  this._paintOpacity = 255;
    if (info['Outline Color']) this.contents.outlineColor = 'rgba(0, 0, 0, 0.5)';
    if (info['Outline Width']) this.contents.outlineWidth = 4;
    if (info['Ruby Color'])    this._rubyBitmap.textColor = MPPlugin.defaultRubyColor;
    if (info['Ruby Size'])     this._rubyBitmap.fontSize = MPPlugin.defaultRubySize;
    if (info['Ruby Width'])    this._rubyBitmap.outlineWidth = MPPlugin.defaultRubyOutline;
};

Window_Message.prototype.saveTextInfo = function() {
    var info = MPPlugin.textInformations;
    if (info['Speed'])         this._textInfo[0] = this._speed;
    if (info['Anime Type'])    this._textInfo[1] = this._animeType;
    if (info['Text Color'])    this._textInfo[2] = this.contents.textColor;
    if (info['Text Size'])     this._textInfo[3] = this.contents.fontSize;
    if (info['Text Opacity'])  this._textInfo[4] = this._paintOpacity;
    if (info['Outline Color']) this._textInfo[5] = this.contents.outlineColor;
    if (info['Outline Width']) this._textInfo[6] = this.contents.outlineWidth;
    if (info['Ruby Color'])    this._textInfo[7] = this._rubyBitmap.textColor;
    if (info['Ruby Size'])     this._textInfo[8] = this._rubyBitmap.fontSize;
    if (info['Ruby Width'])    this._textInfo[9] = this._rubyBitmap.outlineWidth;
};

Window_Message.prototype.loadTextInfo = function() {
    if (this._textInfo.length === 0) return;
    var info = MPPlugin.textInformations;
    if (info['Speed'])         this._speed = this._textInfo[0];
    if (info['Anime Type'])    this._animeType = this._textInfo[1];
    if (info['Text Color'])    this.contents.textColor = this._textInfo[2];
    if (info['Text Size'])     this.contents.fontSize = this._textInfo[3];
    if (info['Text Opacity'])  this._paintOpacity = this._textInfo[4];
    if (info['Outline Color']) this.contents.outlineColor = this._textInfo[5];
    if (info['Outline Width']) this.contents.outlineWidth = this._textInfo[6];
    if (info['Ruby Color'])    this._rubyBitmap.textColor = this._textInfo[7];
    if (info['Ruby Size'])     this._rubyBitmap.fontSize = this._textInfo[8];
    if (info['Ruby Width'])    this._rubyBitmap.outlineWidth = this._textInfo[9];

};

if (Window_Message.prototype.hasOwnProperty('processNormalCharacter')) {
    Alias.WiMe_processNormalCharacter = Window_Message.prototype.processNormalCharacter;
}
Window_Message.prototype.processNormalCharacter = function(textState) {
    var list = TextAnimation[this._animeType];
    if (!list || this._showFast || this._lineShowFast) {
        this.contents.paintOpacity = this._paintOpacity;
        if (Alias.WiMe_processNormalCharacter) {
            Alias.WiMe_processNormalCharacter.apply(this, arguments);
        } else {
            Window_Base.prototype.processNormalCharacter.apply(this, arguments);
        }
        this.contents.paintOpacity = 255;
    } else {
        var c = textState.text[textState.index++];
        var w = this.textWidth(c);
        var h = textState.height;
        var bitmap = this.createCharacterBitmap(w + 8, h);
        bitmap.drawText(c, 4, 0, w * 2, h);
        var x = textState.x;
        var y = textState.y;
        var rect = new Rectangle(4, 0, w, h);
        var sprite = new Sprite_TextCharacter(bitmap, x, y, rect, list);
        this._characterSprite.addChild(sprite);
        textState.x += w;
    }
    this._charSeCount++;
};

Window_Message.prototype.processDrawIcon = function(iconIndex, textState) {
    var x = textState.x + 2;
    var y = textState.y + (textState.height - Window_Base._iconHeight) / 2;
    var list = TextAnimation[this._animeType];
    if (!list || this._showFast || this._lineShowFast) {
        this.contents.paintOpacity = this._paintOpacity;
        this.drawIcon(iconIndex, x, y);
        this.contents.paintOpacity = 255;
    } else {
        var w = Window_Base._iconWidth + 8
        var h = Window_Base._iconHeight + 8;
        var bitmap = this.createCharacterBitmap(w, h);
        
        var icons = ImageManager.loadSystem('IconSet');
        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var sx = iconIndex % 16 * pw;
        var sy = Math.floor(iconIndex / 16) * ph;
        bitmap.blt(icons, sx, sy, pw, ph, 0, 0);
        
        var rect = new Rectangle(0, 0, w, h);
        var sprite = new Sprite_TextCharacter(bitmap, x, y, rect, list);
        this._characterSprite.addChild(sprite);
    }
    textState.x += Window_Base._iconWidth + 4;
};

Window_Message.prototype.processGroupCharacter = function(textState, texts) {
    var x = textState.x;
    var y = textState.y;
    var c = texts[0];
    var w = this.textWidth(c);
    var h = textState.height;
    var list = TextAnimation[this._animeType];
    if (!list || this._showFast || this._lineShowFast) {
        this.contents.paintOpacity = this._paintOpacity;
        this.contents.drawText(c, x, y, w * 2, h);
        this.contents.paintOpacity = 255;
    } else {
        var bitmap = this.createCharacterBitmap(w + 8, h);
        bitmap.drawText(c, 4, 0, w * 2, h);
        var rect = new Rectangle(4, 0, w, h);
        var sprite = new Sprite_TextCharacter(bitmap, x, y, rect, list);
        this._characterSprite.addChild(sprite);
    }
    textState.x += w;
};

Window_Message.prototype.processRubyCharacter = function(textState, texts) {
    var x = textState.x;
    var y = textState.y;
    var c = texts[0];
    var w = this.textWidth(c);
    var h = textState.height;
    var r = texts[1];
    var rw = this._rubyBitmap.measureTextWidth(r);
    var rh = textState.rubyHeight;
    this._rubyBitmap.clear();
    this._rubyBitmap.resize(rw + 8, rh + 8);
    this._rubyBitmap.drawText(r, 4, 0, rw + 8, rh + 8);
    var list = TextAnimation[this._animeType];
    if (!list || this._showFast || this._lineShowFast) {
        this.contents.paintOpacity = this._paintOpacity;
        this.contents.drawText(c, x, y, w * 2, h);
        var rx = x + (w - rw) / 2;
        var ry = y - (rh + 4);
        this.contents.blt(this._rubyBitmap, 0, 0, rw + 8, rh + 8, rx, ry);
        this.contents.paintOpacity = 255;
    } else {
        var bitmap = this.createCharacterBitmap(Math.max(w + 8, rw + 8), h + rh);
        var dx = (bitmap.width - w) / 2;
        bitmap.drawText(c, dx, rh + 4, w * 2, h);
        var rx = (bitmap.width - (rw + 8)) / 2;
        bitmap.blt(this._rubyBitmap, 0, 0, rw + 8, rh + 8, rx, 0);
        var rect = new Rectangle(dx, rh + 4, w, h);
        var sprite = new Sprite_TextCharacter(bitmap, x, y, rect, list);
        this._characterSprite.addChild(sprite);
    }
    textState.x += w;
};

Window_Message.prototype.createCharacterBitmap = function(w, h) {
    var bitmap = new Bitmap(w, h);
    bitmap.fontFace = this.contents.fontFace;
    bitmap.fontSize = this.contents.fontSize;
    bitmap.textColor = this.contents.textColor;
    bitmap.paintOpacity = this._paintOpacity;
    bitmap.outlineColor = this.contents.outlineColor;
    bitmap.outlineWidth = this.contents.outlineWidth;
    return bitmap;
};

if (Window_Message.prototype.hasOwnProperty('calcTextHeight')) {
    Alias.WiMe_calcTextHeight = Window_Message.prototype.calcTextHeight;
}
Window_Message.prototype.calcTextHeight = function(textState, all) {
    var line = textState.text.slice(textState.index).split('\n')[0];

    var maxFontSize = this.contents.fontSize;
    var regExp = /\x1bFS\[(\d+)\]/gi;
    for (;;) {
        var array = regExp.exec(line);
        if (array) {
            var fontSize = parseInt(array[1]);
            if (maxFontSize < fontSize) {
                maxFontSize = fontSize;
            }
        } else {
            break;
        }
    }
    
    var _super = Alias.WiMe_calcTextHeight || Window_Base.prototype.calcTextHeight;
    return Math.max(_super.apply(this, arguments), maxFontSize + 8);
};

//326
Alias.WiMe_startPause = Window_Message.prototype.startPause;
Window_Message.prototype.startPause = function() {
    Alias.WiMe_startPause.apply(this, arguments);
    if (MPPlugin.StopSeWhenSkip) 
        AudioManager.stopSe();
};

//-----------------------------------------------------------------------------
// Window_MessageFace

function Window_MessageFace() {
    this.initialize.apply(this, arguments);
}

Window_MessageFace.prototype = Object.create(Window_Base.prototype);
Window_MessageFace.prototype.constructor = Window_MessageFace;

Window_MessageFace.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow;
    var width = Window_Base._faceWidth + this.standardPadding() * 2;
    var height = Window_Base._faceHeight + this.standardPadding() * 2;
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.visible = false;
    this._moveX = 0;
    this._moveDuration = 0;
};

Window_MessageFace.prototype.loadWindowskin = function() {
    this.windowskin = ImageManager.loadSystem(MPPlugin.faceWindow.Windowskin);
};

Window_MessageFace.prototype.setFace = function(faceName, faceIndex, height, mirror) {
    var fw = Window_Base._faceWidth;
    this.contents.clear();
    this.drawFace(faceName, faceIndex, 0, 0, fw, height);
    this._windowContentsSprite.anchor.x = mirror ? 1 : 0;
    this._windowContentsSprite.scale.x = mirror ? -1 : 1;
    this.visible = true;
    this.openness = 255;
    this._closing = false;
};

Window_MessageFace.prototype.app = function(x, y, moveX, duration) {
    this.x = x;
    this.y = y;
    this._moveX = moveX;
    this._moveDuration = duration;
    if (duration === 0) this.x = moveX;
};

Window_MessageFace.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (this._moveDuration > 0) {
        var d = this._moveDuration;
        this.x = (this.x * (d - 1) + this._moveX) / d;
        this._moveDuration--;
    }
};

//-----------------------------------------------------------------------------
// Window_MessageName

function Window_MessageName() {
    this.initialize.apply(this, arguments);
}

Window_MessageName.prototype = Object.create(Window_Base.prototype);
Window_MessageName.prototype.constructor = Window_MessageName;

Window_MessageName.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow;
    Window_Base.prototype.initialize.call(this, 0, 0, 0, this.fittingHeight(1));
    this.openness = 0;
    this._name = null;
    this._needOpen = false;
};

Window_MessageName.prototype.standardPadding = function() {
    return 10;
};

Window_MessageName.prototype.loadWindowskin = function() {
    this.windowskin = ImageManager.loadSystem(MPPlugin.nameWindow.Windowskin);
};

Window_MessageName.prototype.setName = function(name, colorIndex) {
    if (this._name !== name) {
        this._name = name;
        var width = this.textWidth(name) + this.textPadding() * 2;
        this.width = width + this.standardPadding() * 2;
        this.createContents();
        this.resetFontSettings();
        this.changeTextColor(this.textColor(colorIndex));
        this.drawText(name, this.textPadding(), 0, width);
        this._needOpen = true;
    } else if (name) {
        this.open();
    }
    if ($gameMessage.positionType() === 0) {
        var y = this._messageWindow.y - MPPlugin.nameWindow.y;
        this._messageWindow.y = Math.max(y, 0);
    }
    this.x = this._messageWindow.x + MPPlugin.nameWindow.x;
    this.y = this._messageWindow.y + MPPlugin.nameWindow.y;
};

Window_MessageName.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (this._needOpen && this.isClosed()) {
        this.open();
        this._needOpen = false;
    }
};

//-----------------------------------------------------------------------------
// Scene_Boot

//61
Alias.ScBo_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function() {
    Alias.ScBo_start.call(this);
    this.createTextAnimation();
};

Scene_Boot.prototype.createTextAnimation = function() {
    //Type 1
    var list = [];
    list[0] = { code:0, origin:0, x:-6, y:0, sx:100, sy:100, o:0 };
    list[1] = { code:1, origin:0, x:0, y:0, sx:100, sy:100, o:255, d:6, wait:true };
    TextAnimation[1] = list;
    //Type 2
    list = [];
    list[0] = { code:0, origin:0, x:0, y:0, sx:0, sy:100, o:255 };
    list[1] = { code:1, origin:0, x:0, y:0, sx:75, sy:100, o:255, d:6, wait:true };
    list[2] = { code:1, origin:0, x:0, y:0, sx:100, sy:100, o:255, d:6, wait:true };
    TextAnimation[2] = list;
    //Type 3
    list = [];
    list[0] = { code:0, origin:1, x:0, y:0, sx:0, sy:0, o:255 };
    list[1] = { code:1, origin:1, x:0, y:0, sx:60, sy:60, o:255, d:8, wait:true };
    list[2] = { code:1, origin:1, x:0, y:0, sx:100, sy:100, o:255, d:8, wait:true };
    list[3] = { code:1, origin:1, x:0, y:0, sx:120, sy:120, o:255, d:8, wait:true };
    list[4] = { code:1, origin:1, x:0, y:0, sx:100, sy:100, o:255, d:8, wait:true };
    TextAnimation[3] = list;
    //Type 4
    list = [];
    list[0] = { code:0, origin:0, x:0, y:0, sx:100, sy:100, o:255 };
    list[1] = { code:5, x:0.0, y:0.0, w:0.0, h:1.0, d:0 };
    list[2] = { code:5, x:0.0, y:0.0, w:1.0, h:1.0, d:10, wait:true };
    TextAnimation[4] = list;
    //Original
    var commons = MPPlugin.animeCommons;
    for (var i = 0; i < commons.length; i++) {
        var common = $dataCommonEvents[commons[i]];
        if (!common) continue;
        list = [];
        common.list.forEach(function(cmd) {
            var params = cmd.parameters;
            switch (cmd.code) {
                case 230:
                    list.wait({ code:6, d:params[0] });
                    break;
                case 231:
                    list.push({ code:0, origin:params[2], x:params[4], y:params[5],
                        sx:params[6], sy:params[7], o:params[8] });
                    break;
                case 232:
                    list.push({ code:1, origin:params[2],
                        x:params[4], y:params[5], sx:params[6], sy:params[7],
                        o:params[8], d:params[10], wait:params[11] });
                    break;
                case 233:
                    list.push({ code:2, r:params[1] });
                    break;
                case 234:
                    list.push({ code:3, t:params[1], d:params[2], wait:params[3] });
                    break;
                case 356:
                    var args = params[0].split(" ");
                    var command = args.shift();
                    switch (command) {
                        case MPPlugin.PluginCommands.SetCharaAngle:
                        case 'SetCharaAngle':
                            list.push({ code:4, a:Number(args[0]) });
                            break;
                        case MPPlugin.PluginCommands.MoveCharaFrame:
                        case 'MoveCharaFrame':
                            list.push({ code:5, x:Number(args[0]), y:Number(args[1]),
                                w:Number(args[2]), h:Number(args[3]),
                                d:Number(args[4]), wait:!!eval(args[5])});
                            break;
                    }
                    break;
            }
        });
        TextAnimation.push(list);
    }
};

//-----------------------------------------------------------------------------
// Scene_Map

//68
Alias.ScMa_updateMainMultiply = Scene_Map.prototype.updateMainMultiply;
Scene_Map.prototype.updateMainMultiply = function() {
    Alias.ScMa_updateMainMultiply.apply(this, arguments);
    if (this._messageWindow.sceneEffectSkip) {
        for (var i = 1; i < 999; i++) {
            if (this.isEffecting_MesEx(MPPlugin.SkipEffects)) {
                this.updateMain();
            } else {
                this._messageWindow.sceneEffectSkip = false;
                break;
            }
        }
    }
};

//217
Alias.ScMa_createMessageWindow = Scene_Map.prototype.createMessageWindow;
Scene_Map.prototype.createMessageWindow = function() {
    Alias.ScMa_createMessageWindow.apply(this, arguments);
    this._messageWindow.effectHandler = this.isEffecting_MesEx.bind(this);
};

Scene_Map.prototype.isEffecting_MesEx = function(infos) {
    if (infos['Scroll Map'] && $gameMap.isScrolling()) 
        return true;
    if (infos['Set Movement Route'] && $gameMap.isAnyMoveRouteForcingNr())
        return true;
    if (infos['Show Animation'] && $gameMap.isAnyAnimationPlaying())
        return true;
    if (infos['Show Balloon Icon'] && $gameMap.isAnyBalloonPlaying())
        return true;
    if (infos['Move Picture'] && $gameScreen.isAnyPictureMoving())
        return true;
    if (infos['Tint Picture'] && $gameScreen.isAnyPictureTinting())
        return true;
    if (infos['Tint Screen'] && $gameScreen.isTinting())
        return true;
    if (infos['Flash Screen'] && $gameScreen.isFlashing())
        return true;
    if (infos['Shake Screen'] && $gameScreen.isShaking())
        return true;
    if (infos['Set Weather Effect'] && $gameScreen.isWeatherChanging())
        return true;
    if (infos['Fadeout BGM'] && AudioManager.isBgmFadeOuting())
        return true;
    if (infos['Fadeout BGS'] && AudioManager.isBgsFadeOuting())
        return true;
    if (infos['Play ME'] && AudioManager.isMePlaying())
        return true;
    return false;
};




})();
