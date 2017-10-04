
// Constructor
function Entity()
{
	this.spawn = new Phaser.Point();

	this.hitCooldown = 6;
	this.hitBuffer = 0;
};

Entity.prototype.init = function ( sprite, bgSprite, dataRef, x, y )
{
	this.sprite = sprite;
	this.sprite.loadTexture( 'entities16', 0 );
	this.sprite.frame = 0;
	this.sprite.anchor.set( 0.5, 0.5 );
	this.sprite.visible = true;
	this.sprite.alpha = 1.0;
	this.sprite.body.immovable = true;
	this.sprite.body.moves = false;

	this.bgSprite = bgSprite;
	this.bgSprite.anchor.set( 0.5, 0.5 );
	this.bgSprite.kill();

	this.data = dataRef;

	this.spawn.setTo( x, y );
	this.sprite.reset( x*16 + 8, y*16 );
	this.sprite.body.setSize( 16, 16, 0, 16 );
};

Entity.prototype.create = function () {};

Entity.prototype.destroy = function () {};

Entity.prototype.update = function ()
{
	this.hitBuffer -= 1;
};

Entity.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		DungeonGame.game.debug.body( this.sprite, BLUE );
	}
};


Entity.prototype.overlap = function ( other )
{
	if ( this.hasPhysics() )
	{
		DungeonGame.game.physics.arcade.collide( other.sprite, this.sprite );
	}
};

Entity.prototype.damage = function ()
{
	if ( this.hitBuffer > this.hitCooldown )
	{
		this.hitBuffer = this.hitCooldown;

		// Move please
		DungeonGame.Audio.play( 'chop' );
		//DungeonGame.cameraShake( 1 );

		this.hurt();
	}
	if ( this.hitBuffer <= 0 )
	{
		this.hitBuffer = this.hitCooldown + 4;
	}
};

Entity.prototype.hurt = function ()
{
};


Entity.prototype.getGridPos = function ()
{
	return {
		"x": Math.floor(this.sprite.x / 16),
		"y": Math.floor(this.sprite.y / 16)
	};
};

Entity.prototype.hasPhysics = function ()
{
	return true;
};
