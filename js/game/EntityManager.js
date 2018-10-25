
// Constructor
function EntityManager ( group, bgGroup, entityMap )
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

	this.entities = Array( 96 );
	this.sprites = Array( 96 );
	this.bgSprites = Array( 96 );

	for ( var i = 0; i < this.sprites.length; i++ )
	{
		this.sprites[i] = group.create( 0, 0, 'entities16', 0, false );
		DungeonGame.game.physics.arcade.enable( this.sprites[i], Phaser.Physics.ARCADE );
	}
	for ( var i = 0; i < this.bgSprites.length; i++ )
	{
		this.bgSprites[i] = bgGroup.create( 0, 0, 'entities16', 0, false );
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
				for ( var i = 0; i < this.entityMap[y][x].length; i++ ) {
					var index = this.getFirstDead();
					if ( index != -1 )
					{
						this.entities[index] = null;

						if ( this.entityMap[y][x][i] == 'spikes' )
							this.entities[index] = new Spikes();
						else if ( this.entityMap[y][x][i] == 'door' )
							this.entities[index] = new Door( this.onOpen );
						else if ( this.entityMap[y][x][i] == 'switch' )
							this.entities[index] = new Switch( this.onTrigger.bind(this) );
						else if ( this.entityMap[y][x][i] == 'pressureplate' )
							this.entities[index] = new PressurePlate( this.onTrigger.bind(this) );
						else if ( this.entityMap[y][x][i] == 'chest' )
							this.entities[index] = new Chest( this.onOpen );
						else if ( this.entityMap[y][x][i] == 'box' )
							this.entities[index] = new Box( this.onDeath.bind(this) );
						else if ( this.entityMap[y][x][i] == 'block' )
							this.entities[index] = new Block();
						else if ( this.entityMap[y][x][i] == 'torch' )
							this.entities[index] = new Torch( true );
						else if ( this.entityMap[y][x][i] == 'torch_hidden' )
							this.entities[index] = new Torch( false );

						if ( this.entities[index] )
						{
							this.entities[index].init( this.sprites[index], this.bgSprites[index], this.dataMap[y][x], x, y );
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
						console.warn( "Out of Entity resources!" );
					}
				}
			}
		}
	}

	for ( var i = 0; i < newEntities.length; i++ )
	{
		newEntities[i].create();

		if ( Chest.prototype.isPrototypeOf( newEntities[i] ) && pointCmp( [room_x, room_y], DungeonGame.World.monsterRooms ) )
		{
			newEntities[i].sprite.visible = false;
			newEntities[i].bgSprite.visible = false;
		}
	}
};

