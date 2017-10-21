
// Constructor
function Enemy( sprite )
{
	this.spawn = new Phaser.Point();

	this.isHurting = false;
	this.isHurtingTimer = 0;
	this.isFlashing = false;
	this.isFlashingTimer = 0;
	this.hitCooldown = 6;
	this.hitBuffer = 0;
};

Enemy.prototype.init = function ( sprite, bgSprite, lightSprite, dataRef, x, y, onDeath )
{
	this.sprite = sprite;
	this.sprite.owner = this;
	this.sprite.frame = 0;
	this.sprite.anchor.set( 0.5, 0.5 );
	this.sprite.visible = true;
	this.sprite.alpha = 1.0;
	this.sprite.scale.x = 1;
	this.sprite.body.immovable = false;
	this.sprite.body.moves = true;

	this.bgSprite = bgSprite;
	this.bgSprite.visible = true;
	this.bgSprite.anchor.set( 0.5, 0.5 );
	this.bgSprite.kill();

	this.lightSprite = lightSprite;
	this.lightSprite.visible = true;
	this.lightSprite.anchor.set( 0.5, 0.5 );
	this.lightSprite.kill();

	this.data = dataRef;

	this.spawn.setTo( x, y );
	this.sprite.reset( x*16+8, y*16+8 );
	this.sprite.body.setSize( 16, 16, 0, 16 );
	this.sprite.body.bounce.set( 0.0 );

	this.onDeath = onDeath;
};

Enemy.prototype.create = function () {};

Enemy.prototype.destroy = function () {};

Enemy.prototype.update = function ()
{
	if ( this.aiState == 'idle' )
	{
		if ( Math.random() < 0.005 )
			DungeonGame.Audio.play( this.sound, 'cry' );
	}

	this.updateHurtState();
};

Enemy.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		DungeonGame.game.debug.body( this.sprite, RED );
	}
};


/* Damage management */

Enemy.prototype.updateHurtState = function ()
{
	this.hitBuffer -= 1;
	this.isHurtingTimer -= 1;
	this.isFlashingTimer -= 1;

	if ( this.isHurtingTimer == 0 )
		this.isHurting = false;
	if ( this.isFlashingTimer == 0 )
		this.isFlashing = false;

	if ( this.isFlashing )
	{
		if ( ( Math.abs(this.hitBuffer) % 6 < 3 ) )
		{
			this.sprite.alpha = 0.8;
			this.sprite.tint = 0xffffff;
		}
		else
		{
			this.sprite.alpha = 0.3;
			this.sprite.tint = 0xff7777;
		}
	}
	else
	{
		this.sprite.alpha = 1.0;
		this.sprite.tint = 0xffffff;
	}
};

Enemy.prototype.getHit = function ( other )
{
	// Ensure that monster has been colliding with sword at least 2 frames. This due to the swing setSize bug.
	if ( this.hitBuffer > 0 )
	{
		this.hitBuffer = 0;

		// Move please, as it may depend on weapon
		DungeonGame.Audio.play( 'chop' );
		DungeonGame.World.cameraShake( 2 );

		// Knockback
		this.knockback( other.position );

		// Take damage
		this.isHurting = true;
		this.isFlashing = true;
		this.health -= 1;
		if ( this.health > 0 )
		{
			this.takeDamage();
		}
		else
		{
			this.defeat();
		}
	}
	if ( !this.isHurting )
	{
		this.hitBuffer = 4;
	}
};

Enemy.prototype.takeDamage = function ()
{
	DungeonGame.Audio.play( this.sound, 'hurt' );

	this.isHurtingTimer = 10;
	this.isFlashingTimer = 35;
};

Enemy.prototype.knockback = function ( from ) {};

Enemy.prototype.defeat = function ()
{
	DungeonGame.Audio.play( this.sound, 'death' );
	DungeonGame.World.cameraShake( 8 );

	this.onDeath( this );
};


Enemy.prototype.getAttackPower = function ()
{
	return 0;
};

Enemy.prototype.getGridPos = function ()
{
	return new Phaser.Point(
		Math.floor(this.sprite.x / 16),
		Math.floor(this.sprite.y / 16)
	);
};

Enemy.prototype.getPhysicsPos = function ()
{
	return this.getGridPos();
};

Enemy.prototype.getRoomPos = function ()
{
	return new Phaser.Point(
		Math.floor(this.sprite.x / ROOM_WIDTH / 16),
		Math.floor(this.sprite.y / ROOM_HEIGHT / 16)
	);
};

Enemy.prototype.hasPhysics = function ()
{
	return true;
};
