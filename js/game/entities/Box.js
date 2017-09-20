
// Constructor
function Box( sprite )
{
	Entity.call( this, sprite );
	this.sprite.frame = 0;
	this.sprite.scale.x = [-1,1].choice();

	this.sprite.body.immovable = false;
	this.sprite.body.moves = true;
	this.sprite.body.drag.setTo( 1000, 1000 );

	this.health = 3;
};


Box.prototype.hurt = function ()
{
	this.health -= 1;
	if ( this.health == 2 )
		this.sprite.frame = 1;
	if ( this.health == 1 )
		this.sprite.frame = 2;
	if ( this.health <= 0 )
		this.defeat();
};

Box.prototype.defeat = function ()
{
	DungeonGame.Audio.play( 'break' );

	DungeonGame.Particle.createRubbleBurst( this.sprite.x, this.sprite.y );

	this.sprite.kill();

	this.deathCallback( this.spawn.x, this.spawn.y );
};

extend( Entity, Box );
