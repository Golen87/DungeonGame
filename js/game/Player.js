
// Constructor
function Player ()
{
}

Player.prototype.create = function ( x, y, group )
{
	this.speed = 80;

	this.group = DungeonGame.game.add.group();

	this.sprite = group.create( x, y, 'player', 0 );
	DungeonGame.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	this.sprite.body.setSize( 10, 8, 3, 5 );
	//this.sprite.body.setCircle( 6, 2, 4 );

	this.sword = group.create( x, y+2, 'sword', 0 );
	DungeonGame.game.physics.arcade.enable( this.sword, Phaser.Physics.ARCADE );
	this.sword.anchor.set( 0.5 );
	this.sword.exists = false;
	this.sword.body.setSize( 16, 28, 5, 10 );
	this.swordTimer = 0;

	this.setupAnimation();

	this.keys = DungeonGame.game.input.keyboard.createCursorKeys();
	this.keys.w = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.W );
	this.keys.a = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.A );
	this.keys.s = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.S );
	this.keys.d = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.D );

	this.keys.i = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.I );
	this.keys.j = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.J );
	this.keys.k = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.K );
	this.keys.l = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.L );

	this.keys.space = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
	this.keys.shift = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.SHIFT );

	this.gridPos = new Phaser.Point( x, y );
	this.prevGridPos = new Phaser.Point( x, y );
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

	this.sword.animations.add( 'attack', [1,1,1,2,3], 60, false );
	//this.sword.animations.currentAnim.onComplete.add(function () {	this.sword.kill();}, this);
	this.sword.animations.currentAnim.killOnComplete = true;

	this.stepCooldown = 0;
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
	if ( this.keys.space.justDown )
	{
		this.sword.reset(
			this.sprite.body.center.x + this.sprite.body.velocity.x/60,
			this.sprite.body.center.y + this.sprite.body.velocity.y/60
		);
		this.sword.animations.play( 'attack' );
		this.swordTimer = 0;

		this.sword.scale.y *= -1;
		if ( this.direction == 'right' )
		{
			this.sword.angle = 0;
			this.sword.body.setSize( 16, 28, 28, 10 );
		}
		else if ( this.direction == 'down' )
		{
			this.sword.angle = 90;
			this.sword.body.setSize( 28, 16, 10, this.sword.scale.y == 1 ? 28 : 4 );
		}
		else if ( this.direction == 'left' )
		{
			this.sword.angle = 180;
			this.sword.body.setSize( 16, 28, 5, 10 );
		}
		else if ( this.direction == 'up' )
		{
			this.sword.angle = 270;
			this.sword.body.setSize( 28, 16, 10, this.sword.scale.y == 1 ? 5 : 27 );
		}

		DungeonGame.Audio.play( 'swing' );
	}
	if ( this.keys.space.justUp )
	{
		//this.sword.kill();
	}
	this.sword.alpha = (0.75 - this.swordTimer / 10).clamp( 0, 1 );
	//console.log(this.sword.animations.currentAnim.frame, this.sword.alpha);
	this.swordTimer += 1;

	var p = new Phaser.Point( 0, 0 );

	var frame = this.sprite.animations.currentFrame.index % 6;
	this.stepCooldown -= 1;

	if ( this.state == 'walk' && ( frame == 2 || frame == 4 ) && this.stepCooldown <= 0 )
	{
		DungeonGame.Audio.play( 'footsteps' );
		this.stepCooldown = 10;
	}

	if ( !this.sword.exists )
	{
		if ( this.keys.up.isDown || this.keys.w.isDown )
			p.y -= 1;
		if ( this.keys.down.isDown || this.keys.s.isDown )
			p.y += 1;
		if ( this.keys.left.isDown || this.keys.a.isDown )
			p.x -= 1;
		if ( this.keys.right.isDown || this.keys.d.isDown )
			p.x += 1;

		if ( this.keys.i.justDown )
			this.sprite.body.y -= SCREEN_HEIGHT - 16;
		if ( this.keys.k.justDown )
			this.sprite.body.y += SCREEN_HEIGHT - 16;
		if ( this.keys.j.justDown )
			this.sprite.body.x -= SCREEN_WIDTH - 16;
		if ( this.keys.l.justDown )
			this.sprite.body.x += SCREEN_WIDTH - 16;
	}

	p.setMagnitude( this.speed );
	this.sprite.body.velocity.x += ( p.x - this.sprite.body.velocity.x ) / 3;
	this.sprite.body.velocity.y += ( p.y - this.sprite.body.velocity.y ) / 3;
	this.sword.body.velocity.copyFrom( this.sprite.body.velocity );

	if ( p.getMagnitude() > 0 )
	{
		var direction;
		if ( Math.abs( p.x ) >= Math.abs( p.y ) )
			direction = p.x > 0 ? 'right' : 'left';
		else
			direction = p.y > 0 ? 'down' : 'up';
		this.setAnimation( 'walk', direction );
	}
	else
	{
		this.setAnimation( 'idle', this.direction );
	}

	this.prevGridPos.copyFrom( this.gridPos );
	this.gridPos.x = Math.round( ( this.sprite.position.x - 8 ) / 16 ) * 16;
	this.gridPos.y = Math.round( ( this.sprite.position.y - 8 ) / 16 ) * 16;
};

Player.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		DungeonGame.game.debug.body( this.sprite );
		DungeonGame.game.debug.body( this.sword );
	}
};
