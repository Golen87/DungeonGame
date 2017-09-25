
// Constructor
function RoomManager ( decoGroup )
{
	this.width = DungeonGame.game.cache.getImage( 'overworld' ).width;
	this.height = DungeonGame.game.cache.getImage( 'overworld' ).height;

	this.tileMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.makePixelMap();

	this.physicsMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.fgMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.bgMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.entityMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.enemyMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.decoMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.makeSpriteMap();

	this.activeMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );

	this.background = DungeonGame.game.add.group();
	this.background.createMultiple( 4*ROOM_WIDTH*ROOM_HEIGHT, 'dungeon', 0, false );
	this.foreground = DungeonGame.game.add.group();
	this.foreground.createMultiple( 4*ROOM_WIDTH*ROOM_HEIGHT, 'dungeon', 0, false );
	this.physics = DungeonGame.game.add.group();
	this.physics.createMultiple( ROOM_WIDTH*ROOM_HEIGHT, 'dungeon', 0, false );

	this.decorations = Array( 32 );
	for ( var i = 0; i < this.decorations.length; i++ )
	{
		this.decorations[i] = decoGroup.create( 0, 0, 'decoration', 0, false );
		this.decorations[i].anchor.set( 0.0, 0.0 );
	}
	
	for ( var i = 0; i < this.physics.children.length; i++ )
	{
		DungeonGame.game.physics.enable( this.physics.children[i], Phaser.Physics.ARCADE );
	}
}


RoomManager.prototype.makePixelMap = function ()
{
	var bmd = DungeonGame.game.make.bitmapData( this.width, this.height );
	bmd.draw( DungeonGame.game.cache.getImage( 'overworld' ), 0, 0 );
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
			var key = [r, g, b].toString();

			if ( a == 0 )
			{
				var index = TILES.map(function(e) { return e.name; }).indexOf( TILE_NONE );
				this.tileMap[y][x] = index;
			}
			else if ( key in PIXEL_TABLE )
			{
				var index = TILES.map(function(e) { return e.name; }).indexOf( PIXEL_TABLE[key].name );
				this.tileMap[y][x] = index;
			}
			else
			{
				console.error( 'Unknown color: {0}'.format( key ) );
			}
		}
	}
}


RoomManager.prototype.addForeground = function ( x, y, spos )
{
	if ( spos.length != 2 || !isInt( spos[0] ) )
		spos = Phaser.ArrayUtils.getRandomItem( spos );
	var index = spos[0] + spos[1]*8;

	if ( this.fgMap[y][x] == null )
		this.fgMap[y][x] = [];
	this.fgMap[y][x].push( index );
};

RoomManager.prototype.addBackground = function ( x, y, spos )
{
	if ( spos.length != 2 || !isInt( spos[0] ) )
		spos = Phaser.ArrayUtils.getRandomItem( spos );
	var index = spos[0] + spos[1]*8;

	if ( this.bgMap[y][x] == null )
		this.bgMap[y][x] = [];
	this.bgMap[y][x].push( index );
};

RoomManager.prototype.addPhysics = function ( x, y )
{
	this.physicsMap[y][x] = true;
};

RoomManager.prototype.addEntity = function ( x, y, name )
{
	this.entityMap[y][x] = name;
};

RoomManager.prototype.addEnemy = function ( x, y, name )
{
	this.enemyMap[y][x] = name;
};

RoomManager.prototype.addDecoration = function ( x, y, spos )
{
	var index = Phaser.ArrayUtils.getRandomItem( spos );

	if ( this.decoMap[y][x] == null )
		this.decoMap[y][x] = [];
	this.decoMap[y][x].push( index );
};


RoomManager.prototype.isWithin = function ( x, y )
{
	return ( x >= 0 ) && ( y >= 0 ) && ( x < this.width ) && ( y < this.height );
};

RoomManager.prototype.getTileType = function ( x, y )
{
	if ( this.isWithin( x, y ) )
		return TILES[this.tileMap[y][x]]['type'];
	return TYPE_NONE;
};

RoomManager.prototype.getTileName = function ( x, y )
{
	if ( this.isWithin( x, y ) )
		return TILES[this.tileMap[y][x]]['name'];
	return TYPE_NONE;
};

RoomManager.prototype.isWall = function ( x, y, allowVoid=false )
{
	var type = this.getTileType( x, y );
	if ( allowVoid && type == TYPE_NONE )
	{
		return true;
	}
	return ( type == TYPE_WALL );
};

