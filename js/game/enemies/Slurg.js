
// Constructor
function Slurg()
{
	Enemy.call( this );

	this.health = 3;
	this.speed = 24;

	this.sound = 'spider';
	this.damageTimer = 0;
};

Slurg.prototype.create = function ()
{
	this.sprite.loadTexture( 'slurg', 0 );

	this.sprite.body.setSize( 12, 10, 2, 2 );

	this.lightSprite.reset( this.spawn.x*16, this.spawn.y*16 );
	this.lightSprite.loadTexture( 'slurgLight', 0 );
	this.lightSprite.tint = 0x777777;
	this.lightOffset = new Phaser.Point( 0, 0 );

	this.aiState = 'idle';
	this.goalPos = new Phaser.Point( this.sprite.body.position.x, this.sprite.body.position.y );

	this.setupAnimation();
};

Slurg.prototype.setupAnimation = function ()
{
	var len = 5;
	var idle = [0];
	var walk = [0, 1, 2, 3, 3, 3, 3, 3, 3];
	var hurt = [4];

	this.sprite.animations.add( 'idle_right', idle, 3, true );
	this.sprite.animations.add( 'walk_right', walk, 10, true );
	this.sprite.animations.add( 'hurt_right', hurt, 1, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	hurt = hurt.map( n => n + len )
	this.sprite.animations.add( 'idle_down', idle, 3, true );
	this.sprite.animations.add( 'walk_down', walk, 10, true );
	this.sprite.animations.add( 'hurt_down', hurt, 1, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	hurt = hurt.map( n => n + len )
	this.sprite.animations.add( 'idle_left', idle, 3, true );
	this.sprite.animations.add( 'walk_left', walk, 10, true );
	this.sprite.animations.add( 'hurt_left', hurt, 1, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	hurt = hurt.map( n => n + len )
	this.sprite.animations.add( 'idle_up', idle, 3, true );
	this.sprite.animations.add( 'walk_up', walk, 10, true );
	this.sprite.animations.add( 'hurt_up', hurt, 1, true );

	this.setAnimation( 'idle', ['right', 'down', 'left', 'up'].choice() );
};

Slurg.prototype.setAnimation = function ( newState, newDirection )
{
	var name = null;
	if ( this.state != newState || this.direction != newDirection )
	{
		name = '{0}_{1}'.format( newState, newDirection );
		this.state = newState;
		this.direction = newDirection;

		if ( this.direction == 'right' )
		{
			this.lightSprite.frame = 0;
			this.lightOffset.set( -4, -2 );
		}
		else if ( this.direction == 'left' )
		{
			this.lightSprite.frame = 1;
			this.lightOffset.set( 4, -2 );
		}
		else
		{
			this.lightSprite.frame = 2;
			this.lightOffset.set( 0, 0 );
		}

		if ( this.state == 'hurt' )
			this.lightSprite.tint = 0x555555;
		else
			this.lightSprite.tint = 0x777777;
	}

	if ( name )
	{
		this.sprite.animations.play( name );
	}
};


Slurg.prototype.update = function ()
{
	Enemy.prototype.update.call( this );

	this.lightSprite.x = this.sprite.x + this.lightOffset.x;
	this.lightSprite.y = this.sprite.y + this.lightOffset.y;

	if ( this.sprite.frame % 5 != 3 )
	{
		this.sprite.body.position.x -= this.sprite.body.velocity.x / 60;
		this.sprite.body.position.y -= this.sprite.body.velocity.y / 60;
	}
};

Slurg.prototype.overlap = function ( other )
{
	Enemy.prototype.overlap.call( this );
};

Slurg.prototype.hurt = function ()
{
	Enemy.prototype.hurt.call( this );

	//DungeonGame.game.add.tween( this.chestBeam ).to({ alpha: 1.0 }, 400, Phaser.Easing.Linear.In, true );
};

extend( Enemy, Slurg );
