
// Constructor
function Spikes()
{
	Entity.call( this );

	this.active = false;
	this.animationTimer = 0;
	this.prepareTimer = 0;

	this.manual = false;
	this.prepareDuration = 60;
	this.autoDuration = 130;
	this.autoTimer = this.autoDuration;
};

Spikes.prototype.create = function ()
{
	this.sprite.body.setSize( 12, 12, 2, 16+2 );

	this.bgSprite.reset( this.spawn.x*16 + 8, this.spawn.y*16 );
	this.bgSprite.frame = 6;

	var odd = this.sprite.position.y/16 % 2;
	this.sprite.scale.x 	= 1 - 2*odd;
	this.bgSprite.scale.x	= 1 - 2*odd;

	this.sprite.position.y -= 4;
	this.sprite.anchor.set( 0.5, 3/8 );

	this.setState( this.active, false );
};

Spikes.prototype.update = function ()
{
	Entity.prototype.update.call( this );

	if ( !this.manual )
	{
		this.autoTimer -= 1;
		if ( this.autoTimer < 0 )
		{
			this.autoTimer = this.autoDuration;
			this.prepare( !this.active );
		}
	}

	this.animationTimer -= 1;
	if ( this.animationTimer == 0 )
	{
		this.setState( this.active, true );
	}

	this.prepareTimer -= 1;
	if ( this.prepareTimer == 0 )
	{
		this.toggle( !this.active );
	}
};

Spikes.prototype.setState = function ( state, sound=true )
{
	this.active = state;

	if ( state )
	{
		this.sprite.alpha = 1.0;
		this.sprite.frame = 9;

		if ( sound )
			DungeonGame.Audio.play( 'spikes' );
	}
	else
	{
		this.sprite.alpha = 0.0;
	}
};

Spikes.prototype.toggle = function ( state, immediate=false )
{
	this.active = state;

	if ( state )
	{
		this.sprite.frame = 10;
		this.sprite.alpha = 1.0;
		this.animationTimer = 4;
	}
	else
	{
		this.sprite.frame = 8;
		this.sprite.alpha = 1.0;
		this.animationTimer = 16;
	}

	if ( immediate )
	{
		this.animationTimer = 0;
		this.setState( this.active, false );
	}
};

Spikes.prototype.prepare = function ( state )
{
	if ( state )
	{
		this.sprite.alpha = 1.0;
		this.sprite.frame = 7;

		this.prepareTimer = this.prepareDuration;
		this.autoTimer += this.prepareDuration / 2;
	}
	else
	{
		this.toggle( state );
	}
}


Spikes.prototype.damage = function () {};

Spikes.prototype.overlap = function ( other )
{
	if ( this.active )
	{
		DungeonGame.game.physics.arcade.collide( other.sprite, this.sprite );
		var p = new Phaser.Point( this.sprite.position.x, this.sprite.position.y + 8 );
		other.damage( 10, p );
	}
};

Spikes.prototype.hasPhysics = function ()
{
	return this.active;
};

Spikes.prototype.getGridPos = function ()
{
	return {
		"x": Math.floor(this.sprite.x / 16),
		"y": Math.floor((this.sprite.y+4) / 16)
	};
};


extend( Entity, Spikes );
