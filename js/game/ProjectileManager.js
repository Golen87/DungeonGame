
// Constructor
function ProjectileManager ( group, bgGroup, physicsMap )
{
	this.physicsMap = physicsMap;

	this.projectiles = Array( 16 );
	this.sprites = Array( 16 );
	this.bgSprites = Array( 16 );

	for ( var i = 0; i < this.sprites.length; i++ )
	{
		this.sprites[i] = group.create( 0, 0, null, 0, false );
		DungeonGame.game.physics.arcade.enable( this.sprites[i], Phaser.Physics.ARCADE );
	}
	for ( var i = 0; i < this.bgSprites.length; i++ )
	{
		this.bgSprites[i] = bgGroup.create( 0, 0, null, 0, false );
	}
}

ProjectileManager.prototype.update = function ()
{
	for ( var i = 0; i < this.projectiles.length; i++ )
	{
		if ( this.projectiles[i] && this.projectiles[i].sprite.exists && this.projectiles[i].sprite.visible )
		{
			this.projectiles[i].update();
		}
	}
}


ProjectileManager.prototype.render = function ()
{
	for ( var i = 0; i < this.projectiles.length; i++ )
	{
		if ( this.projectiles[i] && this.projectiles[i].sprite.exists )
		{
			this.projectiles[i].render();
		}
	}
};


ProjectileManager.prototype.isInView = function ( x, y )
{
	// Will erase borders, which can be seen if moving to another room while camera shakes.
	return (
		x >= DungeonGame.game.camera.x - 16 &&
		y >= DungeonGame.game.camera.y - 16 &&
		x < DungeonGame.game.camera.x + 16 * ROOM_WIDTH &&
		y < DungeonGame.game.camera.y + 16 * ROOM_HEIGHT
	);
};

ProjectileManager.prototype.clearOutOfView = function ()
{
	for ( var i = 0; i < this.projectiles.length; i++ )
	{
		var projectile = this.projectiles[i];
		if ( projectile && projectile.sprite.exists && !this.isInView( projectile.sprite.position.x, projectile.sprite.position.y ) )
		{
			projectile.destroy();
		}
	}
};

ProjectileManager.prototype.getFirstDead = function ()
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

ProjectileManager.prototype.createProjectile = function ( type, x, y, direction )
{
	this.clearOutOfView();

	var index = this.getFirstDead();
	if ( index != -1 )
	{
		this.projectiles[index] = null;

		if ( type == 'fireball' )
			this.projectiles[index] = new Fireball();

		if ( this.projectiles[index] )
		{
			this.projectiles[index].init( this.sprites[index], this.bgSprites[index], x, y, direction );
			this.projectiles[index].create();
		}
		else
		{
			console.error( "Projectile not defined." );
		}
	}
	else
	{
		//console.error( "Out of Projectile resources!" ); --------------------------------------------------------------------------------------------------------------------
	}
};

ProjectileManager.prototype.checkPhysicsAt = function ( x, y )
{
	for ( var i = 0; i < this.projectiles.length; i++ )
	{
		if ( this.projectiles[i] && this.projectiles[i].sprite.exists )
		{
			if ( this.projectiles[i].hasPhysics() )
			{
				var p = this.projectiles[i].getPhysicsPos();

				if ( p.x == x && p.y == y )
					return true;

				// Special case since doors are 32 wide
				if ( p.x+1 == x && p.y == y && Door.prototype.isPrototypeOf( this.projectiles[i] ) )
					return true;
			}
		}
	}
	return false;
};

ProjectileManager.prototype.activateProjectiles = function ()
{
	for ( var i = 0; i < this.projectiles.length; i++ )
	{
		var projectile = this.projectiles[i];
		if ( projectile && projectile.sprite.exists )
		{
			if ( !projectile.sprite.visible )
			{
				projectile.sprite.visible = true;
				projectile.bgSprite.visible = true;
				projectile.lightSprite.visible = true;

				DungeonGame.Particle.createSmokeBurst( projectile.sprite.x, projectile.sprite.y );
				DungeonGame.Audio.play( 'monsterroom-spawn' );
			}
		}
	}
};

ProjectileManager.prototype.onDeath = function ( projectile )
{
	projectile.sprite.kill();
	projectile.bgSprite.kill();
	projectile.lightSprite.kill();

	var projectileCount = 0;
	for ( var i = 0; i < this.projectiles.length; i++ )
	{
		if ( this.projectiles[i] && this.projectiles[i].sprite.exists )
		{
			projectileCount++;
		}
	}

	if ( projectileCount == 0 )
	{
		this.onAllKilled( projectile.getRoomPos() );
	}
};

ProjectileManager.prototype.pause = function ( isPaused )
{
	for ( var i = 0; i < this.projectiles.length; i++ )
	{
		if ( this.projectiles[i] && this.projectiles[i].sprite.exists )
		{
			if ( this.projectiles[i].sprite.animations.currentAnim )
			{
				this.projectiles[i].sprite.animations.paused = isPaused;
			}
		}
	}
}
