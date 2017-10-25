var DungeonGame = DungeonGame || {};

DungeonGame.MainMenu = function() {};

DungeonGame.MainMenu.prototype = {
	create: function() {
		DungeonGame.game.stage.backgroundColor = '#111111';
		DungeonGame.game.camera.flash( 0x111111, 500 );

		// Particles need to move
		DungeonGame.game.physics.arcade.isPaused = false;


		//this.obj = [];
		//for ( var j = 0; j < 2; j++ )
		//{
		//	for ( var i = 5; i < 10-j; i++ )
		//	{
		//		this.obj.push( this.add.sprite( 16*i + 8*j + 8, 128-8+16*j, 'items', randInt(0,8*9-1) ) );
		//	}
		//}

		var x = SCREEN_WIDTH/2;
		var y = 48;

		/* Title */
		var s = this.add.sprite( x, y-8, 'titleBg' )
		s.scale.set(2);
		s.anchor.set(0.5);

		var text = this.add.bitmapText( x, y, 'Adventurer', 'Dragon\'s Crypt', 16 );
		text.anchor.x = 0.5;

		/* Torches */
		var margin = 54;
		this.timer = 0;

		var fx = margin;
		var fy = y + 16;
		var t = this.add.sprite( fx-8, fy-21, 'entities16', 18 );
		for (var i = 0; i < 2; i++) {
			this.light1 = this.add.sprite( fx, fy, 'torchlight' );
			this.light1.anchor.set( 0.5 );
			this.light1.blendMode = Phaser.blendModes.COLOR_DODGE;
		}
		DungeonGame.Particle.createSmokeTrail( fx, fy );
		DungeonGame.Particle.createFire( fx, fy );

		var fx = SCREEN_WIDTH-margin;
		var fy = y + 16;
		var t = this.add.sprite( fx-8, fy-21, 'entities16', 18 );
		for (var i = 0; i < 2; i++) {
			this.light2 = this.add.sprite( fx, fy, 'torchlight' );
			this.light2.anchor.set( 0.5 );
			this.light2.blendMode = Phaser.blendModes.COLOR_DODGE;
		}
		DungeonGame.Particle.createSmokeTrail( fx, fy );
		DungeonGame.Particle.createFire( fx, fy );

		/* Subtitle */
		y += 20;
		//var text = this.add.bitmapText( x, y, 'PixeladeFancy', 'Kill dragons and stuff', 13 );
		var text = this.add.bitmapText( x, y, 'PixeladeFancy', 'The secret grail', 13 );
		text.anchor.x = 0.5;

		/* Selection menu */
		y += 44;
		this.menuManager = new MenuManager();
		this.setupMenus();
		this.menuManager.createMenu( SCREEN_WIDTH/2, y, this.startMenu );

		this.menuManager.allowInput = false;
		DungeonGame.game.time.events.add( 550, function() {
			this.menuManager.allowInput = true;
		}, this );

		/* Darkness around edges */
		this.fog = DungeonGame.game.add.sprite( 0, 0, 'fog' );
		this.fog.blendMode = Phaser.blendModes.MULTIPLY;

		/* Version */
		var text = this.add.bitmapText( 1, SCREEN_HEIGHT+1, 'Pixelade', 'v1.1', 13 );
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
			this.startGame();
		}

		this.timer += 1;
		if ( this.timer % 2 == 0 )
			this.light1.tint = randInt(0x40, 0x90) * 0x010101;
		if ( this.timer % 2 == 1 )
			this.light2.tint = randInt(0x40, 0x90) * 0x010101;
	},
};


DungeonGame.MainMenu.prototype.setupMenus = function ()
{
	var play = function() { this.startGame(); };
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

DungeonGame.MainMenu.prototype.startGame = function ()
{
	if ( this.menuManager.allowInput )
	{
		this.menuManager.allowInput = false;

		this.camera.fade(0x000000, 700);
		this.time.events.add( 800, function() {
			this.state.start( 'Game' );
		}, this);
	}
};
