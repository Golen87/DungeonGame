
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
	this.guiGroup.add( this.cinematicTop );
	this.cinematicBottom = DungeonGame.game.add.graphics( 0, 0 );
	this.cinematicBottom.beginFill( 0x000000, 1.0 );
	this.cinematicBottom.drawRect( 0, SCREEN_HEIGHT - this.cinDist, SCREEN_WIDTH, this.cinDist );
	this.cinematicBottom.endFill();
	this.guiGroup.add( this.cinematicBottom );
	this.cinemaValue = 0;

	this.hpPerc = 1.0;
	this.hpGoal = 1.0;
	this.hpCooldown = 0;
	this.staPerc = 0.0;

	this.hpBar = DungeonGame.game.add.graphics( 0, 0 );
	this.hpBar.beginFill( 0xd9383c, 1.0 );
	this.hpBar.drawRect( 0, 0, 63, 6 );
	this.hpBar.endFill();
	this.guiGroup.add( this.hpBar );

	this.staBar = DungeonGame.game.add.graphics( 0, 0 );
	this.staBar.beginFill( 0x46a04d, 1.0 );
	this.staBar.drawRect( 0, 0, 63, 6 );
	this.staBar.endFill();
	this.guiGroup.add( this.staBar );

	this.hpGui = this.guiGroup.create( 0, 0, 'healthHud' );
	this.hpGui.anchor.setTo( 0.0, 1.0 );

	this.invGui = this.guiGroup.create( 0, 0, 'itemHud' );
	this.invGui.anchor.setTo( 1.0, 1.0 );

	this.invSize = 2;
	this.itemSlot = Array( this.invSize );
	for ( var i = 0; i < this.invSize; i++ )
	{
		this.itemSlot[i] = this.guiGroup.create( 0, 0, 'items', randInt(0,8*9-1) );
		this.itemSlot[i].anchor.setTo( 1.0, 1.0 );

		this.itemSlot[i].label = DungeonGame.game.add.bitmapText( 0, 0, 'TinyUnicode', ' ', 16, this.guiGroup );
		this.itemSlot[i].label.anchor.setTo( 0.0, 1.0 );
	}
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

	this.cinematicTop.x = DungeonGame.game.camera.view.x;
	this.cinematicTop.y = DungeonGame.game.camera.view.y - this.cinDist * ( 2 - this.cinemaValue );
	this.cinematicTop.alpha = this.cinemaValue;

	this.hpBar.x = DungeonGame.game.camera.view.x + 29;
	this.hpBar.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 21 + this.cinDist * this.cinemaValue;
	this.hpBar.alpha = Math.min( 1, 2 - this.cinemaValue );
	this.staBar.x = DungeonGame.game.camera.view.x + 29;
	this.staBar.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 11 + this.cinDist * this.cinemaValue;
	this.staBar.alpha = Math.min( 1, 2 - this.cinemaValue );
	this.hpGui.x = DungeonGame.game.camera.view.x + 1;
	this.hpGui.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 1 + this.cinDist * this.cinemaValue;
	this.hpGui.alpha = Math.min( 1, 2 - this.cinemaValue );

	this.updateHealthBar();

	this.invGui.x = DungeonGame.game.camera.view.x + SCREEN_WIDTH - 1;
	this.invGui.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 1 + this.cinDist * this.cinemaValue;
	this.invGui.alpha = Math.min( 1, 2 - this.cinemaValue );

	for ( var i = 0; i < this.invSize; i++ )
	{
		this.itemSlot[i].x = DungeonGame.game.camera.view.x + SCREEN_WIDTH - 13 - 25 * ( this.invSize - i - 1 );
		this.itemSlot[i].y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 5 + this.cinDist * this.cinemaValue;
		this.itemSlot[i].alpha = Math.min( 1, 2 - this.cinemaValue );

		//this.itemSlot[i].label.text = Math.round(DungeonGame.game.time.totalElapsedSeconds()).toString();
		this.itemSlot[i].label.x = DungeonGame.game.camera.view.x + SCREEN_WIDTH - 29 - 25 * ( this.invSize - i - 1 );
		this.itemSlot[i].label.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 3 + this.cinDist * this.cinemaValue;
		this.itemSlot[i].label.alpha = Math.min( 1, 2 - this.cinemaValue );
	}

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
	this.darkBg.beginFill( 0x000000, 0.75 );
	this.darkBg.drawRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	this.darkBg.endFill();

	this.menu = DungeonGame.game.add.sprite( c.x+SCREEN_WIDTH/2, c.y+SCREEN_HEIGHT/2 + 8, 'items', randInt(0,8*9-1) );
	this.menu.anchor.set( 0.5 );
	this.choiseLabel = DungeonGame.game.add.bitmapText( c.x+SCREEN_WIDTH/2, c.y+SCREEN_HEIGHT/2 - 8, 'Adventurer', 'Paused', 16 );
	this.choiseLabel.anchor.setTo( 0.5, 0.5 );

	this.darkFg = DungeonGame.game.add.graphics( c.x, c.y );
	this.darkFg.beginFill( 0x000000, 0.2 );
	for (var i=0; i<SCREEN_HEIGHT/2; i++)
		this.darkFg.drawRect( 0, i*2, SCREEN_WIDTH, 1 );
	this.darkFg.endFill();
};

GuiManager.prototype.hidePauseMenu = function ()
{
	this.darkBg.clear();
	this.darkFg.clear();
	this.menu.kill();
	this.choiseLabel.kill();
};


GuiManager.prototype.setHealth = function ( hpPerc, staPerc )
{
	if ( this.hpGoal != hpPerc )
	{
		if ( this.hpCooldown < 0 && this.hpPerc != this.hpGoal )
			this.hpPerc = this.hpGoal;

		this.hpGoal = hpPerc;
		this.hpCooldown = 60;
	}

	this.staPerc = staPerc;
};

GuiManager.prototype.updateHealthBar = function ()
{
	var diff = ( this.hpPerc != this.hpGoal );

	this.hpCooldown -= 1;
	if ( this.hpCooldown <= 0 )
	{
		this.hpPerc += (this.hpGoal - this.hpPerc).clamp( -0.01, 0.01 );
	}

	var min = Math.min( this.hpPerc, this.hpGoal );
	var max = Math.max( this.hpPerc, this.hpGoal );
	var warning = this.hpGoal <= 0.2;
	var blinking = ( warning && DungeonGame.game.time.totalElapsedSeconds() % 0.3 < 0.15 );

	if ( diff || warning || this.hpCooldown > -2 )
	{
		this.hpBar.clear();
		this.hpBar.beginFill( 0xecea33, warning && !blinking ? 0.6 : 1.0 );
		this.hpBar.drawRect( 0, 0, Math.floor( 50 * max ), 6 );
		this.hpBar.endFill();
		this.hpBar.beginFill( 0xd9383c, warning && blinking ? 0.6 : 1.0 );
		this.hpBar.drawRect( 0, 0, Math.floor( 50 * min ), 6 );
		this.hpBar.endFill();

		this.staBar.clear();
		this.staBar.beginFill( 0x46a04d, 1.0 );
		this.staBar.drawRect( 0, 0, Math.floor( 50 * this.staPerc ), 6 );
		this.staBar.endFill();
	}
};
