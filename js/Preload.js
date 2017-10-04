var DungeonGame = DungeonGame || {};

//loading the game assets
DungeonGame.Preload = function() {};

DungeonGame.Preload.prototype = {
	preload: function () {
		
		this.game.stage.backgroundColor = '#111111';

		// Show loading screen
		this.preloadBar = this.add.sprite( this.game.world.centerX, this.game.world.centerY, 'preloader-bar' );
		this.preloadBar.anchor.setTo( 0.5 );

		this.load.setPreloadSprite( this.preloadBar );

		//this.loadingAnimation = this.add.sprite( 0, this.game.world.height, 'loading-animation', 0 );
		//this.loadingAnimation.anchor.set( 0, 1 );
		//this.loadingAnimation.scale.set( 4, 4 );
		//this.loadingAnimation.animations.add( 'loading', [0,1,2,3,4,5], 8, true );
		//this.loadingAnimation.animations.play( 'loading' );
		//this.loadingAnimation.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

		// Load game assets
		
		this.load.bitmapFont( 'Adventurer', 'assets/fonts/Adventurer/font.png', 'assets/fonts/Adventurer/font.fnt' ); // 16
		this.load.bitmapFont( 'Pixelade', 'assets/fonts/Pixelade/font.png', 'assets/fonts/Pixelade/font.fnt' ); // 13
		this.load.bitmapFont( 'PixeladeFancy', 'assets/fonts/Pixelade/font_fancy.png', 'assets/fonts/Pixelade/font_fancy.fnt' ); // 13
		//this.load.bitmapFont( 'Love', 'assets/fonts/Love/font.png', 'assets/fonts/Love/font.fnt' ); // 8
		//this.load.bitmapFont( 'Fraktur', 'assets/fonts/Fraktur/font.png', 'assets/fonts/Fraktur/font.fnt' ); // 16
		this.load.bitmapFont( 'TinyUnicode', 'assets/fonts/TinyUnicode/font.png', 'assets/fonts/TinyUnicode/font.fnt' ); // 16
		//this.load.bitmapFont( 'OldWizard', 'assets/fonts/OldWizard/font.png', 'assets/fonts/OldWizard/font.fnt' ); // 16
		//this.load.bitmapFont( 'Peepo', 'assets/fonts/Peepo/font.png', 'assets/fonts/Peepo/font.fnt' ); // 9
		//this.load.bitmapFont( 'Superscript', 'assets/fonts/Superscript/font.png', 'assets/fonts/Superscript/font.fnt' ); // 10
		//this.load.bitmapFont( '04b24', 'assets/fonts/04b24/font.png', 'assets/fonts/04b24/font.fnt' ); // 8

		this.load.spritesheet( 'dungeon', 'assets/sprites/dungeon.png', 16, 16 );
		this.load.spritesheet( 'decoration', 'assets/sprites/decoration.png', 16, 32 );

		this.load.spritesheet( 'entities16', 'assets/sprites/entities16.png', 16, 32 );
		this.load.spritesheet( 'entities32', 'assets/sprites/entities32.png', 32, 32 );
		this.load.spritesheet( 'items', 'assets/sprites/items.png', 16, 16 );
		this.load.spritesheet( 'enemy', 'assets/sprites/enemy.png', 16, 16 );
		this.load.spritesheet( 'player', 'assets/sprites/player.png', 16, 16 );
		this.load.spritesheet( 'wings', 'assets/sprites/wings.png', 32, 32 );
		this.load.spritesheet( 'swing', 'assets/sprites/swing.png', 48, 48 );

		this.load.image( 'healthHud', 'assets/sprites/gui/health-hud.png' );
		this.load.image( 'itemHud', 'assets/sprites/gui/item-hud.png' );

		this.load.spritesheet( 'smoke', 'assets/sprites/particles/smoke.png', 9, 9 );
		this.load.spritesheet( 'sparkle', 'assets/sprites/particles/sparkle.png', 9, 9 );
		this.load.spritesheet( 'rubble', 'assets/sprites/particles/rubble.png', 5, 5 );
		this.load.spritesheet( 'fire', 'assets/sprites/particles/fire.png', 8, 12 );

		//this.load.image( 'map', 'assets/rooms/map.png' );
		//this.load.image( 'overworld', 'assets/rooms/overworld.png' );
		this.load.image( 'floorMap', 'assets/rooms/floorMap.png' );
		this.load.image( 'wallMap', 'assets/rooms/wallMap.png' );
		this.load.image( 'entityMap', 'assets/rooms/entityMap.png' );


		this.load.audio( 'footsteps', 'assets/sounds/footsteps.ogg' );
		this.load.audio( 'eating', 'assets/sounds/eating.ogg' );
		this.load.audio( 'swing', 'assets/sounds/swing.ogg' );
		this.load.audio( 'chop', 'assets/sounds/chop.ogg' );
		this.load.audio( 'hurt', 'assets/sounds/hurt.ogg' );
		this.load.audio( 'death', 'assets/sounds/death.ogg' );

		this.load.audio( 'break', 'assets/sounds/break.ogg' );
		this.load.audio( 'crystal', 'assets/sounds/crystal.ogg' );
		this.load.audio( 'spikes', 'assets/sounds/spikes.ogg' );

		this.load.audio( 'rat', 'assets/sounds/monsters/rat.ogg' );
		this.load.audio( 'mouse', 'assets/sounds/monsters/mouse.ogg' );
		this.load.audio( 'rhino', 'assets/sounds/monsters/rhino.ogg' );
		this.load.audio( 'spider', 'assets/sounds/monsters/spider.ogg' );
		this.load.audio( 'slime', 'assets/sounds/monsters/slime.ogg' );
		this.load.audio( 'creature', 'assets/sounds/monsters/creature.ogg' );


		// Loading percentage text
		//this.progress = this.game.add.text(this.game.world.centerX, this.game.world.centerY-30, '0%', {fill: 'white'});
		//this.progress.anchor.setTo(.5,.5);

		// Loading progress bar
		var x = this.game.world.centerX - this.game.cache.getImage( 'preloader-bar' ).width / 2;
		var y = this.game.world.centerY;
		var progressBg = this.game.add.sprite( x, y, 'preloader-bar' );
		var progressFg = this.game.add.sprite( x, y, 'preloader-bar' );
		progressBg.tint = 0x444444;
		progressBg.anchor.setTo( 0, 0.5 );
		progressFg.anchor.setTo( 0, 0.5 );
		this.game.load.setPreloadSprite( progressFg );
		this.game.load.onFileComplete.add( this.fileComplete, this );

	},
	setup: function () {
		DungeonGame.Audio = new AudioManager();
		DungeonGame.Particle = new ParticleManager();
		DungeonGame.Gui = new GuiManager();
	},
	create: function () {
		this.setup();

		this.state.start( 'MainMenu' );
		//this.state.start( 'Game' );
	},
	fileComplete: function ( progress, cacheKey, success, totalLoaded, totalFiles ) {}
};
