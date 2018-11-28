
// Constructor
function RoomManager ( decoGroup )
{
	this.worldName = 'floorMap';
	// floorMap, wallMap, entityMap

	this.width = DungeonGame.game.cache.getImage( this.worldName ).width;
	this.height = DungeonGame.game.cache.getImage( this.worldName ).height;

	this.tileMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.makePixelMap( 'floorMap' );
	this.makePixelMap( 'wallMap' );
	this.makePixelMap( 'entityMap' );


	this.background = DungeonGame.game.add.group();
	this.foreground = DungeonGame.game.add.group();
	// Testing bitmap
	this.tilesSpriteTemp = this.background.create( 0, 0, 'dungeon', 0, false );
	this.tilesBmdBg = DungeonGame.game.make.bitmapData( 16*this.width, 16*this.height );
	this.tilesBmdBgAnchor = this.background.create( 0, 0, this.tilesBmdBg );
	this.tilesBmdFg = DungeonGame.game.make.bitmapData( 16*this.width, 16*this.height );
	this.tilesBmdFgAnchor = this.foreground.create( 0, 0, this.tilesBmdFg );


	this.physicsMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.fgMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.bgMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.entityMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.enemyMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.decoMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.makeSpriteMap();

	this.activeMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );

	//this.background = DungeonGame.game.add.group();
	//this.background.createMultiple( 2*ROOM_WIDTH*ROOM_HEIGHT, 'dungeon', 0, false );
	//this.foreground = DungeonGame.game.add.group();
	//this.foreground.createMultiple( 3*ROOM_WIDTH*ROOM_HEIGHT, 'dungeon', 0, false );
	this.physics = DungeonGame.game.add.group();
	this.physics.createMultiple( ROOM_WIDTH*ROOM_HEIGHT / 2, null, 0, false );
	this.boundaries = DungeonGame.game.add.group();
	this.boundaries.createMultiple( 4, null, 0, false );

	this.decorations = Array( 32 );
	for ( var i = 0; i < this.decorations.length; i++ )
	{
		this.decorations[i] = decoGroup.create( 0, 0, 'dungeon', 0, false );
		this.decorations[i].anchor.set( 0.0, 0.0 );
	}
	
	for ( var i = 0; i < this.physics.children.length; i++ )
	{
		DungeonGame.game.physics.enable( this.physics.children[i], Phaser.Physics.ARCADE );
	}

	for ( var i = 0; i < this.boundaries.children.length; i++ )
	{
		DungeonGame.game.physics.enable( this.boundaries.children[i], Phaser.Physics.ARCADE );
	}
}


RoomManager.prototype.test = function ( x, y )
{
	var index = TILES.map(function(e) { return e.name; }).indexOf( Tiles.Wall.name );
	if ( this.tileMap[y][x] == null )
		this.tileMap[y][x] = [];

	if ( this.tileMap[y][x].contains(index) )
	{
		this.tileMap[y][x].splice(this.tileMap[y][x].indexOf( index ), 1);
	}
	else
	{
		this.tileMap[y][x].push( index );
	}
	//this.tileMap[y][x].push( index );

	for ( var i = 0; i < this.physics.children.length; i++ )
	{
		this.physics.children[i].kill();
	}
	for ( var i = 0; i < this.boundaries.children.length; i++ )
	{
		this.boundaries.children[i].kill();
	}
	/*
	for ( var i = 0; i < this.background.children.length; i++ )
	{
		var s = this.background.children[i];
		if ( s.alive )
		{
			s.kill();
			this.activeMap[s.position.y/16][s.position.x/16] = null;
		}
	}
	for ( var i = 0; i < this.foreground.children.length; i++ )
	{
		var s = this.foreground.children[i];
		if ( s.alive )
		{
			s.kill();
			this.activeMap[s.position.y/16][s.position.x/16] = null;
		}
	}
	*/
	for ( var i = 0; i < this.decorations.children.length; i++ )
	{
		var s = this.decorations.children[i];
		if ( s.alive )
		{
			s.kill();
			this.activeMap[s.position.y/16][s.position.x/16] = null;
		}
	}

	this.physicsMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.fgMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.bgMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.entityMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.enemyMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.decoMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );

	this.tilesBmdBg.clear();
	this.tilesBmdFg.clear();

	this.makeSpriteMap();
}

