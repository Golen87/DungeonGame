
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

						DungeonGame.Particle.createSmokeBurst( this.sprite.x, this.sprite.y );
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
	var tr, tg;
	if ( allMonsters )
	{
		tr = trigger;
	}
	else
	{
		tr = trigger.getRoomPos();
		tg = trigger.getRelGridPos();
	}
	var sr = target.getRoomPos();
	var sg = target.getRelGridPos();

	if ( tr.x == sr.x && tr.y == sr.y )
	{
		// Monster rooms
		if ( pointCmp( tr, this.monsterRooms ) )
		{
			if ( allMonsters )
			{
				target.toggle( false, immediate );
				target.lockState = true;
				this.clearMonsterRoom( tr );
			}
			else if ( trigger.active && !pointCmp( tr, this.clearedMonsterRooms ) )
			{
				target.toggle( true, immediate );
				this.triggerMonsterRoom( tr );
			}
			return true;
		}

		if ( allMonsters )
			return false;

		// Block puzzle
		if ( pointCmp( tr, [[0, 0]] ) )
		{
			var states = this.getActiveAt( tr, [[9,2], [9,4]] );
			if ( states.equals( [true, true] ) )
				target.toggle( false, immediate );
			else
				target.toggle( true, immediate );
			return true;
		}
		// Block puzzle
		if ( pointCmp( tr, [[0, 1]] ) )
		{
			var states = this.getActiveAt( tr, [[7,3], [7,4]] );
			if ( states.equals( [true, true] ) )
				target.toggle( false, immediate );
			else
				target.toggle( true, immediate );
			return true;
		}
		// Intersection switch
		if ( pointCmp( tr, [[3, 1]] ) )
		{
			if ( pointCmp( sg, [[8, 4], [9, 4], [8, 9], [9, 9]] ) )
				target.toggle( trigger.active, immediate );
			if ( pointCmp( sg, [[6, 6], [11, 6], [6, 7], [11, 7]] ) )
				target.toggle( !trigger.active, immediate );
			return true;
		}

		console.log( 'Unknown: ({0},{1}) for ({2},{3}) -> ({4},{5})'.format( tr.x, tr.y, tg.x, tg.y, sg.x, sg.y ) );
		return false;
	}
	return true;
};

EntityManager.prototype.getActiveAt = function ( roomPos, coordList )
{
	var result = [];
	for ( var i=0; i<coordList.length; i++ )
	{
		var coords = coordList[i];
		coords[0] += roomPos.x * ROOM_WIDTH;
		coords[1] += roomPos.y * ROOM_HEIGHT;

		result.push( this.activeMap[coords[1]][coords[0]].active );
	}
	return result;
};
