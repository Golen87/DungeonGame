
// Constructor
function EntityManager ( group, bgGroup, lightGroup, entityMap )
{
	this.entityMap = entityMap;
	this.activeMap = [...Array( entityMap.length ).keys()].map( i => Array( entityMap[0].length ) );
	this.dataMap = [...Array( entityMap.length ).keys()].map( i => Array( entityMap[0].length ) );

	for ( var y = 0; y < this.dataMap.length; y++ )
	{
		for ( var x = 0; x < this.dataMap[y].length; x++ )
		{
			this.dataMap[y][x] = {};
		}
	}

	this.entities = Array( 64 );
	this.sprites = Array( 64 );
	this.bgSprites = Array( 64 );
	this.lightSprites = Array( 64 );

	for ( var i = 0; i < this.sprites.length; i++ )
	{
		this.sprites[i] = group.create( 0, 0, 'entities16', 0, false );
		DungeonGame.game.physics.arcade.enable( this.sprites[i], Phaser.Physics.ARCADE );
	}
	for ( var i = 0; i < this.bgSprites.length; i++ )
	{
		this.bgSprites[i] = bgGroup.create( 0, 0, 'entities16', 0, false );
	}
	for ( var i = 0; i < this.lightSprites.length; i++ )
	{
		this.lightSprites[i] = lightGroup.create( 0, 0, 'entities16', 0, false );
		this.lightSprites[i].blendMode = Phaser.blendModes.COLOR_DODGE;
	}
}

EntityManager.prototype.update = function ()
{
	for ( var i = 0; i < this.entities.length; i++ )
	{
		if ( this.entities[i] && this.entities[i].sprite.exists )
		{
			this.entities[i].update();
		}
	}
}


EntityManager.prototype.render = function ()
{
	for ( var i = 0; i < this.entities.length; i++ )
	{
		if ( this.entities[i] && this.entities[i].sprite.exists )
		{
			this.entities[i].render();
		}
	}
};


EntityManager.prototype.isInView = function ( x, y )
{
	// Will erase borders, which can be seen if moving to another room while camera shakes.
	return (
		x >= DungeonGame.game.camera.x - 16 &&
		y >= DungeonGame.game.camera.y - 16 &&
		x < DungeonGame.game.camera.x + 16 * ROOM_WIDTH &&
		y < DungeonGame.game.camera.y + 16 * ROOM_HEIGHT
	);
};

EntityManager.prototype.clearOutOfView = function ()
{
	for ( var i = 0; i < this.entities.length; i++ )
	{
		var entity = this.entities[i];
		if ( entity && entity.sprite.exists && !this.isInView( entity.sprite.position.x, entity.sprite.position.y ) )
		{
			this.activeMap[entity.spawn.y][entity.spawn.x] = null;
			entity.destroy();
			entity.sprite.kill();
			entity.bgSprite.kill();
			entity.lightSprite.kill();
		}
	}
};

EntityManager.prototype.getFirstDead = function ()
{
	for ( var i = 0; i < this.sprites.length; i++ )
	{
		if ( !this.sprites[i].exists )
		{
			return i;
		}
	}
	return -1;
};

EntityManager.prototype.loadRoom = function ( room_x, room_y )
{
	var offset_x = room_x * ROOM_WIDTH;
	var offset_y = room_y * ROOM_HEIGHT;

	this.clearOutOfView();
	var newEntities = [];

	for ( var y = offset_y; y < offset_y + ROOM_HEIGHT; y++ )
	{
		for ( var x = offset_x; x < offset_x + ROOM_WIDTH; x++ )
		{
			if ( !this.activeMap[y][x] && this.entityMap[y][x] )
			{
				var index = this.getFirstDead();
				if ( index != -1 )
				{
					this.entities[index] = null;

					if ( this.entityMap[y][x] == 'spikes' )
						this.entities[index] = new Spikes();
					else if ( this.entityMap[y][x] == 'door' )
						this.entities[index] = new Door( this.onOpen );
					else if ( this.entityMap[y][x] == 'switch' )
						this.entities[index] = new Switch( this.onTrigger.bind(this) );
					else if ( this.entityMap[y][x] == 'pressureplate' )
						this.entities[index] = new PressurePlate( this.onTrigger.bind(this) );
					else if ( this.entityMap[y][x] == 'chest' )
						this.entities[index] = new Chest( this.onOpen );
					else if ( this.entityMap[y][x] == 'box' )
						this.entities[index] = new Box( this.onDeath.bind(this) );
					else if ( this.entityMap[y][x] == 'block' )
						this.entities[index] = new Block();

					if ( this.entities[index] )
					{
						this.entities[index].init( this.sprites[index], this.bgSprites[index], this.lightSprites[index], this.dataMap[y][x], x, y );
						newEntities.push( this.entities[index] );
						this.activeMap[y][x] = this.entities[index];
					}
					else
					{
						console.error( "Entity not defined." );
					}
				}
				else
				{
					console.error( "Out of Entity resources!" );
				}
			}
		}
	}

	for ( var i = 0; i < newEntities.length; i++ )
	{
		newEntities[i].create();

		if ( Chest.prototype.isPrototypeOf( newEntities[i] ) && pointCmp( [room_x, room_y], this.monsterRooms ) )
		{
			newEntities[i].sprite.visible = false;
			newEntities[i].bgSprite.visible = false;
			newEntities[i].lightSprite.visible = false;
		}
	}
};

