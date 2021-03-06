
// Constructor
function World ()
{
	this.Player = new Player();
}


World.prototype.create = function ()
{
	this.worldWidth = DungeonGame.game.cache.getImage( 'floorMap' ).width / ROOM_WIDTH;
	this.worldHeight = DungeonGame.game.cache.getImage( 'floorMap' ).height / ROOM_HEIGHT;
	DungeonGame.game.world.setBounds( 0, 0, this.worldWidth * SCREEN_WIDTH, this.worldHeight * SCREEN_HEIGHT );
	//this.background = DungeonGame.game.add.tileSprite( 0, 0, this.worldWidth * ROOM_WIDTH * 16, this.worldHeight * ROOM_HEIGHT * 16, 'dungeon', sposToIndex(TILE_FLOOR.spos) );

	this.ground = DungeonGame.game.add.group();
	this.entities = DungeonGame.game.add.group();
	this.lighting = DungeonGame.game.add.group();

	this.groundEmitter = this.ground.create( 0, 0, null, 0 );
	DungeonGame.Particle.initRubbleBurst( this.groundEmitter );
	DungeonGame.Particle.initFloorRubbleBurst( this.groundEmitter );

	this.items = [];

	this.roomManager = new RoomManager( this.entities );
	this.nextRoomOffset = 8;
	this.currentArea = [3,9-1];
	this.roomManager.loadRoom( this.currentArea[0], this.currentArea[1] );

	this.Player.create(
		this.currentArea[0] * SCREEN_WIDTH + SCREEN_WIDTH/2,
		this.currentArea[1] * SCREEN_HEIGHT + SCREEN_HEIGHT*9/16,
		//this.currentArea[1] * SCREEN_HEIGHT + SCREEN_HEIGHT/2,
		this.entities
	);

	this.enemyManager = new EnemyManager( this.entities, this.ground, this.lighting, this.roomManager.enemyMap, this.roomManager.physicsMap );

	this.entityManager = new EntityManager( this.entities, this.ground, this.roomManager.entityMap );
	this.entityManager.onOpen = World.prototype.onOpen.bind( this );
	this.entityManager.triggerMonsterRoom = World.prototype.triggerMonsterRoom.bind( this );
	this.entityManager.clearMonsterRoom = World.prototype.clearMonsterRoom.bind( this );

	this.projectileManager = new ProjectileManager( this.entities, this.ground, this.roomManager.physicsMap );

	this.monsterRooms = [[0,0], [0,1], [0,2], [2,6], [3,8], [4,2], [5,6]];
	this.clearedMonsterRooms = [];
	this.entityManager.clearedMonsterRooms = this.clearedMonsterRooms;
	this.enemyManager.clearedMonsterRooms = this.clearedMonsterRooms;
	this.enemyManager.onAllKilled = this.entityManager.onAllKilled.bind( this.entityManager );

	//this.entityManager.loadRoom( this.currentArea[0], this.currentArea[1] );
	//this.enemyManager.loadRoom( this.currentArea[0], this.currentArea[1] );

	//for ( var i = 0; i < 2; i++ )
	//{
	//	for ( var j = 0; j < 2; j++ )
	//	{
	//		var item = new Item();
	//		item.create(
	//			this.currentArea[0] * SCREEN_WIDTH + 160 + 16*i - 8,
	//			this.currentArea[1] * SCREEN_HEIGHT + 128 + 16*j - 8,
	//			this.ground
	//		);
	//		this.items.push( item );
	//	}
	//}

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
	DungeonGame.game.world.bringToTop( this.entities );
	DungeonGame.game.world.bringToTop( this.roomManager.foreground );
	DungeonGame.game.world.bringToTop( DungeonGame.Light.lightGroup );
	DungeonGame.game.world.bringToTop( this.lighting );
	DungeonGame.game.world.bringToTop( DungeonGame.Gui.guiGroup );

	this.shake = 0;
	this.prevShakeDir = [0,0];

	// Due to how fire particles somehow don't end up on top at spawn
	this.Player.sprite.position.y += ROOM_HEIGHT * 16;
	this.shiftRoom( 0, 1 );
	this.camPos.y += ROOM_HEIGHT * 16;
	DungeonGame.game.camera.x = Math.round( this.camPos.x );
	DungeonGame.game.camera.y = Math.round( this.camPos.y );

	DungeonGame.Audio.playMusic();
};

