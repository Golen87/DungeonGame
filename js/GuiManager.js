
// Constructor
function GuiManager()
{
};

GuiManager.prototype.create = function ()
{
	this.guiGroup = DungeonGame.game.add.group();


	/* Pause menu */

	this.menuManager = new MenuManager();
	this.setupMenus();
	this.menuManager.allowInput = false;


	/* General darkness */

	this.fog = DungeonGame.game.add.sprite( 0, 0, 'fog' );
	this.fog.blendMode = Phaser.blendModes.MULTIPLY;
	this.guiGroup.add( this.fog );
	this.fog.tint = 0xffeeee;


	/* Cinematic mode GUI */

	this.cinDist = 32;
	this.cinOffset = 104;
	this.cinematicTop = DungeonGame.game.add.graphics( 0, 0 );
	this.cinematicTop.beginFill( 0xFFFFFF, 1.0 );
	this.cinematicTop.tint = 0x000000;
	this.cinematicTop.drawRect( 0, -this.cinOffset, SCREEN_WIDTH, this.cinDist + this.cinOffset );
	this.cinematicTop.endFill();
	this.guiGroup.add( this.cinematicTop );
	this.cinematicBottom = DungeonGame.game.add.graphics( 0, 0 );
	this.cinematicBottom.beginFill( 0xFFFFFF, 1.0 );
	this.cinematicBottom.tint = 0x000000;
	this.cinematicBottom.drawRect( 0, SCREEN_HEIGHT - this.cinDist, SCREEN_WIDTH, this.cinDist + this.cinOffset );
	this.cinematicBottom.endFill();
	this.guiGroup.add( this.cinematicBottom );
	this.cinemaValue = 5;


	/* Health GUI */

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


	/* Inventory GUI */

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


	/* Chest effects */

	this.chestBeam = this.guiGroup.create( 0, 0, 'sunshine' );
	this.chestBeam.blendMode = Phaser.blendModes.COLOR_DODGE;
	this.chestBeam.anchor.set(0.5);
	this.chestBeam.alpha = 1.0;
	this.chestBeam.kill();

	this.chestItem = this.guiGroup.create( 0, 0, 'items' );
	this.chestItem.anchor.set( 0.5 );
	this.chestItem.kill();
};

GuiManager.prototype.update = function ()
{
	this.menuManager.update();

	this.fog.x = DungeonGame.game.camera.view.x - 8;
	this.fog.y = DungeonGame.game.camera.view.y - 8;

	if ( this.startupTimer == null )
		this.startupTimer = 3;
	if ( this.startupTimer > 0 )
		this.startupTimer -= 1;

	if ( DungeonGame.cinematic )
	{
		if ( this.startupTimer == 0 )
			this.cinemaValue += ( 2 - this.cinemaValue ) / 6;
	}
	else
	{
		this.cinemaValue += ( 0 - this.cinemaValue ) / 6;
	}

	this.cinematicTop.x = DungeonGame.game.camera.view.x;
	this.cinematicTop.y = DungeonGame.game.camera.view.y - this.cinDist * ( 2 - this.cinemaValue );
	this.cinematicBottom.x = DungeonGame.game.camera.view.x;
	this.cinematicBottom.y = DungeonGame.game.camera.view.y + this.cinDist * ( 2 - this.cinemaValue );

	this.hpBar.x = DungeonGame.game.camera.view.x + 29;
	this.hpBar.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 21 + this.cinDist * this.cinemaValue;
	this.staBar.x = DungeonGame.game.camera.view.x + 29;
	this.staBar.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 11 + this.cinDist * this.cinemaValue;
	this.hpGui.x = DungeonGame.game.camera.view.x + 1;
	this.hpGui.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 1 + this.cinDist * this.cinemaValue;

	this.updateHealthBar();

	this.invGui.x = DungeonGame.game.camera.view.x + SCREEN_WIDTH - 1;
	this.invGui.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 1 + this.cinDist * this.cinemaValue;

	for ( var i = 0; i < this.invSize; i++ )
	{
		this.itemSlot[i].x = DungeonGame.game.camera.view.x + SCREEN_WIDTH - 13 - 25 * ( this.invSize - i - 1 );
		this.itemSlot[i].y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 5 + this.cinDist * this.cinemaValue;

		//this.itemSlot[i].label.text = Math.round(DungeonGame.game.time.totalElapsedSeconds()).toString();
		this.itemSlot[i].label.x = DungeonGame.game.camera.view.x + SCREEN_WIDTH - 29 - 25 * ( this.invSize - i - 1 );
		this.itemSlot[i].label.y = DungeonGame.game.camera.view.y + SCREEN_HEIGHT - 3 + this.cinDist * this.cinemaValue;
	}

	this.chestBeam.angle += 0.5;
};


