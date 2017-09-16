
var DungeonGame = DungeonGame || {};

DungeonGame.Game = function()
{
	this.World = new World();
};

DungeonGame.Game.prototype =
{
	create: function()
	{
		//  This group will hold the main player + all the tree sprites to depth sort against
		this.World.create();
		DungeonGame.Gui.create();

		this.stage.backgroundColor = '#1c1117';
		this.stage.backgroundColor = '#403020';

		this.debugToggle = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.Q );
		this.shadowToggle = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.F );
		this.cinemaToggle = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.C );
		this.pauseToggle = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.ESC );
	},

	update: function()
	{
		if ( !DungeonGame.paused )
			this.World.update();

		DungeonGame.Gui.update();

		if (this.debugToggle.justDown)
			DungeonGame.debug = !DungeonGame.debug;

		if ( this.shadowToggle.justDown )
			DungeonGame.shadow = !DungeonGame.shadow;

		if ( this.cinemaToggle.justDown )
			DungeonGame.cinematic = !DungeonGame.cinematic;

		if ( this.pauseToggle.justDown )
		{
			DungeonGame.paused = !DungeonGame.paused;
			DungeonGame.game.physics.arcade.isPaused = DungeonGame.paused;

			if ( DungeonGame.paused )
			{
				DungeonGame.Gui.showPauseMenu();
			}
			else
			{
				DungeonGame.Gui.hidePauseMenu();
			}
		}
	},

	render: function()
	{
		this.World.render();
	},
};
