
// Constructor
function LightManager()
{
};

LightManager.prototype.create = function ()
{
	this.lightGroup = DungeonGame.game.add.group();


	/* General darkness */
	//NORMAL, ADD, MULTIPLY, SCREEN, OVERLAY, DARKEN, LIGHTEN, COLOR_DODGE, COLOR_BURN, HARD_LIGHT, SOFT_LIGHT, DIFFERENCE, EXCLUSION, HUE, SATURATION, COLOR, LUMINOSITY

	// The FOW darkness that gets carved out by adding lights
	this.fowBmd = DungeonGame.game.make.bitmapData( SCREEN_WIDTH, SCREEN_HEIGHT );
	this.fowBmd.fill( 0, 0, 0, 1 );
	this.fowBmdAnchor = this.lightGroup.create( 0, 0, this.fowBmd );
	this.fowBmdAnchor.blendMode = Phaser.blendModes.MULTIPLY;
	this.fowBmdAnchor.alpha = 1.0;
	this.fowSpriteTemp = this.lightGroup.create( 0, 0, 'glow', 0, false );

	//this.MODE = 'lighter';
	//this.modes = ['lighter','color','color-burn','color-dodge','darken','destination-atop','destination-in','destination-out','destination-over','difference','exclusion','hard-light','hue','lighten','luminosity','multiply','overlay','saturation','screen','soft-light','source-atop','source-in','source-out','source-over','xor'];
	//var key = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.R );
	//key.onDown.add( function() {this.MODE = this.modes[(this.modes.indexOf(this.MODE)+1)%this.modes.length]; console.log(this.MODE);}, this );

	// The additional brightness from torches. Has a max brightness limit.
	this.lightBmd = DungeonGame.game.make.bitmapData( SCREEN_WIDTH, SCREEN_HEIGHT );
	this.lightBmd.fill( 0, 0, 0, 1 );
	this.lightBmdAnchor = this.lightGroup.create( 0, 0, this.lightBmd );
	this.lightBmdAnchor.blendMode = Phaser.blendModes.COLOR_DODGE;
	this.lightBmdAnchor.alpha = 1.0;
	this.lightSpriteTemp = this.lightGroup.create( 0, 0, 'torchlight', 0, false );
	//this.lightGroup.create(400, 300, 'player');

	// Static darkness around the edges of the screen
	this.fog = DungeonGame.game.add.sprite( 0, 0, 'fog' );
	this.fog.blendMode = Phaser.blendModes.MULTIPLY;
	this.lightGroup.add( this.fog );
	this.fog.tint = 0xffeeee;
};

LightManager.prototype.update = function ()
{
	this.fog.x = DungeonGame.game.camera.view.x - 8;
	this.fog.y = DungeonGame.game.camera.view.y - 8;

	this.fowBmdAnchor.x = DungeonGame.game.camera.view.x;
	this.fowBmdAnchor.y = DungeonGame.game.camera.view.y;

	this.lightBmdAnchor.x = DungeonGame.game.camera.view.x;
	this.lightBmdAnchor.y = DungeonGame.game.camera.view.y;
};

LightManager.prototype.clear = function ()
{
	this.fowBmd.fill(24, 24, 24, 1.0);
	this.lightBmd.fill(0, 0, 0, 1.0);

	DungeonGame.Audio.toggleMusic('light', false);
};


LightManager.prototype.drawFow = function(x, y, scale=1.0, alpha=1.0)
{
	// BMD is only the size of the screen.
	x -= DungeonGame.game.camera.view.x;
	y -= DungeonGame.game.camera.view.y;

	this.fowSpriteTemp.alpha = alpha;

	var w = scale * this.fowSpriteTemp.width;
	var h = scale * this.fowSpriteTemp.height;
	var px = x - Math.floor( w / 2 );
	var py = y - Math.floor( h / 2 );
	this.fowBmd.draw(this.fowSpriteTemp, px, py, w, h, 'screen', true);
};

LightManager.prototype.drawLight = function(x, y, scale=1.0, alpha=1.0)
{
	// BMD is only the size of the screen.
	x -= DungeonGame.game.camera.view.x;
	y -= DungeonGame.game.camera.view.y;

	this.lightSpriteTemp.alpha = alpha;

	var w = scale * this.lightSpriteTemp.width;
	var h = scale * this.lightSpriteTemp.height;
	var px = x - Math.floor( w / 2 );
	var py = y - Math.floor( h / 2 );
	this.lightBmd.draw(this.lightSpriteTemp, px, py, w, h, 'exclusion', true);

	DungeonGame.Audio.toggleMusic('light', true);
};
