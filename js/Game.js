
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


		this.stage.backgroundColor = '#1c1117';
		this.stage.backgroundColor = '#403020';

		this.debugToggle = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.Q );
		this.shadowToggle = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.F );
		this.cinemaToggle = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.C );
		this.pauseToggle = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.ESC );

		this.game.camera.flash(0x111111, 1000);

		this.cinematicTop = DungeonGame.game.add.graphics( 0, 0 );
		this.cinematicTop.beginFill( 0x000000, 1.0 );
		this.cinematicTop.drawRect( 0, 0, SCREEN_WIDTH, 16 );
		this.cinematicTop.endFill();
		this.cinematicBottom = DungeonGame.game.add.graphics( 0, 0 );
		this.cinematicBottom.beginFill( 0x000000, 1.0 );
		this.cinematicBottom.drawRect( 0, SCREEN_HEIGHT - 16, SCREEN_WIDTH, 16 );
		this.cinematicBottom.endFill();
		this.cinemaValue = 0;
		this.cinemaOn = false;

		this.healthGui = DungeonGame.game.add.sprite( 0, 0, 'healthHud' );
		this.healthGui.anchor.setTo( 1.0, 1.0 );
		this.inventoryGui = DungeonGame.game.add.sprite( 0, 0, 'itemHud' );
		this.inventoryGui.anchor.setTo( 0.0, 1.0 );

		this.itemSlot1 = DungeonGame.game.add.sprite( 0, 0, 'items', randInt(0,8*9-1) );
		this.itemSlot1.anchor.setTo( 0.0, 1.0 );
		this.itemSlot2 = DungeonGame.game.add.sprite( 0, 0, 'items', randInt(0,8*9-1) );
		this.itemSlot2.anchor.setTo( 0.0, 1.0 );
		this.itemSlot3 = DungeonGame.game.add.sprite( 0, 0, 'items', randInt(0,8*9-1) );
		this.itemSlot3.anchor.setTo( 0.0, 1.0 );
	},

	update: function()
	{
		if ( !DungeonGame.paused )
			this.World.update();

		if (this.debugToggle.justDown)
			DungeonGame.debug = !DungeonGame.debug;

		if ( this.shadowToggle.justDown )
			DungeonGame.shadow = !DungeonGame.shadow;

		if ( this.pauseToggle.justDown )
		{
			DungeonGame.paused = !DungeonGame.paused;
			this.game.physics.arcade.isPaused = DungeonGame.paused;

			if ( DungeonGame.paused )
			{
				var c = this.game.camera.view;
				this.menuGraphics = DungeonGame.game.add.graphics( c.x, c.y );
				this.menuGraphics.beginFill( 0x000000, 0.5 );
				this.menuGraphics.drawRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
				this.menuGraphics.endFill();
				this.menu = DungeonGame.game.add.sprite( c.x+16, c.y+16, 'menu' );
				this.choiseLabel = this.add.bitmapText( c.x+SCREEN_WIDTH/2, c.y+16, 'Adventurer', 'Paused', 16 );
				this.choiseLabel.anchor.setTo( 0.5, 0.5 );
			}
			else
			{
				this.menuGraphics.clear();
				this.menu.kill();
				this.choiseLabel.kill();
			}
		}

		if ( this.cinemaToggle.justDown )
			this.cinemaOn = !this.cinemaOn;

		if ( this.cinemaOn )
		{
			this.cinemaValue += ( 2 - this.cinemaValue ) / 10;
		}
		else
		{
			this.cinemaValue += ( 0 - this.cinemaValue ) / 10;
		}

		this.healthGui.x = this.game.camera.view.x + SCREEN_WIDTH - 1;
		this.healthGui.y = this.game.camera.view.y + SCREEN_HEIGHT - 1 + 16 * this.cinemaValue;
		this.healthGui.alpha = Math.min( 1, 2 - this.cinemaValue );

		this.inventoryGui.x = this.game.camera.view.x + 1;
		this.inventoryGui.y = this.game.camera.view.y + SCREEN_HEIGHT - 1 + 16 * this.cinemaValue;
		this.inventoryGui.alpha = Math.min( 1, 2 - this.cinemaValue );

		this.itemSlot1.x = this.game.camera.view.x + 13;
		this.itemSlot1.y = this.game.camera.view.y + SCREEN_HEIGHT - 5 + 16 * this.cinemaValue;
		this.itemSlot1.alpha = Math.min( 1, 2 - this.cinemaValue );
		this.itemSlot2.x = this.game.camera.view.x + 13 + 25;
		this.itemSlot2.y = this.game.camera.view.y + SCREEN_HEIGHT - 5 + 16 * this.cinemaValue;
		this.itemSlot2.alpha = Math.min( 1, 2 - this.cinemaValue );
		this.itemSlot3.x = this.game.camera.view.x + 13 + 50;
		this.itemSlot3.y = this.game.camera.view.y + SCREEN_HEIGHT - 5 + 16 * this.cinemaValue;
		this.itemSlot3.alpha = Math.min( 1, 2 - this.cinemaValue );

		this.cinematicTop.x = this.game.camera.view.x;
		this.cinematicTop.y = this.game.camera.view.y - 16 * ( 2 - this.cinemaValue );
		this.cinematicTop.alpha = this.cinemaValue;
		this.cinematicBottom.x = this.game.camera.view.x;
		this.cinematicBottom.y = this.game.camera.view.y + 16 * ( 2 - this.cinemaValue );
		this.cinematicBottom.alpha = this.cinemaValue;
	},

	render: function()
	{
		this.World.render();
	},
};
