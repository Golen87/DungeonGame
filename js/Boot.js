var DungeonGame = DungeonGame || {};

DungeonGame.Boot = function() {};

DungeonGame.Boot.prototype = {
	preload: function() {
		// Loading screen assets
		this.load.image( 'preloader-bar', 'assets/sprites/preloader-bar.png' );
	},
	create: function() {
		// Physics system
		this.game.physics.startSystem( Phaser.Physics.ARCADE );

		this.state.start( 'Preload' );
	}
};
