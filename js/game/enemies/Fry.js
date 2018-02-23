
// Constructor
function Fry()
{
	Enemy.call( this );

	this.health = 2;
	this.maxSpeed = 60;

	this.sound = 'rat';

	this.flapSpeed = 0;
	this.flapTimer = randInt(0, 5);
	this.flapFrame = 0;
	this.flapFrameOffset = 0;

	this.turnCooldown = 120;
	this.turnTimer = 0;
};

Fry.prototype.create = function ()
{
	this.sprite.loadTexture( 'fry', 0 );

	this.sprite.body.setSize( 12, 10, 2, 16 );
	this.sprite.position.y += 8;
	this.sprite.anchor.y = 1.0;

	this.aiState = 'idle';
	this.goalPos = new Phaser.Point( this.sprite.body.position.x, this.sprite.body.position.y );

	this.sprite.body.bounce.set( 2.0 );
	//this.sprite.body.drag.set( this.maxSpeed );
	this.sprite.body.direction = Math.random() * 2 * Math.PI;

	this.acceleration = new Phaser.Point( 0, 0 );
	this.sprite.body.turning = null;
};

Fry.prototype.update = function ()
{
	Enemy.prototype.update.call( this );

	this.updateMovement();
	this.updateAnimation();
};

Fry.prototype.updateMovement = function ()
{
	this.turnTimer -= 1;

	if ( ( Math.random() < 0.02 && this.turnTimer <= 0 ) || this.sprite.body.turning == null )
	{
		this.sprite.body.turning = [-1.4, 0.4, 0, 0.4, 1.4].choice();
		this.turnTimer = this.turnCooldown;
	}

	this.sprite.body.direction += Math.PI / 100 * this.sprite.body.turning;

	if ( this.sprite.body.turning != 0 && !this.isHurting )
	{
		this.acceleration.set(
			this.maxSpeed / 20 * Math.cos( this.sprite.body.direction ),
			this.maxSpeed / 20 * Math.sin( this.sprite.body.direction )
		);
		this.sprite.body.drag.set( 0 );
	}
	else
	{
		this.acceleration.set( 0 );
		this.sprite.body.drag.set( this.maxSpeed );
	}

	this.sprite.body.velocity.x += this.acceleration.x;
	this.sprite.body.velocity.y += this.acceleration.y;
	this.sprite.body.velocity.setMagnitude( Math.min( this.sprite.body.velocity.getMagnitude(), this.maxSpeed ) );
};

Fry.prototype.updateAnimation = function ()
{
	var p = this.sprite.body.velocity;
	var m = p.getMagnitude();

	if ( m > 0 )
	{
		var direction;
		if ( Math.abs( p.x ) >= Math.abs( p.y ) )
			direction = p.x > 0 ? 'right' : 'left';
		else
			direction = p.y > 0 ? 'down' : 'up';

		this.flapFrameOffset = 6 * ['right', 'down', 'left', 'up'].indexOf( direction );
	}

	this.flapSpeed = 6 - 2 * m / this.maxSpeed;

	this.flapTimer -= 1;
	if ( this.flapTimer <= 0 )
	{
		this.flapTimer += this.flapSpeed;
		this.flapFrame = ( this.flapFrame + 1 ) % 5;
	}

	this.sprite.frame = this.flapFrameOffset + this.flapFrame;
};

Fry.prototype.overlap = function ( other )
{
	//Enemy.prototype.overlap.call( this );
};

Fry.prototype.takeDamage = function ()
{
	Enemy.prototype.takeDamage.call( this );

	//DungeonGame.game.add.tween( this.chestBeam ).to({ alpha: 1.0 }, 400, Phaser.Easing.Linear.In, true );
};

Fry.prototype.knockback = function ( from )
{
	var p = new Phaser.Point(
		this.sprite.body.center.x - from.x,
		this.sprite.body.center.y - from.y
	).setMagnitude( 300 );
	this.sprite.body.velocity.add( p.x, p.y );
};

Fry.prototype.defeat = function ()
{
	Enemy.prototype.defeat.call( this );

	DungeonGame.Particle.createSmokeBurst( this.sprite.x, this.sprite.y - 16 );
};

Fry.prototype.getAttackPower = function ()
{
	return 15;
};

Fry.prototype.hasPhysics = function ()
{
	return false;
};

extend( Enemy, Fry );