EntityManager.prototype.checkPhysicsAt = function ( x, y )
{
	for ( var i = 0; i < this.entities.length; i++ )
	{
		if ( this.entities[i] && this.entities[i].sprite.exists )
		{
			if ( this.entities[i].hasPhysics() )
			{
				var p = this.entities[i].getGridPos();

				if ( p.x == x && p.y == y )
					return true;

				// Special case since doors are 32 wide
				if ( p.x+1 == x && p.y == y && Door.prototype.isPrototypeOf( this.entities[i] ) )
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
	return null;
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
	if ( this.entityMap[entity.spawn.y][entity.spawn.x].length == 1 )
	{
		this.activeMap[entity.spawn.y][entity.spawn.x] = null;
		this.entityMap[entity.spawn.y][entity.spawn.x] = null;
	}
	else
	{
		var arr = this.entityMap[entity.spawn.y][entity.spawn.x];
		arr.splice( arr.indexOf( 'box' ), 1 );
	}

	entity.sprite.kill();
	entity.bgSprite.kill();
};


EntityManager.prototype.onAllKilled = function ( roomPos, manual=false )
{
	for ( var i = 0; i < this.entities.length; i++ )
	{
		var entity = this.entities[i];
		if ( entity && entity.sprite.exists )
		{
			if ( Spikes.prototype.isPrototypeOf( entity ) )
			{
				if ( !manual )
				{
					this.scriptedTriggers( roomPos, entity, false, true );
				}
			}
			if ( Chest.prototype.isPrototypeOf( entity ) )
			{
				if ( !entity.sprite.visible )
				{
					DungeonGame.cinematic = true;
					DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 1.0, function () {
						this.sprite.visible = true;
						this.bgSprite.visible = true;

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

EntityManager.prototype.scriptedTriggers = function ( trigger, spikes, immediate, allMonsters=false )
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
	var spike_room = spikes.getRoomPos();
	var spike_pos = spikes.getRelGridPos();

	if ( room_pos.x == spike_room.x && room_pos.y == spike_room.y )
	{
		// Secret Grail Block puzzle
		//if ( pointCmp( room_pos, [[3,8]] ) )
		//{
		//	if ( this.blockPuzzle( trigger, spikes, immediate, room_pos, [[4,4], [4,8], [11,4], [11,8]] ) )
		//	{
		//		this.onAllKilled( room_pos, true );
		//	}
		//	return true;
		//}

		// Monster rooms
		if ( pointCmp( room_pos, DungeonGame.World.monsterRooms ) )
		{
			if ( allMonsters )
			{
				spikes.toggle( false, immediate );
				spikes.lockState = true;
				this.clearMonsterRoom( room_pos );
			}
			else if ( trigger.active && !pointCmp( room_pos, this.clearedMonsterRooms ) )
			{
				spikes.toggle( true, immediate );
				this.triggerMonsterRoom( room_pos );
			}
			return true;
		}

		if ( allMonsters )
			return false;

		// Spiky path towards key
		if ( pointCmp( room_pos, [[6,4]] ) )
		{
			if ( pointCmp( spike_pos, [[4,7], [5,7], [4,8], [5,8], [8,9], [9,9], [8,10], [9,10]] ) )
				spikes.toggle( !trigger.active, immediate );
			else
				spikes.manual = false;
			return true;
		}
		// Intersection switch
		if ( pointCmp( room_pos, [[2,2]] ) )
		{
			if ( pointCmp( spike_pos, [[8,5], [9,5], [8,8], [9,8]] ) )
				spikes.toggle( trigger.active, immediate );
			if ( pointCmp( spike_pos, [[6,6], [11,6], [6,7], [11,7]] ) )
				spikes.toggle( !trigger.active, immediate );
			return true;
		}
		// Tarragon
		if ( pointCmp( room_pos, [[4,0]] ) )
		{
			spikes.toggle( trigger.active, immediate );
			return true;
		}
		// Block puzzle near golden sword
		if ( pointCmp( room_pos, [[4,3]] ) )
		{
			this.blockPuzzle( trigger, spikes, immediate, room_pos, [[8,6], [6,9]] );
			return true;
		}
		// Block puzzle right before golden sword
		if ( pointCmp( room_pos, [[6,3]] ) )
		{
			this.blockPuzzle( trigger, spikes, immediate, room_pos, [[2,4], [2,5]] );
			return true;
		}
		// Block puzzle in center room
		if ( pointCmp( room_pos, [[3,4]] ) )
		{
			this.blockPuzzle( trigger, spikes, immediate, room_pos, [[5,5], [5,8], [10,5], [10,8]] );
			return true;
		}
		// Golden sword
		if ( pointCmp( room_pos, [[6,2]] ) )
		{
			this.blockPuzzle( trigger, spikes, immediate, room_pos, [[3,4], [11,4], [3,6], [11,6]] );
			return true;
		}

		// Block puzzle Semi hard
		if ( pointCmp( room_pos, [[5,2]] ) )
		{
			this.blockPuzzle( trigger, spikes, immediate, room_pos, [[7,4], [7,5]] );
			return true;
		}
		// Block puzzle Hardest
		if ( pointCmp( room_pos, [[5,1]] ) )
		{
			this.blockPuzzle( trigger, spikes, immediate, room_pos, [[9,2], [9,4]] );
			return true;
		}


		if ( DungeonGame.skip )
			console.log( 'Unknown: ({0},{1}) for ({2},{3}) -> ({4},{5})'.format( room_pos.x, room_pos.y, tri_pos.x, tri_pos.y, spike_pos.x, spike_pos.y ) );
		return false;
	}
	return true;
};

EntityManager.prototype.blockPuzzle = function ( trigger, spikes, immediate, room_pos, plate_positions )
{
	var states = this.getActiveAt( room_pos, plate_positions );

	// Check that all states are true - all pressure plates activated
	if ( states.every(function(e,i,a){return (e==true);}) )
	{
		spikes.toggle( false, immediate );

		var blocks = [];
		for (var i = 0; i < plate_positions.length; i++)
		{
			blocks.push( this.getBlockAt(
				plate_positions[i][0] + room_pos.x * ROOM_WIDTH,
				plate_positions[i][1] + room_pos.y * ROOM_HEIGHT
			) );
		}

		// Check that all blocks above pressure plates are boxes/blocks
		if ( blocks.every(function(e,i,a){return (e!=null);}) )
		{
			var plates = this.getEntitiesAt( room_pos, plate_positions );
			for (var i = 0; i < plate_positions.length; i++)
			{
				plates[i].myBlock = blocks[i];
				plates[i].myBlock.lockState = true;
			}
			return true;
		}
	}
	else
	{
		spikes.toggle( true, immediate );
		if ( trigger.myBlock )
		{
			var plates = this.getEntitiesAt( room_pos, plate_positions );
			for (var i = 0; i < plate_positions.length; i++)
			{
				if ( plates[i].myBlock )
				{
					plates[i].myBlock.lockState = false;
					plates[i].myBlock = null;
				}
			}
		}
	}
	return false;
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
			console.warn( 'No trigger at ({0},{1})'.format( roomPos.x, roomPos.y ) );
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


EntityManager.prototype.pause = function ( isPaused )
{
	for ( var i = 0; i < this.entities.length; i++ )
	{
		if ( this.entities[i] && this.entities[i].sprite.exists )
		{
			if ( this.entities[i].sprite.animations.currentAnim )
			{
				this.entities[i].sprite.animations.paused = isPaused;
			}
		}
	}
}
