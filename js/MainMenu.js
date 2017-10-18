var DungeonGame = DungeonGame || {};

DungeonGame.MainMenu = function() {};

DungeonGame.MainMenu.prototype = {
	create: function() {
		DungeonGame.game.stage.backgroundColor = '#111111';
		DungeonGame.paused = true;

		//this.obj = [];
		//for ( var j = 0; j < 2; j++ )
		//{
		//	for ( var i = 5; i < 10-j; i++ )
		//	{
		//		this.obj.push( this.add.sprite( 16*i + 8*j + 8, 128-8+16*j, 'items', randInt(0,8*9-1) ) );
		//	}
		//}

		var x = SCREEN_WIDTH/2;
		var y = 32;

		/* Title */
		var text = this.add.bitmapText( x, y, 'Adventurer', 'Dragon\'s Crypt', 16 );
		text.anchor.x = 0.5;

		/* Torches */
		var margin = 54;
		DungeonGame.Particle.createSmokeTrail( margin, y );
		DungeonGame.Particle.createSmokeTrail( SCREEN_WIDTH-margin, y );

		/* Subtitle */
		y += 20;
		var text = this.add.bitmapText( x, y, 'PixeladeFancy', 'Kill dragons and stuff', 13 );
		text.anchor.x = 0.5;

		/* Selection menu */
		this.menuManager = new MenuManager();
		this.setupMenus();
		this.menuManager.createMenu( SCREEN_WIDTH/2, 96, this.startMenu );

		//var text = this.add.bitmapText( SCREEN_WIDTH/2, SCREEN_HEIGHT - 32, 'Pixelade', 'Press [space] to start', 13 );
		//text.anchor.x = 0.5;

		/* Version */
		var text = this.add.bitmapText( 1, SCREEN_HEIGHT+1, 'Pixelade', 'v1.0', 13 );
		text.anchor.set( 0, 1 );
		text.tint = 0x555555;

		//this.fire = DungeonGame.game.add.sprite( 32, 32, 'fire', 0 );
		//this.fire.anchor.set( 0.5 );
		//this.fire.animations.add( 'burn', [0,1,2,3,4,5,6,7], 10, true );
		//this.fire.animations.play( 'burn' );
	},
	update: function() {
		this.menuManager.update();

		if ( DungeonGame.game.input.activePointer.isDown )
		{
			this.state.start( 'Game' );
		}
	},
};


DungeonGame.MainMenu.prototype.setupMenus = function ()
{
	var play = function() { this.state.start( 'Game' ); };
	var options = function() { this.menuManager.nextMenu( this.optionsMenu ); };
	var credits = function() { this.state.start( 'Credits' ); };

	this.startMenu = [
		[ 'play', play.bind(this) ],
		[ 'options', options.bind(this) ],
		[ 'credits', credits.bind(this) ],
	];

	function musicText() { return 'music {0}'.format(DungeonGame.music ? 'on' : 'off'); }
	function soundText() { return 'sound {0}'.format(DungeonGame.sound ? 'on' : 'off'); }

	var music = function() {
		DungeonGame.music = !DungeonGame.music;
		createCookie( 'music', DungeonGame.music ? 'on' : 'off', 100 );
		this.optionsMenu[this.menuManager.selection][0] = musicText();
		return musicText();
	};
	var sound = function() {
		DungeonGame.sound = !DungeonGame.sound;
		createCookie( 'sound', DungeonGame.sound ? 'on' : 'off', 100 );
		this.optionsMenu[this.menuManager.selection][0] = soundText();
		return soundText();
	};
	var back = function() { this.menuManager.previousMenu(); };

	this.optionsMenu = [
		[ musicText(), music.bind(this) ],
		[ soundText(), sound.bind(this) ],
		[ 'back', back.bind(this) ],
	];
};
