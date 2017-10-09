
// Constructor
function Enemy( sprite )
{
	this.spawn = new Phaser.Point();

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
	this.bgSprite.anchor.set( 0.5, 0.5 );
	this.bgSprite.kill();

	this.lightSprite = lightSprite;
	this.lightSprite.anchor.set( 0.5, 0.5 );
	this.lightSprite.kill();

	this.data = dataRef;

	this.spawn.setTo( x, y );
	this.sprite.reset( x*16+8, y*16+8 );
	this.sprite.body.setSize( 16, 16, 0, 16 );

	this.onDeath = onDeath;
};

Enemy.prototype.create = function () {};

Enemy.prototype.destroy = function () {};

Enemy.prototype.update = function ()
{
	if ( this.state == 'hurt' )
	{
	}
	else
	{

	if ( this.aiState == 'walk' && this.sprite.body.velocity.getMagnitude() == 0 )
		this.aiState = 'idle';

	if ( this.aiState == 'idle' && Math.random() < 0.02 )
	{
		this.aiState = 'walk';
		var movement = [[1,0], [0,1], [-1,0], [0,-1]].choice()
		var len = randInt( 1, 4 );
		this.goalPos.x = this.sprite.body.position.x + len * 16 * movement[0];
		this.goalPos.y = this.sprite.body.position.y + len * 16 * movement[1];
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

	if ( this.aiState == 'idle' )
	{
		if ( Math.random() < 0.01 )
			DungeonGame.Audio.play( this.sound, 'cry' );
	}

	this.damageTimer -= 1;
};

Enemy.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		DungeonGame.game.debug.body( this.sprite, RED );
	}
};


Enemy.prototype.damage = function ()
{
	if ( this.damageTimer > 0 )
	{
		this.damageTimer = 0;
		this.health -= 1;

		// Move please
		DungeonGame.Audio.play( 'chop' );
		DungeonGame.cameraShake( 2 );

		if ( this.health <= 0 )
		{
			this.defeat();
		}
		else
		{
			this.hurt();
		}
	}
	if ( this.state != 'hurt' )
	{
		this.damageTimer = 4;
	}
};

Enemy.prototype.damageStep = function ()
{
	if ( this.state == 'hurt' )
	{
		// Toggles between 1 and 0.5
		this.sprite.alpha = 1.5 - this.sprite.alpha;
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
	DungeonGame.cameraShake( 8 );

	DungeonGame.Particle.createSmokeBurst( this.sprite.x, this.sprite.y );

	this.onDeath( this );
};

Enemy.prototype.getAttackPower = function ()
{
	return 20;
};

Enemy.prototype.getGridPos = function ()
{
	return {
		"x": Math.floor(this.sprite.x / 16),
		"y": Math.floor(this.sprite.y / 16)
	};
};

Enemy.prototype.hasPhysics = function ()
{
	return true;
};
