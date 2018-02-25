
var DungeonGame = DungeonGame || {};

DungeonGame.Game = function()
{
	this.World = new World();
	DungeonGame.World = this.World;
};

DungeonGame.Game.prototype =
{
	create: function()
	{
		this.stage.backgroundColor = '#403020';

		DungeonGame.debug = false;
		DungeonGame.shadow = false;
		DungeonGame.paused = false;
		DungeonGame.cinematic = true;
		DungeonGame.game.physics.arcade.isPaused = false;

		DungeonGame.Gui.create();
		this.World.create();

		this.debugToggle = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.Q );
		this.shadowToggle = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.F );
		this.cinemaToggle = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.C );
		this.pauseToggle = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.ESC );

		this.skipShift = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.SHIFT );
		this.skipToggle = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.O );

		var key = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.ESC );
		key.onDown.add( this.togglePause, this );
		var key = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.P );
		key.onDown.add( this.togglePause, this );

		this.mousePosition = new Phaser.Point( 0, 0 );
		this.holdPosition = new Phaser.Point( 0, 0 );

		DungeonGame.togglePause = DungeonGame.Game.prototype.togglePause.bind( this );
	},

	update: function()
	{
		DungeonGame.Gui.clear();

		if ( !DungeonGame.paused )
			this.World.update();

		DungeonGame.Gui.update();

		if ( this.skipShift.isDown && this.skipToggle.isDown )
		{
			DungeonGame.skip = true;
		}

		if ( DungeonGame.skip )
		{
			if ( this.debugToggle.justDown )
			{
				DungeonGame.debug = !DungeonGame.debug;
				DungeonGame.game.debug.reset();
			}

			if ( this.shadowToggle.justDown )
				DungeonGame.shadow = !DungeonGame.shadow;

			if ( this.cinemaToggle.justDown )
				DungeonGame.cinematic = !DungeonGame.cinematic;
		}

		this.handleMouseInput();
	},

	render: function()
	{
		this.World.render();
	},

	togglePause: function()
	{
		if ( !DungeonGame.cinematic )
		{
			DungeonGame.paused = !DungeonGame.paused;
			DungeonGame.game.physics.arcade.isPaused = DungeonGame.paused;
			this.World.pause( DungeonGame.paused );

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

	handleMouseInput: function()
	{
		if ( DungeonGame.game.input.activePointer.isDown )
		{
			this.mousePosition.set(
				DungeonGame.game.input.x * DungeonGame.inputScale.x - DungeonGame.inputOffset.x,
				DungeonGame.game.input.y * DungeonGame.inputScale.y - DungeonGame.inputOffset.y,
			);

			if ( this.leftDown == null )
			{
				this.leftDown = true;
				this.holdTimestamp = DungeonGame.game.time.totalElapsedSeconds();
				this.holdPosition.copyFrom( this.mousePosition );
			}

			var playerScreenPos = new Phaser.Point(
				DungeonGame.World.Player.sprite.position.x - DungeonGame.World.camPos.x,
				DungeonGame.World.Player.sprite.position.y - DungeonGame.World.camPos.y
			);

			if ( playerScreenPos.distance( this.mousePosition ) > 4 )
			{
				var angle = playerScreenPos.angle( this.mousePosition );
				DungeonGame.input.right = ( angle < Math.PI*3/8 && angle > -Math.PI*3/8 );
				DungeonGame.input.left = ( angle < -Math.PI*5/8 || angle > Math.PI*5/8 );
				DungeonGame.input.up = ( angle < -Math.PI*1/8 && angle > -Math.PI*7/8 );
				DungeonGame.input.down = ( angle < Math.PI*7/8 && angle > Math.PI*1/8 );
			}
			else
			{
				DungeonGame.input.right = false;
				DungeonGame.input.left = false;
				DungeonGame.input.up = false;
				DungeonGame.input.down = false;
			}

			/*if ( this.holdPosition.distance( this.mousePosition ) > 16 )
			{
				var angle = this.holdPosition.angle( this.mousePosition );
				DungeonGame.input.right = ( angle < Math.PI*3/8 && angle > -Math.PI*3/8 );
				DungeonGame.input.left = ( angle < -Math.PI*5/8 || angle > Math.PI*5/8 );
				DungeonGame.input.up = ( angle < -Math.PI*1/8 && angle > -Math.PI*7/8 );
				DungeonGame.input.down = ( angle < Math.PI*7/8 && angle > Math.PI*1/8 );
			}
			if ( this.holdPosition.distance( this.mousePosition ) > 64 )
			{
				this.holdPosition.x += ( this.mousePosition.x - this.holdPosition.x ) / 3;
				this.holdPosition.y += ( this.mousePosition.y - this.holdPosition.y ) / 3;
			}*/
		}
		else
		{
			DungeonGame.input.space = false;

			if ( this.leftDown == true )
			{
				this.leftDown = null;
				var dt = DungeonGame.game.time.totalElapsedSeconds() - this.holdTimestamp;
				if ( dt < 0.2 )
				{
					DungeonGame.input.space = true;
				}

				DungeonGame.input.right = false;
				DungeonGame.input.left = false;
				DungeonGame.input.down = false;
				DungeonGame.input.up = false;
			}
		}
	},
};
