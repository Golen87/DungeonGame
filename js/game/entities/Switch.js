
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

	this.lightFac = 0;
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

	DungeonGame.Light.drawFow( this.sprite.x, this.sprite.y + h + 8, 1 + 3 * this.lightFac, 0.5 + 0.5 * this.lightFac );
	DungeonGame.Light.drawLight( this.sprite.position.x, this.sprite.position.y, 1.0, 0.6 * this.lightFac );
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
			this.lightTween = DungeonGame.game.add.tween( this ).to({ lightFac: 1.0 }, 600, Phaser.Easing.Elastic.Out, true );
		}
		else
		{
			this.lightFac = 1.0;
		}
	}
	else
	{
		this.sprite.frame = 4;
		if ( !immediate )
		{
			DungeonGame.Audio.play( 'crystal', 'off' );
			this.lightTween = DungeonGame.game.add.tween( this ).to({ lightFac: 0.0 }, 600, Phaser.Easing.Exponential.Out, true );
		}
		else
		{
			this.lightFac = 0.0;
		}
	}
};

Switch.prototype.hurt = function ()
{
	DungeonGame.Audio.play( 'chop' );
	this.toggle( !this.active );
};

extend( Entity, Switch );
