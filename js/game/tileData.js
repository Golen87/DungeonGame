var TYPE_NONE = 'NONE';
var TYPE_WALL = 'WALL';
var TYPE_FLOOR = 'FLOOR';

var TYPE_OBJECT = 'OBJECT';
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
var DECO_PILLAR = {
	'name': 'pillar',
	'type': TYPE_WALL,
	'spos': [0],
};

var FLOOR_RUBBLE = {
	'name': 'rubble',
	'type': TYPE_FLOOR
};
var FLOOR_INDENT = {
	'name': 'indent',
	'type': TYPE_FLOOR,
	'spos': [4,2]
};

var OBJ_BOX = {
	'name': 'box',
	'type': TYPE_OBJECT
};
var OBJ_BLOCK = {
	'name': 'block',
	'type': TYPE_OBJECT
};
var OBJ_SWITCH = {
	'name': 'switch',
	'type': TYPE_OBJECT
};
var OBJ_DOOR = {
	'name': 'door',
	'type': TYPE_OBJECT
};
var OBJ_CHEST = {
	'name': 'chest',
	'type': TYPE_OBJECT
};
var OBJ_SPIKES = {
	'name': 'spikes',
	'type': TYPE_OBJECT
};
var OBJ_PRESSUREPLATE = {
	'name': 'pressureplate',
	'type': TYPE_OBJECT
};

var ENEMY = {
	'name': 'enemy',
	'type': TYPE_ENEMY
};


var PIXEL_TABLE = {
	'255,255,255': TILE_FLOOR,
	'255,255,128': FLOOR_RUBBLE,
	'255,128,128': FLOOR_INDENT,

	'0,0,0': TILE_WALL,
	'50,50,50': TILE_SPIRAL,
	'128,128,128': DECO_PILLAR,

	'255,0,0': ENEMY,

	'255,0,255': OBJ_SPIKES,
	'0,0,255': OBJ_DOOR,
	'0,255,255': OBJ_SWITCH,
	'0,128,255': OBJ_PRESSUREPLATE,
	'0,255,0': OBJ_CHEST,
	'255,255,0': OBJ_BOX,
	'128,128,0': OBJ_BLOCK,
}

var TILES = [
	TILE_NONE,
	TILE_WALL,
	TILE_SPIRAL,
	TILE_FLOOR,
	DECO_PILLAR,

	FLOOR_RUBBLE,
	FLOOR_INDENT,

	ENEMY,

	OBJ_SPIKES,
	OBJ_DOOR,
	OBJ_SWITCH,
	OBJ_PRESSUREPLATE,
	OBJ_CHEST,
	OBJ_BOX,
	OBJ_BLOCK,
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
