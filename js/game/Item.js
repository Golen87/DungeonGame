
// Constructor
function Item()
{
};

Item.prototype.create = function ( x, y, group )
{
	this.sprite = group.create( x, y, 'items', randInt(0,8*9) );
	DungeonGame.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	//this.sprite.body.setSize(10, 8, 3, 5);
	this.sprite.body.setCircle( 6, 2, 4 );
};

Item.prototype.update = function ()
{
};

Item.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		DungeonGame.game.debug.body( this.sprite );
	}
};
