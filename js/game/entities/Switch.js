
// Constructor
function Switch( sprite )
{
	Entity.call( this, sprite );
	this.sprite.frame = 3;

	this.sprite.body.immovable = true;
	this.sprite.body.moves = false;
	this.sprite.body.drag.setTo( 1000, 1000 );

	this.active = false;
};


Switch.prototype.hurt = function ()
{

	this.active = !this.active;
	if ( this.active )
	{
		this.sprite.frame = 4;
		DungeonGame.Audio.play( 'crystal', 'on' );
	}
	else
	{
		this.sprite.frame = 3;
		DungeonGame.Audio.play( 'crystal', 'off' );
	}
};

extend( Entity, Switch );
