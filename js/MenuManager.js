
// Constructor
function MenuManager ()
{
	this.allowInput = true;
	this.startPosition = new Phaser.Point( 0, 0 );
	this.corners = null;

	this.history = [];

	this.animationTime = 500;
	this.animationDist = 96;
	this.animationDelay = 0;
	this.easing = Phaser.Easing.Quartic.Out;

	this.setupInput();
}

MenuManager.prototype.setupInput = function ()
{
	var key = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.DOWN );
	key.onDown.add( function() {this.nextChoice( 1 );}, this );
	var key = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.S );
	key.onDown.add( function() {this.nextChoice( 1 );}, this );
	var key = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.UP );
	key.onDown.add( function() {this.nextChoice( -1 );}, this );
	var key = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.W );
	key.onDown.add( function() {this.nextChoice( -1 );}, this );

	var key = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
	key.onDown.add( function() {this.pickChoice();}, this );
	var key = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.ENTER );
	key.onDown.add( function() {this.pickChoice();}, this );
};

MenuManager.prototype.update = function ()
{
	if ( this.corners )
	{
		for ( var i=0; i<4; i++ )
		{
			var corner = this.corners[i];
			corner.anchor.x = 0.5 + 0.25 * Math.sin( 1.6 * DungeonGame.game.time.totalElapsedSeconds() * Math.PI );
		}
	}
};

MenuManager.prototype.createMenu = function ( x, y, choiceList )
{
	this.startPosition.set( x, y );

	this.choiceList = choiceList;

	this.selection = 0;

	this.labels = [];
	for ( var i=0; i<this.choiceList.length; i++ )
	{
		var label = DungeonGame.game.add.bitmapText( x, y, 'OldWizard', this.choiceList[i][0], 16 );
		label.anchor.set( 0.5 );
		label.tint = 0x777777;
		label.function = this.choiceList[i][1];
		this.labels.push( label );
		y += 24;
	}


	this.corners = [];
	this.corners.push( DungeonGame.game.add.sprite( 0, 0, 'corner' ) );
	this.corners[0].scale.set( 1, 1 );
	this.corners.push( DungeonGame.game.add.sprite( 0, 0, 'corner' ) );
	this.corners[1].scale.set( 1, -1 );
	this.corners.push( DungeonGame.game.add.sprite( 0, 0, 'corner' ) );
	this.corners[2].scale.set( -1, 1 );
	this.corners.push( DungeonGame.game.add.sprite( 0, 0, 'corner' ) );
	this.corners[3].scale.set( -1, -1 );

	this.nextChoice( 0 );
};

MenuManager.prototype.nextMenu = function ( choiceList )
{
	this.history.push( [this.choiceList, this.selection, this.labels] );
	for ( var i=0; i<this.labels.length; i++ )
	{
		DungeonGame.game.add.tween( this.labels[i] ).to({ x: this.startPosition.x - this.animationDist, alpha: 0 }, this.animationTime, this.easing, true, this.animationDelay*i );
	}

	this.choiceList = choiceList;

	this.selection = 0;

	var x = this.startPosition.x;
	var y = this.startPosition.y;
	this.labels = [];
	for ( var i=0; i<this.choiceList.length; i++ )
	{
		var label = DungeonGame.game.add.bitmapText( x, y, 'OldWizard', this.choiceList[i][0], 16 );
		label.anchor.set( 0.5 );
		label.tint = 0x777777;
		label.function = this.choiceList[i][1];
		this.labels.push( label );
		y += 24;

		label.x += this.animationDist;
		label.alpha = 0;
		DungeonGame.game.add.tween( label ).to({ x: this.startPosition.x, alpha: 1 }, this.animationTime, this.easing, true, this.animationDelay*i );
	}

	for ( var i=0; i<4; i++ )
	{
		this.corners[i].x = this.corners[i].startX + this.animationDist;
		this.corners[i].alpha = 0;
		DungeonGame.game.add.tween( this.corners[i] ).to({ x: this.corners[i].startX, alpha: 1 }, this.animationTime, this.easing, true, this.animationDelay*this.selection );
	}

	this.nextChoice( 0 );
};

MenuManager.prototype.previousMenu = function ()
{
	for ( var i=0; i<this.labels.length; i++ )
	{
		DungeonGame.game.add.tween( this.labels[i] ).to({ x: this.startPosition.x + this.animationDist, alpha: 0 }, this.animationTime, this.easing, true, this.animationDelay*i );
		DungeonGame.game.time.events.add( this.animationTime, this.labels[i].kill, this.labels[i] );
	}

	var previousMenu = this.history.pop();
	this.choiceList = previousMenu[0];
	this.selection = previousMenu[1];
	this.labels = previousMenu[2];

	for ( var i=0; i<this.labels.length; i++ )
	{
		DungeonGame.game.add.tween( this.labels[i] ).to({ x: this.startPosition.x, alpha: 1 }, this.animationTime, this.easing, true, this.animationDelay*i );
	}

	for ( var i=0; i<4; i++ )
	{
		this.corners[i].x = this.corners[i].startX - this.animationDist;
		this.corners[i].alpha = 0;
		DungeonGame.game.add.tween( this.corners[i] ).to({ x: this.corners[i].startX, alpha: 1 }, this.animationTime, this.easing, true, this.animationDelay*this.selection );
	}

	this.nextChoice( 0 );
};

MenuManager.prototype.killMenu = function ()
{
	for ( var i=0; i<this.labels.length; i++ )
	{
		this.labels[i].kill();
	}

	for ( var i=0; i<4; i++ )
	{
		this.corners[i].kill();
	}
	this.corners = null;

	for ( var i=0; i<this.history.length; i++ )
	{
		var menu = this.history[i];
		this.choiceList = menu[0];
		this.selection = menu[1];
		this.labels = menu[2];

		for ( var j=0; j<this.labels.length; j++ )
		{
			this.labels[j].kill();
		}
	}
};

MenuManager.prototype.nextChoice = function ( inc )
{
	if ( this.allowInput )
	{
		this.labels[this.selection].tint = 0x777777;

		this.selection += inc + this.labels.length; // Avoid negative modulo
		this.selection %= this.labels.length;

		this.labels[this.selection].tint = 0xffffff;

		for ( var i=0; i<4; i++ )
		{
			var corner = this.corners[i];
			corner.anchor.set( 0.5 );

			var y = this.labels[this.selection].y - corner.scale.y * 4;
			if ( corner.x == 0 && corner.y == 0 )
			{
				corner.x = this.startPosition.x - corner.scale.x * 44;
				corner.startX = corner.x;
				corner.y = y;
			}
			else
				DungeonGame.game.add.tween( corner ).to({ y: y }, 200, Phaser.Easing.Exponential.Out, true );
		}

		if ( inc != 0 && this.labels.length > 1 )
			DungeonGame.Audio.play( 'menu', 'select' );
	}
};

MenuManager.prototype.pickChoice = function ()
{
	if ( this.allowInput )
	{
		var newText = this.choiceList[this.selection][1]();
		if ( newText )
		{
			this.labels[this.selection].text = newText;
		}

		DungeonGame.Audio.play( 'menu', 'click' );
	}
};
