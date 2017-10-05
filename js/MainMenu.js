var DungeonGame = DungeonGame || {};

DungeonGame.MainMenu = function() {};

DungeonGame.MainMenu.prototype = {
	create: function() {
		DungeonGame.game.stage.backgroundColor = '#111111';


		this.obj = [];
		for ( var j = 0; j < 2; j++ )
		{
			for ( var i = 5; i < 10-j; i++ )
			{
				this.obj.push( this.add.sprite( 16*i + 8*j + 8, 128-8+16*j, 'items', randInt(0,8*9-1) ) );
			}
		}

		var text = this.add.bitmapText( SCREEN_WIDTH/2, 48, 'OldWizard', 'DungeonGame', 32 );
		text.anchor.x = 0.5;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, 64+16, 'PixeladeFancy', 'For a lack of a better title', 13 );
		text.anchor.x = 0.5;

		var text = this.add.bitmapText( SCREEN_WIDTH/2, SCREEN_HEIGHT - 32, 'Pixelade', 'Press [space] to start', 13 );
		text.anchor.x = 0.5;

		var start = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
		var credits = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.ESC );
		start.onDown.add( this.startGame, this );
		credits.onDown.add( this.showCredits, this );

		//this.fire = DungeonGame.game.add.sprite( 32, 32, 'fire', 0 );
		//this.fire.anchor.set( 0.5 );
		//this.fire.animations.add( 'burn', [0,1,2,3,4,5,6,7], 10, true );
		//this.fire.animations.play( 'burn' );

		DungeonGame.Particle.createSmokeTrail( 16, 64 );
		DungeonGame.Particle.createSmokeTrail( SCREEN_WIDTH-16, 64 );
	},
	update: function() {},

	startGame: function() {
		this.state.start( 'Game' );
	},
	showCredits: function() {
		this.state.start( 'Credits' );
	},
};