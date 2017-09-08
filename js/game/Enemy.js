
// Constructor
function Enemy()
{
};

Enemy.prototype.create = function ( x, y, group )
{
	this.speed = 50;

	this.sprite = group.create( x, y, 'enemy', 0 );
	DungeonGame.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	//this.sprite.body.setSize(10, 8, 3, 5);
	this.sprite.body.setCircle( 6, 2, 4 );

	this.setupAnimation();

	this.aiState = 'idle';
	this.goalPos = new Phaser.Point( this.sprite.body.position.x, this.sprite.body.position.y );
	this.goalPos = new Phaser.Point( this.sprite.body.position.x, this.sprite.body.position.y );
};

Enemy.prototype.setupAnimation = function ()
{
	var len = 2;
	var idle = [0, 1];
	var walk = [0, 1];
	this.sprite.animations.add( 'idle_right', idle, 3, true );
	this.sprite.animations.add( 'walk_right', walk, 10, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	this.sprite.animations.add( 'idle_down', idle, 3, true );
	this.sprite.animations.add( 'walk_down', walk, 10, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	this.sprite.animations.add( 'idle_left', idle, 3, true );
	this.sprite.animations.add( 'walk_left', walk, 10, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	this.sprite.animations.add( 'idle_up', idle, 3, true );
	this.sprite.animations.add( 'walk_up', walk, 10, true );

	this.state = 'idle';
	this.direction = 'down';
	this.sprite.animations.play( 'idle_down' );
};

Enemy.prototype.setAnimation = function ( newState, newDirection )
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

Enemy.prototype.update = function ()
{
	if ( this.aiState == 'idle' && Math.random() < 0.00 )
	{
		this.aiState = 'walk';
		var movement = [[1,0], [0,1], [-1,0], [0,-1]].choice()
		this.goalPos.x += 16 * movement[0];
		this.goalPos.y += 16 * movement[1];
		this.sprite.body.velocity.x = movement[0] * this.speed;
		this.sprite.body.velocity.y = movement[1] * this.speed;
	}
	if ( this.aiState == 'walk' && this.sprite.body.position == this.goalPos )
	{
		this.aiState = 'idle';
		this.sprite.body.velocity = 0;
	}

	var v = this.sprite.body.velocity;
	if ( v.getMagnitude() > 0 )
	{
		var direction;
		if ( Math.abs( v.x ) >= Math.abs( v.y ) )
			direction = v.x > 0 ? 'right' : 'left';
		else
			direction = v.y > 0 ? 'down' : 'up';
		this.setAnimation( 'walk', direction );
	}
	else
	{
		this.setAnimation( 'idle', this.direction );
	}
};

Enemy.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		DungeonGame.game.debug.body( this.sprite );
	}
};
