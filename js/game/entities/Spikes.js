
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

	this.hidden = false;
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

	// Secret Grail Block puzzle
	if ( pointCmp( this.getRoomPos(), [[3,8]] ) )
	{
		this.silent = true;
	}

	// Any Monster room
	if ( pointCmp( this.getRoomPos(), DungeonGame.World.monsterRooms ) )
	{
		this.hide();
	}
	// Tarragon
	if ( pointCmp( this.getRoomPos(), [[4,0]] ) )
	{
		this.hide();
	}

	if ( !this.hidden ) {
		DungeonGame.Audio.toggleMusic('spikes', true);
	}
};

Spikes.prototype.destroy = function ()
{
	this.data.hidden = this.hidden;
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

Spikes.prototype.hide = function ()
{
	if ( this.data.hidden == false )
		return;

	this.hidden = true;

	var spos = Tiles.Indent.spos.choice();
	this.bgSprite.loadTexture( 'dungeon', sposToIndex(spos) );
	this.bgSprite.anchor.set( 0.5, 0 );
};

Spikes.prototype.unhide = function ( immediate=false )
{
	if ( this.hidden )
	{
		this.hidden = false;

		this.bgSprite.loadTexture( 'entities16', 6 );
		this.bgSprite.anchor.set( 0.5, 0.5 );

		if ( !immediate )
		{
			DungeonGame.World.cameraShake( 4 );
			DungeonGame.Particle.createFloorRubbleBurst( this.sprite.x, this.sprite.y+8 );
		}

		DungeonGame.Audio.toggleMusic('spikes', true);
	}
};

Spikes.prototype.setState = function ( state, sound=true )
{
	this.active = state;

	if ( state )
	{
		this.sprite.alpha = 1.0;
		this.sprite.frame = 9;

		if ( sound && !this.silent )
			DungeonGame.Audio.play( 'spikes' );
		this.unhide( !sound );
	}
	else
	{
		this.sprite.alpha = 0.0;
	}
};

Spikes.prototype.toggle = function ( state, immediate=false )
{
	if ( this.active == state || this.lockState )
		return;

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
		this.animationTimer = 12;
	}

	if ( immediate )
	{
		this.animationTimer = 0;
		this.setState( this.active, false );
	}

	this.unhide( immediate );
};

Spikes.prototype.prepare = function ( state )
{
	if ( state )
	{
		this.sprite.alpha = 1.0;
		this.sprite.frame = 7;

		this.prepareTimer = this.prepareDuration;
		this.autoTimer += this.prepareDuration / 2;

		this.unhide();
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
	return new Phaser.Point(
		Math.floor(this.sprite.x / 16),
		Math.floor((this.sprite.y+4) / 16)
	);
};


extend( Entity, Spikes );
