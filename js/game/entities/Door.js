
// Constructor
function Door( onTryOpen )
{
	Entity.call( this );
	this.onTryOpen = onTryOpen;

	this.isOpen = false;
};

Door.prototype.create = function ()
{
	this.sprite.frame = 14;

	if ( this.data.open )
	{
		this.isOpen = true;
		this.sprite.frame = 15;
	}
};

Door.prototype.destroy = function ()
{
	this.data.open = this.isOpen;
};

Door.prototype.open = function ()
{
	this.isOpen = true;
	this.sprite.frame = 15;
	DungeonGame.Audio.play( 'crystal', 'on' );
};

Door.prototype.hurt = function ()
{
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