EntityManager.prototype.checkPhysicsAt = function ( x, y )
{
	for ( var i = 0; i < this.entities.length; i++ )
	{
		if ( this.entities[i] && this.entities[i].sprite.exists )
		{
			var p = this.entities[i].getGridPos();
			if ( p.x == x && p.y == y )
			{
				if ( this.entities[i].hasPhysics() )
					return true;
			}
		}
	}
	return false;
};

EntityManager.prototype.getBlockAt = function ( x, y )
{
	for ( var i = 0; i < this.entities.length; i++ )
	{
		if ( this.entities[i] && this.entities[i].sprite.exists )
		{
			if ( Box.prototype.isPrototypeOf( this.entities[i] ) || Block.prototype.isPrototypeOf( this.entities[i] ) )
			{
				var p = this.entities[i].getGridPos();
				if ( p.x == x && p.y == y )
				{
					return this.entities[i];
				}
			}
		}
	}
};


EntityManager.prototype.onTrigger = function ( entity, immediate )
{
	if ( Switch.prototype.isPrototypeOf( entity ) || PressurePlate.prototype.isPrototypeOf( entity ) )
	{
		for ( var i = 0; i < this.entities.length; i++ )
		{
			if ( this.entities[i] && this.entities[i].sprite.exists )
			{
				this.entities[i].manual = true;
				if ( Spikes.prototype.isPrototypeOf( this.entities[i] ) )
				{
					if ( !this.scriptedTriggers( entity, this.entities[i], immediate ) )
					{
						this.entities[i].toggle( !entity.active, immediate );
					}
				}
			}
		}
	}
};

EntityManager.prototype.onDeath = function ( entity )
{
	this.activeMap[entity.spawn.y][entity.spawn.x] = null;
	this.entityMap  [entity.spawn.y][entity.spawn.x] = null;

	entity.sprite.kill();
	entity.bgSprite.kill();
	entity.lightSprite.kill();
};


EntityManager.prototype.onAllKilled = function ( roomPos )
{
	for ( var i = 0; i < this.entities.length; i++ )
	{
		var entity = this.entities[i];
		if ( entity && entity.sprite.exists )
		{
			if ( Spikes.prototype.isPrototypeOf( entity ) )
			{
				this.scriptedTriggers( roomPos, entity, false, true );
			}
			if ( Chest.prototype.isPrototypeOf( entity ) )
			{
				if ( !entity.sprite.visible )
				{
					DungeonGame.cinematic = true;
					DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 1.0, function () {
						this.sprite.visible = true;
						this.bgSprite.visible = true;
						this.lightSprite.visible = true;

						DungeonGame.Particle.createSmokeBurst( this.sprite.x, this.sprite.y + 8 );
						DungeonGame.Audio.play( 'monsterroom-spawn' );
					}, entity );
					DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 2.2, function () {
						DungeonGame.cinematic = false;
					}, entity );
				}
			}
		}
	}
};

