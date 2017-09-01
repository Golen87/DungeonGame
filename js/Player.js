
// Constructor
function Player ()
{
}


Player.staticMethod = function ()
{
};


Player.prototype.preload = function ()
{
};

Player.prototype.create = function ()
{
	this.speed = 80;

	this.sprite = DungeonGame.game.add.sprite( 128, 64, 'player', 0 );
	DungeonGame.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	this.sprite.body.setSize(10, 14, 3, 1);
	//this.sprite.body.setCircle( 8 );

	//this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

	this.setupAnimation();

	this.cursors = DungeonGame.game.input.keyboard.createCursorKeys();
};

Player.prototype.setupAnimation = function ()
{
	var len = 6;
	var idle = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
	var walk = [2, 3, 4, 5];
	this.sprite.animations.add( 'idle_right', idle, 8, true );
	this.sprite.animations.add( 'walk_right', walk, 10, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	this.sprite.animations.add( 'idle_down', idle, 8, true );
	this.sprite.animations.add( 'walk_down', walk, 10, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	this.sprite.animations.add( 'idle_left', idle, 8, true );
	this.sprite.animations.add( 'walk_left', walk, 10, true );
	idle = idle.map( n => n + len )
	walk = walk.map( n => n + len )
	this.sprite.animations.add( 'idle_up', idle, 8, true );
	this.sprite.animations.add( 'walk_up', walk, 10, true );

	this.state = 'idle';
	this.direction = 'down';
	this.sprite.animations.play( 'idle_down' );

	//this.damageAnimation = false;
	//PhaserGame.prototype.cloudBurst(this);
};

Player.prototype.setAnimation = function ( newState, newDirection )
{
	var name = null;
	if ( this.state != newState || this.direction != newDirection )
	{
		name = '{0}_{1}'.format( newState, newDirection );
		this.state = newState;
		this.direction = newDirection;
	}

	if ( name )
	{
		this.sprite.animations.play( name );
	}
};

Player.prototype.update = function ()
{
	var p = new Phaser.Point( 0, 0 );

	var state = 'idle';
	var direction = this.direction;

	if ( this.cursors.up.isDown )
	{
		p.y -= 1;
		direction = 'up';
		state = 'walk';
	}
	if ( this.cursors.down.isDown )
	{
		p.y += 1;
		direction = 'down';
		state = 'walk';
	}
	if ( this.cursors.left.isDown )
	{
		p.x -= 1;
		direction = 'left';
		state = 'walk';
	}
	if ( this.cursors.right.isDown )
	{
		p.x += 1;
		direction = 'right';
		state = 'walk';
	}

	p.setMagnitude(this.speed);
	this.sprite.body.velocity.x += (p.x - this.sprite.body.velocity.x) / 5;
	this.sprite.body.velocity.y += (p.y - this.sprite.body.velocity.y) / 5;

	this.setAnimation( state, direction );
};

Player.prototype.render = function ()
{
	//DungeonGame.game.debug.body( this.sprite );
};
