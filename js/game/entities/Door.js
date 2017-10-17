
// Constructor
function Door( onTryOpen )
{
	Entity.call( this );
	this.onTryOpen = onTryOpen;

	this.isOpen = false;
};

Door.prototype.create = function ()
{
	this.sprite.loadTexture( 'entities32', 0 );
	//this.sprite.frame = 15;
	this.sprite.frame = 0;
	this.sprite.anchor.set(0.25, 0.5);
	this.sprite.body.setSize(32, 16);

	if ( this.data.open )
	{
		this.isOpen = true;
		this.sprite.frame = 1;
	}
};

Door.prototype.destroy = function ()
{
	this.data.open = this.isOpen;
};

Door.prototype.open = function ()
{
	this.isOpen = true;
	this.sprite.frame = 1;
	DungeonGame.Audio.play( 'open' );
};

Door.prototype.hurt = function ()
{
	if ( !this.isOpen )
	{
		this.onTryOpen( this );
	}
};

Door.prototype.overlap = function ( other )
{
	Entity.prototype.overlap.call( this, other );
	if ( !this.isOpen )
	{
		this.onTryOpen( this );
	}
};

Door.prototype.hasPhysics = function ()
{
	return !this.isOpen;
};

extend( Entity, Door );
