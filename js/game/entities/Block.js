

// Constructor
function Block( sprite, bgSprite )
{
	Entity.call( this, sprite, bgSprite );
	this.sprite.frame = 11;
	this.sprite.scale.x = [-1,1].choice();

	this.sprite.body.immovable = true;
	this.sprite.body.moves = false;
	this.sprite.body.drag.setTo( 1000, 1000 );

	this.health = 3;

	this.isPushingBuffer = 0;
	this.pushBuffer = 0;
	this.pushDir = [0,0];

	this.moveBuffer = new Phaser.Point( 0, 0 );
};


Block.prototype.update = function ()
{
	Entity.prototype.update.call( this );

	if ( this.moveBuffer.getMagnitude() > 0 )
	{
		if ( this.moveBuffer.x > 0 )
		{
			this.moveBuffer.x -= 1;
			this.sprite.position.x += 1;
		}
		if ( this.moveBuffer.y > 0 )
		{
			this.moveBuffer.y -= 1;
			this.sprite.position.y += 1;
		}
		if ( this.moveBuffer.x < 0 )
		{
			this.moveBuffer.x += 1;
			this.sprite.position.x -= 1;
		}
		if ( this.moveBuffer.y < 0 )
		{
			this.moveBuffer.y += 1;
			this.sprite.position.y -= 1;
		}
	}

	if ( this.isPushingBuffer > 0 )
	{
		this.pushBuffer += 1;
		if ( this.pushBuffer > 10 )
		{
			//this.sprite.position.x += 16*this.pushDir[0];
			//this.sprite.position.y += 16*this.pushDir[1];

			var p = this.getGridPos();
			if ( !DungeonGame.checkPhysicsAt( p.x + this.pushDir[0], p.y + this.pushDir[1] ) )
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

Block.prototype.overlap = function ( other )
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

Block.prototype.hurt = function ()
{
	//DungeonGame.Audio.play( 'break' );
};

extend( Entity, Block );
