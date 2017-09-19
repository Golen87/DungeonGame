
// Constructor
function Box( sprite )
{
	Entity.call( this, sprite );

	this.sprite.body.immovable = false;
	this.sprite.body.moves = true;
	this.sprite.body.drag.setTo( 1000, 1000 );
};


Box.prototype.hurt = function ()
{
	console.log( "Oof" );
};

Box.prototype.defeat = function ()
{
	DungeonGame.Particle.createSmokeBurst( this.sprite.x+8, this.sprite.y+8 );

	this.sprite.kill();

	this.deathCallback( this.spawn.x, this.spawn.y );
};

extend( Entity, Box );
