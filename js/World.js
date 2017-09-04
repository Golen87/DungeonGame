
// Constructor
function World ()
{
	this.Player = new Player();
}


World.prototype.create = function ()
{
	this.background = DungeonGame.game.add.group();
	this.foreground = DungeonGame.game.add.group();
	this.physics = DungeonGame.game.add.group();

	this.worldWidth = DungeonGame.game.cache.getImage( 'overworld' ).width / ROOM_WIDTH;
	this.worldHeight = DungeonGame.game.cache.getImage( 'overworld' ).height / ROOM_HEIGHT;
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
			var room = new Room( this.roomMap[key], x, y, this.foreground, this.background, this.physics );
			//room.generate();
			this.rooms[key] = room;
		}
	}


	this.currentArea = [7,7];

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

	this.nextRoomOffset = 8;
	this.getCurrentRoom().appear();

	DungeonGame.game.world.bringToTop( this.foreground );
};

World.prototype.update = function ()
{
	DungeonGame.game.physics.arcade.collide( this.Player.sprite, this.getCurrentRoom().physics );
	//DungeonGame.game.physics.arcade.overlap( this.Player.sprite, this.Room.physics, this.collision, null, this );

	this.Player.update();

	this.foreground.sort( 'y', Phaser.Group.SORT_ASCENDING );

	if ( this.Player.sprite.position.x > this.camGoal.x + SCREEN_WIDTH - this.nextRoomOffset ) {
		this.shiftRoom( 1, 0 );
	}
	if ( this.Player.sprite.position.x < this.camGoal.x + this.nextRoomOffset ) {
		this.shiftRoom( -1, 0 );
	}
	if ( this.Player.sprite.position.y > this.camGoal.y + SCREEN_HEIGHT - this.nextRoomOffset ) {
		this.shiftRoom( 0, 1 );
	}
	if ( this.Player.sprite.position.y < this.camGoal.y + this.nextRoomOffset ) {
		this.shiftRoom( 0, -1 );
	}

	this.camPos.x += ( this.camGoal.x - this.camPos.x ) / 4;
	this.camPos.y += ( this.camGoal.y - this.camPos.y ) / 4;
	DungeonGame.game.camera.x = Math.round( this.camPos.x );
	DungeonGame.game.camera.y = Math.round( this.camPos.y );

	if ( this.Player.gridPos != this.Player.prevGridPos )
	{
		for ( var i = 0; i < this.foreground.children.length; i++ )
		{
			this.applyLighting( this.foreground.children[i] );
		}
		for ( var i = 0; i < this.background.children.length; i++ )
		{
			this.applyLighting( this.background.children[i] );
		}
	}
};

World.prototype.applyLighting = function ( sprite )
{
	var dist = this.Player.gridPos.distance( sprite.position );
	var max = 600;
	var fac = ( (max - dist) / max ).clamp( 0, 1 );
	sprite.tint = (0xff*fac << 0) + (0xff*fac << 8) + (0xff*fac << 16);
};

World.prototype.render = function ()
{
	this.getCurrentRoom().render();

	this.Player.render();

	//DungeonGame.game.debug.spriteInfo(this.Player.sprite, 0, 0);
	if ( DungeonGame.debug )
	{
		DungeonGame.game.debug.text( DungeonGame.game.time.fps, 0, 10 );
		DungeonGame.game.debug.text( this.foreground.children.length, 0, 25 );
		DungeonGame.game.debug.text( this.background.children.length, 0, 40 );
		DungeonGame.game.debug.text( this.physics.children.length, 0, 55 );
	}
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

World.prototype.shiftRoom = function ( dx, dy )
{
	dx *= 2 * this.nextRoomOffset;
	dy *= 2 * this.nextRoomOffset;
	var x = Math.floor( ( this.Player.sprite.position.x + dx ) / SCREEN_WIDTH );
	var y = Math.floor( ( this.Player.sprite.position.y + dy ) / SCREEN_HEIGHT );
	x = Math.max( 0, Math.min( this.worldWidth - 1, x ) );
	y = Math.max( 0, Math.min( this.worldHeight - 1, y ) );
	if ( x != this.currentArea[0] || y != this.currentArea[1] )
	{
		this.getCurrentRoom().queueDisappear();
		this.currentArea[0] = x;
		this.currentArea[1] = y;
		this.getCurrentRoom().appear();

		this.camGoal.x = x * SCREEN_WIDTH;
		this.camGoal.y = y * SCREEN_HEIGHT;

		this.Player.sprite.position.x += dx;
		this.Player.sprite.position.y += dy;
	}
};
