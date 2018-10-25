
// Constructor
function IronSlurg()
{
	Enemy.call( this );

	this.health = 5;
	this.speed = 24 / 60;

	this.spriteIndexLength = 5;
	this.sound = 'spider';

	this.idleTimer = 0;
	this.aiState = 'idle';
	this.iWantToTurn = false;
	this.aboutToTurn = null;
};

IronSlurg.prototype.create = function ()
{
	this.sprite.loadTexture( 'ironslurg', 0 );

	this.sprite.body.setSize( 12, 10, 2, 3 );

	this.sprite.body.drag.set( 1500 );
	this.goalPos = new Phaser.Point( this.sprite.x, this.sprite.y );

	this.setupAnimation();
};

IronSlurg.prototype.setupAnimation = function ()
{
	var idle = [0];
	var walk = [0, 1, 2, 3, 3, 3, 3];
	var hurt = [4];
	var hide = [0,0,0,4,5,6,7,9,10,8,10,9,10];
	var hide = [0,0,0,4,5,6,7,8,11,9,11,10,11];

	this.sprite.animations.add( 'idle_right', idle, 3, true );
	this.sprite.animations.add( 'walk_right', walk, 8, true );
	this.sprite.animations.add( 'hurt_right', hurt, 1, true );
	idle = idle.map( n => n + this.spriteIndexLength );
	walk = walk.map( n => n + this.spriteIndexLength );
	hurt = hurt.map( n => n + this.spriteIndexLength );
	this.sprite.animations.add( 'idle_down', idle, 3, true );
	this.sprite.animations.add( 'walk_down', walk, 8, true );
	this.sprite.animations.add( 'hurt_down', hurt, 1, true );
	idle = idle.map( n => n + this.spriteIndexLength );
	walk = walk.map( n => n + this.spriteIndexLength );
	hurt = hurt.map( n => n + this.spriteIndexLength );
	this.sprite.animations.add( 'idle_left', idle, 3, true );
	this.sprite.animations.add( 'walk_left', walk, 8, true );
	this.sprite.animations.add( 'hurt_left', hurt, 1, true );
	idle = idle.map( n => n + this.spriteIndexLength );
	walk = walk.map( n => n + this.spriteIndexLength );
	hurt = hurt.map( n => n + this.spriteIndexLength );
	this.sprite.animations.add( 'idle_up', idle, 3, true );
	this.sprite.animations.add( 'walk_up', walk, 8, true );
	this.sprite.animations.add( 'hurt_up', hurt, 1, true );

	this.setAnimation( 'idle', ['right', 'down', 'left', 'up'].choice() );
};

IronSlurg.prototype.setAnimation = function ( newState, newDirection )
{
	var name = null;
	if ( this.state != newState || this.direction != newDirection )
	{
		name = '{0}_{1}'.format( newState, newDirection );
		this.state = newState;
		this.direction = newDirection;
	}

	if ( name )
	{
		this.sprite.animations.play( name );
	}
};


IronSlurg.prototype.update = function ()
{
	Enemy.prototype.update.call( this );

	this.updateMovement();
};

IronSlurg.prototype.updateMovement = function ()
{
	if ( this.isFlashing )
	{
		this.setAnimation( 'hurt', this.direction );
		return;
	}
	else if ( this.state == 'hurt' )
	{
		this.align();
	}

	this.idleTimer -= 1;
	if ( this.idleTimer > 0 )
	{
		this.setAnimation( 'idle', this.direction );
		return;
	}

	if ( this.aboutToTurn != null )
	{
		this.setAnimation( this.state, this.aboutToTurn );
		this.aboutToTurn = null;
		this.idleTimer = randInt(10, 20);
		return;
	}

	//if ( this.isAligned() )
	if ( this.atGoalPos() )
	{
		if ( this.canMove( this.dirToVec( this.direction ) ) )
		{
			var shouldContinue = this.findBestDir( this.direction, null );
			if ( shouldContinue )
			{
				if ( Math.random() < 0.10 )
				{
					this.iWantToTurn = true;
				}
			}
			else
			{
				if ( Math.random() < 0.70 )
				{
					this.iWantToTurn = true;
				}
			}

			var dirs = this.findAvailableTurns();
			if ( this.iWantToTurn && dirs.length > 0 )
			{
				this.setDir( dirs.choice(), true );
				return;
			}
			else
			{
				this.move();
			}
		}
		else
		{
			var dirs = this.findAvailableTurns();

			if ( dirs.length > 0 )
			{
				this.setDir( dirs.choice() );
			}
			else
			{
				var newDir = this.rotateDir( this.direction, [false, true].choice() );
				this.setDir( newDir );
			}
		}
	}
	
	if ( !this.atGoalPos() )
	{
		this.setAnimation( 'walk', this.direction );

		var k = 0.0;
		if ( this.sprite.frame % this.spriteIndexLength < 4 )
			k = 0.25 * (this.sprite.frame % this.spriteIndexLength);
		//if ( this.sprite.frame % this.spriteIndexLength >= 2 )
		{
			this.sprite.x += ( this.goalPos.x - this.sprite.x ).clamp( -this.speed * k, this.speed * k );
			this.sprite.y += ( this.goalPos.y - this.sprite.y ).clamp( -this.speed * k, this.speed * k );
		}
	}
};

