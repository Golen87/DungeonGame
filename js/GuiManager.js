
// Constructor
function GuiManager()
{
};

GuiManager.prototype.create = function ()
{
	DungeonGame.game.camera.flash(0x111111, 1000);

	this.guiGroup = DungeonGame.game.add.group();

	this.cinDist = 24;
	this.cinematicTop = DungeonGame.game.add.graphics( 0, 0 );
	this.cinematicTop.beginFill( 0x000000, 1.0 );
	this.cinematicTop.drawRect( 0, 0, SCREEN_WIDTH, this.cinDist );
	this.cinematicTop.endFill();
	this.cinematicBottom = DungeonGame.game.add.graphics( 0, 0 );
	this.cinematicBottom.beginFill( 0x000000, 1.0 );
	this.cinematicBottom.drawRect( 0, SCREEN_HEIGHT - this.cinDist, SCREEN_WIDTH, this.cinDist );
	this.cinematicBottom.endFill();
	this.cinemaValue = 0;

	this.healthGui = this.guiGroup.create( 0, 0, 'healthHud' );
	this.healthGui.anchor.setTo( 1.0, 1.0 );
	this.inventoryGui = this.guiGroup.create( 0, 0, 'itemHud' );
	this.inventoryGui.anchor.setTo( 0.0, 1.0 );

	this.itemSlot1 = this.guiGroup.create( 0, 0, 'items', randInt(0,8*9-1) );
	this.itemSlot1.anchor.setTo( 0.0, 1.0 );
	this.itemSlot2 = this.guiGroup.create( 0, 0, 'items', randInt(0,8*9-1) );
	this.itemSlot2.anchor.setTo( 0.0, 1.0 );
	this.itemSlot3 = this.guiGroup.create( 0, 0, 'items', randInt(0,8*9-1) );
	this.itemSlot3.anchor.setTo( 0.0, 1.0 );
};

GuiManager.prototype.update = function ()
{
	if ( DungeonGame.cinematic )
	{
		this.cinemaValue += ( 2 - this.cinemaValue ) / 6;
	}
	else
	{
		this.cinemaValue += ( 0 - this.cinemaValue ) / 6;
	}

	this.healthGui.x = DungeonGame.game.camera.view.x + SCREEN_WIDTH - 1;
	this.healthGui.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 1 + this.cinDist * this.cinemaValue;
	this.healthGui.alpha = Math.min( 1, 2 - this.cinemaValue );

	this.inventoryGui.x = DungeonGame.game.camera.view.x + 1;
	this.inventoryGui.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 1 + this.cinDist * this.cinemaValue;
	this.inventoryGui.alpha = Math.min( 1, 2 - this.cinemaValue );

	this.itemSlot1.x = DungeonGame.game.camera.view.x + 13;
	this.itemSlot1.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 5 + this.cinDist * this.cinemaValue;
	this.itemSlot1.alpha = Math.min( 1, 2 - this.cinemaValue );
	this.itemSlot2.x = DungeonGame.game.camera.view.x + 13 + 25;
	this.itemSlot2.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 5 + this.cinDist * this.cinemaValue;
	this.itemSlot2.alpha = Math.min( 1, 2 - this.cinemaValue );
	this.itemSlot3.x = DungeonGame.game.camera.view.x + 13 + 50;
	this.itemSlot3.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 5 + this.cinDist * this.cinemaValue;
	this.itemSlot3.alpha = Math.min( 1, 2 - this.cinemaValue );

	this.cinematicTop.x = DungeonGame.game.camera.view.x;
	this.cinematicTop.y = DungeonGame.game.camera.view.y - this.cinDist * ( 2 - this.cinemaValue );
	this.cinematicTop.alpha = this.cinemaValue;
	this.cinematicBottom.x = DungeonGame.game.camera.view.x;
	this.cinematicBottom.y = DungeonGame.game.camera.view.y + this.cinDist * ( 2 - this.cinemaValue );
	this.cinematicBottom.alpha = this.cinemaValue;
};

GuiManager.prototype.showPauseMenu = function ()
{
	var c = DungeonGame.game.camera.view;
	this.darkBg = DungeonGame.game.add.graphics( c.x, c.y );
	this.darkBg.beginFill( 0x000000, 0.5 );
	this.darkBg.drawRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	this.darkBg.endFill();
	this.menu = this.guiGroup.create( c.x+16, c.y+16, 'menu' );
	this.choiseLabel = DungeonGame.game.add.bitmapText( c.x+SCREEN_WIDTH/2, c.y+16, 'Adventurer', 'Paused', 16 );
	this.choiseLabel.anchor.setTo( 0.5, 0.5 );
};

GuiManager.prototype.hidePauseMenu = function ()
{
	this.darkBg.clear();
	this.menu.kill();
	this.choiseLabel.kill();
};
