var DungeonGame = DungeonGame || {};

DungeonGame.Credits = function() {};

DungeonGame.Credits.prototype = {
	create: function() {
		DungeonGame.game.stage.backgroundColor = '#111111';
		DungeonGame.game.camera.flash( 0x111111, 500 );

		var y = 30;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'PixeladeFancy', '- Made by -', 13 );
		text.anchor.x = 0.5;

		y += 16;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'OldWizard', 'Måns "Golen" Gezelius', 16 );
		text.anchor.x = 0.5;

		y += 16;
		y += 16;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'PixeladeFancy', '- Monster art -', 13 );
		text.anchor.x = 0.5;
		y += 16;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'Pixelade', 'Magdalena "Camelopardia" Annell', 13 );
		text.anchor.x = 0.5;
		var icon = this.add.sprite( SCREEN_WIDTH - 32, y+4, 'camelopardia' );
		icon.anchor.set( 0.5 );
		var icon = this.add.sprite( 32, y+4, 'camelopardia' );
		icon.anchor.set( 0.5 );

		y += 16;
		y += 16;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'PixeladeFancy', '- Special thanks -', 13 );
		text.anchor.x = 0.5;
		y += 16;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'Pixelade', 'Jefferson "Justice Watch" Marshall', 13 );
		text.anchor.x = 0.5;
		y += 16;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'Pixelade', '0x72 Robert', 13 );
		text.anchor.x = 0.5;

		"A Game by Måns Gezelius (Golen)"
		"Credits:"
		"This game is created by (company name)"
		"Copyrighted @ (company name) All rights reserved"

		"Special thanks:"
		"Music soundtrack"
		"Musician name"
		"special thanks"
		"time"

		/* Darkness around edges */
		this.fog = DungeonGame.game.add.sprite( 0, 0, 'fog' );
		this.fog.blendMode = Phaser.blendModes.MULTIPLY;

		/* Copyright */
		var text = this.add.bitmapText( 1, SCREEN_HEIGHT+1, 'Pixelade', '©2017 Golen', 13 );
		text.anchor.set( 0, 1 );
		text.tint = 0x555555;

		var text = this.add.bitmapText( SCREEN_WIDTH-1, SCREEN_HEIGHT+1, 'Pixelade', 'www.golen.nu', 13 );
		text.anchor.set( 1, 1 );
		text.tint = 0x555555;

		//var text = this.add.bitmapText( SCREEN_WIDTH/2, SCREEN_HEIGHT - 32, 'Pixelade', 'Press [space] to play again', 13 );
		//text.anchor.x = 0.5;

		var start = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
		start.onDown.add( this.toMainMenu, this );
		var start = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.ENTER );
		start.onDown.add( this.toMainMenu, this );
		var esc = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.ESC );
		esc.onDown.add( this.toMainMenu, this );
	},
	update: function() {},

	toMainMenu: function() {
		DungeonGame.Audio.play( 'menu', 'click' );
		this.state.start( 'MainMenu' );
	},
};