
// Constructor
function Spikes( sprite, bgSprite )
{
	Entity.call( this, sprite, bgSprite );

	this.sprite.body.immovable = true;
	this.sprite.body.moves = false;
};

Spikes.prototype.create = function ( x, y, deathCallback )
{
	Entity.prototype.create.call( this, x, y, deathCallback );

	this.bgSprite.reset( x*16 + 8, y*16 );
	this.bgSprite.frame = 6;

	var odd = this.sprite.position.y/16 % 2;
	this.sprite.scale.x 	= 1 - 2*odd;
	this.bgSprite.scale.x	= 1 - 2*odd;

	this.active = true;
	this.timer = 0;
	this.toggle( this.active, false );
};

Spikes.prototype.update = function ()
{
	Entity.prototype.update.call( this );

	this.timer -= 1;
	if ( this.timer == 0 )
	{
		this.toggle( !this.active );
	}
};

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

Spikes.prototype.toggle = function ( state, sound=true )
{
	this.active = state;
	this.timerRunning = false;

	if ( state )
	{
		this.sprite.alpha = 1.0;
		this.sprite.frame = 7;
		if ( sound )
			DungeonGame.Audio.play( 'spikes' );
	}
	else
	{
		this.sprite.alpha = 0.0;
	}
};

Spikes.prototype.prepareToggle = function ( state )
{
	if ( state )
	{
		this.sprite.alpha = 1.0;
		this.sprite.frame = 8;

		this.timer = 90;
	}
	else
	{
		this.active = false;
		this.sprite.alpha = 0.0;

		this.timer = 0;
	}
}


extend( Entity, Spikes );
