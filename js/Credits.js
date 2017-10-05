var DungeonGame = DungeonGame || {};

DungeonGame.Credits = function() {};

DungeonGame.Credits.prototype = {
	create: function() {
		DungeonGame.game.stage.backgroundColor = '#111111';

		var y = 64;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'PixeladeFancy', '- Made by -', 13 );
		text.anchor.x = 0.5;

		y += 16;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'OldWizard', 'Måns Gezelius', 16 );
		text.anchor.x = 0.5;

		y += 16;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'OldWizard', '(Golen)', 16 );
		text.anchor.x = 0.5;

		y += 16;
		y += 16;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'PixeladeFancy', '- Special thanks -', 13 );
		text.anchor.x = 0.5;

		y += 16;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'Pixelade', 'Jefferson "Justice Watch" Marshall', 13 );
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

		//var text = this.add.bitmapText( SCREEN_WIDTH/2, SCREEN_HEIGHT - 32, 'Pixelade', 'Press [space] to play again', 13 );
		//text.anchor.x = 0.5;

		var start = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
		start.onDown.add( this.toMainMenu, this );
		var esc = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.ESC );
		esc.onDown.add( this.toMainMenu, this );
	},
	update: function() {},

	toMainMenu: function() {
		this.state.start( 'MainMenu' );
	},
};