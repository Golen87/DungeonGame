
// Constructor
function World ()
{
	this.Room;

	this.Player = new Player();
}


World.prototype.create = function ()
{
	this.background = DungeonGame.game.add.group();
	this.foreground = DungeonGame.game.add.group();

	this.Room = new Room( 'room_2', this.foreground );
	this.Room.generate();

	this.Player.create( this.foreground );

	DungeonGame.game.world.bringToTop( this.foreground );
};

World.prototype.update = function ()
{
	//DungeonGame.game.physics.arcade.overlap( this.Player.sprite, this.Room.physics, this.collision, null, this );
	DungeonGame.game.physics.arcade.collide( this.Player.sprite, this.Room.physics );

	this.Player.update();

	this.foreground.sort( 'y', Phaser.Group.SORT_ASCENDING );
};

World.prototype.render = function ()
{
	this.Room.render();

	this.Player.render();
};

World.prototype.collision = function ( player, wall )
{
	//console.log(player.body.position, wall.body.position);
};