EntityManager.prototype.scriptedTriggers = function ( trigger, target, immediate, allMonsters=false )
{
	var room_pos, tri_pos;
	if ( allMonsters )
	{
		room_pos = trigger;
	}
	else
	{
		room_pos = trigger.getRoomPos();
		tri_pos = trigger.getRelGridPos();
	}
	var spike_room = target.getRoomPos();
	var spike_pos = target.getRelGridPos();

	if ( room_pos.x == spike_room.x && room_pos.y == spike_room.y )
	{
		// Monster rooms
		if ( pointCmp( room_pos, this.monsterRooms ) )
		{
			if ( allMonsters )
			{
				target.toggle( false, immediate );
				target.lockState = true;
				this.clearMonsterRoom( room_pos );
			}
			else if ( trigger.active && !pointCmp( room_pos, this.clearedMonsterRooms ) )
			{
				target.toggle( true, immediate );
				this.triggerMonsterRoom( room_pos );
			}
			return true;
		}

		if ( allMonsters )
			return false;

		// Block puzzle
		if ( pointCmp( room_pos, [[0, 0]] ) )
		{
			this.blockPuzzle( trigger, target, immediate, room_pos, [[9,2], [9,4]] );
			return true;
		}
		// Block puzzle
		if ( pointCmp( room_pos, [[0, 1]] ) )
		{
			this.blockPuzzle( trigger, target, immediate, room_pos, [[7,3], [7,4]] );
			return true;
		}
		// Intersection switch
		if ( pointCmp( room_pos, [[3, 1]] ) )
		{
			if ( pointCmp( spike_pos, [[8, 4], [9, 4], [8, 9], [9, 9]] ) )
				target.toggle( trigger.active, immediate );
			if ( pointCmp( spike_pos, [[6, 6], [11, 6], [6, 7], [11, 7]] ) )
				target.toggle( !trigger.active, immediate );
			return true;
		}
		// Block puzzle
		if ( pointCmp( room_pos, [[11, 9]] ) )
		{
			this.blockPuzzle( trigger, target, immediate, room_pos, [[9,6], [7,9]] );
			return true;
		}
		// Block puzzle
		if ( pointCmp( room_pos, [[13, 9]] ) )
		{
			this.blockPuzzle( trigger, target, immediate, room_pos, [[2,4], [2,5]] );
			return true;
		}

		//console.log( 'Unknown: ({0},{1}) for ({2},{3}) -> ({4},{5})'.format( room_pos.x, room_pos.y, tri_pos.x, tri_pos.y, spike_pos.x, spike_pos.y ) );
		return false;
	}
	return true;
};

EntityManager.prototype.blockPuzzle = function ( trigger, target, immediate, room_pos, plate_positions )
{
	var states = this.getActiveAt( room_pos, plate_positions );
	if ( states.equals( [true, true] ) )
	{
		target.toggle( false, immediate );

		var block1 = this.getBlockAt(
			plate_positions[0][0] + room_pos.x * ROOM_WIDTH,
			plate_positions[0][1] + room_pos.y * ROOM_HEIGHT
		);
		var block2 = this.getBlockAt(
			plate_positions[1][0] + room_pos.x * ROOM_WIDTH,
			plate_positions[1][1] + room_pos.y * ROOM_HEIGHT
		);

		if ( block1 && block2 )
		{
			var plates = this.getEntitiesAt( room_pos, plate_positions );
			plates[0].myBlock = block1;
			plates[0].myBlock.lockState = true;
			plates[1].myBlock = block2;
			plates[1].myBlock.lockState = true;
		}
	}
	else
	{
		target.toggle( true, immediate );
		if ( trigger.myBlock )
		{
			var plates = this.getEntitiesAt( room_pos, plate_positions );
			if ( plates[0].myBlock )
			{
				plates[0].myBlock.lockState = false;
				plates[0].myBlock = null;
			}
			if ( plates[1].myBlock )
			{
				plates[1].myBlock.lockState = false;
				plates[1].myBlock = null;
			}
		}
	}
};

EntityManager.prototype.getEntitiesAt = function ( roomPos, coordList )
{
	var result = [];
	for ( var i=0; i<coordList.length; i++ )
	{
		var coords = [
			coordList[i][0] + roomPos.x * ROOM_WIDTH,
			coordList[i][1] + roomPos.y * ROOM_HEIGHT
		];

		if ( this.activeMap[coords[1]][coords[0]] )
			result.push( this.activeMap[coords[1]][coords[0]] );
		else
			console.error( 'No trigger at ({0},{1})'.format( roomPos.x, roomPos.y ) );
	}
	return result;
};


EntityManager.prototype.getActiveAt = function ( roomPos, coordList )
{
	var result = this.getEntitiesAt( roomPos, coordList );
	for ( var i=0; i<result.length; i++ )
	{
		result[i] = result[i].active;
	}
	return result;
};
