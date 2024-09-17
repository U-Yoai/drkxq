//-----------------------------------------------------------------------------
//  Galv's Layer Graphics
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_LayerGraphics.js
//-----------------------------------------------------------------------------
//  2017-11-24 - Version 2.0 - added ability to set x,y anchor on static layer
//                             images & set a character target to follow
//  2016-06-15 - Version 1.9 - fixed compatibility issue in yanfly battle core
//  2016-05-02 - Version 1.8 - fixed a bug with battle layer crash
//  2016-04-27 - Version 1.7 - minor code changes
//  2016-04-16 - Version 1.6 - added static image command
//                           - added battle layers
//  2016-01-23 - Version 1.5 - implemented code for potential memory issue
//  2015-11-29 - Version 1.4 - added setting for tile size
//  2015-11-19 - Version 1.3 - fixed minor poor code
//  2015-11-11 - Version 1.2 - added Galv plugin command efficiency code
//  2015-11-06 - Version 1.1 - added ability to create layers via map notes
//  2015-10-30 - Version 1.0 - release
//-----------------------------------------------------------------------------
//  Terms can be found at:
//  galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_LayerGraphics = true;

var Galv = Galv || {};        // Galv's main object
Galv.pCmd = Galv.pCmd || {};  // Plugin Command manager
Galv.LG = Galv.LG || {};      // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.2.0) Create graphic layers for parallax mapping, fog, etc. View the 'Help' document for plugin commands and info.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Tile Size
 * @desc The width/height of your tiles if you changed it with another plugin.
 * @default 48
 *
 * @help
 *   Galv's Layer Graphics
 * ----------------------------------------------------------------------------
 * Before you start, you will need to create a layers folder in your project.
 * /img/layers/
 * This is where all your layer images will be taken from.
 *
 * Each map can have many graphic layers, but be aware that the more you have,
 * the more chance the game could lag (especially on slow computers or mobile
 * devices).
 *
 * When a layer is made, it is stored, so you can set layers for maps before
 * a player enters them. The layers are created when the map is created, so
 * for layer commands created on the same map, 'REFRESH LAYERS' plugin command
 * can be used to force the layers to create during play.
 *
 * Below are commands to be used in the "Plugin Command" event command.
 * NOTE: This is different to the "Script" event command.
 * ----------------------------------------------------------------------------
 *   Plugin Commands (Quick)
 * ----------------------------------------------------------------------------
 *
 *   LAYER MAPID ID GRAPHIC XSPEED YSPEED OPACITY Z XSHIFT YSHIFT BLEND
 *
 *   LAYER_S MAPID ID GRAPHIC X Y OPACITY Z BLEND
 *
 *   LAYER REMOVE MAPID ID
 *
 *   LAYER REFRESH
 *
 * ----------------------------------------------------------------------------
 *   Plugin Commands (Detailed)
 * ----------------------------------------------------------------------------
 * To create or change a layer graphic, the following plugin command is used:
 *
 *   LAYER MAPID ID GRAPHIC XSPEED YSPEED OPACITY Z XSHIFT YSHIFT BLEND
 *
 * Each property is separated by a space and you will exchange the property
 * names above with values.
 *
 * EXPLANATION OF PROPERTIES:
 * LAYER        - do not change this, it is the keyword for the plugin.
 * MAPID        - the id of the map you are creating the layer for
 * ID           - the id of the layer itself. If you want to change or remove
 *              - an existing layer, you refer to it by it's id.
 * GRAPHIC      - The filename of the image found in /img/layers/
 * XSPEED       - The speed of the horizontal movement. Negatives to go left
 * YSPEED       - The speed of the vertical movement. Negatives to go up
 * OPACITY      - Transparency of the image (0 - 255)
 * Z            - What priority the image has. 0 = ground, 5 = above all chars
 * XSHIFT       - Horizonal movement shift that differs from player movement
 * YSHIFT       - Vertical movement shift that differs from player movement
 *              - Make XSHIFT and YSHIFT = 0 to move with map
 * BLEND        - Blend mode (0 = normal, 1 = add, 2 = multiply, 3 = screen)
 *              - *NOTE RPG Maker MV version 1.1 mutliply isn't supported
 *
 * Example:
 * LAYER 12 1 clouds 1 0 155 5 0 0 0
 * This will create/change layer 1 on map 12. It will make it use "clouds.png"
 * as the image that will scroll right, be partially transparent and above all
 *
 * Using Variables
 * You can use a variable for any property (except 'GRAPHIC') in the plugin 
 * if you put a "v" before the property. The number after will be variable id.
 *
 * Example:
 * LAYER 12 1 clouds 1 0 v1 5 0 0 0
 * This is the same example as above, but will use the value of variable 1
 * for the opacity of the layer. This only changes the setting when called,
 * changing the variable again without calling this plugin command again will
 * not change the layer.
 *
 * ----------------------------------------------------------------------------
 *
 * Alternatively, a static sprite layer can be created. These layers will not
 * tile/loop and are stuck to the map, better used for parallax mapping:
 *
 *   LAYER_S MAPID ID GRAPHIC X Y OPACITY Z BLEND XANCHOR YANCHOR CHAR ROTATE
 *
 * Each property is separated by a space and you will exchange the property
 * names above with values.
 *
 * EXPLANATION OF PROPERTIES:
 * LAYER_S      - do not change this, it is the keyword for the plugin.
 * MAPID        - the id of the map you are creating the layer for
 * ID           - the id of the layer itself. If you want to change or remove
 *              - an existing layer, you refer to it by it's id.
 * GRAPHIC      - The filename of the image found in /img/layers/
 * X            - The X position of the static layer image on the map.
 * Y            - The Y position of the static layer image on the map.
 * OPACITY      - Transparency of the image (0 - 255)
 * Z            - What priority the image has. 0 = ground, 5 = above all chars
 * BLEND        - Blend mode (0 = normal, 1 = add, 2 = multiply, 3 = screen)
 *              - *NOTE RPG Maker MV version 1.1 mutliply isn't supported
 * XANCHOR      - 0 left, 0.5 middle, 1 right - the part of the image that
 *              - is set to the X position porperty above.
 * YANCHOR      - 0 left, 0.5 middle, 1 right - the part of the image that
 *              - is set to the Y position porperty above.
 * CHAR         - 0 for none, -1 for player, above 0 for a specific event id
 * ROTATE       - 0 for no, 1 for yes, to rotate the sprite depending on the
 *              - direction the specified CHAR is facing. Default graphic
 *              - should be facing down. This doesn't work if no CHAR is set
 *
 *
 *
 * Example:
 * LAYER_S 6 2 town 0 0 255 0 0
 * This will create/change layer 2 on map 6. It will make it use "town.png"
 * as the image that will stick with the map. The X and Y are 0's which will
 * be common for most parallax mapping. Z is 0 to appear under the player.
 *
 * ----------------------------------------------------------------------------
 *
 *   LAYER REMOVE MAPID ID  - Remove a layer from a map
 * 
 * Example:
 * LAYER REMOVE 12 1       - Removes layer 1 from map 12
 *
 * ----------------------------------------------------------------------------
 *
 *   LAYER REFRESH          - For creating new layers on the same map as the
 *                          - plugin command. Do this command if creating
 *                          - NEW layers on the map. It is not required for
 *                          - changing existing layers
 *
 * ----------------------------------------------------------------------------
 *
 * ----------------------------------------------------------------------------
 *   MAP NOTES
 * ----------------------------------------------------------------------------
 * In addition to using the plugin calls, you can setup layers on each map in
 * the NOTE section of the map settings. Do this in the same way as the plugin
 * call except do not add the map ID.
 *
 *   LAYER ID GRAPHIC XSPEED YSPEED OPACITY Z XSHIFT YSHIFT BLEND
 *
 *   LAYER_S ID GRAPHIC X Y OPACITY Z BLEND XANCHOR YANCHOR CHAR ROTATE
 *
 * These layers can be changed as normal with plugin commands.
 * ----------------------------------------------------------------------------
 *
 * ----------------------------------------------------------------------------
 *   SCRIPT STUFF
 * ----------------------------------------------------------------------------
 * For advanced users only. Layer properties can be accessed via script:
 * $gameMap.layerSettings[mapId][layerId].property
 * "property" being the above properites in lowercase.
 * ----------------------------------------------------------------------------
 *
 * ----------------------------------------------------------------------------
 *   SCRIPT CALL - BATTLE LAYERS
 * ----------------------------------------------------------------------------
 *
 *   Galv.LG.bLayer(id,'graphic',xspeed,yspeed,opacity,z,blend);
 *
 * Battle layers are controlled with this script call. They don't use the
 * Plugin Command but the values are the same as the plugin commands above
 * (without the map ID). Once set, battle layers last for every combat after
 * until they are changed again.
 *
 * BATTLE Z LEVEL - works slightly different. Cannot use decimals.
 * 0 - behind all
 * 1 - between battleback 1 and 2
 * 2 - over battlebacks but under characters
 * 3 - over all characters
 *
 * To remove a layer simply use the same call with only the id.
 * For example:
 *
 *   Galv.LG.bLayer(id);
 *
 * ----------------------------------------------------------------------------
 */