RoomManager.prototype.makePixelMap = function ( worldFile )
{
	var bmd = DungeonGame.game.make.bitmapData( this.width, this.height );
	bmd.draw( DungeonGame.game.cache.getImage( worldFile ), 0, 0 );
	bmd.update();

	for ( var y = 0; y < this.height; y++ )
	{
		for ( var x = 0; x < this.width; x++ )
		{
			var hex = bmd.getPixel32( x, y );
			var r = ( hex >>  0 ) & 0xFF;
			var g = ( hex >>  8 ) & 0xFF;
			var b = ( hex >> 16 ) & 0xFF;
			var a = ( hex >> 24 ) & 0xFF;
			var color = [r, g, b].toString();

			if ( a == 0 )
				continue;

			var tile = getTileByColor( color );

			if ( tile )
			{
				if ( this.tileMap[y][x] == null )
					this.tileMap[y][x] = [];
				this.tileMap[y][x].push( tile );
			}
			else
			{
				console.error( 'Unknown color: {0}'.format( color ) );
			}
		}
	}
}


RoomManager.prototype.addTile = function ( x, y, spos, blendMode = 0 )
{
	if ( spos.length != 2 || !isInt( spos[0] ) )
		spos = Phaser.ArrayUtils.getRandomItem( spos );

	this.tilesSpriteTemp.frame = sposToIndex(spos);
	this.tilesBmd.draw(this.tilesSpriteTemp, 16*x, 16*y, 16, 16, bitmapBlendModes[blendMode], true);
};

RoomManager.prototype.addForeground = function ( x, y, spos, blendMode = 0 )
{
	if ( spos.length != 2 || !isInt( spos[0] ) )
		spos = Phaser.ArrayUtils.getRandomItem( spos );
	var index = sposToIndex(spos);

	if ( this.fgMap[y][x] == null )
		this.fgMap[y][x] = [];
	this.fgMap[y][x].push( index );

	this.tilesSpriteTemp.frame = index;
	this.tilesBmdFg.draw( this.tilesSpriteTemp, 16*x, 16*y, 16, 16, bitmapBlendModes[blendMode], true );
};

RoomManager.prototype.addBackground = function ( x, y, spos, blendMode = 0 )
{
	if ( spos.length != 2 || !isInt( spos[0] ) )
		spos = Phaser.ArrayUtils.getRandomItem( spos );
	var index = sposToIndex(spos);

	if ( this.bgMap[y][x] == null )
		this.bgMap[y][x] = [];
	this.bgMap[y][x].push( [index, blendMode] );

	this.tilesSpriteTemp.frame = index;
	this.tilesBmdBg.draw( this.tilesSpriteTemp, 16*x, 16*y, 16, 16, bitmapBlendModes[blendMode], true );
};

RoomManager.prototype.addFloor = function ( x, y, spos, blendMode = 0 )
{
	if ( spos.length != 2 || !isInt( spos[0] ) )
		spos = Phaser.ArrayUtils.getRandomItem( spos );
	var index = sposToIndex(spos);

	if ( this.bgMap[y][x] == null )
		this.bgMap[y][x] = [];
	this.bgMap[y][x].unshift( [index, blendMode] );

	//this.tilesSpriteTemp.frame = index;
	//this.tilesBmd.draw(this.tilesSpriteTemp, 16*x, 16*y, 16, 16, null, true);
};

RoomManager.prototype.addPhysics = function ( x, y )
{
	this.physicsMap[y][x] = true;
};

RoomManager.prototype.addEntity = function ( x, y, tile )
{
	if ( !this.entityMap[y][x] )
		this.entityMap[y][x] = [];
	this.entityMap[y][x].push( tile );
};

RoomManager.prototype.addEnemy = function ( x, y, tile )
{
	if ( !this.enemyMap[y][x] )
		this.enemyMap[y][x] = [];
	this.enemyMap[y][x] = tile;
};

RoomManager.prototype.addDecoration = function ( x, y, spos )
{
	if ( spos.length != 2 || !isInt( spos[0] ) )
		spos = Phaser.ArrayUtils.getRandomItem( spos );
	var index = sposToIndex(spos);

	if ( this.decoMap[y][x] == null )
		this.decoMap[y][x] = [];
	this.decoMap[y][x].push( index );
};


