
// Constructor
function Switch( onTrigger )
{
	Entity.call( this );
	this.onTrigger = onTrigger;

	this.active = false;
};

Switch.prototype.create = function ()
{
	this.sprite.frame = 4;

	this.bgSprite.reset( this.spawn.x*16 + 8, this.spawn.y*16 );
	this.bgSprite.frame = 3;

	this.toggle( this.data.active, false );
};

Switch.prototype.destroy = function ()
{
	this.data.active = this.active;
};

Switch.prototype.update = function ()
{
	Entity.prototype.update.call( this );

	var h = this.active * ( 3 + Math.sin( DungeonGame.game.time.totalElapsedSeconds() * Math.PI ) );
	this.sprite.position.y += ( this.spawn.y * 16 - h - this.sprite.position.y ) / 8;
	this.sprite.body.offset.y += ( 16 + h - this.sprite.body.offset.y ) / 8;
};

Switch.prototype.toggle = function ( state, audio=true )
{
	this.active = state != null ? state : false;

	this.onTrigger( this, !audio );

	if ( state )
	{
		this.sprite.frame = 5;
		if ( audio )
			DungeonGame.Audio.play( 'crystal', 'on' );
	}
	else
	{
		this.sprite.frame = 4;
		if ( audio )
			DungeonGame.Audio.play( 'crystal', 'off' );
	}
};

Switch.prototype.hurt = function ()
{
	this.toggle( !this.active );
};

extend( Entity, Switch );
