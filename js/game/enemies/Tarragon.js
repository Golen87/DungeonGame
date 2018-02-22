
// Constructor
function Tarragon()
{
	Enemy.call( this );

	this.health = 60;
	this.speed = 30 / 60;

	this.sound = 'rhino';

	this.idleTimer = 0;
	this.aiState = 'idle';
	this.iWantToTurn = false;
	this.aboutToTurn = null;
};

Tarragon.prototype.create = function ()
{
	this.sprite.loadTexture( 'tarragon', 0 );

	this.sprite.body.setSize( 55, 36, 8+3, 13+12 );
	this.sprite.y -= 8;
	this.sprite.x -= 8;
	//this.sprite.anchor.set( (24)/48, (24+8)/48 );

	this.goalPos = new Phaser.Point( this.sprite.x, this.sprite.y );

	this.setupAnimation();
};

Tarragon.prototype.setupAnimation = function ()
{
	var len = 0;
	var idle = [0];
	var walk_left = [1, 2, 3, 4, 0];
	var walk_right = [4, 3, 2, 1, 0];
	var hurt = [5, 6, 7, 8];

	this.sprite.animations.add( 'idle', idle, 1, true );
	this.sprite.animations.add( 'left', walk_left, 4, true );
	this.sprite.animations.add( 'right', walk_right, 4, true );
	this.sprite.animations.add( 'hurt', hurt, 4, false );

	this.setAnimation( 'idle', 'left' );
};

Tarragon.prototype.setAnimation = function ( newState, newDirection )
{
	var name = null;
	if ( this.state != newState || this.direction != newDirection )
	{
		name = '{0}'.format( newState );
		if ( newState == 'walk' )
			name = '{0}'.format( newDirection );
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

	if ( this.health > 0 )
	{
		this.updateMovement();
	}
};

Tarragon.prototype.updateMovement = function ()
{
	if ( this.isStunned )
	{
		this.setAnimation( 'hurt', this.direction );
		return;
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
		this.idleTimer = randInt(50, 100);
		return;
	}

	if ( this.atGoalPos() )
	{
		if ( this.canMove( this.dirToVec( this.direction ) ) )
		{
			if ( Math.random() < 0.0 )
			{
				this.iWantToTurn = true;
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

		this.sprite.x += ( this.goalPos.x - this.sprite.x ).clamp(-this.speed, this.speed);
		this.sprite.y += ( this.goalPos.y - this.sprite.y ).clamp(-this.speed, this.speed);
	}
};

Tarragon.prototype.dirToVec = function ( dir )
{
	if ( dir == "left" )
		return [-1, 0];
	if ( dir == "right" )
		return [1, 0];
	return [0, 0];
};

Tarragon.prototype.rotateDir = function ( dir )
{
	var allDirs = ['right', 'left'];
	var i = allDirs.indexOf( dir );
	i = (i + 1) % 2;
	return [allDirs[i]];
};

Tarragon.prototype.setDir = function ( dir, onTheMove=false )
{
	this.aboutToTurn = dir;
	this.iWantToTurn = false;
	this.idleTimer = randInt(50, 100);
	if ( this.idleTimer )
		this.idleTimer /= 2;
};

Tarragon.prototype.findAvailableTurns = function ()
{
	return this.rotateDir( this.direction );
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
	if ( p.x + dir[0] <= 72 )
		return false;
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


Tarragon.prototype.getGridPos = function ()
{
	return new Phaser.Point(
		Math.floor(this.sprite.body.center.x / 16),
		Math.floor(this.sprite.body.center.y / 16)
	);
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
			this.getHit( other, 1 );
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
	this.setAnimation( 'hurt', this.direction );

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
		DungeonGame.Gui.showVictory();
	}, this );
};

Tarragon.prototype.getAttackPower = function ()
{
	return 10;
};

extend( Enemy, Tarragon );