//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {

// LAYER GRAPHIC FOLDER
//-----------------------------------------------------------------------------
ImageManager.loadLayerGraphic = function(filename, hue) {
    return this.loadBitmap('img/layers/', filename, hue, true);
};


// GALV'S PLUGIN MANAGEMENT. INCLUDED IN ALL GALV PLUGINS THAT HAVE PLUGIN COMMAND CALLS, BUT ONLY RUN ONCE.
if (!Galv.aliased) {
	var Galv_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		if (Galv.pCmd[command]) {
			Galv.pCmd[command](args);
			return;
		};
		Galv_Game_Interpreter_pluginCommand.call(this, command, args);
	};
	Galv.aliased = true; // Don't keep aliasing for other Galv scripts.
};

// Direct to Plugin Object
Galv.pCmd.LAYER = function(arguments) {
	Galv.LG.createLayer(arguments);
};

Galv.pCmd.LAYER_S = function(arguments) {
	Galv.LG.createLayerS(arguments);
};
// END GALV'S PLUGIN MANAGEMENT



Galv.LG.tileSize = Number(PluginManager.parameters('Galv_LayerGraphics')["Tile Size"]);


// CREATE TILING LAYER
//-----------------------------------------------------------------------------
Galv.LG.createLayer = function(config) {
	switch (config[0]) {
	case 'REFRESH':
		// Recreate layer graphics
		SceneManager._scene._spriteset.createLayerGraphics();
		return;
	case 'REMOVE':
		// Remove specified layer object
		var mapid = Galv.LG.num(config[1]);
		var id = Galv.LG.num(config[2]);
		if (id) {
			$gameMap.layerSettings[mapid][id] = {};
		} else {
			$gameMap.layerSettings[mapid] = {};
		};
		return;
	};
	
	// get variables
	var mapid = Galv.LG.num(config[0]);
	var id = Galv.LG.num(config[1]);
	$gameMap.layerSettings[mapid] = $gameMap.layerSettings[mapid] || {};
	$gameMap.layerSettings[mapid][id] = $gameMap.layerSettings[mapid][id] || {};
	
	var x_exist = $gameMap.layerSettings[mapid][id].currentx || 0;
	var y_exist = $gameMap.layerSettings[mapid][id].currenty || 0;
	
	// create object
	$gameMap.layerSettings[mapid][id] = {
		graphic: config[2],                      // filename of the graphic in /img/layers/
		xspeed: Galv.LG.num(config[3]),          // speed the layer will scroll horizontally
		yspeed: Galv.LG.num(config[4]),          // speed the layer will scroll vertically
		opacity: Galv.LG.num(config[5]),         // the opacity of the layer
		z: Galv.LG.num(config[6]),               // what level the layer is displayed at (ground is 0)
		xshift: Galv.LG.num(config[7]),          // Moves the layer at a different x amount than the map (0 to not move)
		yshift: Galv.LG.num(config[8]),          // Moves the layer at a different y amount than the map (0 to not move)
		blend: Galv.LG.num(config[9]),           // Blend mode  (0 = normal, 1 = add, 2 = multiply, 3 = screen)
		currentx: x_exist,                       // origin x saved. Reset this on map change
		currenty: y_exist,                       // origin y saved. Reset this on map change
	};
};


