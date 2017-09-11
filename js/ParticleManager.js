
// Constructor
function ParticleManager()
{
};

ParticleManager.prototype.initSmokeBurst = function ()
{
	this.smokeBurst = DungeonGame.game.add.emitter( 0,0, 200 );
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
	//if ( this.smokeBurst == null || this.smokeBurst.game == null )
	this.initSmokeBurst();

	this.smokeBurst.x = x;
	this.smokeBurst.y = y;
	// start(explode, lifespan, frequency, quantity, forceQuantity)
	this.smokeBurst.start( true, 0, 4000, 16 );
};

ParticleManager.prototype.initSmokeTrail = function ()
{
	this.smokeTrail = DungeonGame.game.add.emitter( 0, 0, 100 );
	this.smokeTrail.particleClass = this.SmokeParticle;
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
};

ParticleManager.prototype.createSmokeTrail = function ( x, y )
{
	//if ( this.smokeTrail == null || this.smokeTrail.game == null )
	this.initSmokeTrail();

	this.smokeTrail.x = x;
	this.smokeTrail.y = y;

	// start(explode, lifespan, frequency, quantity, forceQuantity)
	this.smokeTrail.start( false, 4000, 100 );

	//this.sprite.addChild( this.smokeTrail );
}


/* Particle data */

ParticleManager.prototype.SmokeParticle = (function ()
{
	var SmokeParticle = function ( game, x, y )
	{
		Phaser.Particle.call( this, game, x, y, 'smoke' );
		this.animations.add( 'evaporate', [7,6,5,4,3,2,1,0] );
		this.animations.currentAnim.killOnComplete = true;
	};
	SmokeParticle.prototype = Object.create( Phaser.Particle.prototype );
	SmokeParticle.prototype.constructor = SmokeParticle;
	SmokeParticle.prototype.onEmit = function ()
	{
		this.animations.stop( 'evaporate', true );
		this.animations.play( 'evaporate', 3+8*Math.random(), false );
		if ( Math.random() < 0.5 ) this.scale.x *= -1;
		if ( Math.random() < 0.5 ) this.scale.y *= -1;
		var color = 0x111111 * [6, 8, 10, 12].choice();
		this.tint = color;
		//this.animations.getAnimation( 'evaporate' ).frame = Math.floor( Math.random() * this.animations.getAnimation( 'evaporate' ).frameTotal );
	}
	return SmokeParticle;
}());

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
