
// Constructor
function PressurePlate( onTrigger )
{
	Entity.call( this );
	this.onTrigger = onTrigger;

	this.active = false;
	this.prevActive = false;
	this.timer = 0;
};

PressurePlate.prototype.create = function ()
{
	Entity.prototype.create.call( this );

	this.sprite.alpha = 0.0;

	this.bgSprite.reset( this.spawn.x*16 + 8, this.spawn.y*16 );
	this.bgSprite.frame = 12;

	this.toggle( false );
};

PressurePlate.prototype.update = function ()
{
	Entity.prototype.update.call( this );

	var p = this.getGridPos();
	if ( DungeonGame.checkPhysicsAt( p.x, p.y ) )
	{
		this.toggle( true );
	}

	this.timer -= 1;
	if ( this.timer <= 0 && this.active )
	{
		this.toggle( false );
	}
};

PressurePlate.prototype.toggle = function ( state )
{
	this.active = state;

	if ( this.active != this.prevActive )
	{
		this.onTrigger( this );

		if ( state )
			this.bgSprite.frame = 13;
		else
			this.bgSprite.frame = 12;
	}

	if ( state )
		this.timer = 4;

	this.prevActive = state;
};

PressurePlate.prototype.damage = function () {};

PressurePlate.prototype.overlap = function ( other )
{
	var x = other.sprite.body.center.x - this.sprite.body.center.x;
	var y = other.sprite.body.center.y - this.sprite.body.center.y + 4;

	if ( Math.abs(x) < 8 && Math.abs(y) < 6 )
	{
		this.toggle( true );
	}
};

PressurePlate.prototype.hasPhysics = function ()
{
	return false;
};


extend( Entity, PressurePlate );
