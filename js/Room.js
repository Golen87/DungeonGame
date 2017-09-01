
// Constructor
function Room ( path, group )
{
	this.path = path;

	var roomText = DungeonGame.game.cache.getText( this.path );
	roomText = roomText.split( '\n' );

	var temp = roomText.shift().split( ',' );
	this.width = temp[0];
	this.height = temp[1];
	roomText.shift(); // Remove space

	this.grid = [];
	for ( var y = 0; y < this.height; y++ )
	{
		var line = roomText.shift();
		if ( line.length != this.width )
			console.error( 'Map has incorrect size!' );
		this.grid.push( line );
	}

	this.tileMap = {};
	while ( roomText.length > 0 )
	{
		var line = roomText.shift();
		if ( line )
		{
			// char NAME
			var char = line[0];
			var name = line.substring( 2 );
			var found = false;
			for ( var i = 0; i < TILES.length; i++ ) {
				if ( name == TILES[i]['name'] )
				{
					this.tileMap[char] = {
						'type': TILES[i]['type'],
						'name': name
					};
					found = true;
				}
			}
			if ( !found )
			{
				console.error( 'Unknown tilename "{0}"'.format( name ) );
			}
		}
	}

	this.foreground = group;
	this.background = DungeonGame.game.add.group();
	this.physics = DungeonGame.game.add.group();
}


Room.prototype.addForeground = function ( x, y, spos )
{
	if ( spos.length != 2 || !isInt( spos[0] ) )
	{
		spos = Phaser.ArrayUtils.getRandomItem( spos );
	}
	var index = spos[0] + spos[1]*8;
	var s = this.foreground.create( x*16, y*16, 'dungeon', index );
};

Room.prototype.addBackground = function ( x, y, spos )
{
	if ( spos.length != 2 || !isInt( spos[0] ) )
	{
		spos = Phaser.ArrayUtils.getRandomItem( spos );
	}
	var index = spos[0] + spos[1]*8;
	var s = this.background.create( x*16, y*16, 'dungeon', index );
};

Room.prototype.addPhysics = function ( x, y )
{
	if ( this.isWithin( x, y-1 ) && this.isWall( x, y-1, true ) )
		return;

	var s = this.physics.create( x*16, y*16, 'dungeon', 0 );
	s.visible = false;

	DungeonGame.game.physics.enable( s, Phaser.Physics.ARCADE );

	var i = 1;
	while ( this.isWithin( x, y+i ) && this.isWall( x, y+i, true ) ) {
		s.body.setSize(16, 16*(i+1) );
		i += 1;
	}

	s.body.immovable = true;
};


Room.prototype.isWithin = function ( x, y )
{
	return ( x >= 0 ) && ( y >= 0 ) && ( x < this.width ) && ( y < this.height );
};

Room.prototype.getTileType = function ( x, y )
{
	if ( this.isWithin( x, y ) )
		return this.tileMap[this.grid[y][x]]['type'];
	return TYPE_NONE;
};

Room.prototype.getTileName = function ( x, y )
{
	if ( this.isWithin( x, y ) )
		return this.tileMap[this.grid[y][x]]['name'];
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

//Room.prototype.isRubbleOrWall = function ( x, y )
//{
//	var name = this.get( x, y );
//	return ( name == RUBBLE ) || ( name == 'rubble' );
//};


Room.prototype.generate = function ()
{
	for ( var y = 0; y < this.height; y++ )
	{
		for ( var x = 0; x < this.width; x++ )
		{
			// Add wall
			if ( this.isWall( x, y, true ) )
			{
				this.addPhysics( x, y );

				if ( this.isFloor( x, y+1 ) )
				{
					this.addForeground( x, y, TILE_WALL['spos'] );
					if ( this.getTileName( x, y ) == TILE_SPIRAL['name'] )
					{
						this.addForeground( x, y, TILE_SPIRAL['spos'] );
					}

					if ( this.isFloor( x-1, y ) || ( this.isWall( x-1, y+1, true ) ) )
					{
						this.addForeground( x, y, DECO_EDGESHADE_LEFT );
					}
					if ( this.isFloor( x+1, y ) || ( this.isWall( x+1, y+1, true ) ) )
					{
						this.addForeground( x, y, DECO_EDGESHADE_RIGHT );
					}

					if ( this.isFloor( x, y-1 ) )
					{
						this.addForeground( x, y, DECO_TOP_N );
					}
				}
				else
				{
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
				neighbours += this.isFloor( x-1, y ) || this.isWall( x-1, y ) ? '<' : '-';
				neighbours += this.isFloor( x, y-1 ) || this.isWall( x, y-1 ) ? '^' : '-';
				neighbours += this.isFloor( x+1, y ) || this.isWall( x+1, y ) ? '>' : '-';
				neighbours += this.isFloor( x, y+1 ) || this.isWall( x, y+1 ) ? 'v' : '-';
				
				var r = DungeonGame.game.rnd.integerInRange( 0, 1 );
				var spos = {
					'----': [1, 3], // missing
					'---v': [1, 3], // missing
					'-->-': [1, 3], // missing
					'-->v': [0, 6],
					'-^--': [1, 3], // missing
					'-^-v': [1, 3], // missing
					'-^>-': [0, 8],
					'-^>v': [0, 7],
					'<---': [1, 3], // missing
					'<--v': [3, 6],
					'<->-': [1, 3], // missing
					'<->v': [1+r, 6],
					'<^--': [3, 8],
					'<^-v': [3, 7],
					'<^>-': [1+r, 8],
					'<^>v': [1+r, 7]
				}[neighbours]

				if ( spos )
				{
					//this.addBackground( x, y, spos[0], spos[1] );
				}
			}
			// Add floor
			else if ( this.isFloor( x, y ) )
			{
				this.addBackground( x, y, TILE_FLOOR['spos'] );
				if ( this.isWall( x, y-1, true ) )
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