World.prototype.update = function ()
{
	this.Player.update();

	this.enemyManager.update();
	this.entityManager.update();
	this.projectileManager.update();

	this.handleCollisions();

	this.entities.sort( 'y', Phaser.Group.SORT_ASCENDING );
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

	var fac = 1 - Math.pow( 0.75, DungeonGame.game.time.elapsed * 0.06 );
	this.camPos.x += ( this.camGoal.x - this.camPos.x ) * fac;
	this.camPos.y += ( this.camGoal.y - this.camPos.y ) * fac;

	var d = this.camPos.distance( this.camGoal );
	if ( d < 1 && d != 0 )
	{
		this.camPos.x = this.camGoal.x;
		this.camPos.y = this.camGoal.y;
		this.roomManager.clearOutOfView();
		this.enemyManager.clearOutOfView();
		this.entityManager.clearOutOfView();
		this.projectileManager.clearOutOfView();
	}
	//this.camPos.x += ( this.camGoal.x - this.camPos.x ).clamp(-2,2);
	//this.camPos.y += ( this.camGoal.y - this.camPos.y ).clamp(-2,2);

	DungeonGame.game.camera.x = Math.round( this.camPos.x );
	DungeonGame.game.camera.y = Math.round( this.camPos.y );

	if ( this.shake > 0 )
	{
		do
		{
			var dir = Math.random() * 2 * Math.PI;
			var sx = Math.round( Math.sin(dir) * Math.ceil( this.shake/4 ) );
			var sy = Math.round( Math.cos(dir) * Math.ceil( this.shake/4 ) );
		}
		while ( this.prevShakeDir[0] == sx && this.prevShakeDir[1] == sy )
		this.prevShakeDir = [sx, sy];

		DungeonGame.game.camera.x += sx;
		DungeonGame.game.camera.y += sy;

		this.shake -= 1;
	}

	/*if ( this.Player.gridPos != this.Player.prevGridPos )
	{
		for ( var i = 0; i < this.roomManager.background.children.length; i++ )
			this.applyLighting( this.roomManager.background.children[i], false );
		for ( var i = 0; i < this.ground.children.length; i++ )
			this.applyLighting( this.ground.children[i], true );
		for ( var i = 0; i < this.entities.children.length; i++ )
			this.applyLighting( this.entities.children[i], true );
		for ( var i = 0; i < this.roomManager.foreground.children.length; i++ )
			this.applyLighting( this.roomManager.foreground.children[i], false );
	}*/
};

