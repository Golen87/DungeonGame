
// Constructor
function Enemy()
{
};

Enemy.prototype.create = function ( x, y, group )
{
	this.health = 3;
	this.speed = 32;

	this.sprite = group.create( x, y, 'enemy', 0 );
	DungeonGame.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	//this.sprite.body.setSize(10, 8, 3, 5);
	this.sprite.body.setCircle( 6, 2, 4 );

	this.setupAudio();
	this.setupAnimation();
	this.setupParticles();

	this.aiState = 'idle';
	this.goalPos = new Phaser.Point( this.sprite.body.position.x, this.sprite.body.position.y );

	this.damageTimer = 0;
};


Enemy.prototype.setupAudio = function ()
{
	var vol = 0.4;

	this.rat = DungeonGame.game.add.audio( 'rat' );
	this.rat.addMarker( 'cry_1', 0.0, 0.5, vol );
	this.rat.addMarker( 'cry_2', 0.6, 0.5, vol );
	this.rat.addMarker( 'cry_3', 1.2, 0.5, vol );
	this.rat.addMarker( 'hurt_1', 1.8, 0.35, vol );
	this.rat.addMarker( 'hurt_2', 2.25, 0.35, vol );
	this.rat.addMarker( 'hurt_3', 2.7, 0.35, vol );
	this.rat.addMarker( 'death', 3.15, 0.55, vol );

	this.mouse = DungeonGame.game.add.audio( 'mouse' );
	this.mouse.addMarker( 'cry_1', 0.0, 0.2, vol );
	this.mouse.addMarker( 'cry_2', 0.3, 0.2, vol );
	this.mouse.addMarker( 'cry_3', 0.6, 0.2, vol );
	this.mouse.addMarker( 'hurt_1', 0.9, 0.4, vol );
	this.mouse.addMarker( 'hurt_2', 1.4, 0.4, vol );
	this.mouse.addMarker( 'hurt_3', 1.9, 0.4, vol );
	this.mouse.addMarker( 'death', 2.4, 0.3, vol );

	this.rhino = DungeonGame.game.add.audio( 'rhino' );
	this.rhino.addMarker( 'cry_1', 0.0, 1.1, vol );
	this.rhino.addMarker( 'cry_2', 1.2, 1.1, vol );
	this.rhino.addMarker( 'cry_3', 2.4, 1.1, vol );
	this.rhino.addMarker( 'cry_4', 3.6, 1.3, vol );
	this.rhino.addMarker( 'hurt_1', 5.0, 0.6, vol );
	this.rhino.addMarker( 'hurt_2', 5.7, 0.5, vol );
	this.rhino.addMarker( 'hurt_3', 6.3, 0.7, vol );
	this.rhino.addMarker( 'hurt_4', 7.1, 0.6, vol );
	this.rhino.addMarker( 'death', 7.8, 0.9, vol );

	this.spider = DungeonGame.game.add.audio( 'spider' );
	this.spider.addMarker( 'cry_1', 0.0, 0.9, vol );
	this.spider.addMarker( 'cry_2', 1.0, 0.9, vol );
	this.spider.addMarker( 'cry_3', 2.0, 0.9, vol );
	this.spider.addMarker( 'cry_4', 3.0, 0.9, vol );
	this.spider.addMarker( 'hurt_1', 4.0, 0.7, vol );
	this.spider.addMarker( 'hurt_2', 4.8, 0.7, vol );
	this.spider.addMarker( 'hurt_3', 5.6, 0.7, vol );
	this.spider.addMarker( 'death_1', 6.4, 0.8, vol );
	this.spider.addMarker( 'death_2', 7.3, 0.8, vol );

	this.slime = DungeonGame.game.add.audio( 'slime' );
	this.slime.addMarker( 'cry_1', 0.0, 1.2, vol );
	this.slime.addMarker( 'cry_2', 1.3, 1.2, vol );
	this.slime.addMarker( 'cry_3', 2.6, 1.2, vol );
	this.slime.addMarker( 'hurt_1', 3.9, 1.2, vol );
	this.slime.addMarker( 'hurt_2', 5.2, 1.2, vol );
	this.slime.addMarker( 'hurt_3', 6.5, 1.2, vol );
	this.slime.addMarker( 'death', 7.8, 1.2, vol );

	this.creature = DungeonGame.game.add.audio( 'creature' );
	this.creature.addMarker( 'cry_1', 0.0, 1.6, vol );
	this.creature.addMarker( 'cry_2', 1.7, 1.3, vol );
	this.creature.addMarker( 'cry_3', 3.1, 1.3, vol );
	this.creature.addMarker( 'cry_4', 4.5, 1.7, vol );
	this.creature.addMarker( 'hurt_1', 6.3, 1.4, vol );
	this.creature.addMarker( 'hurt_2', 7.8, 1.4, vol );
	this.creature.addMarker( 'hurt_3', 9.3, 1.4, vol );
	this.creature.addMarker( 'death_1', 10.8, 1.1, vol );
	this.creature.addMarker( 'death_2', 12.0, 1.3, vol );

	this.chop = DungeonGame.game.add.audio( 'chop' );
	this.chop.addMarker( '1', 0.0, 0.2, 0.3 );
	this.chop.addMarker( '2', 0.3, 0.2, 0.3 );
	this.chop.addMarker( '3', 0.6, 0.2, 0.3 );
};

