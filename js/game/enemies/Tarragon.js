
// Constructor
function Tarragon()
{
	Enemy.call( this );

	this.health = 30;
	this.speed = 32 / 60;

	this.sound = 'rhino';

	this.idleTimer = 0;
	this.aiState = 'idle';
	this.iWantToTurn = false;
	this.aboutToTurn = null;
};

Tarragon.prototype.create = function ()
{
	this.sprite.loadTexture( 'tarragon', 0 );

	this.sprite.body.setSize( 35, 36, 8, 13 );
	this.sprite.y -= 8;

	this.goalPos = new Phaser.Point( this.sprite.x, this.sprite.y );

	this.setupAnimation();
};

Tarragon.prototype.setupAnimation = function ()
{
	var len = 0;
	var idle = [0];
	var walk = [0, 1, 2, 3, 3, 3, 3, 3];
	var hurt = [4];
	var idle = [0];
	var walk = [0, 0, 0, 0, 0, 0, 0, 0];
	var hurt = [0];

	this.sprite.animations.add( 'idle_right', idle, 3, true );
	this.sprite.animations.add( 'walk_right', walk, 8, true );
	this.sprite.animations.add( 'hurt_right', hurt, 1, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	hurt = hurt.map( n => n + len )
	this.sprite.animations.add( 'idle_down', idle, 3, true );
	this.sprite.animations.add( 'walk_down', walk, 8, true );
	this.sprite.animations.add( 'hurt_down', hurt, 1, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	hurt = hurt.map( n => n + len )
	this.sprite.animations.add( 'idle_left', idle, 3, true );
	this.sprite.animations.add( 'walk_left', walk, 8, true );
	this.sprite.animations.add( 'hurt_left', hurt, 1, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	hurt = hurt.map( n => n + len )
	this.sprite.animations.add( 'idle_up', idle, 3, true );
	this.sprite.animations.add( 'walk_up', walk, 8, true );
	this.sprite.animations.add( 'hurt_up', hurt, 1, true );

	this.setAnimation( 'idle', ['right', 'down', 'left', 'up'].choice() );
};

Tarragon.prototype.setAnimation = function ( newState, newDirection )
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


Tarragon.prototype.update = function ()
{
	Enemy.prototype.update.call( this );

	this.updateMovement();
};

Tarragon.prototype.updateMovement = function ()
{
	if ( this.isFlashing )
	{
		this.setAnimation( 'hurt', this.direction );
		this.goalPos
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

		if ( this.sprite.frame % 5 == 3 )
		{
			this.sprite.x += ( this.goalPos.x - this.sprite.x ).clamp(-this.speed, this.speed);
			this.sprite.y += ( this.goalPos.y - this.sprite.y ).clamp(-this.speed, this.speed);
		}
	}
};

Tarragon.prototype.dirToVec = function ( dir )
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

Tarragon.prototype.rotateDir = function ( dir, cw )
{
	var allDirs = ['right', 'down', 'left', 'up'];
	var i = allDirs.indexOf( dir );
	if ( cw )
		i = (i + 1) % 4;
	else
		i = (i + 3) % 4;
	return allDirs[i];
};

Tarragon.prototype.setDir = function ( dir, onTheMove=false )
{
	this.aboutToTurn = dir;
	this.iWantToTurn = false;
	this.idleTimer = randInt(10, 40);
	if ( this.idleTimer )
		this.idleTimer /= 2;
};

Tarragon.prototype.findAvailableTurns = function ()
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

Tarragon.prototype.findBestDir = function ( dir1, dir2 )
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

Tarragon.prototype.canMove = function ( dir )
{
	var p = this.getGridPos();
	return ( !DungeonGame.World.checkPhysicsAt( p.x + dir[0], p.y + dir[1] ) );
};

Tarragon.prototype.move = function ()
{
	var p = this.getGridPos();
	var d = this.dirToVec( this.direction );
	this.goalPos.x = this.sprite.x + 16 * d[0];
	this.goalPos.y = this.sprite.y + 16 * d[1];
	this.setAnimation( 'walk', this.direction );
};

Tarragon.prototype.atGoalPos = function ()
{
	return ( this.sprite.x == this.goalPos.x && this.sprite.y == this.goalPos.y );
};

Tarragon.prototype.align = function ()
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


Tarragon.prototype.getPhysicsPos = function ()
{
	return new Phaser.Point(
		Math.floor(this.goalPos.x / 16),
		Math.floor(this.goalPos.y / 16)
	);
};

Tarragon.prototype.overlap = function ( other )
{
	Enemy.prototype.overlap.call( this );
};

Tarragon.prototype.overlapEntity = function ( other )
{
	if ( Spikes.prototype.isPrototypeOf( other.owner ) )
	{
		if ( other.owner.hasPhysics() )
		{
			this.getHit( other );
			DungeonGame.game.physics.arcade.collide( this.sprite, other );
		}
	}
	else
	{
		DungeonGame.game.physics.arcade.collide( this.sprite, other );
	}
};

Tarragon.prototype.takeDamage = function ()
{
	Enemy.prototype.takeDamage.call( this );

	//DungeonGame.game.add.tween( this.chestBeam ).to({ alpha: 1.0 }, 400, Phaser.Easing.Linear.In, true );
};

Tarragon.prototype.defeat = function ()
{
	var c = this.sprite.body.center;
	var randomSmoke = function( me )
	{
		DungeonGame.Particle.createSmokeBurst( c.x + randInt(-20, 15), c.y + randInt(-20, 13) );
	};

	this.isHurtingTimer = 10000;
	this.isFlashingTimer = 10000;

	DungeonGame.cinematic = true;

	var t = 0;
	DungeonGame.game.time.events.add( t, function() {
		DungeonGame.World.cameraShake( 16 );
		DungeonGame.Audio.play( this.sound, 'hurt' );
		DungeonGame.Particle.createSmokeBurst( this.sprite.body.center.x, this.sprite.body.center.y );
		randomSmoke( this );
		randomSmoke( this );
		randomSmoke( this );
	}, this );

	t += 1800;
	DungeonGame.game.time.events.add( t, function() {
		DungeonGame.World.cameraShake( 8 );
		randomSmoke( this );
	}, this );

	t += 1500;
	DungeonGame.game.time.events.add( t, function() {
		DungeonGame.Audio.play( this.sound, 'groan' );
		DungeonGame.World.cameraShake( 4 );
		randomSmoke( this );
		randomSmoke( this );
	}, this );

	t += 1100;
	DungeonGame.game.time.events.add( t, function() {
		DungeonGame.World.cameraShake( 16 );
		randomSmoke( this );
		randomSmoke( this );
	}, this );

	t += 800;
	DungeonGame.game.time.events.add( t, function() {
		DungeonGame.World.cameraShake( 8 );
		randomSmoke( this );
		randomSmoke( this );
	}, this );

	t += 500;
	DungeonGame.game.time.events.add( t, function() {
		DungeonGame.World.cameraShake( 4 );
		randomSmoke( this );
	}, this );

	t += 300;
	DungeonGame.game.time.events.add( t, function() {
		DungeonGame.World.cameraShake( 32 );
		DungeonGame.Audio.play( this.sound, 'death' );
		for (var i = 0; i < 8; i++)
		{
			DungeonGame.Particle.createSmokeBurst(
				c.x + 20 * Math.cos( Math.PI*2/8*i ) - 2,
				c.y + 10 * Math.sin( Math.PI*2/8*i ) - 4
			);
		}
		this.onDeath( this );
	}, this );

	t += 2500;
	DungeonGame.game.time.events.add( t, function() {
		DungeonGame.cinematic = false;
	}, this );
};

Tarragon.prototype.getAttackPower = function ()
{
	return 10;
};

extend( Enemy, Tarragon );