RoomManager.prototype.isWithin = function ( x, y )
{
	return ( x >= 0 ) && ( y >= 0 ) && ( x < this.width ) && ( y < this.height );
};

RoomManager.prototype.getTiles = function ( x, y )
{
	if ( this.isWithin( x, y ) )
	{
		return this.tileMap[y][x];
	}
	return [];
};

RoomManager.prototype.getTileType = function ( x, y )
{
	var result = [];
	if ( this.isWithin( x, y ) )
	{
		if (this.tileMap[y][x]) {
			for ( var i=0; i<this.tileMap[y][x].length; i++ )
			{
				result.push( this.tileMap[y][x][i].type );
			}
		}
	}
	return result;
};

RoomManager.prototype.checkTile = function ( x, y, tile )
{
	var tiles = this.getTiles( x, y );
	if (tiles)
	{
		return tiles.contains( tile );
	}
	return false;
};

RoomManager.prototype.isWall = function ( x, y, allowVoid=false )
{
	var typeList = this.getTileType( x, y );
	if ( allowVoid && typeList.length == 0 )
	{
		return true;
	}
	return ( typeList.contains(TileTypes.Wall) );
};

RoomManager.prototype.isFloor = function ( x, y )
{
	var typeList = this.getTileType( x, y );
	return !this.isWall(x,y) && typeList.contains(TileTypes.Floor);
	//return ( typeList == TileTypes.Floor || typeList == TileTypes.Entity || typeList == TileTypes.Enemy );
};

RoomManager.prototype.isEntity = function ( x, y )
{
	var typeList = this.getTileType( x, y );
	return ( typeList.contains(TileTypes.Entity) );
};

RoomManager.prototype.isEnemy = function ( x, y )
{
	var typeList = this.getTileType( x, y );
	return ( typeList.contains(TileTypes.Enemy) );
};


