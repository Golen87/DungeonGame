
// Constructor
function Box( onDeath )
{
	Entity.call( this );
	this.onDeath = onDeath;

	this.health = 3;

	this.isPushingBuffer = 0;
	this.pushBuffer = 0;
	this.pushDir = [0,0];

	this.moveBuffer = new Phaser.Point( 0, 0 );
};

Box.prototype.create = function ()
{
	this.sprite.frame = 0;
	this.sprite.scale.x = [-1,1].choice();

	if ( this.data.position )
		this.sprite.position = this.data.position;

	this.trail = DungeonGame.Particle.createWalkTrail( 0, 0 );
	this.trailCooldown = 0;
	DungeonGame.World.entities.add( this.trail );
};

Box.prototype.destroy = function () {
	if ( this.lockState )
	{
		this.data.position = new Phaser.Point( this.sprite.position.x, this.sprite.position.y );
	}
	else
	{
		this.data.position = null;
	}

	this.trail.destroy();
};


Box.prototype.update = function ()
{
	Entity.prototype.update.call( this );

	if ( this.moveBuffer.x != 0 || this.moveBuffer.y != 0 )
	{
		var speed = 1.0;
		var mx = this.moveBuffer.x.clamp( -speed, speed );
		var my = this.moveBuffer.y.clamp( -speed, speed );

		this.moveBuffer.x -= mx;
		this.sprite.position.x += mx;
		this.moveBuffer.y -= my;
		this.sprite.position.y += my;

		this.trailCooldown -= 1;
		if ( this.trailCooldown < 0 )
		{
			this.trailCooldown = 4;
			this.trail.x = this.sprite.body.center.x - mx*8/speed;
			this.trail.y = this.sprite.body.center.y - my*8/speed;
			this.trail.start( true, 4000, null, 1 );
		}
	}
	else if ( this.isPushingBuffer > 0 )
	{
		this.pushBuffer += 1;
		if ( this.pushBuffer > 16 )
		{
			var p = this.getGridPos();
			if ( !DungeonGame.World.checkPhysicsAt( p.x + this.pushDir[0], p.y + this.pushDir[1] ) )
			{
				this.moveBuffer.x = this.pushDir[0] * 16;
				this.moveBuffer.y = this.pushDir[1] * 16;
				this.pushDir = [0,0];
				this.pushBuffer = 0;
			}
		}
	}
	else
	{
		this.pushBuffer = 0;
	}

	this.isPushingBuffer -= 1;
};

Box.prototype.overlap = function ( other )
{
	function setDir( x, y ) {
		if ( this.pushDir[0] != x || this.pushDir[1] != y )
		{
			this.pushBuffer = 0;
		}
		this.pushDir = [x,y];
	}

	var x = this.sprite.body.center.x - other.sprite.body.center.x;
	var y = this.sprite.body.center.y - other.sprite.body.center.y;
	var vx = 16 * other.sprite.body.velocity.x / other.speed;
	var vy = 16 * other.sprite.body.velocity.y / other.speed;

	this.isPushingBuffer = 4;

	if ( Math.abs(x) > Math.abs(y) && Math.abs(y) < 8 && Math.abs(vy) < 2 )
	{
		if ( x > 0 )
		{
			setDir.call( this, 1, 0 );
		}
		else
		{
			setDir.call( this, -1, 0 );
		}
	}
	else if ( Math.abs(y) > Math.abs(x) && Math.abs(x) < 8 && Math.abs(vx) < 2 )
	{
		if ( y > 0 )
		{
			setDir.call( this, 0, 1 );
		}
		else
		{
			setDir.call( this, 0, -1 );
		}
	}
	else
	{
		this.isPushingBuffer = 0;
	}

	DungeonGame.game.physics.arcade.collide( other.sprite, this.sprite );
};

Box.prototype.overlapEntity = function ( other )
{
	if ( Spikes.prototype.isPrototypeOf( other.owner ) )
	{
		if ( other.owner.hasPhysics() )
		{
			this.defeat();
		}
	}
};

Box.prototype.hurt = function ( power )
{
	DungeonGame.Audio.play( 'chop' );

	this.health -= power;
	if ( this.health == 2 )
		this.sprite.frame = 1;
	if ( this.health == 1 )
		this.sprite.frame = 2;
	if ( this.health <= 0 )
		this.defeat();
};

Box.prototype.defeat = function ()
{
	DungeonGame.Audio.play( 'break' );
	DungeonGame.World.cameraShake( 8 );

	DungeonGame.Particle.createRubbleBurst( this.sprite.x, this.sprite.y );

	this.onDeath( this );
};

extend( Entity, Box );
