
// Constructor
function Player ()
{
}

Player.prototype.create = function ( x, y, group )
{
	this.health = 100;
	this.speed = 80;

	this.wings = group.create( x, y, 'wings', 0 );
	this.wings.anchor.set( 0.5 );
	this.wings.visible = false;

	this.sprite = group.create( x, y, 'player', 0 );
	DungeonGame.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	//this.sprite.body.setSize( 10, 10, 3+8, 5+8 );
	this.sprite.body.setSize( 10, 8, 3, 5 );
	//this.sprite.body.setCircle( 6, 2, 4 );

	var weapon = [1,3,4,5,6,14,15].choice();
	DungeonGame.Gui.itemSlot1.frame = weapon;
	DungeonGame.Gui.itemSlot2.visible = false;

	this.sword = group.create( x, y+2, 'items', weapon );
	DungeonGame.game.physics.arcade.enable( this.sword, Phaser.Physics.ARCADE );
	this.sword.anchor.set( 0.5 );
	this.sword.body.setSize( 0, 0, 0, 0 );
	this.sword.exists = false;
	this.sword.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
	this.sword.scale.x *= -1;

	this.swing = group.create( x, y+2, 'swing', 0 );
	DungeonGame.game.physics.arcade.enable( this.swing, Phaser.Physics.ARCADE );
	this.swing.anchor.set( 0.5 );
	this.swing.exists = false;
	this.swing.body.setSize( 16, 28, 5, 10 );
	this.swingTimer = 0;

	this.damageState = 'idle';
	this.damageTimer = 0;
	this.damageStepActive = false;

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
	this.keys.h = DungeonGame.game.input.keyboard.addKey( Phaser.Keyboard.H );

	this.gridPos = new Phaser.Point( x, y );
	this.prevGridPos = new Phaser.Point( x, y );
};

Player.prototype.setupAnimation = function ()
{
	var len = 6;
	var idle = [0,0,0,0,0,0,0,0,0,0,0,0,0,1];
	var walk = [3,4,5,2];
	var hurt = [1];
	this.sprite.animations.add( 'idle_right', idle, 8, true );
	this.sprite.animations.add( 'walk_right', walk, 10, true );
	this.sprite.animations.add( 'hurt_right', hurt, 8, false );
	idle = idle.map( n => n + len );
	walk = walk.map( n => n + len );
	hurt = hurt.map( n => n + len );
	this.sprite.animations.add( 'idle_down', idle, 8, true );
	this.sprite.animations.add( 'walk_down', walk, 10, true );
	this.sprite.animations.add( 'hurt_down', hurt, 8, false );
	idle = idle.map( n => n + len );
	walk = walk.map( n => n + len );
	hurt = hurt.map( n => n + len );
	this.sprite.animations.add( 'idle_left', idle, 8, true );
	this.sprite.animations.add( 'walk_left', walk, 10, true );
	this.sprite.animations.add( 'hurt_left', hurt, 8, false );
	idle = idle.map( n => n + len );
	walk = walk.map( n => n + len );
	hurt = hurt.map( n => n + len );
	this.sprite.animations.add( 'idle_up', idle, 8, true );
	this.sprite.animations.add( 'walk_up', walk, 10, true );
	this.sprite.animations.add( 'hurt_up', hurt, 8, false );

	this.state = 'idle';
	this.direction = 'down';
	this.sprite.animations.play( 'idle_down' );

	this.swing.animations.add( 'attack', [1,1,1,2,3], 60, false );
	this.swing.animations.currentAnim.onComplete.add(function () {
		this.swing.kill();
		this.sword.kill();
	}, this);
	//this.swing.animations.currentAnim.killOnComplete = true;

	this.wings.animations.add( 'fly', [0,1], 8, true );
	this.wings.animations.play( 'fly' );

	this.stepCooldown = 0;
};

