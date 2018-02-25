
// Constructor
function Switch( onTrigger )
{
	Entity.call( this );
	this.onTrigger = onTrigger;

	this.active = false;
};

Switch.prototype.create = function ()
{
	this.sprite.frame = 4;

	this.bgSprite.reset( this.spawn.x*16 + 8, this.spawn.y*16 );
	this.bgSprite.frame = 3;

	this.lightSprite.reset( this.spawn.x*16 + 8, this.spawn.y*16 - 1 );
	this.lightSprite.loadTexture( 'glow' );
	this.lightSprite.blendMode = Phaser.blendModes.COLOR_DODGE;
	this.lightSprite.fac = 0;
	this.lightTween = null;

	this.TINT_ON = 0x555555;
	this.TINT_OFF = 0x000000;

	this.toggle( this.data.active, true );
};

Switch.prototype.destroy = function ()
{
	this.data.active = this.active;
};

Switch.prototype.update = function ()
{
	Entity.prototype.update.call( this );

	var h = this.active * ( 3 + Math.sin( DungeonGame.game.time.totalElapsedSeconds() * Math.PI ) );
	this.sprite.position.y += ( this.spawn.y * 16 - h - this.sprite.position.y ) / 8;
	this.sprite.body.offset.y += ( 16 + h - this.sprite.body.offset.y ) / 8;

	this.lightSprite.x = this.sprite.position.x;
	this.lightSprite.y = this.sprite.position.y;

	this.lightSprite.scale.set(this.lightSprite.fac);

	if (this.active)
		DungeonGame.Gui.drawLight(this.lightSprite.x, this.lightSprite.y);
	else
		DungeonGame.Gui.drawLight(this.lightSprite.x, this.lightSprite.y, 1);
};

Switch.prototype.toggle = function ( state, immediate=false )
{
	this.active = state != null ? state : false;

	this.onTrigger( this, immediate );

	if ( state )
	{
		this.sprite.frame = 5;
		if ( !immediate )
		{
			DungeonGame.Audio.play( 'crystal', 'on' );
			tweenTint( this.lightSprite, this.TINT_OFF, this.TINT_ON, 200 );
			this.lightTween = DungeonGame.game.add.tween( this.lightSprite ).to({ fac: 1.0 }, 600, Phaser.Easing.Elastic.Out, true );
		}
		else
		{
			this.lightSprite.tint = this.TINT_ON;
			this.lightSprite.fac = 1.0;
		}
	}
	else
	{
		this.sprite.frame = 4;
		if ( !immediate )
		{
			DungeonGame.Audio.play( 'crystal', 'off' );
			tweenTint( this.lightSprite, this.TINT_ON, this.TINT_OFF, 300 );
			this.lightTween = DungeonGame.game.add.tween( this.lightSprite ).to({ fac: 0.0 }, 600, Phaser.Easing.Exponential.Out, true );
		}
		else
		{
			this.lightSprite.tint = this.TINT_OFF;
			this.lightSprite.fac = 0.0;
		}
	}
};

Switch.prototype.hurt = function ()
{
	DungeonGame.Audio.play( 'chop' );
	this.toggle( !this.active );
};

extend( Entity, Switch );