GuiManager.prototype.setupMenus = function ()
{
	var resume = function() { DungeonGame.togglePause(); };
	var options = function() { this.menuManager.nextMenu( this.optionsMenu ); };
	var quit = function() { this.menuManager.nextMenu( this.confirmationMenu ); };

	this.pauseMenu = [
		[ 'resume', resume.bind(this) ],
		[ 'options', options.bind(this) ],
		[ 'quit', quit.bind(this) ],
	];

	function musicText() { return 'music {0}'.format(DungeonGame.music ? 'on' : 'off'); }
	function soundText() { return 'sound {0}'.format(DungeonGame.sound ? 'on' : 'off'); }

	var music = function() {
		DungeonGame.music = !DungeonGame.music;
		createCookie( 'music', DungeonGame.music ? 'on' : 'off', 100 );
		this.optionsMenu[this.menuManager.selection][0] = musicText();
		return musicText();
	};
	var sound = function() {
		DungeonGame.sound = !DungeonGame.sound;
		createCookie( 'sound', DungeonGame.sound ? 'on' : 'off', 100 );
		this.optionsMenu[this.menuManager.selection][0] = soundText();
		return soundText();
	};
	var back = function() { this.menuManager.previousMenu(); };

	this.optionsMenu = [
		[ musicText(), music.bind(this) ],
		[ soundText(), sound.bind(this) ],
		[ 'back', back.bind(this) ],
	];

	var exit = function() {
		if ( this.menuManager.allowInput )
		{
			this.menuManager.allowInput = false;

			DungeonGame.game.camera.fade(0x111111, 700);
			DungeonGame.game.time.events.add( 700, function() {
				DungeonGame.game.state.start( 'MainMenu' );
			}, this);
		}
	};

	this.confirmationMenu = [
		[ 'sure', exit.bind(this) ],
		[ 'no', back.bind(this) ],
	];

	this.gameoverMenu = [
		[ 'Try again', exit.bind(this) ],
	];
};

GuiManager.prototype.showPauseMenu = function ()
{
	this.menuManager.allowInput = true;

	var c = DungeonGame.game.camera.view;

	this.darkBg = DungeonGame.game.add.graphics( c.x, c.y );
	this.darkBg.beginFill( 0x000000, 0.75 );
	this.darkBg.drawRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	this.darkBg.endFill();

	this.darkFg = DungeonGame.game.add.graphics( c.x, c.y );
	this.darkFg.beginFill( 0x000000, 0.2 );
	for (var i=0; i<SCREEN_HEIGHT/2; i++)
		this.darkFg.drawRect( 0, i*2, SCREEN_WIDTH, 1 );
	this.darkFg.endFill();

	var x = c.x+SCREEN_WIDTH/2;
	var y = c.y + 32;

	this.choiceTitle = DungeonGame.game.add.bitmapText( x, y, 'OldWizard', 'Pause', 16 );
	this.choiceTitle.anchor.setTo( 0.5, 0.5 );
	y += 28;
	this.menuItem = DungeonGame.game.add.sprite( x, y, 'items', randInt(0,8*9-1) );
	this.menuItem.anchor.set( 0.5 );

	y += 28;
	this.menuManager.createMenu( x, y, this.pauseMenu );

	DungeonGame.Audio.play( 'menu', 'open' );
};

