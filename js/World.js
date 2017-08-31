
// Constructor
function World ()
{
	this.Room;

	this.Player = new Player();
}


World.prototype.create = function ()
{
	this.Room = new Room( 'room_1' );

	this.Player.create();
};

World.prototype.update = function ()
{
	DungeonGame.game.physics.arcade.collide( this.Player.sprite, this.Room.sprites );

	this.Player.update();
};

World.prototype.render = function ()
{
	this.Room.render();

	this.Player.render();
};