// CREATE STATIC LAYER
//-----------------------------------------------------------------------------
Galv.LG.createLayerS = function(config) {
	// get variables

	var mapid = Galv.LG.num(config[0]);
	var id = Galv.LG.num(config[1]);
	$gameMap.layerSettings[mapid] = $gameMap.layerSettings[mapid] || {};
	$gameMap.layerSettings[mapid][id] = $gameMap.layerSettings[mapid][id] || {};
	
	// create object
	$gameMap.layerSettings[mapid][id] = {
		static: true,               // determines static layer
		graphic: config[2],         // filename of the graphic in /img/layers/
		x: Galv.LG.num(config[3]),          // speed the layer will scroll horizontally
		y: Galv.LG.num(config[4]),          // speed the layer will scroll vertically
		opacity: Galv.LG.num(config[5]),         // the opacity of the layer
		z: Galv.LG.num(config[6]),               // what level the layer is displayed at (ground is 0)
		blend: Galv.LG.num(config[7]),           // Blend mode  (0 = normal, 1 = add, 2 = multiply, 3 = screen)
		xa: config[8] ? Galv.LG.num(config[8]) : 0,     // xanchor (0-1)
		ya: config[9] ? Galv.LG.num(config[9]) : 0,     // yanchor (0-1)
		character: config[10] ? Galv.LG.num(config[10]) : 0,  // designated character to follow (-1 player, 0 none, >0 event id
		rotate: config[11] ? Galv.LG.num(config[11]) : 0,     // rotate? 0 for no, 1 for yes
	};

};


