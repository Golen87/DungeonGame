
// Constructor
function EnemyManager ( group, bgGroup, lightGroup, enemyMap, physicsMap )
{
	this.enemyMap = enemyMap;
	this.physicsMap = physicsMap;
	this.activeMap = [...Array( physicsMap.length ).keys()].map( i => Array( physicsMap[0].length ) );
	this.dataMap = [...Array( enemyMap.length ).keys()].map( i => Array( enemyMap[0].length ) );

	for ( var y = 0; y < this.dataMap.length; y++ )
	{
		for ( var x = 0; x < this.dataMap[y].length; x++ )
		{
			this.dataMap[y][x] = {};
		}
	}

	this.enemies = Array( 16 );
	this.sprites = Array( 16 );
	this.bgSprites = Array( 16 );
	this.lightSprites = Array( 16 );

	for ( var i = 0; i < this.sprites.length; i++ )
	{
		this.sprites[i] = group.create( 0, 0, null, 0, false );
		DungeonGame.game.physics.arcade.enable( this.sprites[i], Phaser.Physics.ARCADE );
	}
	for ( var i = 0; i < this.bgSprites.length; i++ )
	{
		this.bgSprites[i] = bgGroup.create( 0, 0, null, 0, false );
	}
	for ( var i = 0; i < this.lightSprites.length; i++ )
	{
		this.lightSprites[i] = lightGroup.create( 0, 0, null, 0, false );
		this.lightSprites[i].blendMode = Phaser.blendModes.COLOR_DODGE;
	}
}

EnemyManager.prototype.update = function ()
{
	for ( var i = 0; i < this.enemies.length; i++ )
	{
		if ( this.enemies[i] && this.enemies[i].sprite.exists )
		{
			this.enemies[i].update();
		}
	}
}


EnemyManager.prototype.render = function ()
{
	for ( var i = 0; i < this.enemies.length; i++ )
	{
		if ( this.enemies[i] && this.enemies[i].sprite.exists )
		{
			this.enemies[i].render();
		}
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
		if ( enemy && enemy.sprite.exists && !this.isInView( enemy.sprite.position.x, enemy.sprite.position.y ) )
		{
			this.activeMap[enemy.spawn.y][enemy.spawn.x] = null;
			enemy.destroy();
			enemy.sprite.kill();
			enemy.bgSprite.kill();
			enemy.lightSprite.kill();
		}
	}
};

EnemyManager.prototype.getFirstDead = function ()
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

EnemyManager.prototype.loadRoom = function ( room_x, room_y )
{
	var offset_x = room_x * ROOM_WIDTH;
	var offset_y = room_y * ROOM_HEIGHT;

	this.clearOutOfView();
	var newEnemies = [];

	for ( var y = offset_y; y < offset_y + ROOM_HEIGHT; y++ )
	{
		for ( var x = offset_x; x < offset_x + ROOM_WIDTH; x++ )
		{
			if ( !this.activeMap[y][x] && this.enemyMap[y][x])
			{
				var index = this.getFirstDead();
				if ( index != -1 )
				{
					this.activeMap[y][x] = true;
					this.enemies[index] = null;

					if ( this.enemyMap[y][x] == 'slurg' )
						this.enemies[index] = new Slurg();
					else if ( this.enemyMap[y][x] == 'bat' )
						this.enemies[index] = new Bat();

					if ( this.enemies[index] )
					{
						this.enemies[index].init( this.sprites[index], this.bgSprites[index], this.lightSprites[index], this.dataMap[y][x], x, y, this.onDeath.bind(this) );
						newEnemies.push( this.enemies[index] );
					}
					else
					{
						console.error( "Enemy not defined." );
					}
				}
				else
				{
					console.error( "Out of Enemy resources!" );
				}
			}
		}
	}

	for ( var i = 0; i < newEnemies.length; i++ )
	{
		newEnemies[i].create();
	}
};

EnemyManager.prototype.onDeath = function ( enemy )
{
	this.activeMap[enemy.spawn.y][enemy.spawn.x] = null;
	this.enemyMap[enemy.spawn.y][enemy.spawn.x] = null;

	enemy.sprite.kill();
	enemy.bgSprite.kill();
	enemy.lightSprite.kill();
};

EnemyManager.prototype.pause = function ( isPaused )
{
	for ( var i = 0; i < this.enemies.length; i++ )
	{
		if ( this.enemies[i] && this.enemies[i].sprite.exists )
		{
			if ( this.enemies[i].sprite.animations.currentAnim )
			{
				this.enemies[i].sprite.animations.paused = isPaused;
			}
		}
	}
}