World.prototype.handleCollisions = function ()
{
	for ( var i = 0; i < this.enemyManager.enemies.length; i++ )
	{
		var enemy = this.enemyManager.enemies[i];
		if ( enemy && enemy.sprite.exists )
		{
			DungeonGame.game.physics.arcade.overlap( this.Player.swing, enemy.sprite, function( swing, enemy ) {
				enemy.owner.getHit( swing, this.Player.getAttackPower() );
			}, null, this );
			DungeonGame.game.physics.arcade.overlap( this.Player.sprite, enemy.sprite, function() {
				this.Player.damage( enemy.getAttackPower(), enemy.sprite.body.center );
			}, null, this );

			if ( !Fry.prototype.isPrototypeOf( enemy ) )
			{
				DungeonGame.game.physics.arcade.overlap( this.entityManager.sprites, enemy.sprite, function( other ) {
					enemy.overlapEntity( other );
				}, null, this );
			}
		}
	}

	for ( var i = 0; i < this.entityManager.entities.length; i++ )
	{
		var entity = this.entityManager.entities[i];
		if ( entity && entity.sprite.exists )
		{
			DungeonGame.game.physics.arcade.overlap( this.Player.swing, entity.sprite, function( swing, entity ) {
				entity.owner.damage( this.Player.getAttackPower() );
			}, null, this );
			DungeonGame.game.physics.arcade.overlap( this.Player.sprite, entity.sprite, function() {
				entity.overlap( this.Player );
			}, null, this );

			DungeonGame.game.physics.arcade.overlap( this.entityManager.sprites, entity.sprite, function( other ) {
				entity.overlapEntity( other );
			}, null, this );
		}
	}

	for ( var i = 0; i < this.projectileManager.projectiles.length; i++ )
	{
		var projectile = this.projectileManager.projectiles[i];
		if ( projectile && projectile.sprite.exists )
		{
			DungeonGame.game.physics.arcade.collide( projectile.sprite, this.roomManager.physics, function( projectile ) {
				projectile.owner.destroy();
			}, null, this );
			DungeonGame.game.physics.arcade.overlap( this.Player.swing, projectile.sprite, function( swing, projectile ) {
				//projectile.owner.damage( this.Player.getAttackPower() );
			}, null, this );
			DungeonGame.game.physics.arcade.overlap( this.Player.sprite, projectile.sprite, function() {
				//projectile.overlap( this.Player );
			}, null, this );
		}
	}

	for ( var i = 0; i < this.items.length; i++ )
	{
		DungeonGame.game.physics.arcade.overlap( this.Player.sprite, this.items[i].sprite, this.collision, null, this );
	}


	DungeonGame.game.physics.arcade.collide( this.Player.sprite, this.roomManager.physics );

	DungeonGame.game.physics.arcade.collide( this.enemyManager.sprites, this.roomManager.physics );
	DungeonGame.game.physics.arcade.collide( this.enemyManager.sprites, this.roomManager.boundaries );

	DungeonGame.game.physics.arcade.collide( this.entityManager.sprites, this.roomManager.physics );
	DungeonGame.game.physics.arcade.collide( this.entityManager.sprites, this.roomManager.boundaries );
};

World.prototype.applyLighting = function ( sprite, entities )
{
	var dist = this.Player.gridPos.distance( sprite.position );
	var minDist = DungeonGame.shadow ? 32 : 128;
	var maxDist = DungeonGame.shadow ? 80 : 960;
	var fac = ( (maxDist - dist) / (maxDist - minDist) ).clamp( 0, 1 );
	var maxLight = DungeonGame.shadow ? (entities ? 0xaa : 0x55) : 0xff;
	sprite.tint = (maxLight*fac << 0) + (maxLight*fac << 8) + (maxLight*fac << 16);
};

World.prototype.render = function ()
{
	this.roomManager.render();
	this.enemyManager.render();
	this.entityManager.render();
	this.projectileManager.render();

	this.Player.render();

	for ( var i = 0; i < this.items.length; i++ )
	{
		if ( this.items[i].sprite.exists )
			this.items[i].render();
	}

	if ( DungeonGame.debug )
	{
		var y = 10;
		DungeonGame.game.debug.text( 'fps: {0}'.format( DungeonGame.game.time.fps ), 0, y );

		y += 15;
		DungeonGame.game.debug.text( 'room: {0},{1}'.format( this.currentArea[0], this.currentArea[1] ), 0, y );

		y += 15;
		DungeonGame.game.debug.text( 'tile: {0},{1}'.format(
			this.Player.gridPos.x/16 - this.currentArea[0]*ROOM_WIDTH,
			this.Player.gridPos.y/16 - this.currentArea[1]*ROOM_HEIGHT
		), 0, y );

		y += 15;
		var count = 0;
		for ( var i = 0; i < this.roomManager.physics.children.length; i++ )
			if ( this.roomManager.physics.children[i].exists ) count += 1;
		DungeonGame.game.debug.text( 'phy: {0}'.format( count ), 0, y );

		y += 15;
		var count = 0;
		for ( var i = 0; i < this.roomManager.foreground.children.length; i++ )
			if ( this.roomManager.foreground.children[i].exists ) count += 1;
		DungeonGame.game.debug.text( 'fgr: {0}'.format( count ), 0, y );

		y += 15;
		var count = 0;
		for ( var i = 0; i < this.roomManager.background.children.length; i++ )
			if ( this.roomManager.background.children[i].exists ) count += 1;
		DungeonGame.game.debug.text( 'bgr: {0}'.format( count ), 0, y );

		y += 15;
		var count = 0;
		for ( var i = 0; i < this.enemyManager.sprites.length; i++ )
			if ( this.enemyManager.sprites[i].exists ) count += 1;
		DungeonGame.game.debug.text( 'enm: {0}'.format( count ), 0, y );

		y += 15;
		var count = 0;
		for ( var i = 0; i < this.entityManager.sprites.length; i++ )
			if ( this.entityManager.sprites[i].exists ) count += 1;
		DungeonGame.game.debug.text( 'obj: {0}'.format( count ), 0, y );

		y += 15;
		var count = 0;
		for ( var i = 0; i < this.projectileManager.sprites.length; i++ )
			if ( this.projectileManager.sprites[i].exists ) count += 1;
		DungeonGame.game.debug.text( 'pro: {0}'.format( count ), 0, y );
	}
};

