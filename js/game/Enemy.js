
// Constructor
function Enemy()
{
};

Enemy.prototype.create = function ( x, y, group )
{
	this.health = 3;
	this.speed = 32;

	this.sprite = group.create( x, y, 'enemy', 0 );
	DungeonGame.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	//this.sprite.body.setSize(10, 8, 3, 5);
	this.sprite.body.setCircle( 6, 2, 4 );

	this.setupAnimation();

	this.aiState = 'idle';
	this.goalPos = new Phaser.Point( this.sprite.body.position.x, this.sprite.body.position.y );

	this.sound = 'rat';
	this.damageTimer = 0;
};

Enemy.prototype.setupAnimation = function ()
{
	var len = 3;
	var idle = [0, 1];
	var walk = [0, 1];
	var hurt = [2];
	this.sprite.animations.add( 'idle_right', idle, 3, true );
	this.sprite.animations.add( 'walk_right', walk, 10, true );
	this.sprite.animations.add( 'hurt_right', hurt, 1, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	hurt = hurt.map( n => n + len )
	this.sprite.animations.add( 'idle_down', idle, 3, true );
	this.sprite.animations.add( 'walk_down', walk, 10, true );
	this.sprite.animations.add( 'hurt_down', hurt, 1, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	hurt = hurt.map( n => n + len )
	this.sprite.animations.add( 'idle_left', idle, 3, true );
	this.sprite.animations.add( 'walk_left', walk, 10, true );
	this.sprite.animations.add( 'hurt_left', hurt, 1, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	hurt = hurt.map( n => n + len )
	this.sprite.animations.add( 'idle_up', idle, 3, true );
	this.sprite.animations.add( 'walk_up', walk, 10, true );
	this.sprite.animations.add( 'hurt_up', hurt, 1, true );

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
	if ( this.state == 'hurt' )
	{
	}
	else
	{

	if ( this.aiState == 'walk' && this.sprite.body.velocity.getMagnitude() == 0 )
		this.aiState = 'idle';

	if ( this.aiState == 'idle' && Math.random() < 0.01 )
	{
		this.aiState = 'walk';
		var movement = [[1,0], [0,1], [-1,0], [0,-1]].choice()
		this.goalPos.x = this.sprite.body.position.x + 16 * movement[0];
		this.goalPos.y = this.sprite.body.position.y + 16 * movement[1];
	}
	if ( this.aiState == 'walk' )
	{
		this.sprite.body.velocity.x = this.speed * ( this.goalPos.x - this.sprite.body.position.x ).clamp(-1,1);
		this.sprite.body.velocity.y = this.speed * ( this.goalPos.y - this.sprite.body.position.y ).clamp(-1,1);

		if ( this.aiState == 'walk' && this.sprite.body.position.distance( this.goalPos ) < 0.1 )
		{
			this.aiState = 'idle';
			this.sprite.body.position.copyFrom( this.goalPos );
			this.sprite.body.velocity.setTo( 0, 0 );
		}
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

	}

	this.damageTimer -= 1;
};

Enemy.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		DungeonGame.game.debug.body( this.sprite );
	}
};


Enemy.prototype.damage = function ()
{
	if ( this.damageTimer > 0 )
	{
		this.health -= 1;

		// Move please
		DungeonGame.Audio.play( 'chop' );

		if ( this.health <= 0 )
		{
			this.defeat();
		}
		else
		{
			this.hurt( 1 );
		}
	}
	if ( this.state != 'hurt' )
	{
		this.damageTimer = 2;
	}
};

Enemy.prototype.damageStep = function ()
{
	if ( this.state == 'hurt' )
	{
		this.sprite.alpha = 1.5 - this.sprite.alpha; // Toggles between 1 and 0.5
		DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 0.05, this.damageStep, this );
	}
	else
	{
		this.sprite.alpha = 1.0;
	}
};

Enemy.prototype.damageDone = function ()
{
	this.setAnimation( 'idle', this.direction );
};

Enemy.prototype.hurt = function ()
{
	this.setAnimation( 'hurt', this.direction );
	DungeonGame.Audio.play( this.sound, 'hurt' );

	DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 0.4, this.damageDone, this );
	this.damageStep();
};

Enemy.prototype.defeat = function ()
{
	DungeonGame.Audio.play( this.sound, 'death' );

	DungeonGame.Particle.createSmokeBurst( this.sprite.x, this.sprite.y );

	this.sprite.kill(); // Somehow reach into enemies list and remove, perhaps queueDestruction
};
