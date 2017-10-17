
// Constructor
function Entity()
{
	this.spawn = new Phaser.Point();

	this.hitCooldown = 6;
	this.hitBuffer = 0;
};

Entity.prototype.init = function ( sprite, bgSprite, lightSprite, dataRef, x, y )
{
	this.sprite = sprite;
	this.sprite.owner = this;
	this.sprite.loadTexture( 'entities16', 0 );
	this.sprite.frame = 0;
	this.sprite.anchor.set( 0.5, 0.5 );
	this.sprite.visible = true;
	this.sprite.alpha = 1.0;
	this.sprite.scale.x = 1;
	this.sprite.body.immovable = true;
	this.sprite.body.moves = false;

	this.bgSprite = bgSprite;
	this.bgSprite.loadTexture( 'entities16', 0 );
	this.bgSprite.anchor.set( 0.5, 0.5 );
	this.bgSprite.scale.x = 1;
	this.bgSprite.kill();

	this.lightSprite = lightSprite;
	this.lightSprite.anchor.set( 0.5, 0.5 );
	this.lightSprite.scale.x = 1;
	this.lightSprite.angle = 0;
	this.lightSprite.tint = 0xffffff;
	this.lightSprite.kill();

	this.data = dataRef;
	this.lockState = false;

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

Entity.prototype.overlapEntity = function ( other ) {};

Entity.prototype.damage = function ()
{
	if ( this.hitBuffer > this.hitCooldown )
	{
		this.hitBuffer = this.hitCooldown;

		// Move please
		//DungeonGame.Audio.play( 'chop' );
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


Entity.prototype.getRoomPos = function ()
{
	var p = this.getGridPos();
	p.x = Math.floor(p.x / ROOM_WIDTH);
	p.y = Math.floor(p.y / ROOM_HEIGHT);
	return p;
};

Entity.prototype.getRelGridPos = function ()
{
	var p = this.getGridPos();
	p.x %= ROOM_WIDTH;
	p.y %= ROOM_HEIGHT;
	return p;
};

Entity.prototype.getGridPos = function ()
{
	return new Phaser.Point(
		Math.floor(this.sprite.x / 16),
		Math.floor(this.sprite.y / 16)
	);
};

Entity.prototype.hasPhysics = function ()
{
	return true;
};