RoomManager.prototype.makeSpriteMap = function ()
{
	for ( var y = 0; y < this.height; y++ )
	{
		for ( var x = 0; x < this.width; x++ )
		{
			// Add void
			if ( this.checkTile( x, y, Tiles.Water ) )
			{
				this.tilesBmdBg.rect( 16*x, 16*y+4, 16, 16, '#5793b577' ); // 33CCDD55
				if ( this.isFloor( x, y-1 ) )
				{
					//this.addBackground( x, y, Tiles.Wall.spos );
					this.addBackground( x, y, Tiles.WaterDithering.spos[0] );
					this.addBackground( x, y, Tiles.Water.spos[0] );
				}
				else if ( this.isFloor( x, y-2 ) )
				{
					this.addBackground( x, y, Tiles.WaterDithering.spos[1] );
					this.addBackground( x, y, Tiles.Water.spos[1] );
				}
				else if ( this.isFloor( x, y-3 ) )
				{
					this.addBackground( x, y, Tiles.WaterDithering.spos[2] );
				}
				//if ( !this.isFloor( x, y-1 ) && !this.isWall( x, y-1 ) && this.isFloor( x, y-2 ) )
				//	this.addBackground( x, y, Tiles.Water.spos[2] );

				//33AADD44
			}

			// Add floor
			if ( this.isFloor( x, y ) || this.isWall( x, y ) )
			{
				//this.tilesBmdBg.rect( 16*x-1, 16*y+3, 18, 18, '#FF0000FF' );
				this.addBackground( x, y, Tiles.Floor.spos );
			}

			// Add floor indent
			if ( this.checkTile( x, y, Tiles.Indent ) )
			{
				this.addBackground( x, y, Tiles.Indent.spos );
			}

			// Add floor rubble
			if ( this.checkTile( x, y, Tiles.Rubble ) )
			{
				var neighbours = 0;
				neighbours += 8 * this.checkTile( x, y-1, Tiles.Rubble );
				neighbours += 4 * this.checkTile( x+1, y, Tiles.Rubble );
				neighbours += 2 * this.checkTile( x, y+1, Tiles.Rubble );
				neighbours += 1 * this.checkTile( x-1, y, Tiles.Rubble );
				this.addBackground( x, y, Tiles.Rubble.spos[neighbours] );
			}

			// Add wall shadow on floor
			if ( this.isFloor( x, y ) && this.isWall( x, y-1 ) && this.isWall( x, y-2 ) )
			{
				this.addBackground( x, y, Tiles.Floorshade.spos, Phaser.blendModes.SOFT_LIGHT );
			}

			// Add wall
			if ( this.isWall( x, y ) )
			{
				this.addPhysics( x, y );
			}

			// Add wall
			if ( this.isWall( x, y ) )
			{
				this.addPhysics( x, y );

				// Add front facing wall
				if ( this.isFloor( x, y+1 ) && this.isWall( x, y-1 ) )
				{
					if ( this.checkTile( x, y, Tiles.Spiral ) )
					{
						this.addBackground( x, y, Tiles.Spiral.spos );
					}
					// ... more wall types
					else
					{
						// Default to regular wall
						this.addBackground( x, y, Tiles.Wall.spos );
					}

					// Add wall edge shadow
					if ( this.isFloor( x-1, y ) || ( this.isWall( x-1, y+1 ) ) )
					{
						this.addBackground( x, y, Tiles.Edgeshade_Left.spos, Phaser.blendModes.SOFT_LIGHT );
					}
					if ( this.isFloor( x+1, y ) || ( this.isWall( x+1, y+1 ) ) )
					{
						this.addBackground( x, y, Tiles.Edgeshade_Right.spos, Phaser.blendModes.SOFT_LIGHT );
					}
				}

				// Ceiling
				if ( !this.isFloor( x, y+1 ) )
				{
					// Out of bounds background
					this.addForeground( x, y, Tiles.Ceiling.spos );

					// Edges
					if ( this.isFloor( x-1, y ) || this.isFloor( x-1, y+1 ) )
					{
						this.addForeground( x, y, Tiles.Top_W.spos );
					}
					if ( this.isFloor( x+1, y ) || this.isFloor( x+1, y+1 ) )
					{
						this.addForeground( x, y, Tiles.Top_E.spos );
					}
					if ( this.isFloor( x, y-1 ) )
					{
						this.addForeground( x, y, Tiles.Top_N.spos );
					}
					if ( this.isFloor( x, y+2 ) )
					{
						this.addForeground( x, y, Tiles.Top_S.spos );
					}

					// Floor corners
					if ( ( this.isFloor( x-1, y+1 ) || this.isFloor( x-1, y ) ) && this.isFloor( x, y+2 ) )
					{
						this.addForeground( x, y, Tiles.Top_Inv_SW.spos );
					}
					if ( ( this.isFloor( x+1, y+1 ) || this.isFloor( x+1, y ) ) && this.isFloor( x, y+2 ) )
					{
						this.addForeground( x, y, Tiles.Top_Inv_SE.spos );
					}
					if ( ( this.isFloor( x-1, y ) || this.isFloor( x-1, y+1 ) ) && this.isFloor( x, y-1 ) )
					{
						this.addForeground( x, y, Tiles.Top_Inv_NW.spos );
					}
					if ( ( this.isFloor( x+1, y ) || this.isFloor( x+1, y+1 ) ) && this.isFloor( x, y-1 ) )
					{
						this.addForeground( x, y, Tiles.Top_Inv_NE.spos );
					}

					// Void corners
					if ( this.isWall( x-1, y, true ) && this.isWall( x, y-1, true ) && this.isWall( x-1, y+1, true ) && this.isFloor( x-1, y-1 ) )
					{
						this.addForeground( x, y, Tiles.Top_NW.spos );
					}
					if ( this.isWall( x+1, y, true ) && this.isWall( x, y-1, true ) && this.isWall( x+1, y+1, true ) && this.isFloor( x+1, y-1 ) )
					{
						this.addForeground( x, y, Tiles.Top_NE.spos );
					}
					if ( this.isWall( x-1, y+1, true ) && this.isWall( x, y+2, true ) && this.isFloor( x-1, y+2 ) && this.isWall( x-1, y, true ) )
					{
						this.addForeground( x, y, Tiles.Top_SW.spos );
					}
					if ( this.isWall( x+1, y+1, true ) && this.isWall( x, y+2, true ) && this.isFloor( x+1, y+2 ) && this.isWall( x+1, y, true ) )
					{
						this.addForeground( x, y, Tiles.Top_SE.spos );
					}
				}
			}

			// Add pillar decoration
			const yCenter = 1;
			for ( var dy = 0; dy <= 2; dy++ )
			{
				if ( ( this.isFloor( x, y+0-dy ) && this.isWall( x, y+1-dy ) && this.isFloor( x, y+2-dy ) ) || this.checkTile( x, y-dy+yCenter, Tiles.Pillar ) )
				{
					if ( dy == 0 )
						this.addForeground( x, y, Tiles.Pillar.spos[dy] );
					else if ( dy == 1 )
						this.addDecoration( x, y, Tiles.Pillar.spos[dy] );
					else if ( dy == 2 )
						this.addBackground( x, y, Tiles.Pillar.spos[dy] );
				}
			}

			for ( var key in Tiles )
			{
				var tile = Tiles[key];
				if ( tile.type == TileTypes.Entity && this.checkTile( x, y, tile ) )
				{
					if ( tile == Tiles.Torch )
					{
						if ( this.isFloor( x, y+1 ) )
							this.addEntity( x, y, Tiles.Torch );
						else
							this.addEntity( x, y, Tiles.Torch_Hidden );
					}
					else
						this.addEntity( x, y, tile );
				}
				if ( tile.type == TileTypes.Enemy && this.checkTile( x, y, tile ) )
				{
					this.addEnemy( x, y, tile );
				}
			}
		}
	}
};

