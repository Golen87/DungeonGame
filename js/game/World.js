
// Constructor
function World ()
{
	this.Player = new Player();
}


World.prototype.create = function ()
{
	this.ground = DungeonGame.game.add.group();
	this.actors = DungeonGame.game.add.group();

	this.enemies = [];
	this.items = [];

	this.worldWidth = DungeonGame.game.cache.getImage( 'overworld' ).width / ROOM_WIDTH;
	this.worldHeight = DungeonGame.game.cache.getImage( 'overworld' ).height / ROOM_HEIGHT;
	DungeonGame.game.world.setBounds( 0, 0, this.worldWidth * SCREEN_WIDTH, this.worldHeight * SCREEN_HEIGHT );

	this.roomManager = new RoomManager();
	this.nextRoomOffset = 8;
	this.currentArea = [7,7];
	this.roomManager.loadRoom( this.currentArea[0], this.currentArea[1] );

	this.Player.create(
		this.currentArea[0] * SCREEN_WIDTH + SCREEN_WIDTH/2,
		this.currentArea[1] * SCREEN_HEIGHT + SCREEN_HEIGHT/2,
		this.actors
	);

	for ( var i = 0; i < 3; i++ )
	{
		for ( var j = 0; j < 3; j++ )
		{
			var enemy = new Enemy();
			var x = this.currentArea[0] * SCREEN_WIDTH + 64 + 16*i - 8;
			var y = this.currentArea[1] * SCREEN_HEIGHT + 64 + 16*j - 8;
			//var x = randInt( 0,DungeonGame.game.cache.getImage( 'overworld' ).width * 16 );
			//var y = randInt( 0,DungeonGame.game.cache.getImage( 'overworld' ).height * 16 );
			enemy.create( x, y, this.actors );
			this.enemies.push( enemy );
		}
	}

	for ( var i = 0; i < 2; i++ )
	{
		for ( var j = 0; j < 2; j++ )
		{
			var item = new Item();
			item.create(
				this.currentArea[0] * SCREEN_WIDTH + 160 + 16*i - 8,
				this.currentArea[1] * SCREEN_HEIGHT + 128 + 16*j - 8,
				this.ground
			);
			this.items.push( item );
		}
	}

	this.camGoal = new Phaser.Point();
	this.camGoal.x = this.currentArea[0] * SCREEN_WIDTH;
	this.camGoal.y = this.currentArea[1] * SCREEN_HEIGHT;
	this.camPos = new Phaser.Point();
	this.camPos.x = this.camGoal.x
	this.camPos.y = this.camGoal.y
	DungeonGame.game.camera.x = this.camGoal.x;
	DungeonGame.game.camera.y = this.camGoal.y;

	DungeonGame.game.world.bringToTop( this.roomManager.background );
	DungeonGame.game.world.bringToTop( this.ground );
	DungeonGame.game.world.bringToTop( this.actors );
	DungeonGame.game.world.bringToTop( this.roomManager.foreground );
};

World.prototype.update = function ()
{
	DungeonGame.game.physics.arcade.collide( this.Player.sprite, this.roomManager.physics );
	//DungeonGame.game.physics.arcade.overlap( this.Player.sprite, this.Room.physics, this.collision, null, this );

	this.Player.update();

	for ( var i = 0; i < this.enemies.length; i++ )
	{
		DungeonGame.game.physics.arcade.collide( this.enemies[i].sprite, this.roomManager.physics );
		DungeonGame.game.physics.arcade.overlap( this.Player.swing, this.enemies[i].sprite, this.enemies[i].damage, null, this.enemies[i] );
		DungeonGame.game.physics.arcade.overlap( this.Player.sprite, this.enemies[i].sprite, function(){
			this.Player.damage( this.enemies[i].getAttackPower(), this.enemies[i].sprite.body.position );
		}, null, this );
		this.enemies[i].update();
	}

	for ( var i = 0; i < this.items.length; i++ )
	{
		DungeonGame.game.physics.arcade.overlap( this.Player.sprite, this.items[i].sprite, this.collision, null, this );
	}

	this.actors.sort( 'y', Phaser.Group.SORT_ASCENDING );
	//this.foreground.sort( 'y', Phaser.Group.SORT_ASCENDING );

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
	//this.camPos.x += ( this.camGoal.x - this.camPos.x ).clamp(-2,2);
	//this.camPos.y += ( this.camGoal.y - this.camPos.y ).clamp(-2,2);
	DungeonGame.game.camera.x = Math.round( this.camPos.x + 0*(Math.random()-0.5) );
	DungeonGame.game.camera.y = Math.round( this.camPos.y + 0*(Math.random()-0.5) );

	/*if ( this.Player.gridPos != this.Player.prevGridPos )
	{
		for ( var i = 0; i < this.roomManager.background.children.length; i++ )
			this.applyLighting( this.roomManager.background.children[i], false );
		for ( var i = 0; i < this.ground.children.length; i++ )
			this.applyLighting( this.ground.children[i], true );
		for ( var i = 0; i < this.actors.children.length; i++ )
			this.applyLighting( this.actors.children[i], true );
		for ( var i = 0; i < this.roomManager.foreground.children.length; i++ )
			this.applyLighting( this.roomManager.foreground.children[i], false );
	}*/
};

World.prototype.applyLighting = function ( sprite, objects )
{
	var dist = this.Player.gridPos.distance( sprite.position );
	var minDist = DungeonGame.shadow ? 32 : 128;
	var maxDist = DungeonGame.shadow ? 80 : 960;
	var fac = ( (maxDist - dist) / (maxDist - minDist) ).clamp( 0, 1 );
	var maxLight = DungeonGame.shadow ? (objects ? 0xaa : 0x55) : 0xff;
	sprite.tint = (maxLight*fac << 0) + (maxLight*fac << 8) + (maxLight*fac << 16);
};

World.prototype.render = function ()
{
	this.roomManager.render();

	this.Player.render();

	for ( var i = 0; i < this.enemies.length; i++ )
	{
		this.enemies[i].render();
	}

	for ( var i = 0; i < this.items.length; i++ )
	{
		this.items[i].render();
	}

	if ( DungeonGame.debug )
	{
		DungeonGame.game.debug.text( 'fps: {0}'.format( DungeonGame.game.time.fps ), 0, 10 );

		var count = 0;
		for ( var i = 0; i < this.roomManager.physics.children.length; i++ )
			if ( this.roomManager.physics.children[i].exists ) count += 1;
		DungeonGame.game.debug.text( 'phy: {0}'.format( count ), 0, 25 );

		var count = 0;
		for ( var i = 0; i < this.roomManager.foreground.children.length; i++ )
			if ( this.roomManager.foreground.children[i].exists ) count += 1;
		DungeonGame.game.debug.text( ' fg: {0}'.format( count ), 0, 40 );

		var count = 0;
		for ( var i = 0; i < this.roomManager.background.children.length; i++ )
			if ( this.roomManager.background.children[i].exists ) count += 1;
		DungeonGame.game.debug.text( ' bg: {0}'.format( count ), 0, 55 );
	}
};

World.prototype.collision = function ( player, item )
{
	//console.log( player.body.position, item.body.position );
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
		this.currentArea[0] = x;
		this.currentArea[1] = y;

		this.roomManager.loadRoom( x, y );

		this.camGoal.x = x * SCREEN_WIDTH;
		this.camGoal.y = y * SCREEN_HEIGHT;

		this.Player.sprite.position.x += dx;
		this.Player.sprite.position.y += dy;
	}
};
