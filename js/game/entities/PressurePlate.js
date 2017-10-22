
// Constructor
function PressurePlate( onTrigger )
{
	Entity.call( this );
	this.onTrigger = onTrigger;

	this.active = false;
	this.prevActive = false;
	this.holdTimer = 0;
	this.animationTimer = 0;
};

PressurePlate.prototype.create = function ()
{
	Entity.prototype.create.call( this );

	this.sprite.alpha = 0.0;

	this.bgSprite.reset( this.spawn.x*16 + 8, this.spawn.y*16 );
	this.bgSprite.frame = 12;

	this.onTrigger( this, true );
};

PressurePlate.prototype.hide = function ()
{
	this.hidden = true;

	var spos = FLOOR_INDENT['spos'].choice();
	var index = spos[0] + spos[1]*8;
	this.bgSprite.loadTexture( 'dungeon', index );
	this.bgSprite.anchor.set( 0.5, 0 );
};

PressurePlate.prototype.update = function ()
{
	Entity.prototype.update.call( this );

	var p = this.getGridPos();
	if ( DungeonGame.World.checkPhysicsAt( p.x, p.y ) )
	{
		this.toggle( true );
	}

	this.holdTimer -= 1;
	if ( this.holdTimer <= 0 && this.active )
	{
		this.toggle( false );
	}

	this.animationTimer -= 1;
	if ( this.animationTimer <= 0 && this.active && !this.hidden )
	{
		this.bgSprite.frame = 13;
	}
};

PressurePlate.prototype.toggle = function ( state )
{
	this.active = state;

	if ( this.active != this.prevActive )
	{
		this.onTrigger( this );

		if ( !this.hidden )
		{
			if ( state )
			{
				this.bgSprite.frame = 14;
				this.animationTimer = 4;
				DungeonGame.Audio.play( 'pressureplate', 'on' );
			}
			else
			{
				this.bgSprite.frame = 12;
				DungeonGame.Audio.play( 'pressureplate', 'off' );
			}
		}
	}

	if ( state )
		this.holdTimer = 4;

	this.prevActive = state;
};

PressurePlate.prototype.damage = function () {};

PressurePlate.prototype.overlap = function ( other )
{
	var x = other.sprite.body.center.x - this.sprite.body.center.x;
	var y = other.sprite.body.center.y - this.sprite.body.center.y + 4;

	if ( Math.abs(x) < 8 && Math.abs(y) < 8 )
	{
		this.toggle( true );
	}
};

PressurePlate.prototype.hasPhysics = function ()
{
	return false;
};


extend( Entity, PressurePlate );
