
// Constructor
function Box( onDeath )
{
	Pushable.call( this );
	this.onDeath = onDeath;

	this.health = 3;

	this.pushSpeed = 1.0;
};

Box.prototype.create = function ()
{
	Pushable.prototype.create.call( this );

	this.sprite.frame = 0;
	this.sprite.scale.x = [-1,1].choice();
};

Box.prototype.destroy = function () {
	Pushable.prototype.destroy.call( this );
};


Box.prototype.overlapEntity = function ( other )
{
	if ( Spikes.prototype.isPrototypeOf( other.owner ) )
	{
		if ( other.owner.hasPhysics() )
		{
			this.defeat();
		}
	}
};

Box.prototype.hurt = function ( power )
{
	DungeonGame.Audio.play( 'chop' );

	this.health -= power;
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
	DungeonGame.World.cameraShake( 8 );

	DungeonGame.Particle.createRubbleBurst( this.sprite.x, this.sprite.y );

	this.onDeath( this );
};

extend( Pushable, Box );
