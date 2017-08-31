
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
	this.sprite = DungeonGame.game.add.sprite( 128, 64, 'dungeon', 8*16 + 4 );
	DungeonGame.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	//this.sprite.body.setCircle( 8 );

	this.cursors = DungeonGame.game.input.keyboard.createCursorKeys();
};

Player.prototype.update = function ()
{
	this.sprite.body.velocity.x = 0;
	this.sprite.body.velocity.y = 0;
	this.speed = 100;

	if ( this.cursors.up.isDown )
	{
		this.sprite.body.velocity.y -= this.speed;
		//if ( this.cursors.up.justDown )
		//{
		//	this.sprite.body.y -= this.speed/60;
		//}
	}
	if ( this.cursors.down.isDown )
	{
		this.sprite.body.velocity.y += this.speed;
		//if ( this.cursors.up.justDown )
		//{
		//	this.sprite.body.y += this.speed/60;
		//}
	}
	if ( this.cursors.left.isDown )
	{
		this.sprite.body.velocity.x -= this.speed;
	}
	if ( this.cursors.right.isDown )
	{
		this.sprite.body.velocity.x += this.speed;
	}
};

Player.prototype.render = function ()
{
	//DungeonGame.game.debug.body( this.sprite );
};


//var Player = function () {

	//Phaser.Sprite.call(this, game, 0, 0, key);

	//this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

	//this.anchor.set(0.5);

	//this.checkWorldBounds = true;
	//this.exists = false;

	//this.tracking = false;
	//this.scaleSpeed = 0;

	//this.animations.add('idle', [0], 1, true);
	//this.animations.add('prepare', [1], 1, true);
	//this.animations.add('jump', [2], 1, true);
	//this.animations.add('fall', [3], 1, true);
	//this.animations.add('hurt', [4,5], 16, true);
	//this.state = 'idle';
	//this.timer = 0;

	//this.animations.play('idle');

	//this.hp = 10;
	//this.damageAnimation = false;

//};

//Player.prototype = Object.create(Phaser.Sprite.prototype);
//Player.prototype.constructor = Player;

/*
Player.prototype.spawn = function (x, y, angle, speed) {

	this.hp = 10;

	this.reset(x, y);
	this.scale.set(0.65);

	this.angle = angle;
	this.speed = 80;

	if (this.body.sprite.key == "gluttony") {
		this.dx = 2;
		this.dy = 1;
		this.speed = 220;
		this.scale.set(0.6);
	}

	PhaserGame.prototype.cloudBurst(this);

};

Enemy.prototype.recover = function () {
	this.damageAnimation = false;
	this.animations.play('idle');
};

Enemy.prototype.playerUpdate = function (player) {

	var angle = pointAngle(this.x, this.y, player.x, player.y);

	if (this.body.sprite.key == "gluttony") {
		if (this.body.x > game.width - this.body.width * 1.2 && this.dx > 0)
			this.dx *= -1;
		if (this.body.x < this.body.width * 0.5 && this.dx < 0)
			this.dx *= -1;
		if (this.body.y > game.height - this.body.height * 1.8 && this.dy > 0)
			this.dy *= -1;
		if (this.body.y < this.body.height * 0.1 && this.dy < 0)
			this.dy *= -1;

		this.game.physics.arcade.velocityFromAngle(pointAngle(0, 0, this.dx, this.dy), this.speed, this.body.velocity);
		this.rotation += this.dx / 40;
	}
	else if (this.body.sprite.key == "pride") {
		this.timer -= 1;

		if (this.state == "idle") {
			if (this.timer <= 0) {
				this.state = 'prepare';
				this.animations.play('prepare');
				this.timer = 10;
			}
			this.game.physics.arcade.velocityFromAngle(0, 0, this.body.velocity);
		}
	}
	else {
		this.game.physics.arcade.velocityFromAngle(angle, this.speed, this.body.velocity);
	}

};

Enemy.prototype.damage = function (power) {

	this.hp -= power;

	if (! this.damageAnimation) {
		this.damageAnimation = true;

		this.animations.play('hurt');

		game.time.events.add(Phaser.Timer.SECOND * 0.5, this.recover, this);
	}

	if (this.hp <= 0) {
		this.kill();
		PhaserGame.prototype.cloudBurst(this);
		PhaserGame.prototype.enemyBurst(this, this.body.sprite.key);
	}

};
*/