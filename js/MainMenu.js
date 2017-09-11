var DungeonGame = DungeonGame || {};

DungeonGame.MainMenu = function() {};

DungeonGame.MainMenu.prototype = {
	create: function() {
		this.game.stage.backgroundColor = '#111111';

		// Show loading screen
		this.preloadBar = this.add.sprite( 16, 16, 'player', 0 );
		this.preloadBar.anchor.setTo( 0.5 );

		//var style = { font: "16px Adventurer", fill: "#ffffff", align: "center" };
		//var text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "- phaser -\nwith a sprinkle of\npixi dust", style);
		//text.anchor.set(0.5);

		//  And now we'll color in some of the letters
		//text.addColor('#ffff00', 16);
		//text.addColor('#ffffff', 25);

		//text.addColor('#ff00ff', 28);
		//text.addColor('#ffffff', 32);
		this.load.bitmapFont( 'Adventurer', 'assets/fonts/Adventurer/font.png', 'assets/fonts/Adventurer/font.fnt' ); // 16
		this.load.bitmapFont( 'Pixelade', 'assets/fonts/Pixelade/font.png', 'assets/fonts/Pixelade/font.fnt' ); // 13
		this.load.bitmapFont( 'PixeladeFancy', 'assets/fonts/Pixelade/font_fancy.png', 'assets/fonts/Pixelade/font_fancy.fnt' ); // 13
		this.load.bitmapFont( 'Love', 'assets/fonts/Love/font.png', 'assets/fonts/Love/font.fnt' ); // 8
		this.load.bitmapFont( 'Fraktur', 'assets/fonts/Fraktur/font.png', 'assets/fonts/Fraktur/font.fnt' ); // 16

		var text = this.add.bitmapText( this.game.world.centerX, 16, 'Adventurer', 'Adventurer', 16 );
		text.anchor.x = 0.5;
		var text = this.add.bitmapText( this.game.world.centerX, 32, 'Pixelade', 'Pixelade', 13 );
		text.anchor.x = 0.5;
		var text = this.add.bitmapText( this.game.world.centerX, 48, 'PixeladeFancy', 'PixeladeFancy', 13 );
		text.anchor.x = 0.5;
		var text = this.add.bitmapText( this.game.world.centerX, 64, 'Love', 'Love', 8 );
		text.anchor.x = 0.5;
		var text = this.add.bitmapText( this.game.world.centerX, 80, 'Fraktur', 'Fraktur', 16 );
		text.anchor.x = 0.5;

		var text = this.add.bitmapText( this.game.world.centerX, this.game.world.height - 32, 'Adventurer', 'Press [space] to start', 16 );
		text.anchor.x = 0.5;

		var start = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
		start.onDown.add( this.startGame, this );

		DungeonGame.Particle.createSmokeTrail( 64, 64 );
		DungeonGame.Particle.createSmokeTrail( this.game.world.width-64, 64 );
	},
	update: function() {
		//console.log("Update MainMenu");
		//this.state.start( 'Game' );
	},

	startGame: function() {
		this.state.start( 'Game' );
	},
};