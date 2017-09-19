
// Constructor
function ParticleManager()
{
};


/* Smoke burst */

ParticleManager.prototype.WhiteSmokeParticle = (function ()
{
	var WhiteSmokeParticle = function ( game, x, y )
	{
		Phaser.Particle.call( this, game, x, y, 'smoke' );
		this.animations.add( 'evaporate', [7,6,5,4,3,2,1,0] );
		this.animations.currentAnim.killOnComplete = true;
	};
	WhiteSmokeParticle.prototype = Object.create( Phaser.Particle.prototype );
	WhiteSmokeParticle.prototype.constructor = WhiteSmokeParticle;
	WhiteSmokeParticle.prototype.onEmit = function ()
	{
		this.animations.stop( 'evaporate', true );
		this.animations.play( 'evaporate', 3+8*Math.random(), false );
		if ( Math.random() < 0.5 ) this.scale.x *= -1;
		if ( Math.random() < 0.5 ) this.scale.y *= -1;
		//this.animations.getAnimation( 'evaporate' ).frame = Math.floor( Math.random() * this.animations.getAnimation( 'evaporate' ).frameTotal );
	}
	return WhiteSmokeParticle;
}());

ParticleManager.prototype.initSmokeBurst = function ()
{
	this.smokeBurst = DungeonGame.game.add.emitter( 0,0, 64 );
	this.smokeBurst.particleClass = this.WhiteSmokeParticle;
	this.smokeBurst.width = 8;
	this.smokeBurst.height = 8;
	this.smokeBurst.setXSpeed( -20, 20 );
	this.smokeBurst.setYSpeed( -20, 20 );
	this.smokeBurst.gravity = -32;
	this.smokeBurst.setRotation(0, 0);
	this.smokeBurst.setAlpha( 0.8, 0.0, 8000 )
	//this.smokeBurst.forEach(function(particle) {particle.tint = 0xff0000;});
	//makeParticles(keys, frames, quantity, collide, collideWorldBounds)
	this.smokeBurst.makeParticles();
};

ParticleManager.prototype.createSmokeBurst = function ( x, y )
{
	if ( this.smokeBurst == null || this.smokeBurst.game == null )
		this.initSmokeBurst();

	this.smokeBurst.x = x;
	this.smokeBurst.y = y;
	// start(explode, lifespan, frequency, quantity, forceQuantity)
	this.smokeBurst.start( true, 0, 4000, 16 );
};


/* Smoke trail */

ParticleManager.prototype.SmokeTrailParticle = (function ()
{
	var SmokeTrailParticle = function ( game, x, y )
	{
		Phaser.Particle.call( this, game, x, y, 'smoke' );
		this.animations.add( 'evaporate', [7,6,5,4,3,2,1,0] );
		this.animations.currentAnim.killOnComplete = true;
	};
	SmokeTrailParticle.prototype = Object.create( Phaser.Particle.prototype );
	SmokeTrailParticle.prototype.constructor = SmokeTrailParticle;
	SmokeTrailParticle.prototype.onEmit = function ()
	{
		this.animations.stop( 'evaporate', true );
		this.animations.play( 'evaporate', 3+8*Math.random(), false );
		if ( Math.random() < 0.5 ) this.scale.x *= -1;
		if ( Math.random() < 0.5 ) this.scale.y *= -1;
		var color = 0x111111 * [6, 8, 10, 12].choice();
		this.tint = color;
		//this.animations.getAnimation( 'evaporate' ).frame = Math.floor( Math.random() * this.animations.getAnimation( 'evaporate' ).frameTotal );
	}
	return SmokeTrailParticle;
}());

ParticleManager.prototype.createSmokeTrail = function ( x, y )
{
	this.smokeTrail = DungeonGame.game.add.emitter( 0, 0, 32 );
	this.smokeTrail.particleClass = this.SmokeTrailParticle;
	this.smokeTrail.setAlpha( 0.8, 0.0, 10000 )
	this.smokeTrail.setScale( 1.0, 1, 1.0, 1, 6000, Phaser.Easing.Quintic.Out );
	this.smokeTrail.setRotation( 0, 0 );
	this.smokeTrail.gravity = -32;
	this.smokeTrail.width = 2;
	this.smokeTrail.height = 2;
	this.smokeTrail.setXSpeed( -2, 2 );
	this.smokeTrail.setYSpeed( -2, 2 );
	//makeParticles(keys, frames, quantity, collide, collideWorldBounds)
	this.smokeTrail.makeParticles();

	this.smokeTrail.x = x;
	this.smokeTrail.y = y;

	// start(explode, lifespan, frequency, quantity, forceQuantity)
	this.smokeTrail.start( false, 4000, 100 );

	//this.sprite.addChild( this.smokeTrail );
}


