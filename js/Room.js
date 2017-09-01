
var NONE;
var WALL;
var FLOOR;
var RUBBLE;


// Constructor
function Room ( path )
{
	var roomText = DungeonGame.game.cache.getText( path );
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

	this.sprites = [];
	this.group = DungeonGame.game.add.group();
}


Room.prototype.addGraphic = function ( x, y, sx, sy )
{
	var index = sx + sy*8;
	var s = this.group.create( x*16, y*16, 'dungeon', index );

	this.sprites.push( s );
};

Room.prototype.addPhysics = function ( x, y )
{
	var index = sx + sy*8;
	var s = this.group.create( x*16, y*16, 'dungeon', index );

	if ( collision )
	{
		DungeonGame.game.physics.enable( s, Phaser.Physics.ARCADE );
		s.body.immovable = true;
	}

	this.sprites.push( s );
};

Room.prototype.isWithin = function ( x, y )
{
	return ( x >= 0 ) && ( y >= 0 ) && ( x < this.width ) && ( y < this.height );
};

Room.prototype.get = function ( x, y )
{
	if ( this.isWithin( x, y ) )
		return this.grid[y][x];
};

Room.prototype.isWall = function ( x, y )
{
	var tile = this.get( x, y );
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
					this.addGraphic( x, y, 1, 0 );
					if ( this.isFloor( x-1, y ) && !this.isFloor( x+1, y ) || this.isWall( x-1, y+1 ) )
					{
						//this.addGraphic( x, y, 0, 0, true );
						//this.addGraphic( x, y-1, 1, 5, false );
					}
					else if ( !this.isFloor( x-1, y ) && this.isFloor( x+1, y ) || this.isWall( x+1, y+1 ) )
					{
						//this.addGraphic( x, y, 2, 0, true );
						//this.addGraphic( x, y-1, 2, 0, false );
					}
					//else
					{
						//this.addGraphic( x, y, 1, 0, true );
						//this.addGraphic( x, y-1, 1, 5, false );
					}
				}
				else if ( this.isFloor( x, y-1 ) )
				{
					//var spos = Phaser.ArrayUtils.getRandomItem( [[8,0], [7,1], [8,1]] );
					//this.addGraphic( x, y, spos[0], spos[1], true );
				}
				else if (
					this.isFloor( x-1, y ) ||
					this.isFloor( x+1, y ) ||
					this.isFloor( x-1, y+1 ) ||
					this.isFloor( x+1, y+1 ) ||
					this.isFloor( x-1, y-1 ) ||
					this.isFloor( x+1, y-1 ) )
				{
					//this.addGraphic( x, y, 0, 2, true );
				}
			}
			// Add rubble
			else if ( this.isRubble( x, y ) )
			{
				this.addGraphic( x, y, 0, 2, false );

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
					//this.addGraphic( x, y, spos[0], spos[1] );
				}
			}
			// Add floor
			else if ( this.isFloor( x, y ) )
			{
				this.addGraphic( x, y, 0, 2, false );
				if ( this.isWall( x, y-1 ) )
				{
					var spos = Phaser.ArrayUtils.getRandomItem( [[1,2], [2,2], [3,2]] );
					this.addGraphic( x, y, spos[0], spos[1], false );
				}
			}
		}
	}
};

Room.prototype.render = function ()
{
	//for ( var i = 0; i < this.sprites.length; i++ )
	//	DungeonGame.game.debug.body( this.sprites[i] );
};
