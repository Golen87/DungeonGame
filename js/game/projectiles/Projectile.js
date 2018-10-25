
// Constructor
function Projectile( sprite )
{
	this.spawn = new Phaser.Point();
};

Projectile.prototype.init = function ( sprite, bgSprite, x, y, direction )
{
	this.sprite = sprite;
	this.sprite.owner = this;
	this.sprite.frame = 0;
	this.sprite.anchor.set( 0.5, 0.5 );
	this.sprite.visible = true;
	this.sprite.alpha = 1.0;
	this.sprite.scale.set(1);
	this.sprite.body.immovable = false;
	this.sprite.body.moves = true;

	this.bgSprite = bgSprite;
	this.bgSprite.visible = true;
	this.bgSprite.anchor.set( 0.5, 0.5 );
	this.bgSprite.kill();

	this.spawn.setTo( x, y );
	this.sprite.reset( x, y );
	//this.sprite.body.setSize( 16, 16, 4, 4 );
	this.sprite.body.setCircle( 2, 6, 6+2 );
	this.sprite.body.bounce.set( 0.0 );

	this.sprite.body.direction = direction;
};

Projectile.prototype.create = function () {};

Projectile.prototype.destroy = function () {
	this.sprite.kill();
	this.bgSprite.kill();
};

Projectile.prototype.update = function () {};

Projectile.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		DungeonGame.game.debug.body( this.sprite, PURPLE );
	}
};


Projectile.prototype.getAttackPower = function ()
{
	return 0;
};

Projectile.prototype.getGridPos = function ()
{
	return new Phaser.Point(
		Math.floor(this.sprite.x / 16),
		Math.floor(this.sprite.y / 16)
	);
};

Projectile.prototype.getRoomPos = function ()
{
	return new Phaser.Point(
		Math.floor(this.sprite.x / ROOM_WIDTH / 16),
		Math.floor(this.sprite.y / ROOM_HEIGHT / 16)
	);
};
