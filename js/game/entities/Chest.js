
// Constructor
function Chest( sprite, bgSprite, trigger )
{
	Entity.call( this, sprite, bgSprite );
	this.trigger = trigger;

	this.sprite.body.immovable = true;
	this.sprite.body.moves = false;

	this.active = false;
};

Chest.prototype.create = function ( x, y, deathCallback )
{
	Entity.prototype.create.call( this, x, y, deathCallback );

	this.sprite.frame = 16;

	this.bgSprite.reset( x*16 + 8, y*16 );
	this.bgSprite.frame = 3;
};

Chest.prototype.update = function ()
{
	Entity.prototype.update.call( this );

	var h = this.active * ( 3 + Math.sin( DungeonGame.game.time.totalElapsedSeconds() * Math.PI ) );
	this.sprite.position.y += ( this.spawn.y * 16 - h - this.sprite.position.y ) / 8;
	this.sprite.body.offset.y += ( 16 + h - this.sprite.body.offset.y ) / 8;
};

Chest.prototype.hurt = function ()
{
	this.active = !this.active;
	if ( this.active )
	{
		this.sprite.frame = 17;
		DungeonGame.Audio.play( 'crystal', 'on' );
		this.trigger( this );
	}
	else
	{
		this.sprite.frame = 16;
		DungeonGame.Audio.play( 'crystal', 'off' );
		this.trigger( this );
	}
};

extend( Entity, Chest );