RoomManager.prototype.isFloor = function ( x, y )
{
	var TYPE = this.getTileType( x, y );
	return ( TYPE == TYPE_FLOOR || TYPE == TYPE_OBJECT || TYPE == TYPE_ENEMY );
};

RoomManager.prototype.isEntity = function ( x, y )
{
	var TYPE = this.getTileType( x, y );
	return ( TYPE == TYPE_OBJECT );
};

RoomManager.prototype.isEnemy = function ( x, y )
{
	var TYPE = this.getTileType( x, y );
	return ( TYPE == TYPE_ENEMY );
};


RoomManager.prototype.makeSpriteMap = function ()
{
	for ( var y = 0; y < this.height; y++ )
	{
		for ( var x = 0; x < this.width; x++ )
		{
			// Add wall
			if ( this.isWall( x, y, true ) )
			{
				this.addPhysics( x, y );

				if ( this.getTileName( x, y ) == DECO_PILLAR['name'] )
				{
					if ( this.isWall( x, y-1, true ) )
						this.addBackground( x, y, TILE_WALL['spos'] );
					else if ( this.isFloor( x, y-1, true ) )
						this.addBackground( x, y, TILE_FLOOR['spos'] );
					this.addDecoration( x, y, DECO_PILLAR['spos'] );
					this.addForeground( x, y-1, [4,0] );
				}
				else if ( this.isFloor( x, y+1 ) )
				{
					if ( this.getTileName( x, y ) == TILE_WALL['name'] )
					{
						this.addBackground( x, y, TILE_WALL['spos'] );
					}
					if ( this.getTileName( x, y ) == TILE_SPIRAL['name'] )
					{
						this.addBackground( x, y, TILE_SPIRAL['spos'] );
					}

					if ( this.isFloor( x-1, y ) || ( this.isWall( x-1, y+1 ) ) )
					{
						this.addBackground( x, y, FG_EDGESHADE_LEFT );
					}
					if ( this.isFloor( x+1, y ) || ( this.isWall( x+1, y+1 ) ) )
					{
						this.addBackground( x, y, FG_EDGESHADE_RIGHT );
					}

					if ( this.isFloor( x, y-1 ) )
					{
						//this.addForeground( x, y, FG_TOP_N );

						if ( this.isWall( x, y-1, true ) )
							this.addBackground( x, y, TILE_WALL['spos'] );
						else if ( this.isFloor( x, y-1, true ) )
							this.addBackground( x, y, TILE_FLOOR['spos'] );
						this.addDecoration( x, y, DECO_PILLAR['spos'] );
						this.addForeground( x, y-1, [4,0] );
					}
				}
				else
				{
					// Out of bounds background
					this.addForeground( x, y, TILE_NONE['spos'] );

					// Edges
					if ( this.isFloor( x-1, y ) || this.isFloor( x-1, y+1 ) )
					{
						this.addForeground( x, y, FG_TOP_W );
					}
					if ( this.isFloor( x+1, y ) || this.isFloor( x+1, y+1 ) )
					{
						this.addForeground( x, y, FG_TOP_E );
					}
					if ( this.isFloor( x, y-1 ) )
					{
						this.addForeground( x, y, FG_TOP_N );
					}
					if ( this.isFloor( x, y+2 ) )
					{
						this.addForeground( x, y, FG_TOP_S );
					}

					// Floor corners
					if ( ( this.isFloor( x-1, y+1 ) || this.isFloor( x-1, y ) ) && this.isFloor( x, y+2 ) )
					{
						this.addForeground( x, y, FG_INV_TOP_SW );
					}
					if ( ( this.isFloor( x+1, y+1 ) || this.isFloor( x+1, y ) ) && this.isFloor( x, y+2 ) )
					{
						this.addForeground( x, y, FG_INV_TOP_SE );
					}
					if ( ( this.isFloor( x-1, y ) || this.isFloor( x-1, y+1 ) ) && this.isFloor( x, y-1 ) )
					{
						this.addForeground( x, y, FG_INV_TOP_NW );
					}
					if ( ( this.isFloor( x+1, y ) || this.isFloor( x+1, y+1 ) ) && this.isFloor( x, y-1 ) )
					{
						this.addForeground( x, y, FG_INV_TOP_NE );
					}

					// Void corners
					if ( this.isWall( x-1, y, true ) && this.isWall( x, y-1, true ) && this.isWall( x-1, y+1, true ) && this.isFloor( x-1, y-1 ) )
					{
						this.addForeground( x, y, FG_TOP_NW );
					}
					if ( this.isWall( x+1, y, true ) && this.isWall( x, y-1, true ) && this.isWall( x+1, y+1, true ) && this.isFloor( x+1, y-1 ) )
					{
						this.addForeground( x, y, FG_TOP_NE );
					}
					if ( this.isWall( x-1, y+1, true ) && this.isWall( x, y+2, true ) && this.isFloor( x-1, y+2 ) && this.isWall( x-1, y, true ) )
					{
						this.addForeground( x, y, FG_TOP_SW );
					}
					if ( this.isWall( x+1, y+1, true ) && this.isWall( x, y+2, true ) && this.isFloor( x+1, y+2 ) && this.isWall( x+1, y, true ) )
					{
						this.addForeground( x, y, FG_TOP_SE );
					}
				}

				// For floor without wall? Like bottomless pit
				//var spos = Phaser.ArrayUtils.getRandomItem( [[8,0], [7,1], [8,1]] );
				//this.addForeground( x, y, spos[0], spos[1] );
			}
			// Add rubble
			else if ( this.isFloor( x, y ) && this.getTileName( x, y ) == 'rubble' )
			{
				this.addBackground( x, y, TILE_FLOOR['spos'] );

				var neighbours = '';
				neighbours += this.getTileName( x-1, y ) == 'rubble' || this.isWall( x-1, y, true ) ? '<' : '-';
				neighbours += this.getTileName( x, y-1 ) == 'rubble' || this.isWall( x, y-1, true ) ? '^' : '-';
				neighbours += this.getTileName( x+1, y ) == 'rubble' || this.isWall( x+1, y, true ) ? '>' : '-';
				neighbours += this.getTileName( x, y+1 ) == 'rubble' || this.isWall( x, y+1, true ) ? 'v' : '-';
				
				var r = DungeonGame.game.rnd.integerInRange( 0, 1 );
				var spos = {
					'----': [1+r, 3], // missing
					'---v': [1+r, 3], // missing
					'-->-': [1+r, 3], // missing
					'-->v': [0, 2],
					'-^--': [1+r, 3], // missing
					'-^-v': [1+r, 3], // missing
					'-^>-': [0, 4],
					'-^>v': [0, 3],
					'<---': [1+r, 3], // missing
					'<--v': [3, 2],
					'<->-': [1+r, 3], // missing
					'<->v': [1+r, 2],
					'<^--': [3, 4],
					'<^-v': [3, 3],
					'<^>-': [1+r, 4],
					'<^>v': [1+r, 3]
				}[neighbours]

				if ( spos )
				{
					this.addBackground( x, y, [spos[0], spos[1]] );
				}
			}
			// Add floor
			else if ( this.isFloor( x, y ) )
			{
				this.addBackground( x, y, TILE_FLOOR['spos'] );
				if ( this.isWall( x, y-1 ) )
				{
					this.addBackground( x, y, FG_FLOORSHADE );
				}
			}

			if ( this.isEntity( x, y ) )
			{
				this.addEntity( x, y, this.getTileName( x, y ) );
			}
			if ( this.isEnemy( x, y ) )
			{
				this.addEnemy( x, y, this.getTileName( x, y ) );
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
				DungeonGame.game.debug.body( member );
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
	}
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

	for ( var y = offset_y; y < offset_y + ROOM_HEIGHT; y++ )
	{
		for ( var x = offset_x; x < offset_x + ROOM_WIDTH; x++ )
		{
			if ( this.physicsMap[y][x])
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
						console.error( "Out of Physics resources!" );
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
	
				if ( this.bgMap[y][x] )
				{
					for ( var i = 0; i < this.bgMap[y][x].length; i++ )
					{
						var s = this.background.getFirstDead();
						if ( s )
						{
							this.activeMap[y][x] = true;
							s.frame = this.bgMap[y][x][i];
							s.reset( 16*x, 16*y );
						}
						else
						{
							console.error( "Out of Background resources!" );
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
							console.error( "Out of Foreground resources!" );
						}
					}
				}

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
							console.error( "Out of Decoration resources!" );
						}
					}
				}

			}
		}
	}
};
