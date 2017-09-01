
var NONE;
var WALL;
var FLOOR;
var RUBBLE;


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
			console.error( "Map has incorrect size!" );
		this.grid.push( line );
	}

	while ( roomText.length > 0 )
	{
		var line = roomText.shift();
		if ( line )
		{
			var c = line[0];
			var name = line.substring( 2 );
			if ( name == 'NONE' ) NONE = c;
			else if ( name == 'WALL' ) WALL = c;
			else if ( name == 'FLOOR' ) FLOOR = c;
			else if ( name == 'RUBBLE' ) RUBBLE = c;
			else console.error( "Unknown tile type!" );
		}
	}

	this.foreground = group;
	this.background = DungeonGame.game.add.group();
	this.physics = DungeonGame.game.add.group();
}


Room.prototype.addForeground = function ( x, y, sx, sy )
{
	var index = sx + sy*8;
	var s = this.foreground.create( x*16, y*16, 'dungeon', index );
};

Room.prototype.addBackground = function ( x, y, sx, sy )
{
	var index = sx + sy*8;
	var s = this.background.create( x*16, y*16, 'dungeon', index );
};

Room.prototype.addPhysics = function ( x, y )
{
	if ( this.isWall( x, y-1 ) )
		return;

	var s = this.physics.create( x*16, y*16, 'dungeon', 0 );
	s.visible = false;

	DungeonGame.game.physics.enable( s, Phaser.Physics.ARCADE );

	var i = 1;
	while ( this.isWall( x, y+i ) ) {
		s.body.setSize(16, 16*(i+1) );
		i += 1;
	}

	s.body.immovable = true;
};

Room.prototype.isWithin = function ( x, y )
{
	return ( x >= 0 ) && ( y >= 0 ) && ( x < this.width ) && ( y < this.height );
};

Room.prototype.get = function ( x, y )
{
	if ( this.isWithin( x, y ) )
		return this.grid[y][x];
	return NONE;
};

Room.prototype.isWall = function ( x, y, allowVoid=false )
{
	var tile = this.get( x, y );
	if ( allowVoid )
	{
		return ( tile == WALL || tile == NONE );
	}
	return ( tile == WALL );
};

Room.prototype.isRubble = function ( x, y )
{
	var tile = this.get( x, y );
	return ( tile == RUBBLE );
};

Room.prototype.isRubbleOrWall = function ( x, y )
{
	var tile = this.get( x, y );
	return ( tile == RUBBLE );// || ( tile == WALL );
};

Room.prototype.isFloor = function ( x, y )
{
	var tile = this.get( x, y );
	return ( tile != NONE ) && ( tile != WALL );
};

Room.prototype.generate = function ()
{
	for ( var y = 0; y < this.height; y++ )
	{
		for ( var x = 0; x < this.width; x++ )
		{
			// Add wall
			if ( this.isWall( x, y ) )
			{
				this.addPhysics( x, y );

				if ( this.isFloor( x, y+1 ) )
				{
					this.addForeground( x, y, 1, 0 );
					//this.addForeground( x, y-1, 1, 5 );

					if ( this.isFloor( x-1, y ) && !this.isFloor( x+1, y ) || this.isWall( x-1, y+1, true ) )
					{
						//this.addForeground( x, y, 0, 0 );
						//this.addForeground( x, y-1, 1, 5 );
					}
					else if ( !this.isFloor( x-1, y ) && this.isFloor( x+1, y ) || this.isWall( x+1, y+1, true ) )
					{
						//this.addForeground( x, y, 2, 0 );
						//this.addForeground( x, y-1, 2, 0 );
					}
					//else
					{
						//this.addForeground( x, y, 1, 0 );
						//this.addForeground( x, y-1, 1, 5 );
					}
				}
				else
				{
					// Edges
					if ( this.isFloor( x-1, y ) || this.isFloor( x-1, y+1 ) )
					{
						this.addForeground( x, y, 2, 6 );
					}
					if ( this.isFloor( x+1, y ) || this.isFloor( x+1, y+1 ) )
					{
						this.addForeground( x, y, 0, 6 );
					}
					if ( this.isFloor( x, y-1 ) )
					{
						this.addForeground( x, y, 1, 7 );
					}
					if ( this.isFloor( x, y+2 ) )
					{
						this.addForeground( x, y, 1, 5 );
					}

					// Floor corners
					if ( ( this.isFloor( x-1, y+1 ) || this.isFloor( x-1, y ) ) && this.isFloor( x, y+2 ) )
					{
						this.addForeground( x, y, 4, 6 );
					}
					if ( ( this.isFloor( x+1, y+1 ) || this.isFloor( x+1, y ) ) && this.isFloor( x, y+2 ) )
					{
						this.addForeground( x, y, 3, 6 );
					}
					if ( ( this.isFloor( x-1, y ) || this.isFloor( x-1, y+1 ) ) && this.isFloor( x, y-1 ) )
					{
						this.addForeground( x, y, 4, 7 );
					}
					if ( ( this.isFloor( x+1, y ) || this.isFloor( x+1, y+1 ) ) && this.isFloor( x, y-1 ) )
					{
						this.addForeground( x, y, 3, 7 );
					}

					// Void corners
					if ( this.isWall( x-1, y, true ) && this.isWall( x, y-1, true ) && this.isWall( x-1, y+1, true ) && this.isFloor( x-1, y-1 ) )
					{
						this.addForeground( x, y, 2, 7 );
					}
					if ( this.isWall( x+1, y, true ) && this.isWall( x, y-1, true ) && this.isWall( x+1, y+1, true ) && this.isFloor( x+1, y-1 ) )
					{
						this.addForeground( x, y, 0, 7 );
					}
					if ( this.isWall( x-1, y+1, true ) && this.isWall( x, y+2, true ) && this.isFloor( x-1, y+2 ) && this.isWall( x-1, y, true ) )
					{
						this.addForeground( x, y, 2, 5 );
					}
					if ( this.isWall( x+1, y+1, true ) && this.isWall( x, y+2, true ) && this.isFloor( x+1, y+2 ) && this.isWall( x+1, y, true ) )
					{
						this.addForeground( x, y, 0, 5 );
					}
				}

				// For floor without wall? Like bottomless pit
				//var spos = Phaser.ArrayUtils.getRandomItem( [[8,0], [7,1], [8,1]] );
				//this.addForeground( x, y, spos[0], spos[1] );
			}
			// Add rubble
			else if ( this.isRubble( x, y ) )
			{
				this.addBackground( x, y, 0, 2 );

				var neighbours = '';
				neighbours += this.isRubbleOrWall( x-1, y ) ? '<' : '-';
				neighbours += this.isRubbleOrWall( x, y-1 ) ? '^' : '-';
				neighbours += this.isRubbleOrWall( x+1, y ) ? '>' : '-';
				neighbours += this.isRubbleOrWall( x, y+1 ) ? 'v' : '-';
				
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
				this.addBackground( x, y, 0, 2 );
				if ( this.isWall( x, y-1, true ) )
				{
					var spos = Phaser.ArrayUtils.getRandomItem( [[1,2], [2,2], [3,2]] );
					this.addBackground( x, y, spos[0], spos[1] );
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
