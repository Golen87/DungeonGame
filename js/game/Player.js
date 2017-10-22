
// Constructor
function Player ()
{
}

Player.prototype.create = function ( x, y, group )
{
	this.health = 100;
	this.speed = 80;

	this.sprite = group.create( x, y, 'player', 0 );
	DungeonGame.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	//this.sprite.body.setSize( 10, 10, 3+8, 5+8 );
	this.sprite.body.setSize( 10, 8, 3, 6 );
	//this.sprite.body.setCircle( 6, 2, 4 );

	this.items = [];
	//var weapon = [1,3,4,5,6,14,15].choice();
	this.updateItemGui();

	this.sword = group.create( x, y+2, 'items', 0 );
	if ( DungeonGame.skip ) this.sword.frame = 1;
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

	if ( DungeonGame.skip )
	{
		DungeonGame.cinematic = false;
	}
	else
	{
		this.sprite.visible = false;
		DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 0.1, function() {
			DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 1.0, function() {
				DungeonGame.Particle.createSmokeBurst( this.sprite.x, this.sprite.y );
				DungeonGame.Audio.play( 'monsterroom-spawn' );
				this.sprite.visible = true;
			}, this );
			DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 2.1, function() {
				DungeonGame.cinematic = false;
			}, this );
		}, this );
	}
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

	this.swing.animations.add( 'attack', [1,1,1,1,2,3], 60, false );
	this.swing.animations.currentAnim.onComplete.add(function () {
		this.swing.kill();
		this.sword.kill();
	}, this);
	//this.swing.animations.currentAnim.killOnComplete = true;

	this.stepCooldown = 0;
};

Player.prototype.setAnimation = function ( newState, newDirection )
{
	if ( this.damageState == 'dead' )
		return;

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
	if ( ( this.keys.space.justDown || DungeonGame.input.space ) && !DungeonGame.cinematic )
	{
		if ( this.sword.frame > 0 )
		this.swingSword();
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
		if ( this.keys.up.isDown || this.keys.w.isDown || DungeonGame.input.up )
			p.y -= 1;
		if ( this.keys.down.isDown || this.keys.s.isDown || DungeonGame.input.down )
			p.y += 1;
		if ( this.keys.left.isDown || this.keys.a.isDown || DungeonGame.input.left )
			p.x -= 1;
		if ( this.keys.right.isDown || this.keys.d.isDown || DungeonGame.input.right )
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
		this.health = Math.min( this.health + 100, 100 );
		DungeonGame.Gui.setHealth( this.health / 100, 0.0 );
	}
};

Player.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		if ( this.sprite.exists )
			DungeonGame.game.debug.body( this.sprite, RED );
		if ( this.swing.exists )
			DungeonGame.game.debug.body( this.swing, RED );
		if ( this.sword.exists )
			DungeonGame.game.debug.body( this.sword, RED );
	}
};


Player.prototype.swingSword = function ()
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
		this.swing.body.setSize( 15, 28, 28, 10 );
	}
	else if ( this.direction == 'down' )
	{
		this.swing.angle = 90;
		this.swing.body.setSize( 28, 15, 10, this.swing.scale.y == 1 ? 28 : 4 );
	}
	else if ( this.direction == 'left' )
	{
		this.swing.angle = 180;
		this.swing.body.setSize( 15, 28, 5, 10 );
	}
	else if ( this.direction == 'up' )
	{
		this.swing.angle = 270;
		this.swing.body.setSize( 28, 15, 10, this.swing.scale.y == 1 ? 5 : 27 );
	}
	this.sword.angle = this.swing.scale.y == 1 ? this.swing.angle - 90 : this.swing.angle + 90;
	this.sword.position.x += Math.round(14*Math.cos((this.sword.angle + this.swing.scale.y * 45) * Math.PI / 180));
	this.sword.position.y += Math.round(14*Math.sin((this.sword.angle + this.swing.scale.y * 45) * Math.PI / 180));

	DungeonGame.Audio.play( 'swing' );
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
		DungeonGame.World.cameraShake( power / 5 );

		// Knockback
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

	DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 1.2, this.damageOver, this );

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
	DungeonGame.World.cameraShake( 16 );
	DungeonGame.cinematic = true;

	if ( !this.damageStepActive )
	{
		this.damageStepActive = true;
		this.damageStep();
	}

	DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 1.0, function() {
		DungeonGame.World.cameraShake( 8 );
	}, this );
	DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 2.0, function() {
		DungeonGame.World.cameraShake( 4 );
	}, this );
	DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 2.5, this.gameOver, this );
};

Player.prototype.damageStep = function ()
{
	if ( this.damageState == 'hurt' || this.damageState == 'dead' )
	{
		this.sprite.alpha = 1.5 - this.sprite.alpha; // Toggles between 1 and 0.5
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
	this.sprite.tint = 0xffffff;
};

Player.prototype.gameOver = function ()
{
	DungeonGame.Audio.play( 'death' );

	DungeonGame.Particle.createSmokeBurst( this.sprite.x, this.sprite.y );

	this.sprite.kill();

	DungeonGame.game.time.events.add( Phaser.Timer.SECOND * 1.0, function() {DungeonGame.Gui.showGameOver();}, this );
};


Player.prototype.giveItem = function ( itemIndex )
{
	if ( itemIndex < 16 )
	{
		this.items[0] = itemIndex;
		this.sword.frame = itemIndex;
	}
	else
	{
		this.items.push( itemIndex );
	}

	this.updateItemGui();

	this.health = Math.min( this.health + 30, 100 );
	DungeonGame.Gui.setHealth( this.health / 100, 0.0 );
};

Player.prototype.takeItem = function ( itemIndex )
{
	if ( this.items.indexOf( itemIndex ) != -1 )
	{
		this.items.splice( this.items.indexOf( itemIndex ), 1 );
		this.updateItemGui();
	}
};

Player.prototype.hasItem = function ( itemIndex )
{
	return this.items.indexOf( itemIndex ) != -1;
};

Player.prototype.updateItemGui = function ()
{
	if ( this.items.length >= 1 )
	{
		DungeonGame.Gui.itemSlot[0].visible = true;
		DungeonGame.Gui.itemSlot[0].frame = this.items[0];
		DungeonGame.Gui.itemSlot[0].label.text = "";
	}
	else
	{
		DungeonGame.Gui.itemSlot[0].visible = false;
		DungeonGame.Gui.itemSlot[0].label.text = "";
	}

	var keycount = this.items.count( 69 );
	if ( keycount >= 1 )
	{
		DungeonGame.Gui.itemSlot[1].visible = true;
		DungeonGame.Gui.itemSlot[1].frame = 69;
		DungeonGame.Gui.itemSlot[1].label.text = keycount > 1 ? keycount.toString() : " ";
	}
	else
	{
		DungeonGame.Gui.itemSlot[1].visible = false;
		DungeonGame.Gui.itemSlot[1].label.text = "";
	}

	// Make this more dynamic once there's an actual inventory menu.
	/*
	for ( var i = 0; i < DungeonGame.Gui.invSize; i++ )
	{
		DungeonGame.Gui.itemSlot[i].visible = false;

		if ( this.items.length > i )
		{
			DungeonGame.Gui.itemSlot[i].visible = true;
			DungeonGame.Gui.itemSlot[i].frame = this.items[i];
			var count = this.items.count( this.items[i] );
			DungeonGame.Gui.itemSlot[i].label.text = count > 1 ? count.toString() : " ";
		}
	}
	*/
};