/* Rubble burst */

ParticleManager.prototype.RubbleParticle = (function ()
{
	var RubbleParticle = function ( game, x, y )
	{
		Phaser.Particle.call( this, game, x, y, 'rubble' );
		//this.animations.add( 'evaporate', [7,6,5,4,3,2,1,0] );
		//this.animations.currentAnim.killOnComplete = true;
	};
	RubbleParticle.prototype = Object.create( Phaser.Particle.prototype );
	RubbleParticle.prototype.constructor = RubbleParticle;
	RubbleParticle.prototype.onEmit = function ()
	{
		//this.animations.stop( 'evaporate', true );
		//this.animations.play( 'evaporate', 3+8*Math.random(), false );
		this.frame = randInt( 0, 9 );
		if ( Math.random() < 0.5 ) this.scale.x *= -1;
		if ( Math.random() < 0.5 ) this.scale.y *= -1;
		//this.animations.getAnimation( 'evaporate' ).frame = Math.floor( Math.random() * this.animations.getAnimation( 'evaporate' ).frameTotal );

		var r = 1 * randFloat( 0.27, 0.55 );
		var g = r * randFloat( 0.69, 0.73 );
		var b = r * randFloat( 0.40, 0.52 );
		this.tint = (b*0xff << 0) + (g*0xff << 8) + (r*0xff << 16);

		this.body.gravity.y = 320;
		this.life = 0;
		this.land = randInt( 20, 30 );
		this.death = randInt( 200, 300 );
	};
	RubbleParticle.prototype.update = function ()
	{
		this.life += 1;
		if ( this.life == this.land )
		{
			this.body.velocity.setTo( 0, 0 );
			this.body.gravity.y = 0;
		}
		if ( this.life == this.death )
		{
			this.kill();
		}
	};
	return RubbleParticle;
}());

ParticleManager.prototype.initRubbleBurst = function ( sprite )
{
	this.rubbleBurst = DungeonGame.game.add.emitter( 0, 0, 64 );
	sprite.addChild( this.rubbleBurst );
	this.rubbleBurst.particleClass = this.RubbleParticle;
	this.rubbleBurst.width = 16;
	this.rubbleBurst.height = 16;
	this.rubbleBurst.setXSpeed( -30, 30 );
	this.rubbleBurst.setYSpeed( -80, -20 );
	this.rubbleBurst.setRotation(0, 0);
	//this.rubbleBurst.forEach(function(particle) {particle.tint = 0xff0000;});
	//makeParticles(keys, frames, quantity, collide, collideWorldBounds)
	this.rubbleBurst.makeParticles();
};

ParticleManager.prototype.createRubbleBurst = function ( x, y )
{
	if ( this.rubbleBurst == null || this.rubbleBurst.game == null )
		this.initRubbleBurst();

	this.rubbleBurst.x = x;
	this.rubbleBurst.y = y;
	// start(explode, lifespan, frequency, quantity, forceQuantity)
	this.rubbleBurst.start( true, 0, 4000, 8 );
};


/* Unused */

ParticleManager.prototype.SparkleParticle = (function ()
{
	var SparkleParticle = function ( game, x, y )
	{
		Phaser.Particle.call( this, game, x, y, 'sparkle' );
		this.animations.add( 'evaporate', [8,7,6,5,4,3,2,1,0] );
		this.animations.currentAnim.killOnComplete = true;
	};
	SparkleParticle.prototype = Object.create( Phaser.Particle.prototype );
	SparkleParticle.prototype.constructor = SparkleParticle;
	SparkleParticle.prototype.onEmit = function ()
	{
		this.animations.stop( 'evaporate', true );
		this.animations.play( 'evaporate', 3+8*Math.random(), false );
		//this.animations.getAnimation( 'evaporate' ).frame = Math.floor( Math.random() * this.animations.getAnimation( 'evaporate' ).frameTotal );
	}
	return SparkleParticle;
}());
