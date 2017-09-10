
var SmokeParticle = (function ()
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
		this.animations.play( 'evaporate', 3+10*Math.random(), false );
		//this.animations.getAnimation( 'evaporate' ).frame = Math.floor( Math.random() * this.animations.getAnimation( 'evaporate' ).frameTotal );
	}
	return SmokeParticle;
}());


var SparkleParticle = (function ()
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
		this.animations.play( 'evaporate', 3+10*Math.random(), false );
		//this.animations.getAnimation( 'evaporate' ).frame = Math.floor( Math.random() * this.animations.getAnimation( 'evaporate' ).frameTotal );
	}
	return SparkleParticle;
}());
