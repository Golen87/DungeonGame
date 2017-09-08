
// Constructor
function Room ( roomData, offset_x, offset_y, foreground, background, physics )
{
	this.offset_x = offset_x;
	this.offset_y = offset_y;

	this.grid = roomData;

	this.objects = [];
	this.foreground = foreground;
	this.background = background;
	this.physics = physics;

	this.timer = DungeonGame.game.time.create( false );
}


Room.prototype.addForeground = function ( x, y, spos )
{
	if ( spos.length != 2 || !isInt( spos[0] ) )
	{
		spos = Phaser.ArrayUtils.getRandomItem( spos );
	}
	var index = spos[0] + spos[1]*8;
	var s = this.foreground.create( this.offset_x + x*16, this.offset_y + y*16, 'dungeon', index );
	s.renderable = true;
	this.objects.push( s );
};

Room.prototype.addBackground = function ( x, y, spos )
{
	if ( spos.length != 2 || !isInt( spos[0] ) )
	{
		spos = Phaser.ArrayUtils.getRandomItem( spos );
	}
	var index = spos[0] + spos[1]*8;
	var s = this.background.create( this.offset_x + x*16, this.offset_y + y*16, 'dungeon', index );
	s.renderable = true;
	this.objects.push( s );
};

Room.prototype.addPhysics = function ( x, y )
{
	if ( this.isWithin( x, y-1 ) && this.isWall( x, y-1, true ) )
		return;

	var s = this.physics.create( this.offset_x + x*16, this.offset_y + y*16, 'dungeon', 0 );
	s.renderable = false;

	DungeonGame.game.physics.enable( s, Phaser.Physics.ARCADE );
	s.body.immovable = true;
	s.body.moves = false;

	var i = 1;
	while ( this.isWithin( x, y+i ) && this.isWall( x, y+i, true ) ) {
		s.body.setSize(16, 16*(i+1) );
		i += 1;
	}
	this.objects.push( s );
};


Room.prototype.isWithin = function ( x, y )
{
	return ( x >= 0 ) && ( y >= 0 ) && ( x < ROOM_WIDTH ) && ( y < ROOM_HEIGHT );
};

Room.prototype.getTileType = function ( x, y )
{
	if ( this.isWithin( x, y ) )
		return TILES[this.grid[y][x]]['type'];
	return TYPE_NONE;
};

Room.prototype.getTileName = function ( x, y )
{
	if ( this.isWithin( x, y ) )
		return TILES[this.grid[y][x]]['name'];
	return TYPE_NONE;
};

Room.prototype.isWall = function ( x, y, allowVoid=false )
{
	var type = this.getTileType( x, y );
	if ( allowVoid && type == TYPE_NONE )
	{
		return true;
	}
	return ( type == TYPE_WALL );
};

Room.prototype.isFloor = function ( x, y )
{
	var TYPE = this.getTileType( x, y );
	return ( TYPE == TYPE_FLOOR );
};


