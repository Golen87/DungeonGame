var DungeonGame = DungeonGame || {};

//loading the game assets
DungeonGame.Preload = function() {};

DungeonGame.Preload.prototype = {
	preload: function () {
		
		this.game.stage.backgroundColor = '#111111';

		// Load game assets
		
		this.load.bitmapFont( 'Adventurer', 'assets/fonts/Adventurer/font.png', 'assets/fonts/Adventurer/font.fnt' ); // 16
		//this.load.bitmapFont( 'AdventurerFancy', 'assets/fonts/Adventurer/font_fancy.png', 'assets/fonts/Adventurer/font_fancy.fnt' ); // 16
		this.load.bitmapFont( 'Pixelade', 'assets/fonts/Pixelade/font.png', 'assets/fonts/Pixelade/font.fnt' ); // 13
		this.load.bitmapFont( 'PixeladeFancy', 'assets/fonts/Pixelade/font_fancy.png', 'assets/fonts/Pixelade/font_fancy.fnt' ); // 13
		//this.load.bitmapFont( 'Fraktur', 'assets/fonts/Fraktur/font.png', 'assets/fonts/Fraktur/font.fnt' ); // 16
		this.load.bitmapFont( 'TinyUnicode', 'assets/fonts/TinyUnicode/font.png', 'assets/fonts/TinyUnicode/font.fnt' ); // 16
		this.load.bitmapFont( 'OldWizard', 'assets/fonts/OldWizard/font.png', 'assets/fonts/OldWizard/font.fnt' ); // 16
		//this.load.bitmapFont( 'Peepo', 'assets/fonts/Peepo/font.png', 'assets/fonts/Peepo/font.fnt' ); // 9
		//this.load.bitmapFont( 'Superscript', 'assets/fonts/Superscript/font.png', 'assets/fonts/Superscript/font.fnt' ); // 10
		//this.load.bitmapFont( '04b24', 'assets/fonts/04b24/font.png', 'assets/fonts/04b24/font.fnt' ); // 8

		this.load.spritesheet( 'dungeon', 'assets/sprites/environment/dungeon.png', 16, 16 );
		this.load.spritesheet( 'decoration', 'assets/sprites/environment/decoration.png', 16, 32 );

		this.load.spritesheet( 'entities16', 'assets/sprites/entities/entities16.png', 16, 32 );
		this.load.spritesheet( 'entities32', 'assets/sprites/entities/entities32.png', 32, 32 );
		this.load.spritesheet( 'items', 'assets/sprites/items.png', 16, 16 );

		this.load.image( 'sunshine', 'assets/sprites/lighting/sunshine.png' );
		this.load.image( 'glow', 'assets/sprites/lighting/glow.png' );
		this.load.image( 'torchlight', 'assets/sprites/lighting/torchlight.png' );
		this.load.spritesheet( 'slurgLight', 'assets/sprites/lighting/slurg_light.png', 32, 32 );

		this.load.spritesheet( 'player', 'assets/sprites/player/player_old.png', 16, 16 );
		this.load.spritesheet( 'swing', 'assets/sprites/player/swing.png', 48, 48 );

		this.load.spritesheet( 'imp', 'assets/sprites/enemies/imp.png', 16, 16 );
		this.load.spritesheet( 'slurg', 'assets/sprites/enemies/slurg.png', 16, 16 );
		this.load.spritesheet( 'fry', 'assets/sprites/enemies/fry.png', 16, 32 );
		this.load.spritesheet( 'tarragon', 'assets/sprites/enemies/tarragon.png', 51, 47 );

		this.load.image( 'healthHud', 'assets/sprites/gui/health-hud.png' );
		this.load.image( 'itemHud', 'assets/sprites/gui/item-hud.png' );
		this.load.image( 'corner', 'assets/sprites/gui/corner.png' );
		this.load.image( 'fog', 'assets/sprites/gui/fog.png' );

		this.load.spritesheet( 'smoke', 'assets/sprites/particles/smoke.png', 9, 9 );
		this.load.spritesheet( 'sparkle', 'assets/sprites/particles/sparkle.png', 9, 9 );
		this.load.spritesheet( 'rubble', 'assets/sprites/particles/rubble.png', 5, 5 );
		this.load.spritesheet( 'fire', 'assets/sprites/particles/fire.png', 16, 16 );

		var world = 'test';
		this.load.image( 'floorMap', 'assets/rooms/{0}/floorMap.png'.format(world) );
		this.load.image( 'wallMap', 'assets/rooms/{0}/wallMap.png'.format(world) );
		this.load.image( 'entityMap', 'assets/rooms/{0}/entityMap.png'.format(world) );

		this.load.image( 'camelopardia', 'assets/sprites/camelopardia.png' );


		this.load.audio( 'footsteps', 'assets/sounds/footsteps.ogg' );
		this.load.audio( 'eating', 'assets/sounds/eating.ogg' );
		this.load.audio( 'swing', 'assets/sounds/swing.ogg' );
		this.load.audio( 'chop', 'assets/sounds/chop.ogg' );
		this.load.audio( 'hurt', 'assets/sounds/hurt.ogg' );
		this.load.audio( 'death', 'assets/sounds/death.ogg' );

		this.load.audio( 'break', 'assets/sounds/break.ogg' );
		this.load.audio( 'crystal', 'assets/sounds/crystal.ogg' );
		this.load.audio( 'spikes', 'assets/sounds/spikes.ogg' );
		this.load.audio( 'open', 'assets/sounds/open.ogg' );
		this.load.audio( 'pressureplate', 'assets/sounds/pressureplate.ogg' );

		this.load.audio( 'rat', 'assets/sounds/monsters/rat.ogg' );
		this.load.audio( 'mouse', 'assets/sounds/monsters/mouse.ogg' );
		this.load.audio( 'rhino', 'assets/sounds/monsters/rhino.ogg' );
		this.load.audio( 'spider', 'assets/sounds/monsters/spider.ogg' );
		this.load.audio( 'slime', 'assets/sounds/monsters/slime.ogg' );
		this.load.audio( 'creature', 'assets/sounds/monsters/creature.ogg' );
		this.load.audio( 'monsterroom-spawn', 'assets/sounds/monsters/monsterroom-spawn.ogg' );

		this.load.audio( 'menu', 'assets/sounds/menu.ogg' );


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

		if ( DungeonGame.skip )
			this.state.start( 'Game', Phaser.Plugin.StateTransition.Out.ScaleUp );
		else
			this.state.start( 'MainMenu', Phaser.Plugin.StateTransition.Out.ScaleUp );
	},
	fileComplete: function ( progress, cacheKey, success, totalLoaded, totalFiles ) {}
};
