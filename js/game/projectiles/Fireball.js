
// Constructor
function Fireball()
{
	Projectile.call( this );

	this.speed = 100;

	this.flickerTimer = 0;
	this.flickerMin = 0.70;
	this.flickerMax = 0.90;
	this.flicker = randFloat(this.flickerMin, this.flickerMax);
};

Fireball.prototype.create = function ()
{
	this.sprite.loadTexture( 'fire', 0 );

	this.sprite.animations.add( 'burn', [0,1,2,3,4,5,6] );
	this.sprite.animations.play( 'burn', 20, true );
	this.sprite.animations.getAnimation( 'burn' ).frame = Math.floor( Math.random() * this.sprite.animations.getAnimation( 'burn' ).frameTotal );

	this.sprite.angle = this.sprite.body.direction*180/Math.PI - 90;
	this.sprite.body.velocity.set(
		this.speed * Math.cos(this.sprite.body.direction),
		this.speed * Math.sin(this.sprite.body.direction),
	);
};

Fireball.prototype.update = function ()
{
	Projectile.prototype.update.call( this );

	this.flickerTimer += 1;
	if ( this.flickerTimer % 2 == 0 )
		this.flicker = randFloat(this.flickerMin, this.flickerMax);

	DungeonGame.Light.drawFow( this.sprite.x, this.sprite.y+8, 3.0, 1.0 );
	DungeonGame.Light.drawLight( this.sprite.x, this.sprite.y+8, 1.0, this.flicker );
};

Fireball.prototype.overlap = function ( other )
{
	//Projectile.prototype.overlap.call( this );
};

Fireball.prototype.getAttackPower = function ()
{
	return 15;
};

Fireball.prototype.hasPhysics = function ()
{
	return false;
};

extend( Projectile, Fireball );