Player.prototype.setAnimation = function ( newState, newDirection )
{
	if ( this.damageState == 'dead' )
		return;
	if ( this.damageState == 'hurt' )
		newState = 'hurt';

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
	if ( this.keys.space.justDown && !DungeonGame.cinematic )
	{
		this.swing.reset(
			Math.round(this.sprite.body.center.x + this.sprite.body.velocity.x/60),
			Math.round(this.sprite.body.center.y + this.sprite.body.velocity.y/60)
		);
		this.sword.reset(
			Math.round(this.sprite.body.center.x + this.sprite.body.velocity.x/60),
			Math.round(this.sprite.body.center.y + this.sprite.body.velocity.y/60)
		);
		this.swing.animations.play( 'attack' );
		this.swingTimer = 0;

		this.swing.scale.y *= -1;
		this.sword.scale.y = -this.swing.scale.y;
		if ( this.direction == 'right' )
		{
			this.swing.angle = 0;
			this.swing.body.setSize( 16, 28, 28, 10 );
		}
		else if ( this.direction == 'down' )
		{
			this.swing.angle = 90;
			this.swing.body.setSize( 28, 16, 10, this.swing.scale.y == 1 ? 28 : 4 );
		}
		else if ( this.direction == 'left' )
		{
			this.swing.angle = 180;
			this.swing.body.setSize( 16, 28, 5, 10 );
		}
		else if ( this.direction == 'up' )
		{
			this.swing.angle = 270;
			this.swing.body.setSize( 28, 16, 10, this.swing.scale.y == 1 ? 5 : 27 );
		}
		this.sword.angle = this.swing.scale.y == 1 ? this.swing.angle - 90 : this.swing.angle + 90;
		this.sword.position.x += Math.round(14*Math.cos((this.sword.angle + this.swing.scale.y * 45) * Math.PI / 180));
		this.sword.position.y += Math.round(14*Math.sin((this.sword.angle + this.swing.scale.y * 45) * Math.PI / 180));

		DungeonGame.Audio.play( 'swing' );
	}
	if ( this.keys.space.justUp )
	{
		//this.swing.kill();
	}
	this.swing.alpha = (0.75 - this.swingTimer / 10).clamp( 0, 1 );
	this.swingTimer += 1;

	var p = new Phaser.Point( 0, 0 );

	var frame = this.sprite.animations.currentFrame.index % 6;
	this.stepCooldown -= 1;

	if ( this.state == 'walk' && ( frame == 2 || frame == 4 ) && this.stepCooldown <= 0 )
	{
		DungeonGame.Audio.play( 'footsteps' );
		this.stepCooldown = 10;
	}

	if ( !this.swing.exists && !DungeonGame.cinematic )
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

	this.wings.scale.x = 1;
	if ( this.direction == 'right' || this.direction == 'down' )
		this.wings.scale.x = -1;
	this.wings.position.x = Math.round( this.sprite.position.x + this.sprite.body.velocity.x/60 );
	this.wings.position.y = Math.round( this.sprite.position.y + this.sprite.body.velocity.y/60 ) - 1;

	this.swing.body.velocity.copyFrom( this.sprite.body.velocity );
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

	if ( this.keys.h.justDown )
	{
		this.health = Math.min( this.health + 15, 100 );
		DungeonGame.Gui.setHealth( this.health / 100, 0.0 );
	}
};

Player.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		if ( this.sprite.exists )
			DungeonGame.game.debug.body( this.sprite );
		if ( this.swing.exists )
			DungeonGame.game.debug.body( this.swing );
		if ( this.sword.exists )
			DungeonGame.game.debug.body( this.sword );
	}
};

Player.prototype.damage = function ( power, position )
{
	if ( this.damageState == 'idle' )
	{
		this.damageTimer = 0;
		this.health = Math.max( this.health - power, 0 );
		DungeonGame.Gui.setHealth( this.health / 100, 0.0 );

		// Move please
		DungeonGame.Audio.play( 'chop' );
		var p = new Phaser.Point(
			this.sprite.body.center.x - position.x,
			this.sprite.body.center.y - position.y
		).setMagnitude(400);
		this.sprite.body.velocity.add( p.x, p.y );
		this.sword.body.velocity.add( p.x, p.y );
		this.swing.body.velocity.add( p.x, p.y );

		if ( this.health <= 0 )
		{
			this.defeat();
		}
		else
		{
			this.hurt();
		}
	}
};

Player.prototype.hurt = function ()
{
	this.damageState = 'hurt';
	DungeonGame.Audio.play( 'hurt' );
	this.setAnimation( 'hurt', this.direction );

	// 1.2
	DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 0.5, this.damageOver, this );

	if ( !this.damageStepActive )
	{
		this.damageStepActive = true;
		this.damageStep();
	}
};

Player.prototype.defeat = function ()
{
	this.setAnimation( 'hurt', this.direction );
	this.damageState = 'dead';
	DungeonGame.Audio.play( 'hurt' );
	DungeonGame.cinematic = true;

	if ( !this.damageStepActive )
	{
		this.damageStepActive = true;
		this.damageStep();
	}

	DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 2.5, this.gameOver, this );
};

Player.prototype.damageStep = function ()
{
	if ( this.damageState == 'hurt' || this.damageState == 'dead' )
	{
		this.sprite.alpha = 1.5 - this.sprite.alpha; // Toggles between 1 and 0.5
		this.wings.alpha = this.sprite.alpha - 0.5;
		this.sprite.tint = this.sprite.alpha == 1.0 ? 0xff7777 : 0xffffff;

		DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 0.05, this.damageStep, this );
	}
	else
	{
		this.damageStepActive = false;
	}
};

Player.prototype.damageOver = function ()
{
	this.damageState = 'idle';
	this.sprite.alpha = 1.0;
	this.wings.alpha = 1.0;
	this.sprite.tint = 0xffffff;
};

Player.prototype.gameOver = function ()
{
	DungeonGame.Audio.play( 'death' );

	DungeonGame.Particle.createSmokeBurst( this.sprite.x, this.sprite.y );

	this.sprite.kill();
	this.wings.kill();
};
