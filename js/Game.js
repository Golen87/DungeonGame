
var DungeonGame = DungeonGame || {};

DungeonGame.Game = function()
{
	this.World = new World();
};

DungeonGame.Game.prototype =
{
	create: function()
	{
		this.stage.backgroundColor = '#403020';

		DungeonGame.Gui.create();
		this.World.create();

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
		{
			DungeonGame.debug = !DungeonGame.debug;
			DungeonGame.game.debug.reset();
		}

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

		if ( DungeonGame.game.input.activePointer.isDown )
		{
			var mx = DungeonGame.game.input.x * DungeonGame.inputScale.x - DungeonGame.inputOffset.x;
			var my = DungeonGame.game.input.y * DungeonGame.inputScale.y - DungeonGame.inputOffset.y;

			DungeonGame.input.right = mx > SCREEN_WIDTH * 3/4;
			DungeonGame.input.left = mx < SCREEN_WIDTH * 1/4;
			DungeonGame.input.down = my > SCREEN_HEIGHT * 3/4;
			DungeonGame.input.up = my < SCREEN_HEIGHT * 1/4;
			if ( !DungeonGame.input.justSpaced )
				DungeonGame.input.space = !DungeonGame.input.right && !DungeonGame.input.left && !DungeonGame.input.down && !DungeonGame.input.up;
			else
				DungeonGame.input.space = false;
			DungeonGame.input.justSpaced = true;
		}
		else
		{
			DungeonGame.input.right = false;
			DungeonGame.input.left = false;
			DungeonGame.input.down = false;
			DungeonGame.input.up = false;
			DungeonGame.input.space = false;
			DungeonGame.input.justSpaced = false;
		}
	},

	render: function()
	{
		this.World.render();
	},
};