Enemy.prototype.setupAnimation = function ()
{
	var len = 3;
	var idle = [0, 1];
	var walk = [0, 1];
	var hurt = [2];
	this.sprite.animations.add( 'idle_right', idle, 3, true );
	this.sprite.animations.add( 'walk_right', walk, 10, true );
	this.sprite.animations.add( 'hurt_right', hurt, 1, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	hurt = hurt.map( n => n + len )
	this.sprite.animations.add( 'idle_down', idle, 3, true );
	this.sprite.animations.add( 'walk_down', walk, 10, true );
	this.sprite.animations.add( 'hurt_down', hurt, 1, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	hurt = hurt.map( n => n + len )
	this.sprite.animations.add( 'idle_left', idle, 3, true );
	this.sprite.animations.add( 'walk_left', walk, 10, true );
	this.sprite.animations.add( 'hurt_left', hurt, 1, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	hurt = hurt.map( n => n + len )
	this.sprite.animations.add( 'idle_up', idle, 3, true );
	this.sprite.animations.add( 'walk_up', walk, 10, true );
	this.sprite.animations.add( 'hurt_up', hurt, 1, true );

	this.state = 'idle';
	this.direction = 'down';
	this.sprite.animations.play( 'idle_down' );
};

Enemy.prototype.setAnimation = function ( newState, newDirection )
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

Enemy.prototype.setupParticles = function ()
{
	//this.emitter = DungeonGame.game.add.emitter( 0, 0, 10 );
	//this.emitter.makeParticles( 'smoke' );
	//this.emitter.start( false, 1000, 250 );
	//this.emitter.setRotation(0, 0);
	//this.emitter.setAlpha(1.0, 1.0, 3000);
	//this.emitter.setScale(1.0, 1, 1.0, 1, 6000, Phaser.Easing.Quintic.Out);
	//this.emitter.gravity = -200;
	//this.sprite.addChild( this.emitter );
	// start(explode, lifespan, frequency, quantity, forceQuantity)
};

Enemy.prototype.update = function ()
{
	if ( this.state == 'hurt' )
	{
	}
	else
	{

	if ( this.aiState == 'walk' && this.sprite.body.velocity.getMagnitude() == 0 )
		this.aiState = 'idle';

	if ( this.aiState == 'idle' && Math.random() < 0.01 )
	{
		this.aiState = 'walk';
		var movement = [[1,0], [0,1], [-1,0], [0,-1]].choice()
		this.goalPos.x = this.sprite.body.position.x + 16 * movement[0];
		this.goalPos.y = this.sprite.body.position.y + 16 * movement[1];
	}
	if ( this.aiState == 'walk' )
	{
		this.sprite.body.velocity.x = this.speed * ( this.goalPos.x - this.sprite.body.position.x ).clamp(-1,1);
		this.sprite.body.velocity.y = this.speed * ( this.goalPos.y - this.sprite.body.position.y ).clamp(-1,1);

		if ( this.aiState == 'walk' && this.sprite.body.position.distance( this.goalPos ) < 0.1 )
		{
			this.aiState = 'idle';
			this.sprite.body.position.copyFrom( this.goalPos );
			this.sprite.body.velocity.setTo( 0, 0 );
		}
	}

	var v = this.sprite.body.velocity;
	if ( v.getMagnitude() > 0 )
	{
		var direction;
		if ( Math.abs( v.x ) >= Math.abs( v.y ) )
			direction = v.x > 0 ? 'right' : 'left';
		else
			direction = v.y > 0 ? 'down' : 'up';
		this.setAnimation( 'walk', direction );
	}
	else
	{
		this.setAnimation( 'idle', this.direction );
	}

	}

	this.damageTimer -= 1;
};

Enemy.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		DungeonGame.game.debug.body( this.sprite );
	}
};


Enemy.prototype.damage = function ()
{
	if ( this.damageTimer > 0 )
	{
		this.health -= 1;

		if ( this.health <= 0 )
		{
			this.defeat();
		}
		else
		{
			this.hurt( 1 );
		}
	}
	if ( this.state != 'hurt' )
	{
		this.damageTimer = 2;
	}
};

Enemy.prototype.damageStep = function ()
{
	if ( this.state == 'hurt' )
	{
		this.sprite.alpha = 1.5 - this.sprite.alpha; // Toggles between 1 and 0.5
		DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 0.05, this.damageStep, this );
	}
	else
	{
		this.sprite.alpha = 1.0;
	}
};

Enemy.prototype.damageDone = function ()
{
	this.setAnimation( 'idle', this.direction );
};

Enemy.prototype.hurt = function ()
{
	this.setAnimation( 'hurt', this.direction );
	var s = ['hurt_1', 'hurt_2', 'hurt_3'].choice()
	// rat, mouse, rhino, spider, slime, creature
	this.rat.play( s );

	// Move please
	var s = ['1', '2', '3'].choice()
	this.chop.play( s );

	DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 0.5, this.damageDone, this );
	this.damageStep();
};

Enemy.prototype.defeat = function ()
{
	var s = ['death'].choice()
	this.rat.play( s );

	// Move please
	var s = ['1', '2', '3'].choice()
	this.chop.play( s );

	this.createParticle();

	this.sprite.kill(); // Somehow reach into enemies list and remove, perhaps queueDestruction
};

Enemy.prototype.createParticle = function ()
{
	var emitter = DungeonGame.game.add.emitter( this.sprite.x, this.sprite.y, 200 );
	emitter.width = 8;
	emitter.height = 8;
	emitter.setXSpeed( -20, 20 );
	emitter.setYSpeed( -20, 20 );
	emitter.gravity = -32;
	emitter.maxRotation = 0;
	emitter.minRotation = 0;
	emitter.setAlpha( 0.8, 0.0, 10000 )
	emitter.particleClass = SmokeParticle;
	emitter.makeParticles();
	emitter.start( true, 0, null, 10 );
	// start(explode, lifespan, frequency, quantity, forceQuantity)
};
