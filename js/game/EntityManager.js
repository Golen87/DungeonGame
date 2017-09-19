
// Constructor
function EntityManager ( group, entityMap )
{
	this.entityMap = entityMap;
	this.activeMap = [...Array( entityMap.length ).keys()].map( i => Array( entityMap[0].length ) );

	this.entities = Array( 32 );
	this.sprites = Array( 32 );

	for ( var i = 0; i < this.sprites.length; i++ )
	{
		this.sprites[i] = group.create( 0, 0, 'entities', 0, false );
		DungeonGame.game.physics.arcade.enable( this.sprites[i], Phaser.Physics.ARCADE );
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
			entity.sprite.kill();
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

					this.entities[index] = new Box( this.sprites[index] );
					this.entities[index].create( x, y, this.entityDeath.bind(this) );
				}
				else
				{
					console.error( "Out of Entity resources!" );
				}
			}
		}
	}

};

EntityManager.prototype.entityDeath = function ( x, y )
{
	this.activeMap[y][x] = null;
	this.entityMap[y][x] = null;
};
