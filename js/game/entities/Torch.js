
// Constructor
function Torch( visible )
{
	Entity.call( this );
	this.alive = true;

	this.visible = visible;

	this.flickerTimer = 0;
	this.flickerMin = visible ? 0.90 : 0.84;
	this.flickerMax = visible ? 1.00 : 0.94;
	this.flicker = randFloat(this.flickerMin, this.flickerMax);

	this.lightOffset = visible ? 4 : -2;
};

Torch.prototype.create = function ()
{
	if ( this.data.alive != null )
	{
		this.alive = this.data.alive;
	}

	this.sprite.frame = 18;

	var behindWallOffset = this.visible ? 0 : 6;

	if ( this.alive )
	{
		if ( this.visible )
		{
			this.fire = DungeonGame.Particle.createFire( this.spawn.x*16 + 8, this.spawn.y*16 + 8 - 2 );
			DungeonGame.World.lighting.add( this.fire );
		}
		this.trail = DungeonGame.Particle.createSmokeTrail( this.spawn.x*16 + 8, this.spawn.y*16 + 8 - 2 - behindWallOffset );
		DungeonGame.World.lighting.add( this.trail );
	}
};

Torch.prototype.destroy = function () {
	if ( this.fire && this.fire.exists )
		this.fire.destroy();
	if ( this.trail && this.trail.exists )
		this.trail.destroy();

	this.data.alive = this.alive;
};

Torch.prototype.update = function ()
{
	Entity.prototype.update.call( this );

	this.flickerTimer += 1;
	if ( this.flickerTimer % 2 == 0 )
		this.flicker = randFloat(this.flickerMin, this.flickerMax);// * 0x010101;

	if (this.alive)
	{
		DungeonGame.Light.drawFow( this.spawn.x*16 + 7, this.spawn.y*16 + 7 + this.lightOffset, 4.0, 1.0 );
		DungeonGame.Light.drawLight( this.spawn.x*16 + 7, this.spawn.y*16 + 7 + this.lightOffset, 1.0, this.flicker );
	}
};

Torch.prototype.hasPhysics = function ()
{
	return false;
};

Torch.prototype.hurt = function ()
{
	if (this.alive) {
		DungeonGame.Audio.play( 'chop' );
		if (this.fire && this.fire.exists) {
			this.fire.destroy();
		}
		this.trail.on = false;
		this.alive = false;
	}
};

extend( Entity, Torch );
