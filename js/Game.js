var DungeonGame = DungeonGame ||
{};

DungeonGame.Game = function()
{
	this.World = new World();
};

DungeonGame.Game.prototype =
{
	create: function()
	{
		this.World.create();


		this.stage.backgroundColor = '#1c1117';

		//this.map = this.game.add.tilemap('level1');

		//the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
		//this.map.addTilesetImage('tiles', 'gameTiles');

		//create layer
		//this.backgroundlayer = this.map.createLayer('backgroundLayer');
		//this.blockedLayer = this.map.createLayer('blockedLayer');

		//collision on blockedLayer
		//this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

		//resizes the game world to match the layer dimensions
		//this.backgroundlayer.resizeWorld();

		//this.createItems();
		//this.createDoors();

		//create player
		//var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer')
		//this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
		//this.game.physics.arcade.enable(this.player);

		//the camera will follow the player in the world
		//this.game.camera.follow(this.player);

		//move player with cursor keys
		//this.cursors = this.game.input.keyboard.createCursorKeys();

	},
	createItems: function()
	{
		//create items
		this.items = this.game.add.group();
		this.items.enableBody = true;
		var item;
		result = this.findObjectsByType('item', this.map, 'objectsLayer');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.items);
		}, this);
	},
	createDoors: function()
	{
		//create doors
		this.doors = this.game.add.group();
		this.doors.enableBody = true;
		result = this.findObjectsByType('door', this.map, 'objectsLayer');

		result.forEach(function(element){
			this.createFromTiledObject(element, this.doors);
		}, this);
	},

	//find objects in a Tiled layer that containt a property called "type" equal to a certain value
	findObjectsByType: function(type, map, layer)
	{
		var result = new Array();
		map.objects[layer].forEach(function(element){
			if(element.properties.type === type)
			{
				//Phaser uses top left, Tiled bottom left so we have to adjust
				//also keep in mind that the cup images are a bit smaller than the tile which is 16x16
				//so they might not be placed in the exact position as in Tiled
				element.y -= map.tileHeight;
				result.push(element);
			}
		});
		return result;
	},
	//create a sprite from an object
	createFromTiledObject: function(element, group)
	{
		var sprite = group.create(element.x, element.y, element.properties.sprite);

			//copy all properties to the sprite
			Object.keys(element.properties).forEach(function(key){
				sprite[key] = element.properties[key];
			});
	},
	update: function()
	{
		this.World.update();

		//collision
		//this.game.physics.arcade.collide(this.player, this.blockedLayer);
		//this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
		//this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);

		//player movement

		//this.player.body.velocity.x = 0;

		//if(this.cursors.up.isDown)
		//{
		//	if(this.player.body.velocity.y == 0)
		//	this.player.body.velocity.y -= 50;
		//}
		//else if(this.cursors.down.isDown)
		//{
		//	if(this.player.body.velocity.y == 0)
		//	this.player.body.velocity.y += 50;
		//}
		//else
		//{
		//	this.player.body.velocity.y = 0;
		//}
		//if(this.cursors.left.isDown)
		//{
		//	this.player.body.velocity.x -= 50;
		//}
		//else if(this.cursors.right.isDown)
		//{
		//	this.player.body.velocity.x += 50;
		//}
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