// BATTLE LAYERS
//-----------------------------------------------------------------------------

Galv.LG.bLayer = function(id,graphic,xspeed,yspeed,opacity,z,blend) {
	if (!graphic) {
		if ($gameSystem._bLayers[id]) delete($gameSystem._bLayers[id]);
		return;
	};

	// create object
	$gameSystem._bLayers[id] = {
		graphic: graphic || '',         // filename of the graphic in /img/layers/
		xspeed: xspeed || 0,            // speed the layer will scroll horizontally
		yspeed: yspeed || 0,            // speed the layer will scroll vertically
		opacity: opacity || 0,          // the opacity of the layer
		z: z || 0,                      // what level the layer is displayed at (ground is 0)
		blend: blend || 0,              // Blend mode  (0 = normal, 1 = add, 2 = multiply, 3 = screen)
		xshift: 0,
		yshift: 0,
		currentx: 0,
		currenty: 0
	};
};


// OTHER
//-----------------------------------------------------------------------------

Galv.LG.num = function(txt) {
	if (txt[0] === "v") {
		var varId = Number(txt.replace("v",""));
		return $gameVariables.value(varId);
	} else {
		return Number(txt);
	};
};

Galv.LG.isEmpty = function(obj) {
	return Object.keys(obj).length === 0;
};



// GAME SYSTEM - BATTLE LAYERS
//-----------------------------------------------------------------------------

Galv.LG.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Galv.LG.Game_System_initialize.call(this);
	this._bLayers = {};   // Store battle layers here.
};


// SPRITESET BATTLE
//-----------------------------------------------------------------------------

Galv.LG.Spriteset_Battle_createlowerlayer = Spriteset_Battle.prototype.createLowerLayer;
Spriteset_Battle.prototype.createLowerLayer = function() {
    Galv.LG.Spriteset_Battle_createlowerlayer.call(this);
	for (var i = 0; i < this._battleField.children.length; i++) {
		this._battleField.children[i].z = 2;
	};
	
	this.layerGraphics = this.layerGraphics || {};
	this._back1Sprite.z = 0;
	this._back2Sprite.z = 1;
	this.createLayerGraphics();
};

