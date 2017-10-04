
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
	this.sprite.frame = 17;

	if ( this.data.open )
	{
		this.isOpen = true;
		this.sprite.frame = 16;
	}
};

Chest.prototype.destroy = function ()
{
	this.data.open = this.isOpen;
};

Chest.prototype.hurt = function ()
{
	if ( !this.isOpen )
	{
		this.isOpen = true;
		this.sprite.frame = 16;
		//DungeonGame.Audio.play( 'crystal', 'on' );
		this.onOpen( this );
	}
};

extend( Entity, Chest );
