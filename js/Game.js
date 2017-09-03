
var DungeonGame = DungeonGame || {};

DungeonGame.Game = function()
{
	this.World = new World();
};

DungeonGame.Game.prototype =
{
	create: function()
	{
		//  This group will hold the main player + all the tree sprites to depth sort against
		this.World.create();


		this.stage.backgroundColor = '#1c1117';

		this.createItems();
		this.createDoors();

		this.debugToggle = DungeonGame.game.input.keyboard.addKey(Phaser.Keyboard.Q);

		//this.game.camera.flash(0xff0000, 500);
	},
	createItems: function()
	{
		// Collectable items
		this.items = this.game.add.group();
		this.items.enableBody = true;
	},
	createDoors: function()
	{
		// Perhaps use for pathways between rooms?
		this.doors = this.game.add.group();
		this.doors.enableBody = true;
	},

	update: function()
	{
		this.World.update();

		if (this.debugToggle.justDown)
			DungeonGame.debug = !DungeonGame.debug;
	},
	collect: function(player, collectable)
	{
		console.log('yummy!');

		//remove sprite
		collectable.destroy();
	},
	enterDoor: function(player, door)
	{
		console.log('entering door that will take you to '+door.targetTilemap+' on x:'+door.targetX+' and y:'+door.targetY);
	},
	render: function()
	{
		this.World.render();
	},
};


/*



var sprite;
var sprite2;
var cursors;

function create()
{
	game.physics.startSystem( Phaser.Physics.ARCADE );
	game.world.resize(3000, 600);
	game.world.setBounds(-2000, -2000, 4000, 4000);

	game.stage.backgroundColor = '#1c1117';

	sprite = game.add.sprite( 100, 200, 'dungeon', 2 );
	sprite.anchor.set( 0.5 );
	sprite.smoothed = false;

	game.physics.enable( sprite, Phaser.Physics.ARCADE );
	sprite.body.immovable = true;

	sprite2 = game.add.sprite( 200, 200, 'dungeon', 3 );
	game.physics.enable( sprite2, Phaser.Physics.ARCADE );

	game.add.tween( sprite.scale ).to(
		{ x: 3, y: 3 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true );


	//sprite3 = game.add.sprite( 300, 200, 'atari' );
	//sprite3.name = 'atari';
	//game.physics.enable( sprite3, Phaser.Physics.ARCADE );
	//sprite3.body.collideWorldBounds = true;
	//sprite3.body.checkCollision.up = false;
	//sprite3.body.checkCollision.down = false;
	//sprite3.body.immovable = true;


	game.input.onDown.add( function()
		{
			console.log( "Hello world" )
		}, this );

	cursors = game.input.keyboard.createCursorKeys();

}

function update()
{
	world.update();

	sprite2.body.velocity.x = -200;

	game.physics.arcade.collide( sprite, sprite2 );

	//if( this.game.input.keyboard.isDown( Phaser.Keyboard.UP ) )
	//{
	//	game.camera.y -= 1;
	//}

	//group.sort('y', Phaser.Group.SORT_ASCENDING);
}

function render()
{
	world.render();

	//game.debug.body( sprite );
	//game.debug.body( sprite2 );

}
*/