Spriteset_Battle.prototype.createLayerGraphics = function() {
    // Create Active Layers On Map
	var blayers = $gameSystem._bLayers; // get object only for the map

	for (var propertyId in blayers) {

		// if layers sprite doesn't exist, make it.
		if (!this.layerGraphics.hasOwnProperty(propertyId)) {
			// Create Layer Sprite
			if (blayers[propertyId]) {
				this.layerGraphics[propertyId] = new Sprite_LayerGraphic(propertyId,true);
				this.layerGraphics[propertyId].move(0, 0, Graphics.width, Graphics.height);
			};
		};

		// If settings are empty for the layer
		if (Galv.LG.isEmpty(blayers[propertyId]) || blayers[propertyId]["graphic"] == "") {
			var ind = this._battleField.children.indexOf(this.layerGraphics[propertyId]);
			this._battleField.removeChildAt(ind);
		} else {
			var z = Math.max(blayers[propertyId].z,0); // min 0
			var test = null;
			var skip = 0;

			switch (blayers[propertyId].z) {
				case 0:
					break;
				case 1: // above first battleback
					test = "TilingSprite";
					break;
				case 2: // above second battleback
					test = "TilingSprite";
					skip = 1;
					break;
				default:
					z = this._battleField.children.length;
			};
			
			
			if (test) {
				for (i = 0; i < this._battleField.children.length; i++) {
					if (this._battleField.children[i].constructor.name == test) {
						z = i + 1;
						if (skip > 0) {
							skip -= 1;
						} else {
							break;	
						};
					};
				};
			};
			
			// Get in bounds
			z = Math.min(z,this._battleField.children.length);

			this._battleField.addChildAt(this.layerGraphics[propertyId],z);
		};
	};
};



// SPRITESET MAP
//-----------------------------------------------------------------------------

Galv.LG.Spriteset_Map_createlowerlayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
    Galv.LG.Spriteset_Map_createlowerlayer.call(this);
	this.layerGraphics = this.layerGraphics || {};
	this.createLayerGraphics();
};
    
Spriteset_Map.prototype.createLayerGraphics = function() {
    // Create Active Layers On Map
	
	var mapGraphics = $gameMap.layerConfig(); // get object only for the map

	for (var id in mapGraphics) {

		// if layers sprite doesn't exist, make it.
		if (!this.layerGraphics[id] || !this.layerGraphics[id].id) {
			// Create Layer Sprite
			if (mapGraphics[id]) {
				if (mapGraphics[id].static) { // If layer created using LAYER_S
					this.layerGraphics[id] = new Sprite_LayerGraphicS(id);
				} else {
					this.layerGraphics[id] = new Sprite_LayerGraphic(id);
					this.layerGraphics[id].move(0, 0, Graphics.width, Graphics.height);
				};
			};
		};

		// If settings are empty for the layer
		if (Galv.LG.isEmpty(mapGraphics[id]) || mapGraphics[id]["graphic"] == "") {
			var ind = this._tilemap.children.indexOf(this.layerGraphics[id]);
			this._tilemap.removeChildAt(ind);
		} else {
			this._tilemap.addChild(this.layerGraphics[id]);
		};
	};
};


// GAME MAP - SETUP LAYER SETTINGS
//-----------------------------------------------------------------------------
Galv.LG.Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
	Galv.LG.Game_Map_initialize.call(this);
	this.layerSettings = {};   // Store ALL layers here.
};

Galv.LG.Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
	Galv.LG.Game_Map_setup.call(this,mapId);
	this.layerSettings[mapId] = this.layerSettings[mapId] || {}

	// Setup map notetag layers
	this.createNoteLayers(mapId);
	
	for (var obj in this.layerConfig()) {
		obj.currentx = 0;
		obj.currenty = 0;
	};
};