RoomManager.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		this.physics.forEach( function ( member ) {
			if ( member.exists )
			{
				DungeonGame.game.debug.body( member, GREEN );
			}
		}, this );

		this.boundaries.forEach( function ( member ) {
			if ( member.exists )
			{
				DungeonGame.game.debug.body( member, CYAN );
			}
		}, this );
	}
};


RoomManager.prototype.isInView = function ( x, y )
{
	// Will erase borders, which can be seen if moving to another room while camera shakes.
	return (
		x >= DungeonGame.game.camera.x - 16 - 16 &&
		y >= DungeonGame.game.camera.y - 16 - 16 &&
		x < DungeonGame.game.camera.x + 16 * ROOM_WIDTH + 16 &&
		y < DungeonGame.game.camera.y + 16 * ROOM_HEIGHT + 16
	);
};

RoomManager.prototype.clearOutOfView = function ( clearPhysics=false )
{
	if ( clearPhysics )
	{
		for ( var i = 0; i < this.physics.children.length; i++ )
		{
			this.physics.children[i].kill();
		}
		for ( var i = 0; i < this.boundaries.children.length; i++ )
		{
			this.boundaries.children[i].kill();
		}
	}
	/*
	for ( var i = 0; i < this.background.children.length; i++ )
	{
		var s = this.background.children[i];
		if ( s.alive && !this.isInView( s.position.x, s.position.y ) )
		{
			s.kill();
			this.activeMap[s.position.y/16][s.position.x/16] = null;
		}
	}
	for ( var i = 0; i < this.foreground.children.length; i++ )
	{
		var s = this.foreground.children[i];
		if ( s.alive && !this.isInView( s.position.x, s.position.y ) )
		{
			s.kill();
			this.activeMap[s.position.y/16][s.position.x/16] = null;
		}
	}
	*/
	for ( var i = 0; i < this.decorations.length; i++ )
	{
		var s = this.decorations[i];
		if ( s.alive && !this.isInView( s.position.x, s.position.y ) )
		{
			s.kill();
			this.activeMap[s.position.y/16][s.position.x/16] = null;
		}
	}
	//console.time('someFunction');
	//console.timeEnd('someFunction');
};

RoomManager.prototype.getFirstDeadDeco = function ()
{
	for ( var i = 0; i < this.decorations.length; i++ )
	{
		if ( !this.decorations[i].exists )
		{
			return i;
		}
	}
	return -1;
};

