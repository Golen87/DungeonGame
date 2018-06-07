
// Constructor
function Block()
{
	Pushable.call( this );

	this.health = 3;

	this.pushSpeed = 0.5;
};

Block.prototype.create = function ()
{
	Pushable.prototype.create.call( this );

	this.sprite.frame = 11;
	this.sprite.scale.x = [-1,1].choice();

	this.trail = DungeonGame.Particle.createWalkTrail( 0, 0 );
	this.trailCooldown = 0;
	DungeonGame.World.entities.add( this.trail );
};

Block.prototype.destroy = function () {
	Pushable.prototype.destroy.call( this );
};


Block.prototype.overlap = function ( other )
{
	Pushable.prototype.overlap.call( this, other );

	// Check if player has the Power Glove
	if ( !DungeonGame.World.Player.hasItem( 62 ) )
	{
		this.isPushingBuffer = 0;
	}
}

Block.prototype.hurt = function ()
{
	//DungeonGame.Audio.play( 'break' );
};

extend( Pushable, Block );
