
// Constructor
function Chest( onOpen )
{
	Entity.call( this );
	this.onOpen = onOpen;

	this.isOpen = false;
};

Chest.prototype.create = function ()
{
	//this.sprite.loadTexture( 'entities32', 0 );
	this.sprite.frame = 16;

	if ( this.data.open )
	{
		this.isOpen = true;
		this.sprite.frame = 18;
	}
};

Chest.prototype.destroy = function ()
{
	this.data.open = this.isOpen;
};

Chest.prototype.hurt = function ()
{
	this.open();
};

Chest.prototype.overlap = function ( other )
{
	Entity.prototype.overlap.call( this, other );
	this.open();
};

Chest.prototype.open = function ()
{
	if ( !this.isOpen )
	{
		this.isOpen = true;
		this.sprite.frame = 17;
		DungeonGame.Audio.play( 'chest' );
		//DungeonGame.cinematic = true;

		DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 0.5, function() {
			this.sprite.frame = 18;
			DungeonGame.Audio.play( 'open' );
			this.onOpen( this );
		}, this );
	}
};

extend( Entity, Chest );
