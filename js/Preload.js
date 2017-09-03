var DungeonGame = DungeonGame || {};

//loading the game assets
DungeonGame.Preload = function() {};

DungeonGame.Preload.prototype = {
	preload: function() {
		
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
		
		//this.load.audio('Adventure', 'https://archive.org/download/OldRunescapeSoundtrack/Adventure.mp3' )
		//this.load.audio('Al Kharid', 'https://archive.org/download/OldRunescapeSoundtrack/Al Kharid.mp3' )
		//this.load.audio('Alone', 'https://archive.org/download/OldRunescapeSoundtrack/Alone.mp3' )
		//this.load.audio('Ambient Jungle', 'https://archive.org/download/OldRunescapeSoundtrack/Ambient Jungle.mp3' )
		//this.load.audio('Anywhere', 'https://archive.org/download/OldRunescapeSoundtrack/Anywhere.mp3' )

		this.load.spritesheet( 'dungeon', 'assets/sprites/dungeon.png', 16, 16 );
		this.load.spritesheet( 'player', 'assets/sprites/player.png', 16, 16 );

		this.load.spritesheet( 'map', 'assets/rooms/map.png', 16, 15 );


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
		//this.game.load.onFileComplete.add( this.fileComplete, this );

	},
	create: function() {
		this.state.start( 'Game' );
	},
	//fileComplete: function (progress, cacheKey, success, totalLoaded, totalFiles) {
	//	this.progress.text = progress+"%";
	//}
};