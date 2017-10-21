
// Constructor
function Torch( visible )
{
	Entity.call( this );

	this.timer = 0;
	this.visible = visible;

	this.flickerMin = visible ? 0xe7 : 0xd7;
	this.flickerMax = visible ? 0xff : 0xef;
};

Torch.prototype.create = function ()
{
	this.sprite.frame = 18;

	this.lightSprite.reset( this.spawn.x*16 + 8, this.spawn.y*16 + 8 + 4 );
	this.lightSprite.loadTexture( 'torchlight' );
	this.lightSprite.blendMode = Phaser.blendModes.COLOR_DODGE;

	var behindWallOffset = this.visible ? 0 : 6;
	this.lightSprite.position.y -= behindWallOffset;

	if ( this.visible )
	{
		this.fire = DungeonGame.Particle.createFire( this.spawn.x*16 + 8, this.spawn.y*16 + 8 - 2 );
		DungeonGame.World.lighting.add( this.fire );
	}
	this.trail = DungeonGame.Particle.createSmokeTrail( this.spawn.x*16 + 8, this.spawn.y*16 + 8 - 2 - behindWallOffset );
	DungeonGame.World.lighting.add( this.trail );
};

Torch.prototype.destroy = function () {
	if ( this.fire )
		this.fire.destroy();
	this.trail.destroy();
};

Torch.prototype.update = function ()
{
	Entity.prototype.update.call( this );

	this.timer += 1;
	if ( this.timer % 2 == 0 )
		this.lightSprite.tint = randInt(this.flickerMin, this.flickerMax) * 0x010101;
};

extend( Entity, Torch );
