
// Constructor
function Pushable()
{
	Entity.call( this );

	this.pushSpeed = 1.0;
	this.isPushingBuffer = 0;
	this.pushBuffer = 0;
	this.pushDir = [0,0];

	this.moveBuffer = new Phaser.Point( 0, 0 );
};

Pushable.prototype.create = function ()
{
	this.trail = DungeonGame.Particle.createWalkTrail( 0, 0 );
	this.trailCooldown = 0;
	DungeonGame.World.entities.add( this.trail );
};

Pushable.prototype.destroy = function () {
	this.trail.destroy();
};


Pushable.prototype.update = function ()
{
	Entity.prototype.update.call( this );

	if ( this.moveBuffer.x != 0 || this.moveBuffer.y != 0 )
	{
		var speed = this.pushSpeed;
		var mx = this.moveBuffer.x.clamp( -speed, speed ) * DungeonGame.game.time.elapsed * 0.06;
		var my = this.moveBuffer.y.clamp( -speed, speed ) * DungeonGame.game.time.elapsed * 0.06;

		if ( ( mx > 0 && mx > this.moveBuffer.x ) || ( mx < 0 && mx < this.moveBuffer.x ) )
			mx = this.moveBuffer.x;
		if ( ( my > 0 && my > this.moveBuffer.y ) || ( my < 0 && my < this.moveBuffer.y ) )
			my = this.moveBuffer.y;

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
