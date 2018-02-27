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
		var isFirefox = false;

		var element = document.getElementsByTagName('canvas')[0];
		var style = window.getComputedStyle(element);
		var rect = element.getBoundingClientRect();

		var zoom = style.getPropertyValue('zoom') || style.getPropertyValue('-moz-transform');
		if (isNaN(zoom)) { // Firefox
			isFirefox = true;
			var values = zoom.split('(')[1].split(')')[0].split(',');
			zoom = values[0];
			rect.x /= zoom;
			rect.y /= zoom;
		}
		zoom = parseInt(zoom);

		DungeonGame.inputScale.x = 1 / zoom;
		DungeonGame.inputScale.y = 1 / zoom;
		if (!isFirefox) {
			DungeonGame.inputOffset.x = rect.left * (1 - 1/zoom);
			DungeonGame.inputOffset.y = rect.top * (1 - 1/zoom);
		}
	},

	readSettings: function() {
		if ( readCookie( 'music' ) == 'off' )
			DungeonGame.music = false;
		if ( readCookie( 'sound' ) == 'off' )
			DungeonGame.sound = false;
	},
};
