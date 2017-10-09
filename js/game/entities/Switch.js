
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

	this.toggle( this.data.active, false );
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
};

Switch.prototype.toggle = function ( state, audio=true )
{
	this.active = state != null ? state : false;

	this.onTrigger( this, !audio );

	if ( state )
	{
		this.sprite.frame = 5;
		this.tweenTint( this.lightSprite, 0x000000, 0x666666, 200 );
		this.lightTween = DungeonGame.game.add.tween( this.lightSprite ).to({ fac: 1.0 }, 600, Phaser.Easing.Elastic.Out, true );
		if ( audio )
			DungeonGame.Audio.play( 'crystal', 'on' );
	}
	else
	{
		this.sprite.frame = 4;
		this.tweenTint( this.lightSprite, 0x666666, 0x000000, 300 );
		this.lightTween = DungeonGame.game.add.tween( this.lightSprite ).to({ fac: 0.0 }, 600, Phaser.Easing.Exponential.Out, true );
		if ( audio )
			DungeonGame.Audio.play( 'crystal', 'off' );
	}
};

Switch.prototype.hurt = function ()
{
	DungeonGame.Audio.play( 'chop' );
	this.toggle( !this.active );
};

Switch.prototype.tweenTint = function (obj, startColor, endColor, time)
{
	// create an object to tween with our step value at 0
	var colorBlend = {step: 0};
	// create the tween on this object and tween its step property to 100
	var colorTween = DungeonGame.game.add.tween(colorBlend).to({step: 100}, time);

	// run the interpolateColor function every time the tween updates, feeding it the
	// updated value of our tween each time, and set the result as our tint
	colorTween.onUpdateCallback(function() {
		obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
	});

	// set the object to the start color straight away
	obj.tint = startColor;

	// start the tween
	colorTween.start();
}

extend( Entity, Switch );
