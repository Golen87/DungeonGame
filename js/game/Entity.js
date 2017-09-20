
// Constructor
function Entity( sprite )
{
	this.sprite = sprite;
	this.sprite.anchor.set( 0.5, 0.5 );
	this.sprite.body.immovable = true;
	this.sprite.body.moves = false;

	this.spawn = new Phaser.Point();
};

Entity.prototype.create = function ( x, y, deathCallback )
{
	this.spawn.setTo( x, y );
	this.sprite.reset( x*16 + 8, y*16 );
	this.sprite.body.setSize( 16, 16, 0, 16 );
	//this.sprite.body.setCircle( 6, 2, 4 );

	this.deathCallback = deathCallback;

	this.hitCooldown = 6;
	this.hitBuffer = 0;
};

Entity.prototype.update = function ()
{
	this.hitBuffer -= 1;
};

Entity.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		DungeonGame.game.debug.body( this.sprite );
	}
};


Entity.prototype.damage = function ()
{
	if ( this.hitBuffer > this.hitCooldown )
	{
		this.hitBuffer = this.hitCooldown;

		// Move please
		DungeonGame.Audio.play( 'chop' );

		this.hurt();
	}
	if ( this.hitBuffer <= 0 )
	{
		this.hitBuffer = this.hitCooldown + 4;
	}
};

Entity.prototype.hurt = function ()
{
};