RoomManager.prototype.loadRoom = function ( room_x, room_y )
{
	var offset_x = room_x * ROOM_WIDTH;
	var offset_y = room_y * ROOM_HEIGHT;

	this.clearOutOfView( true );

	this.createRoomBorders( offset_x, offset_y );

	for ( var y = offset_y; y < offset_y + ROOM_HEIGHT; y++ )
	{
		for ( var x = offset_x; x < offset_x + ROOM_WIDTH; x++ )
		{
			if ( this.physicsMap[y][x] )
			{
				if ( !( this.isWithin( x, y-1 ) && this.physicsMap[y-1][x] && y != offset_y ) )
				{
					var s = this.physics.getFirstDead();
					if ( s )
					{
						s.reset( 16*x, 16*y );
						s.body.setSize( 16, 16 );
						s.renderable = false;
						s.body.immovable = true;
						s.body.moves = false;

						var i = 1;
						while ( y+i < offset_y + ROOM_HEIGHT && this.isWithin( x, y+i ) && this.physicsMap[y+i][x] ) {
							s.body.setSize( 16, 16*(i+1) );
							i += 1;
						}
					}
					else
					{
						console.warn( "Out of Physics resources!" );
					}
				}
			}
		}
	}

	for ( var y = offset_y-1; y < offset_y + ROOM_HEIGHT+1; y++ )
	{
		for ( var x = offset_x-1; x < offset_x + ROOM_WIDTH+1; x++ )
		{
			if ( this.isWithin( x, y ) && !this.activeMap[y][x] )
			{
	
				/*
				if ( this.bgMap[y][x] )
				{
					for ( var i = 0; i < this.bgMap[y][x].length; i++ )
					{
						var s = this.background.getFirstDead();
						if ( s )
						{
							this.activeMap[y][x] = true;
							s.frame = this.bgMap[y][x][i][0];
							//s.blendMode = this.bgMap[y][x][i][1];
							s.reset( 16*x, 16*y );
						}
						else
						{
							console.warn( "Out of Background resources!" );
						}
					}
				}

				if ( this.fgMap[y][x] )
				{
					for ( var i = 0; i < this.fgMap[y][x].length; i++ )
					{
						var s = this.foreground.getFirstDead();
						if ( s )
						{
							this.activeMap[y][x] = true;
							s.frame = this.fgMap[y][x][i];
							s.reset( 16*x, 16*y );
						}
						else
						{
							console.warn( "Out of Foreground resources!" );
						}
					}
				}
				*/

				if ( this.decoMap[y][x] )
				{
					for ( var i = 0; i < this.decoMap[y][x].length; i++ )
					{
						var index = this.getFirstDeadDeco();
						if ( index != -1 )
						{
							this.activeMap[y][x] = true;
							this.decorations[index].frame = this.decoMap[y][x][i];
							this.decorations[index].reset( 16*x, 16*y );
						}
						else
						{
							console.warn( "Out of Decoration resources!" );
						}
					}
				}

			}
		}
	}
};

RoomManager.prototype.createRoomBorders = function ( offset_x, offset_y )
{
	var s = this.boundaries.children[0];
	s.reset( 16*offset_x, 16*offset_y );
	s.body.setSize( 16*ROOM_WIDTH, 16 );

	var s = this.boundaries.children[1];
	s.reset( 16*offset_x, 16*offset_y );
	s.body.setSize( 16, 16*ROOM_HEIGHT );

	var s = this.boundaries.children[2];
	s.reset( 16*offset_x, 16*offset_y + 16*(ROOM_HEIGHT-1) );
	s.body.setSize( 16*ROOM_WIDTH, 16 );

	var s = this.boundaries.children[3];
	s.reset( 16*offset_x + 16*(ROOM_WIDTH-1), 16*offset_y );
	s.body.setSize( 16, 16*ROOM_HEIGHT );

	for ( var i = 0; i < 4; i++ )
	{
		var s = this.boundaries.children[i];
		s.renderable = false;
		s.body.immovable = true;
		s.body.moves = false;
	}
};

RoomManager.prototype.checkPhysicsAt = function ( x, y )
{
	// Room border. Prevent enemies and entities from leaving.
	if ((x % ROOM_WIDTH) == 0 ||
		(x % ROOM_WIDTH) == ROOM_WIDTH-1 ||
		(y % ROOM_HEIGHT) == 0 ||
		(y % ROOM_HEIGHT) == ROOM_HEIGHT-1)
		return true;

	return this.physicsMap[y][x];
};