Game_Map.prototype.createNoteLayers = function(mapId) {
	// CREATE MAP CONFIG HERE
	var txtArray = $dataMap.note.match(/[^\r\n]+/g);
	if (!txtArray) return;

	for (i = 0; i < txtArray.length; i++) {
		if (txtArray[i].indexOf("LAYER ") >= 0) {
			var config = (mapId + txtArray[i].replace('LAYER','')).split(" ");
			// If layer doesn't already exist, create it:

			if (!this.layerSettings[mapId][Number(config[1])]) {
				Galv.LG.createLayer(config);
			};
		};
		if (txtArray[i].indexOf("LAYER_S ") >= 0) {
			var config = (mapId + txtArray[i].replace('LAYER_S','')).split(" ");
			// If layer doesn't already exist, create it:

			if (!this.layerSettings[mapId][Number(config[1])]) {
				Galv.LG.createLayerS(config);
			};
		};
	};
};

Game_Map.prototype.layerConfig = function() {
	// Get object list from layerSettings
	if (this.layerSettings[this.mapId()]) {
		return this.layerSettings[this.mapId()];
	} else {
		this.layerSettings[this.mapId()] = {}
		return this.layerSettings[this.mapId()];
	};
};


// CREATE LAYER TILING SPRITE
//-----------------------------------------------------------------------------
function Sprite_LayerGraphic() {
    this.initialize.apply(this, arguments);
}

Sprite_LayerGraphic.prototype = Object.create(TilingSprite.prototype);
Sprite_LayerGraphic.prototype.constructor = Sprite_LayerGraphic;

Sprite_LayerGraphic.prototype.initialize = function(id,battle) {
	this.id = id;
	if (battle) {
		this.lValue = this.lBValue;
		this.displayX = this.displayXBattle;
		this.displayY = this.displayYBattle;
	};
    TilingSprite.prototype.initialize.call(this);
	this.currentGraphic = "";
    this.createBitmap();
    this.update();
};

// TEMP CANVAS FIX FOR WHEN REFRESHING LAYERS ON MAP
Sprite_LayerGraphic.prototype.generateTilingTexture = function(arg) {
    PIXI.TilingSprite.prototype.generateTilingTexture.call(this, arg);
    // Purge from Pixi's Cache
    if (this.tilingTexture && this.tilingTexture.canvasBuffer)
        PIXI.Texture.removeTextureFromCache(this.tilingTexture.canvasBuffer.canvas._pixiId);
};
// - END - TEMP CANVAS FIX FOR WHEN REFRESHING LAYERS ON MAP

Sprite_LayerGraphic.prototype.createBitmap = function() {
	if (Galv.LG.isEmpty(this.lValue())) {
		this.bitmap = ImageManager.loadLayerGraphic("");
	} else {
		this.bitmap = ImageManager.loadLayerGraphic(this.lValue().graphic);
	};
	this.z = this.lValue().z;
};


Sprite_LayerGraphic.prototype.lValue = function() {
	return $gameMap.layerConfig()[this.id];
};

Sprite_LayerGraphic.prototype.lBValue = function() {
	return $gameSystem._bLayers[this.id];
};


// Update
Sprite_LayerGraphic.prototype.update = function() {
	TilingSprite.prototype.update.call(this);

	if (this.currentGraphic !== this.lValue().graphic) {
		this.createBitmap();
		this.currentGraphic = this.lValue().graphic;
	};
	
	this.updatePosition();
};

// Update Position
Sprite_LayerGraphic.prototype.updatePosition = function() {
	this.z = this.lValue().z || 0;
	this.opacity = this.lValue().opacity || 0;
	this.blendMode = this.lValue().blend || 0;
	
	this.origin.x = 0 + this.displayX() * Galv.LG.tileSize + this.lValue().currentx + this.xOffset();
	this.origin.y = 0 + this.displayY() * Galv.LG.tileSize + this.lValue().currenty + this.yOffset();
	this.lValue().currentx += this.lValue().xspeed;
	this.lValue().currenty += this.lValue().yspeed;
};

Sprite_LayerGraphic.prototype.xOffset = function() {
	return this.displayX() * this.lValue().xshift;
};

Sprite_LayerGraphic.prototype.yOffset = function() {
	return this.displayY() * this.lValue().yshift;
};


