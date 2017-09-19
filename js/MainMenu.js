var DungeonGame = DungeonGame || {};

DungeonGame.MainMenu = function() {};

DungeonGame.MainMenu.prototype = {
	create: function() {
		DungeonGame.game.stage.backgroundColor = '#111111';


		this.obj = [];
		for ( var i = 0; i < 16; i++ )
		{
			this.obj.push( this.add.sprite( 16*i, 104, 'items', randInt(0,8*9-1) ) );
		}

		var text = this.add.bitmapText( SCREEN_WIDTH/2, 48, 'Adventurer', 'DungeonGame', 16 );
		text.anchor.x = 0.5;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, 64, 'PixeladeFancy', 'For a lack of a better title', 13 );
		text.anchor.x = 0.5;
		//var text = this.add.bitmapText( SCREEN_WIDTH/2, 48, 'PixeladeFancy', 'Fancy', 13 );
		//text.anchor.x = 0.5;
		//var text = this.add.bitmapText( SCREEN_WIDTH/2, 64, 'Love', 'Love', 8 );
		//text.anchor.x = 0.5;
		//var text = this.add.bitmapText( SCREEN_WIDTH/2, 80, 'Fraktur', 'Fraktur', 16 );
		//text.anchor.x = 0.5;

		var text = this.add.bitmapText( SCREEN_WIDTH/2, SCREEN_HEIGHT - 32, 'Pixelade', 'Press [space] to start', 13 );
		text.anchor.x = 0.5;

		var start = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
		start.onDown.add( this.startGame, this );

		DungeonGame.Particle.createSmokeTrail( 48, 64 );
		DungeonGame.Particle.createSmokeTrail( SCREEN_WIDTH-48, 64 );
	},
	update: function() {
		//console.log("Update MainMenu");
		//this.state.start( 'Game' );
	},

	startGame: function() {
		this.state.start( 'Game' );
	},
};