GuiManager.prototype.hidePauseMenu = function ()
{
	this.menuManager.allowInput = false;

	this.darkBg.clear();
	this.darkFg.clear();
	this.menuItem.kill();
	this.choiceTitle.kill();

	this.menuManager.killMenu();

	DungeonGame.Audio.play( 'menu', 'close' );
};


GuiManager.prototype.showGameOver = function ()
{
	var c = DungeonGame.game.camera.view;

	var x = c.x + SCREEN_WIDTH/2;
	var y = c.y + SCREEN_HEIGHT/2;

	this.darkBg = DungeonGame.game.add.graphics( c.x, c.y );
	this.darkBg.beginFill( 0x000000, 0.75 );
	this.darkBg.drawRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	this.darkBg.endFill();
	this.darkBg.alpha = 0;
	this.darkBg.blendMode = Phaser.blendModes.OVERLAY;
	DungeonGame.game.add.tween( this.darkBg ).to({ alpha: 0.5 }, 1500, Phaser.Easing.Linear.In, true );

	this.choiceTitleBg = DungeonGame.game.add.bitmapText( x+1, y+1, 'OldWizard', 'Game Over', 32 );
	this.choiceTitleBg.anchor.setTo( 0.5, 0.5 );
	this.choiceTitleBg.tint = 0x000000;
	this.choiceTitle = DungeonGame.game.add.bitmapText( x, y, 'OldWizard', 'Game Over', 32 );
	this.choiceTitle.anchor.setTo( 0.5, 0.5 );
	this.choiceTitle.tint = 0xE64A19;

	this.choiceTitle.x -= 16;
	this.choiceTitle.alpha = 0;
	this.choiceTitleBg.x += 16;
	this.choiceTitleBg.alpha = 0;
	DungeonGame.game.add.tween( this.choiceTitle ).to({ x: x, alpha: 1 }, 1500, Phaser.Easing.Quadratic.Out, true );
	DungeonGame.game.add.tween( this.choiceTitleBg ).to({ x: x+1, alpha: 1 }, 1500, Phaser.Easing.Quadratic.Out, true );

	DungeonGame.game.time.events.add( 2000, function() {
		var x = c.x + SCREEN_WIDTH/2;
		var y = c.y + SCREEN_HEIGHT - 20;
		this.menuManager.allowInput = true;
		this.menuManager.createMenu( x, y, this.gameoverMenu );
	}, this );
};

