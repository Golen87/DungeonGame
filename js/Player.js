
// Constructor
function Player ()
{
}

Player.prototype.create = function ( x, y, group )
{
	this.speed = 80;

	this.sprite = group.create( x, y, 'player', 0 );
	DungeonGame.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	this.sprite.body.setSize(10, 8, 3, 5);
	//this.sprite.body.setCircle( 6, 2, 4 );

	//this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

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

	//this.damageAnimation = false;
	//PhaserGame.prototype.cloudBurst(this);

	//addMarker(name, start, duration, volume, loop)
	this.footsteps = DungeonGame.game.add.audio( 'footsteps' );
	this.footsteps.addMarker('1', 0.0, 0.3, 0.1);
	this.footsteps.addMarker('2', 0.4, 0.3, 0.1);
	this.footsteps.addMarker('3', 0.8, 0.3, 0.1);
	this.footsteps.addMarker('4', 1.2, 0.3, 0.1);
	this.stepCooldown = 0;

	this.eating = DungeonGame.game.add.audio( 'eating' );
	this.eating.addMarker('1', 0.0, 0.95);
	this.eating.addMarker('2', 1.0, 0.95);
	this.eating.addMarker('3', 2.0, 0.95);

	this.rat = DungeonGame.game.add.audio( 'rat' );
	this.rat.addMarker('cry_1', 0.0, 0.5 );
	this.rat.addMarker('cry_2', 0.6, 0.5 );
	this.rat.addMarker('cry_3', 1.2, 0.5 );
	this.rat.addMarker('hurt_1', 1.8, 0.35 );
	this.rat.addMarker('hurt_2', 2.25, 0.35 );
	this.rat.addMarker('hurt_3', 2.7, 0.35 );
	this.rat.addMarker('death', 3.15, 0.55 );

	this.mouse = DungeonGame.game.add.audio( 'mouse' );
	this.mouse.addMarker('cry_1', 0.0, 0.2 );
	this.mouse.addMarker('cry_2', 0.3, 0.2 );
	this.mouse.addMarker('cry_3', 0.6, 0.2 );
	this.mouse.addMarker('hurt_1', 0.9, 0.4 );
	this.mouse.addMarker('hurt_2', 1.4, 0.4 );
	this.mouse.addMarker('hurt_3', 1.9, 0.4 );
	this.mouse.addMarker('death', 2.4, 0.3 );

	this.rhino = DungeonGame.game.add.audio( 'rhino' );
	this.rhino.addMarker('cry_1', 0.0, 1.1 );
	this.rhino.addMarker('cry_2', 1.2, 1.1 );
	this.rhino.addMarker('cry_3', 2.4, 1.1 );
	this.rhino.addMarker('cry_4', 3.6, 1.3 );
	this.rhino.addMarker('hurt_1', 5.0, 0.6 );
	this.rhino.addMarker('hurt_2', 5.7, 0.5 );
	this.rhino.addMarker('hurt_3', 6.3, 0.7 );
	this.rhino.addMarker('hurt_4', 7.1, 0.6 );
	this.rhino.addMarker('death', 7.8, 0.9 );

	this.spider = DungeonGame.game.add.audio( 'spider' );
	this.spider.addMarker('cry_1', 0.0, 0.9 );
	this.spider.addMarker('cry_2', 1.0, 0.9 );
	this.spider.addMarker('cry_3', 2.0, 0.9 );
	this.spider.addMarker('cry_4', 3.0, 0.9 );
	this.spider.addMarker('hurt_1', 4.0, 0.7 );
	this.spider.addMarker('hurt_2', 4.8, 0.7 );
	this.spider.addMarker('hurt_3', 5.6, 0.7 );
	this.spider.addMarker('death_1', 6.4, 0.8 );
	this.spider.addMarker('death_2', 7.3, 0.8 );

	this.slime = DungeonGame.game.add.audio( 'slime' );
	this.slime.addMarker('cry_1', 0.0, 1.2 );
	this.slime.addMarker('cry_2', 1.3, 1.2 );
	this.slime.addMarker('cry_3', 2.6, 1.2 );
	this.slime.addMarker('hurt_1', 3.9, 1.2 );
	this.slime.addMarker('hurt_2', 5.2, 1.2 );
	this.slime.addMarker('hurt_3', 6.5, 1.2 );
	this.slime.addMarker('death', 7.8, 1.2 );


	this.creature = DungeonGame.game.add.audio( 'creature' );
	this.creature.addMarker('cry_1', 0.0, 1.6 );
	this.creature.addMarker('cry_2', 1.7, 1.3 );
	this.creature.addMarker('cry_3', 3.1, 1.3 );
	this.creature.addMarker('cry_4', 4.5, 1.7 );
	this.creature.addMarker('hurt_1', 6.3, 1.4 );
	this.creature.addMarker('hurt_2', 7.8, 1.4 );
	this.creature.addMarker('hurt_3', 9.3, 1.4 );
	this.creature.addMarker('death_1', 10.8, 1.1 );
	this.creature.addMarker('death_2', 12.0, 1.3 );
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
		var s = ['cry_1', 'cry_2', 'cry_3', 'hurt_1', 'hurt_2', 'hurt_3', 'death'].choice()
		this.rat.play( s );
	}

	var p = new Phaser.Point( 0, 0 );

	var frame = this.sprite.animations.currentFrame.index % 6;
	this.stepCooldown -= 1;

	if ( this.state == 'walk' && ( frame == 2 || frame == 4 ) && this.stepCooldown <= 0 )
	{
		var s = ['1', '2', '3', '4'].choice()
		this.footsteps.play( s );
		this.stepCooldown = 10;
	}

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

	p.setMagnitude( this.speed );
	this.sprite.body.velocity.x += ( p.x - this.sprite.body.velocity.x ) / 3;
	this.sprite.body.velocity.y += ( p.y - this.sprite.body.velocity.y ) / 3;

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
	}
};