Room.prototype.generate = function ()
{
	for ( var y = 0; y < ROOM_HEIGHT; y++ )
	{
		for ( var x = 0; x < ROOM_WIDTH; x++ )
		{
			// Add wall
			if ( this.isWall( x, y, true ) )
			{
				this.addPhysics( x, y );

				if ( this.isFloor( x, y+1 ) )
				{
					this.addBackground( x, y, TILE_WALL['spos'] );
					if ( this.getTileName( x, y ) == TILE_SPIRAL['name'] )
					{
						this.addBackground( x, y, TILE_SPIRAL['spos'] );
					}

					if ( this.isFloor( x-1, y ) || ( this.isWall( x-1, y+1 ) ) )
					{
						this.addBackground( x, y, DECO_EDGESHADE_LEFT );
					}
					if ( this.isFloor( x+1, y ) || ( this.isWall( x+1, y+1 ) ) )
					{
						this.addBackground( x, y, DECO_EDGESHADE_RIGHT );
					}

					if ( this.isFloor( x, y-1 ) )
					{
						this.addForeground( x, y, DECO_TOP_N );
					}
				}
				else
				{
					// Out of bounds background
					this.addForeground( x, y, TILE_NONE['spos'] );

					// Edges
					if ( this.isFloor( x-1, y ) || this.isFloor( x-1, y+1 ) )
					{
						this.addForeground( x, y, DECO_TOP_W );
					}
					if ( this.isFloor( x+1, y ) || this.isFloor( x+1, y+1 ) )
					{
						this.addForeground( x, y, DECO_TOP_E );
					}
					if ( this.isFloor( x, y-1 ) )
					{
						this.addForeground( x, y, DECO_TOP_N );
					}
					if ( this.isFloor( x, y+2 ) )
					{
						this.addForeground( x, y, DECO_TOP_S );
					}

					// Floor corners
					if ( ( this.isFloor( x-1, y+1 ) || this.isFloor( x-1, y ) ) && this.isFloor( x, y+2 ) )
					{
						this.addForeground( x, y, DECO_INV_TOP_SW );
					}
					if ( ( this.isFloor( x+1, y+1 ) || this.isFloor( x+1, y ) ) && this.isFloor( x, y+2 ) )
					{
						this.addForeground( x, y, DECO_INV_TOP_SE );
					}
					if ( ( this.isFloor( x-1, y ) || this.isFloor( x-1, y+1 ) ) && this.isFloor( x, y-1 ) )
					{
						this.addForeground( x, y, DECO_INV_TOP_NW );
					}
					if ( ( this.isFloor( x+1, y ) || this.isFloor( x+1, y+1 ) ) && this.isFloor( x, y-1 ) )
					{
						this.addForeground( x, y, DECO_INV_TOP_NE );
					}

					// Void corners
					if ( this.isWall( x-1, y, true ) && this.isWall( x, y-1, true ) && this.isWall( x-1, y+1, true ) && this.isFloor( x-1, y-1 ) )
					{
						this.addForeground( x, y, DECO_TOP_NW );
					}
					if ( this.isWall( x+1, y, true ) && this.isWall( x, y-1, true ) && this.isWall( x+1, y+1, true ) && this.isFloor( x+1, y-1 ) )
					{
						this.addForeground( x, y, DECO_TOP_NE );
					}
					if ( this.isWall( x-1, y+1, true ) && this.isWall( x, y+2, true ) && this.isFloor( x-1, y+2 ) && this.isWall( x-1, y, true ) )
					{
						this.addForeground( x, y, DECO_TOP_SW );
					}
					if ( this.isWall( x+1, y+1, true ) && this.isWall( x, y+2, true ) && this.isFloor( x+1, y+2 ) && this.isWall( x+1, y, true ) )
					{
						this.addForeground( x, y, DECO_TOP_SE );
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
					this.addBackground( x, y, DECO_FLOORSHADE );
				}
			}
		}
	}
};

Room.prototype.render = function ()
{
	if ( DungeonGame.debug )
	{
		//DungeonGame.game.debug.body( this.physics );
		this.physics.forEach( function ( member ) {DungeonGame.game.debug.body( member );}, this );
	}
};


Room.prototype.appear = function ()
{
	if ( this.objects.length == 0 )
		this.generate();
	this.timer.stop();
};

Room.prototype.queueDisappear = function ()
{
	// (3/4)^22*240
	this.timer.add( 50000/60, this.disappear, this );
	this.timer.start();
};

Room.prototype.disappear = function ()
{
	for (var i = 0, len = this.objects.length; i < len; i++)
	{
		this.objects[i].kill();
		this.objects[i].destroy();
	}
	this.objects = [];
};


Room.makePixelMap = function ()
{
	var width = DungeonGame.game.cache.getImage( 'overworld' ).width;
	var height = DungeonGame.game.cache.getImage( 'overworld' ).height;

	var bmd = DungeonGame.game.make.bitmapData( width, height );
	bmd.draw( DungeonGame.game.cache.getImage( 'overworld' ), 0, 0 );
	bmd.update();

	var roomMap = {};
	for ( var i = 0; i < width / ROOM_WIDTH; i++ )
	{
		for ( var j = 0; j < height / ROOM_HEIGHT; j++ )
		{
			var roomData = [];
			for ( var y = 0; y < ROOM_HEIGHT; y++ )
			{
				var row = [];
				for ( var x = 0; x < ROOM_WIDTH; x++ )
				{
					var hex = bmd.getPixel32( i*ROOM_WIDTH+x, j*ROOM_HEIGHT+y );
					var r = ( hex	   ) & 0xFF;
					var g = ( hex >>  8 ) & 0xFF;
					var b = ( hex >> 16 ) & 0xFF;
					var a = ( hex >> 24 ) & 0xFF;

					var key = [r, g, b].toString();
					if ( a == 0 )
					{
						var index = TILES.map(function(e) { return e.name; }).indexOf( TILE_NONE );
						row.push( 0 );
					}
					else if ( key in PIXEL_TABLE )
					{
						var index = TILES.map(function(e) { return e.name; }).indexOf( PIXEL_TABLE[key].name );
						row.push( index );
					}
					else
					{
						console.error( 'Unknown color: {0}'.format( key ) );
					}
				}
				roomData.push( row );
			}

			var key = [i,j].toString();
			roomMap[key] = roomData;
		}
	}
	return roomMap;
}
