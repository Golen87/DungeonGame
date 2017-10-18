var DungeonGame = DungeonGame || {};

DungeonGame.Boot = function() {};

DungeonGame.Boot.prototype = {
	preload: function() {
		// Loading screen assets
		this.load.image( 'preloader-bar', 'assets/sprites/gui/preloader-bar.png' );
		//this.load.spritesheet( 'loading-animation', 'assets/sprites/gui/loading.png', 5, 1 );
	},
	create: function() {
		// Physics system
		this.game.physics.startSystem( Phaser.Physics.ARCADE );
		this.game.time.advancedTiming = true; // Remote later?

		this.rescale();
		this.game.scale.setResizeCallback(function () {
			this.rescale();
		}, this);

		this.readSettings();

		this.state.start( 'Preload' );
	},

	rescale: function() {
		var element = document.getElementsByTagName('canvas')[0],
		style = window.getComputedStyle(element),
		zoom = style.getPropertyValue('zoom');
		var rect = element.getBoundingClientRect();

		DungeonGame.inputScale.x = 1 / zoom;
		DungeonGame.inputScale.y = 1 / zoom;
		DungeonGame.inputOffset.x = rect.left * (1 - 1/zoom); //rect.width / zoom / 4
		DungeonGame.inputOffset.y = rect.top * (1 - 1/zoom); //rect.height / zoom / 4
	},

	readSettings: function() {
		if ( readCookie( 'music' ) == 'off' )
			DungeonGame.music = false;
		if ( readCookie( 'sound' ) == 'off' )
			DungeonGame.sound = false;
	},
};
