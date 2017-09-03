
// Constructor
function Player ()
{
}


Player.staticMethod = function ()
{
};


Player.prototype.preload = function ()
{
};

Player.prototype.create = function ( x, y, group )
{
	this.speed = 80;

	this.sprite = group.create( x, y, 'player', 0 );
	DungeonGame.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	this.sprite.body.setSize(10, 8, 3, 5);
	//this.sprite.body.setCircle( 6, 2, 4 );

	//this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

	this.setupAnimation();

	this.cursors = DungeonGame.game.input.keyboard.createCursorKeys();
};

Player.prototype.setupAnimation = function ()
{
	var len = 6;
	var idle = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
	var walk = [2, 3, 4, 5];
	this.sprite.animations.add( 'idle_right', idle, 8, true );
	this.sprite.animations.add( 'walk_right', walk, 10, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	this.sprite.animations.add( 'idle_down', idle, 8, true );
	this.sprite.animations.add( 'walk_down', walk, 10, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	this.sprite.animations.add( 'idle_left', idle, 8, true );
	this.sprite.animations.add( 'walk_left', walk, 10, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	this.sprite.animations.add( 'idle_up', idle, 8, true );
	this.sprite.animations.add( 'walk_up', walk, 10, true );

	this.state = 'idle';
	this.direction = 'down';
	this.sprite.animations.play( 'idle_down' );

	//this.damageAnimation = false;
	//PhaserGame.prototype.cloudBurst(this);
};

Player.prototype.setAnimation = function ( newState, newDirection )
{
	var name = null;
	if ( this.state != newState || this.direction != newDirection )
	{
		name = '{0}_{1}'.format( newState, newDirection );
		this.state = newState;
		this.direction = newDirection;
	}

	if ( name )
	{
		this.sprite.animations.play( name );
	}
};

Player.prototype.update = function ()
{
	var p = new Phaser.Point( 0, 0 );

	if ( this.cursors.up.isDown || DungeonGame.game.input.keyboard.isDown( Phaser.Keyboard.W ) )
	{
		p.y -= 1;
	}
	if ( this.cursors.down.isDown || DungeonGame.game.input.keyboard.isDown( Phaser.Keyboard.S ) )
	{
		p.y += 1;
	}
	if ( this.cursors.left.isDown || DungeonGame.game.input.keyboard.isDown( Phaser.Keyboard.A ) )
	{
		p.x -= 1;
	}
	if ( this.cursors.right.isDown || DungeonGame.game.input.keyboard.isDown( Phaser.Keyboard.D ) )
	{
		p.x += 1;
	}

	p.setMagnitude( this.speed );
	this.sprite.body.velocity.x += ( p.x - this.sprite.body.velocity.x ) / 5;
	this.sprite.body.velocity.y += ( p.y - this.sprite.body.velocity.y ) / 5;

	if ( p.getMagnitude() > 0 )
	{
		var direction;
		if ( Math.abs( p.x ) >= Math.abs( p.y ) )
			direction = p.x > 0 ? 'right' : 'left';
		else
			direction = p.y > 0 ? 'down' : 'up';
		this.setAnimation( 'walk', direction );
	}
	else
	{
		this.setAnimation( 'idle', this.direction );
	}
};

Player.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		DungeonGame.game.debug.body( this.sprite );
	}
};
