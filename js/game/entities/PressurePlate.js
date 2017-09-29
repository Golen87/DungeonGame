
// Constructor
function PressurePlate( sprite, bgSprite )
{
	Entity.call( this, sprite, bgSprite );

	this.sprite.body.immovable = true;
	this.sprite.body.moves = false;
	this.sprite.alpha = 0.0;
};

PressurePlate.prototype.create = function ( x, y, deathCallback )
{
	Entity.prototype.create.call( this, x, y, deathCallback );

	this.bgSprite.reset( x*16 + 8, y*16 );

	this.active = false;
	this.trigger( false );
	this.timer = 0;
};

PressurePlate.prototype.update = function ()
{
	Entity.prototype.update.call( this );

	this.timer -= 1;
	if ( this.timer <= 0 && this.active )
	{
		this.trigger( false );
	}
};

PressurePlate.prototype.trigger = function ( state )
{
	this.active = state;

	if ( state )
	{
		this.bgSprite.frame = 13;
		this.timer = 4;
	}
	else
	{
		this.bgSprite.frame = 12;
	}
};

PressurePlate.prototype.damage = function () {};

PressurePlate.prototype.overlap = function ( other )
{
	var x = other.sprite.body.center.x - this.sprite.body.center.x;
	var y = other.sprite.body.center.y - this.sprite.body.center.y + 4;

	if ( Math.abs(x) < 8 && Math.abs(y) < 6 )
	{
		this.trigger( true );
	}
};

PressurePlate.prototype.hasPhysics = function ()
{
	return false;
};


extend( Entity, PressurePlate );
