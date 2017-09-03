
// Constructor
function World ()
{
	this.Player = new Player();
}


World.prototype.create = function ()
{
	this.background = DungeonGame.game.add.group();
	this.foreground = DungeonGame.game.add.group();

	this.worldWidth = DungeonGame.game.cache.getImage( 'map' ).width / 16;
	this.worldHeight = DungeonGame.game.cache.getImage( 'map' ).height / 15;
	DungeonGame.game.world.setBounds( 0, 0, this.worldWidth * SCREEN_WIDTH, this.worldHeight * SCREEN_HEIGHT );

	this.rooms = {};
	this.roomMap = Room.makePixelMap();

	for ( var i = 0; i < this.worldWidth; i++ )
	{
		for ( var j = 0; j < this.worldHeight; j++ )
		{
			var key = [i,j].toString();
			var x = i * SCREEN_WIDTH;
			var y = j * SCREEN_HEIGHT;
			var room = new Room( this.roomMap[key], x, y, this.foreground );
			room.generate();
			this.rooms[key] = room;
		}
	}


	this.currentArea = [2,5];

	this.Player.create(
		this.currentArea[0] * SCREEN_WIDTH + SCREEN_WIDTH/2,
		this.currentArea[1] * SCREEN_HEIGHT + SCREEN_HEIGHT/2,
		this.foreground
	);

	this.camGoal = new Phaser.Point();
	this.camGoal.x = this.currentArea[0] * SCREEN_WIDTH;
	this.camGoal.y = this.currentArea[1] * SCREEN_HEIGHT;
	this.camPos = new Phaser.Point();
	this.camPos.x = this.camGoal.x
	this.camPos.y = this.camGoal.y
	DungeonGame.game.camera.x = this.camGoal.x;
	DungeonGame.game.camera.y = this.camGoal.y;

	this.getCurrentRoom().appear();

	DungeonGame.game.world.bringToTop( this.foreground );
};

World.prototype.update = function ()
{
	DungeonGame.game.physics.arcade.collide( this.Player.sprite, this.getCurrentRoom().physics );
	//DungeonGame.game.physics.arcade.overlap( this.Player.sprite, this.Room.physics, this.collision, null, this );

	this.Player.update();

	this.foreground.sort( 'y', Phaser.Group.SORT_ASCENDING );

	if ( this.Player.sprite.position.x > this.camGoal.x + SCREEN_WIDTH ) {
		this.camGoal.x += SCREEN_WIDTH;
		this.getCurrentRoom().queueDisappear();
		this.currentArea[0] += 1;
		this.getCurrentRoom().appear();
	}
	if ( this.Player.sprite.position.x < this.camGoal.x ) {
		this.camGoal.x -= SCREEN_WIDTH;
		this.getCurrentRoom().queueDisappear();
		this.currentArea[0] -= 1;
		this.getCurrentRoom().appear();
	}
	if ( this.Player.sprite.position.y > this.camGoal.y + SCREEN_HEIGHT ) {
		this.camGoal.y += SCREEN_HEIGHT;
		this.getCurrentRoom().queueDisappear();
		this.currentArea[1] += 1;
		this.getCurrentRoom().appear();
	}
	if ( this.Player.sprite.position.y < this.camGoal.y ) {
		this.camGoal.y -= SCREEN_HEIGHT;
		this.getCurrentRoom().queueDisappear();
		this.currentArea[1] -= 1;
		this.getCurrentRoom().appear();
	}

	this.camPos.x += ( this.camGoal.x - this.camPos.x ) / 4;
	this.camPos.y += ( this.camGoal.y - this.camPos.y ) / 4;
	DungeonGame.game.camera.x = Math.round( this.camPos.x );
	DungeonGame.game.camera.y = Math.round( this.camPos.y );
};

World.prototype.render = function ()
{
	this.getCurrentRoom().render();

	this.Player.render();

	//DungeonGame.game.debug.spriteInfo(this.Player.sprite, 0, 0);
	//DungeonGame.game.debug.text( DungeonGame.game.time.fps, 0, 10 );
};

World.prototype.collision = function ( player, wall )
{
	//console.log(player.body.position, wall.body.position);
};

World.prototype.getCurrentRoom = function ()
{
	var key = this.currentArea.toString();
	if ( key in this.rooms )
		return this.rooms[key];
};
