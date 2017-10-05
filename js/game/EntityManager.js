
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

	this.entities = Array( 64 );
	this.sprites = Array( 64 );
	this.bgSprites = Array( 64 );

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
				var index = this.getFirstDead();
				if ( index != -1 )
				{
					this.activeMap[y][x] = true;
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
						this.entities[index].init( this.sprites[index], this.bgSprites[index], this.dataMap[y][x], x, y );
						newEntities.push( this.entities[index] );
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
	if ( Switch.prototype.isPrototypeOf( entity ) )
	{
		for ( var i = 0; i < this.entities.length; i++ )
		{
			if ( this.entities[i] && this.entities[i].sprite.exists )
			{
				if ( Spikes.prototype.isPrototypeOf( this.entities[i] ) )
				{
					this.entities[i].manual = true;
					this.entities[i].toggle( !entity.active, immediate );
				}
			}
		}
	}

	if ( PressurePlate.prototype.isPrototypeOf( entity ) )
	{
		for ( var i = 0; i < this.entities.length; i++ )
		{
			if ( this.entities[i] && this.entities[i].sprite.exists )
			{
				if ( Spikes.prototype.isPrototypeOf( this.entities[i] ) )
				{
					this.entities[i].toggle( !entity.active );
				}
			}
		}
	}
};

EntityManager.prototype.onDeath = function ( entity )
{
	this.activeMap[entity.spawn.y][entity.spawn.x] = null;
	this.entityMap[entity.spawn.y][entity.spawn.x] = null;
};
