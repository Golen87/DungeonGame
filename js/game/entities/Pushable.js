
// Constructor
function Pushable()
{
	Entity.call( this );

	this.pushSpeed = 1.0;
	this.isPushingBuffer = 0;
	this.pushBuffer = 0;
	this.pushDir = [0,0];
};

Pushable.prototype.create = function ()
{
	this.trail = DungeonGame.Particle.createWalkTrail( 0, 0 );
	this.trailCooldown = 0;
	DungeonGame.World.entities.add( this.trail );

	if ( this.data.position )
		this.sprite.position = this.data.position;

	this.goalPos = new Phaser.Point( this.sprite.x, this.sprite.y );
};

Pushable.prototype.destroy = function () {
	this.trail.destroy();

	if ( this.lockState )
	{
		this.data.position = new Phaser.Point( this.sprite.position.x, this.sprite.position.y );
	}
	else
	{
		this.data.position = null;
	}
};


Pushable.prototype.update = function ()
{
	Entity.prototype.update.call( this );

	if ( this.sprite.x != this.goalPos.x || this.sprite.y != this.goalPos.y )
	{
		var speed = this.pushSpeed;
		var dt = DungeonGame.game.time.elapsed * 0.06;
		this.sprite.x = this.sprite.x + (this.goalPos.x - this.sprite.x).clamp( -speed*dt, speed*dt );
		this.sprite.y = this.sprite.y + (this.goalPos.y - this.sprite.y).clamp( -speed*dt, speed*dt );

		this.trailCooldown -= 1;
		if ( this.trailCooldown < 0 )
		{
			this.trailCooldown = 4;
			var dx = (this.goalPos.x - this.sprite.x).clamp( -0.5, 0.5 );
			var dy = (this.goalPos.y - this.sprite.y).clamp( -0.5, 0.5 );
			this.trail.x = this.sprite.body.center.x - dx * this.sprite.body.width/2;
			this.trail.y = this.sprite.body.center.y - dy * this.sprite.body.height/2;
			this.trail.start( true, 4000, null, 1 );
		}

		if ( this.sprite.x == this.goalPos.x && this.sprite.y == this.goalPos.y )
		{
			this.isPushingBuffer = 0;
		}
	}
	else if ( this.isPushingBuffer > 0 )
	{
		this.pushBuffer += DungeonGame.game.time.elapsed * 0.06;
		if ( this.pushBuffer > 16 ) // ~0.25 seconds
		{
			var p = this.getGridPos();
			if ( !DungeonGame.World.checkPhysicsAt( p.x + this.pushDir[0], p.y + this.pushDir[1] ) )
			{
				this.goalPos.x = this.sprite.x + this.pushDir[0] * 16;
				this.goalPos.y = this.sprite.y + this.pushDir[1] * 16;
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

Pushable.prototype.overlap = function ( other )
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

	if ( Math.abs(x) > Math.abs(y) && Math.abs(y) < 12 && Math.abs(vy) < 2 )
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
	else if ( Math.abs(y) > Math.abs(x) && Math.abs(x) < 12 && Math.abs(vx) < 2 )
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

extend( Entity, Pushable );
