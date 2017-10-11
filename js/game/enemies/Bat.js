
// Constructor
function Bat()
{
	Enemy.call( this );

	this.health = 3;
	this.maxSpeed = 60;

	this.sound = 'mouse';

	this.flapSpeed = 0;
	this.flapTimer = randInt(0, 5);
	this.flapFrame = 0;
	this.flapFrameOffset = 0;

	this.turnCooldown = 120;
	this.turnTimer = 0;
};

Bat.prototype.create = function ()
{
	this.sprite.loadTexture( 'bat', 0 );

	this.sprite.body.setSize( 12, 10, 2, 16 );
	this.sprite.position.y += 8;
	this.sprite.anchor.y = 1.0;

	this.bgSprite.reset( this.spawn.x*16 + 8, this.spawn.y*16 );
	this.bgSprite.frame = 6;

	this.aiState = 'idle';
	this.goalPos = new Phaser.Point( this.sprite.body.position.x, this.sprite.body.position.y );

	this.sprite.body.bounce.set( 2.0 );
	//this.sprite.body.drag.set( this.maxSpeed );
	this.sprite.body.direction = Math.random() * 2 * Math.PI;

	this.acceleration = new Phaser.Point( 0, 0 );
	this.sprite.body.turning = null;
};

Bat.prototype.update = function ()
{
	Enemy.prototype.update.call( this );

	this.updateMovement();
	this.updateAnimation();
};

Bat.prototype.updateMovement = function ()
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

Bat.prototype.updateAnimation = function ()
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

Bat.prototype.overlap = function ( other )
{
	//Enemy.prototype.overlap.call( this );
};

Bat.prototype.takeDamage = function ()
{
	Enemy.prototype.takeDamage.call( this );

	//DungeonGame.game.add.tween( this.chestBeam ).to({ alpha: 1.0 }, 400, Phaser.Easing.Linear.In, true );
};

Bat.prototype.defeat = function ()
{
	Enemy.prototype.defeat.call( this );

	DungeonGame.Particle.createSmokeBurst( this.sprite.x, this.sprite.y - 16 );
};

Bat.prototype.getAttackPower = function ()
{
	return 15;
};

extend( Enemy, Bat );
