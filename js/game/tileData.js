var TYPE_NONE = 'NONE';
var TYPE_WALL = 'WALL';
var TYPE_FLOOR = 'FLOOR';

var TYPE_DECO = 'OBJECT';
var TYPE_ENEMY = 'ENEMY';


var TILE_NONE = {
	'name': 'none',
	'type': TYPE_NONE,
	'spos': [7,6]
};
var TILE_WALL = {
	'name': 'wall',
	'type': TYPE_WALL,
	'spos': [0,0]
};
var TILE_SPIRAL = {
	'name': 'spiral',
	'type': TYPE_WALL,
	'spos': [1,0]
};
var TILE_FLOOR = {
	'name': 'floor',
	'type': TYPE_FLOOR,
	'spos': [0,1]
};
var TILE_RUBBLE = {
	'name': 'rubble',
	'type': TYPE_FLOOR
};

var DECO_BOX = {
	'name': 'box',
	'type': TYPE_DECO
};

var ENEMY = {
	'name': 'enemy',
	'type': TYPE_ENEMY
};


var PIXEL_TABLE = {
	'0,0,0': TILE_WALL,
	'100,0,100': TILE_SPIRAL,
	'255,255,255': TILE_FLOOR,

	'100,0,0': TILE_WALL, // Rock
	'0,100,0': TILE_SPIRAL, // Tree
	'0,0,255': TILE_RUBBLE, // Water

	'255,0,0': ENEMY, // Soldiers

	'100,0,255': TILE_RUBBLE, // Stairs
	'255,100,0': TILE_FLOOR, // Bridge
	'255,255,0': TILE_FLOOR, // Entrance

	'200,200,200': TILE_FLOOR, // Gray floor
	'0,255,255': TILE_SPIRAL, // Grave
	'0,0,100': TILE_WALL, // Gray walls

	'255,195,0': DECO_BOX,
}

var TILES = [
	TILE_NONE,
	TILE_WALL,
	TILE_SPIRAL,
	TILE_FLOOR,
	TILE_RUBBLE,

	DECO_BOX,
	ENEMY,
];


var FG_EDGESHADE_LEFT = [2,0];
var FG_EDGESHADE_RIGHT = [3,0];

var FG_FLOORSHADE = [[1,1], [2,1], [3,1]];

var FG_TOP_N = [1,7];
var FG_TOP_W = [2,6];
var FG_TOP_S = [1,5];
var FG_TOP_E = [0,6];
var FG_TOP_NW = [2,7];
var FG_TOP_SW = [2,5];
var FG_TOP_SE = [0,5];
var FG_TOP_NE = [0,7];

var FG_INV_TOP_NW = [4,7];
var FG_INV_TOP_SW = [4,6];
var FG_INV_TOP_SE = [3,6];
var FG_INV_TOP_NE = [3,7];