GuiManager.prototype.showVictory = function ()
{
	var c = DungeonGame.game.camera.view;

	var x = c.x + SCREEN_WIDTH/2;
	var y = c.y + SCREEN_HEIGHT/2;

	this.darkBg = DungeonGame.game.add.graphics( c.x, c.y );
	this.darkBg.beginFill( 0x000000, 0.75 );
	this.darkBg.drawRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	this.darkBg.endFill();
	this.darkBg.alpha = 0;
	this.darkBg.blendMode = Phaser.blendModes.OVERLAY;
	DungeonGame.game.add.tween( this.darkBg ).to({ alpha: 0.5 }, 1500, Phaser.Easing.Linear.In, true );

	this.choiceTitleBg = DungeonGame.game.add.bitmapText( x+1, y+1, 'OldWizard', 'You Won', 32 );
	this.choiceTitleBg.anchor.setTo( 0.5, 0.5 );
	this.choiceTitleBg.tint = 0x000000;
	this.choiceTitle = DungeonGame.game.add.bitmapText( x, y, 'OldWizard', 'You Won', 32 );
	this.choiceTitle.anchor.setTo( 0.5, 0.5 );
	this.choiceTitle.tint = 0xFBC02D;

	if ( DungeonGame.World.Player.hasItem( 71 ) )
	{
		this.grail = DungeonGame.game.add.sprite( c.x + SCREEN_WIDTH/2, c.y + SCREEN_HEIGHT - 16, 'items', 71 );
		this.grail.anchor.set( 0.5 );
		this.grail.alpha = 0;
		DungeonGame.game.add.tween( this.grail ).to({ alpha: 1 }, 1500, Phaser.Easing.Quadratic.In, true );
	}

	this.choiceTitle.x -= 16;
	this.choiceTitle.alpha = 0;
	this.choiceTitleBg.x += 16;
	this.choiceTitleBg.alpha = 0;
	DungeonGame.game.add.tween( this.choiceTitle ).to({ x: x, alpha: 1 }, 1500, Phaser.Easing.Quadratic.Out, true );
	DungeonGame.game.add.tween( this.choiceTitleBg ).to({ x: x+1, alpha: 1 }, 1500, Phaser.Easing.Quadratic.Out, true );

	DungeonGame.game.time.events.add( 3000, function() {
		this.startupTimer = -1;
		DungeonGame.game.add.tween( this ).to({ cinemaValue: 4.5 }, 2000, Phaser.Easing.Quadratic.In, true );

		DungeonGame.game.time.events.add( 1000, function() {
			DungeonGame.game.add.tween( this.choiceTitle ).to({ alpha: 0 }, 700, Phaser.Easing.Quadratic.In, true );
			DungeonGame.game.add.tween( this.choiceTitleBg ).to({ alpha: 0 }, 700, Phaser.Easing.Quadratic.In, true );
			if ( this.grail )
				DungeonGame.game.add.tween( this.grail ).to({ alpha: 0 }, 700, Phaser.Easing.Quadratic.In, true );
			tweenTint( this.cinematicTop, 0x000000, 0x111111, 1500 );
			tweenTint( this.cinematicBottom, 0x000000, 0x111111, 1500 );
		}, this );
		DungeonGame.game.time.events.add( 2600, function() {
			DungeonGame.game.state.start( 'Credits' );
		}, this );
	}, this );
};


GuiManager.prototype.setHealth = function ( hpPerc, staPerc )
{
	if ( hpPerc < this.hpGoal )
	{
		tweenTint( this.fog, 0xffcccc, 0xffeeee, 200 );
	}

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


GuiManager.prototype.showNewItem = function ( x, y, itemIndex )
{
	this.chestBeam.reset( x, y );
	this.chestBeam.alpha = 0.0;
	this.chestItem.reset( x, y );
	this.chestItem.alpha = 0.0;
	this.chestItem.frame = itemIndex;

	DungeonGame.game.add.tween( this.chestBeam ).to({ alpha: 1.0 }, 400, Phaser.Easing.Linear.In, true );
	DungeonGame.game.add.tween( this.chestItem ).to({ alpha: 1.0 }, 400, Phaser.Easing.Linear.In, true, 300 );

	DungeonGame.game.add.tween( this.chestBeam ).to({ y: y-16 }, 1500, Phaser.Easing.Exponential.Out, true );
	DungeonGame.game.add.tween( this.chestItem ).to({ y: y-16 }, 1500, Phaser.Easing.Exponential.Out, true );

	DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 2.5, function() {
		if ( this.chestBeam.alpha == 1.0 )
		{
			DungeonGame.game.add.tween( this.chestBeam ).to({ alpha: 0.0 }, 400, Phaser.Easing.Linear.In, true, 300 );
			DungeonGame.game.add.tween( this.chestItem ).to({ alpha: 0.0 }, 400, Phaser.Easing.Linear.In, true );
		}
	}, this );

	DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 3.0, function() {
		if ( this.chestBeam.alpha == 0.0 )
		{
			this.chestBeam.kill();
			this.chestItem.kill();
		}
	}, this );
};