IronSlurg.prototype.dirToVec = function ( dir )
{
	if ( dir == "left" )
		return [-1, 0];
	if ( dir == "right" )
		return [1, 0];
	if ( dir == "up" )
		return [0, -1];
	if ( dir == "down" )
		return [0, 1];
	return [0, 0];
};

IronSlurg.prototype.rotateDir = function ( dir, cw )
{
	var allDirs = ['right', 'down', 'left', 'up'];
	var i = allDirs.indexOf( dir );
	if ( cw )
		i = (i + 1) % 4;
	else
		i = (i + 3) % 4;
	return allDirs[i];
};

IronSlurg.prototype.setDir = function ( dir, onTheMove=false )
{
	this.aboutToTurn = dir;
	this.iWantToTurn = false;
	this.idleTimer = randInt(10, 40);
	if ( this.idleTimer )
		this.idleTimer /= 2;
};

IronSlurg.prototype.findAvailableTurns = function ()
{
	var d1 = this.rotateDir( this.direction, true );
	var d2 = this.rotateDir( this.direction, false );

	var available = [];
	if ( this.canMove( this.dirToVec( d1 ) ) )
		available.push(d1);
	if ( this.canMove( this.dirToVec( d2 ) ) )
		available.push(d2);

	// Move towards player
	if ( available.length == 2 )
	{
		var dir = this.findBestDir( d1, d2 );
		return [dir];
	}

	return available;
};

IronSlurg.prototype.findBestDir = function ( dir1, dir2 )
{
	var vec1 = this.dirToVec( dir1 );
	var vec2 = this.dirToVec( dir2 );
	var goal = DungeonGame.World.Player.sprite.body.center;
	var p1 = new Phaser.Point( this.sprite.x + 16 * vec1[0], this.sprite.y + 16 * vec1[1] );
	var p2 = new Phaser.Point( this.sprite.x + 16 * vec2[0], this.sprite.y + 16 * vec2[1] );
	var dis1 = goal.distance( p1 );
	var dis2 = goal.distance( p2 );
	if ( dis1 < dis2 )
		return dir1;
	if ( dis2 < dis1 )
		return dir2;
	else
		return [dis1, dis2].choice();
};

IronSlurg.prototype.canMove = function ( dir )
{
	var p = this.getGridPos();
	return ( !DungeonGame.World.checkPhysicsAt( p.x + dir[0], p.y + dir[1] ) );
};

IronSlurg.prototype.move = function ()
{
	var p = this.getGridPos();
	var d = this.dirToVec( this.direction );
	this.goalPos.x = this.sprite.x + 16 * d[0];
	this.goalPos.y = this.sprite.y + 16 * d[1];
	this.setAnimation( 'walk', this.direction );
};

IronSlurg.prototype.atGoalPos = function ()
{
	return ( this.sprite.x == this.goalPos.x && this.sprite.y == this.goalPos.y );
};

IronSlurg.prototype.align = function ()
{
	var p = this.getGridPos();
	this.goalPos.x = p.x * 16 + 8;
	this.goalPos.y = p.y * 16 + 8;

	var v = new Phaser.Point( this.goalPos.x - this.sprite.x, this.goalPos.y - this.sprite.y );
	if ( v.getMagnitude() > 0 )
	{
		var direction;
		if ( Math.abs( v.x ) >= Math.abs( v.y ) )
			direction = v.x > 0 ? 'right' : 'left';
		else
			direction = v.y > 0 ? 'down' : 'up';
		this.setAnimation( 'walk', direction );
	}

	//return (
	//	Math.floor((this.sprite.x-8) / 16) == (this.sprite.x-8) / 16 &&
	//	Math.floor((this.sprite.y-8) / 16) == (this.sprite.y-8) / 16
	//);
};


IronSlurg.prototype.getPhysicsPos = function ()
{
	return new Phaser.Point(
		Math.floor(this.goalPos.x / 16),
		Math.floor(this.goalPos.y / 16)
	);
};

IronSlurg.prototype.overlap = function ( other )
{
	Enemy.prototype.overlap.call( this );
};

IronSlurg.prototype.overlapEntity = function ( other )
{
	if ( Spikes.prototype.isPrototypeOf( other.owner ) )
	{
		if ( other.owner.hasPhysics() )
		{
			this.getHit( other, 999 );
			DungeonGame.game.physics.arcade.collide( this.sprite, other );
		}
	}
	else
	{
		DungeonGame.game.physics.arcade.collide( this.sprite, other );
	}
};

IronSlurg.prototype.takeDamage = function ()
{
	Enemy.prototype.takeDamage.call( this );

	//DungeonGame.game.add.tween( this.chestBeam ).to({ alpha: 1.0 }, 400, Phaser.Easing.Linear.In, true );
};

IronSlurg.prototype.knockback = function ( from )
{
	var p = new Phaser.Point(
		this.sprite.body.center.x - from.x,
		this.sprite.body.center.y - from.y
	).setMagnitude( 300 );
	this.sprite.body.velocity.add( p.x, p.y );
};

IronSlurg.prototype.defeat = function ()
{
	Enemy.prototype.defeat.call( this );

	DungeonGame.Particle.createSmokeBurst( this.sprite.x, this.sprite.y );
};

IronSlurg.prototype.getAttackPower = function ()
{
	return 15;
};

extend( Enemy, IronSlurg );