World.prototype.pause = function ( isPaused )
{
	this.Player.sprite.animations.paused = isPaused;
	this.enemyManager.pause( isPaused );
	this.entityManager.pause( isPaused );
}

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
		this.entityManager.loadRoom( x, y );
		this.enemyManager.loadRoom( x, y );

		this.camGoal.x = x * SCREEN_WIDTH;
		this.camGoal.y = y * SCREEN_HEIGHT;

		this.Player.sprite.position.x += dx;
		this.Player.sprite.position.y += dy;
	}
};


World.prototype.onOpen = function ( entity )
{
	if ( Chest.prototype.isPrototypeOf( entity ) )
	{
		var item = null;
		if ( pointCmp( entity.getRoomPos(), [[1,8]] ) )
			item = 1; // Basic sword
		else if ( pointCmp( entity.getRoomPos(), [[3,3]] ) )
			item = 14; // Advanced sword
		else if ( pointCmp( entity.getRoomPos(), [[6,2]] ) )
			item = 7; // Golden sword
		else if ( pointCmp( entity.getRoomPos(), [[2,1]] ) )
			item = 62; // Power glove
		else if ( pointCmp( entity.getRoomPos(), [[3,8]] ) )
			item = 71; // Holy grail
		else
			item = 69;

		this.Player.giveItem( item );
		DungeonGame.Gui.showNewItem( entity.sprite.x, entity.sprite.y, item );
		DungeonGame.Audio.toggleMusic('sword', true);
	}

	if ( Door.prototype.isPrototypeOf( entity ) )
	{
		if ( this.Player.hasItem( 69 ) )
		{
			this.Player.takeItem( 69 ); // 68-69 Key
			entity.open();
		}
	}
};

World.prototype.checkPhysicsAt = function ( x, y )
{
	if ( this.roomManager.isWithin( x, y ) )
	{
		if ( this.roomManager.checkPhysicsAt( x, y ) )
		{
			return true;
		}
		else if ( this.entityManager.checkPhysicsAt( x, y ) )
		{
			return true;
		}
		else if ( this.enemyManager.checkPhysicsAt( x, y ) )
		{
			return true;
		}
	}
	else
	{
		console.error( "Position out of bounds: ({0}, {1})".format(x, y) );
	}
	return false;
};

World.prototype.cameraShake = function ( value )
{
	this.shake = Math.max( Math.round(value), this.shake );
};

World.prototype.triggerMonsterRoom = function ( roomPos )
{
	if ( pointCmp( roomPos, this.monsterRooms ) && !pointCmp( roomPos, this.clearedMonsterRooms ) )
	{
		this.enemyManager.activateEnemies();
	}
};

World.prototype.clearMonsterRoom = function ( roomPos )
{
	if ( pointCmp( roomPos, this.monsterRooms ) && !pointCmp( roomPos, this.clearedMonsterRooms ) )
	{
		this.clearedMonsterRooms.push( roomPos );
	}
};
