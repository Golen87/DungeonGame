var DungeonGame = DungeonGame || {};

DungeonGame.Boot = function() {};

DungeonGame.Boot.prototype = {
	preload: function() {
		// Loading screen assets
		this.load.image( 'preloader-bar', 'assets/sprites/preloader-bar.png' );
		//this.load.spritesheet( 'loading-animation', 'assets/sprites/loading.png', 5, 1 );
	},
	create: function() {
		// Physics system
		this.game.physics.startSystem( Phaser.Physics.ARCADE );
		//this.game.time.advancedTiming = true; // Remote later?

		this.state.start( 'Preload' );
	}
};