Sprite_LayerGraphic.prototype.displayX = function() {
	return $gameMap.displayX();
};
Sprite_LayerGraphic.prototype.displayY = function() {
	return $gameMap.displayY();
};

Sprite_LayerGraphic.prototype.displayXBattle = function() {
	return 0;
};
Sprite_LayerGraphic.prototype.displayYBattle = function() {
	return 0;
};



// CREATE LAYER NORMAL SPRITE
//-----------------------------------------------------------------------------
function Sprite_LayerGraphicS(id) {
	this.id = id;
    this.initialize.apply(this, arguments);
}


Sprite_LayerGraphicS.prototype = Object.create(Sprite.prototype);
Sprite_LayerGraphicS.prototype.constructor = Sprite_LayerGraphicS;


Sprite_LayerGraphicS.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
	this.currentGraphic = "";
    this.createBitmap();
    this.update();
	//console.log(this.lValue());
};


Sprite_LayerGraphicS.prototype.createBitmap = function(val) {
	var val = val || this.lValue();
	if (Galv.LG.isEmpty($gameMap.layerConfig()[this.id])) {
		this.bitmap = ImageManager.loadLayerGraphic("");
	} else {
		this.bitmap = ImageManager.loadLayerGraphic(val.graphic);
	};
	this.z = val.z;
};


Sprite_LayerGraphicS.prototype.lValue = function() {
	return $gameMap.layerConfig()[this.id];
};


// Update
Sprite_LayerGraphicS.prototype.update = function() {
	Sprite.prototype.update.call(this);
	
	var val = this.lValue();
	if (this.currentGraphic !== val.graphic) {
		this.createBitmap(val);
		this.currentGraphic = val.graphic;
	};
	
	this.updatePosition(val);
};

// Update Position
Sprite_LayerGraphicS.prototype.updatePosition = function(val) {	
	this.z = val.z || 0;
	this.opacity = val.opacity || 0;
	this.blendMode = val.blend || 0;
	
	if (val.character) {
		// get character object
		var char = val.character > 0 ? $gameMap.event(val.character) : $gamePlayer;
		
		// set x,y to character's x,y
		var center = Galv.LG.tileSize / 2;
		var tx = char._realX * Galv.LG.tileSize + center;
		var ty = char._realY * Galv.LG.tileSize + center;
		
		this.x = tx - $gameMap.displayX() * Galv.LG.tileSize;
		this.y = ty - $gameMap.displayY() * Galv.LG.tileSize;
		
		// rotate
		if (val.rotate) {
			switch (char._direction) {
				case 1:
					this.rotation = 0.785398; // 45 degrees
					break;
				case 2:
					this.rotation = 0; // 0 degrees
					break;
				case 3:
					this.rotation = 5.49779; // 315 degrees
					break;
				case 4: 
					this.rotation = 1.5708; // 90 degrees
					break;
				case 6:
					this.rotation = 4.71239; // 270 degrees
					break;
				case 7:
					this.rotation = 2.35619; // 135 degrees
					break;
				case 8:
					this.rotation = 3.14159; // 180 degrees
					break;
				case 9:
					this.rotation = 3.92699; // 225 degrees
					break;
			};

		} else {
			this.rotation = 0;
		}
		
	} else {
		this.x = val.x - $gameMap.displayX() * Galv.LG.tileSize;
		this.y = val.y - $gameMap.displayY() * Galv.LG.tileSize;
		this.rotation = 0;
	}
	
	this.anchor.x = val.xa;
	this.anchor.y = val.ya;
	
	
};


// YANFLY FIX
if (Imported.YEP_BattleEngineCore) {
	Galv.LG.Spriteset_Battle_battleFieldDepthCompare = Spriteset_Battle.prototype.battleFieldDepthCompare;
	Spriteset_Battle.prototype.battleFieldDepthCompare = function(a, b) {
		if (a.tilePosition || b.tilePosition) {
			if (a.z < b.z) return -1;
			if (a.z > b.z) return 1;
			return 0;
		};
		return Galv.LG.Spriteset_Battle_battleFieldDepthCompare.call(this,a,b);
	};
};

})();

