
// Constructor
function EnemyManager ( group, enemyMap, physicsMap )
{
	this.enemyMap = enemyMap;
	this.physicsMap = physicsMap;
	this.activeMap = [...Array( physicsMap.length ).keys()].map( i => Array( physicsMap[0].length ) );

	this.enemies = Array( 32 );

	for ( var i = 0; i < this.enemies.length; i++ )
	{
		var sprite = group.create( 0, 0, 'enemy', 0, false );
		DungeonGame.game.physics.arcade.enable( sprite, Phaser.Physics.ARCADE );
		var enemy = new Enemy( sprite );
		this.enemies[i] = enemy;

		//enemy.create( x, y, this.actors );
	}
}

EnemyManager.prototype.update = function ()
{
	for ( var i = 0; i < this.enemies.length; i++ )
	{
		this.enemies[i].update();
	}
}


EnemyManager.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		this.enemies.forEach( function ( member ) {
			if ( member.sprite.exists )
			{
				DungeonGame.game.debug.body( member.sprite );
			}
		}, this );
	}
};


EnemyManager.prototype.isInView = function ( x, y )
{
	// Will erase borders, which can be seen if moving to another room while camera shakes.
	return (
		x >= DungeonGame.game.camera.x - 16 &&
		y >= DungeonGame.game.camera.y - 16 &&
		x < DungeonGame.game.camera.x + 16 * ROOM_WIDTH &&
		y < DungeonGame.game.camera.y + 16 * ROOM_HEIGHT
	);
};

EnemyManager.prototype.clearOutOfView = function ()
{
	for ( var i = 0; i < this.enemies.length; i++ )
	{
		var enemy = this.enemies[i];
		if ( enemy.sprite.alive && !this.isInView( enemy.sprite.position.x, enemy.sprite.position.y ) )
		{
			this.activeMap[enemy.spawn.y][enemy.spawn.x] = null;
			enemy.sprite.kill();
		}
	}
};

EnemyManager.prototype.getFirstDead = function ()
{
	for ( var i = 0; i < this.enemies.length; i++ )
	{
		var enemy = this.enemies[i];
		if ( !enemy.sprite.alive )
		{
			return enemy;
		}
	}
};

EnemyManager.prototype.loadRoom = function ( room_x, room_y )
{
	var offset_x = room_x * ROOM_WIDTH;
	var offset_y = room_y * ROOM_HEIGHT;

	this.clearOutOfView();

	for ( var y = offset_y; y < offset_y + ROOM_HEIGHT; y++ )
	{
		for ( var x = offset_x; x < offset_x + ROOM_WIDTH; x++ )
		{
			if ( !this.activeMap[y][x] && this.enemyMap[y][x])
			{
				var enemy = this.getFirstDead();
				if ( enemy )
				{
					this.activeMap[y][x] = true;
					enemy.create( x, y, this.enemyDeath.bind(this) );
				}
				else
				{
					console.error( "Out of Enemy resources!" );
				}
			}
		}
	}

};

EnemyManager.prototype.enemyDeath = function ( x, y )
{
	this.activeMap[y][x] = null;
	this.enemyMap[y][x] = null;
};
