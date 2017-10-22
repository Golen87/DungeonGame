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
	'spos': [[6,2], [7,2], [6,3], [7,3], [6,4], [7,4]]
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
var OBJ_TORCH = {
	'name': 'torch',
	'type': TYPE_OBJECT
};

var ENEMY_SLURG = {
	'name': 'slurg',
	'type': TYPE_ENEMY
};
var ENEMY_FRY = {
	'name': 'fry',
	'type': TYPE_ENEMY
};
var ENEMY_TARRAGON = {
	'name': 'tarragon',
	'type': TYPE_ENEMY
};


var PIXEL_TABLE = {
	'255,255,255': TILE_FLOOR,
	'255,255,128': FLOOR_RUBBLE,
	'255,128,128': FLOOR_INDENT,

	'0,0,0': TILE_WALL,
	'32,32,64': TILE_SPIRAL,
	'32,64,64': DECO_PILLAR,

	'255,0,0': ENEMY_SLURG,
	'255,128,0': ENEMY_FRY,
	'128,0,0': ENEMY_TARRAGON,

	'255,0,255': OBJ_SPIKES,
	'0,0,255': OBJ_DOOR,
	'0,255,255': OBJ_SWITCH,
	'0,128,255': OBJ_PRESSUREPLATE,
	'0,255,0': OBJ_CHEST,
	'255,255,0': OBJ_BOX,
	'128,128,0': OBJ_BLOCK,
	'128,64,0': OBJ_TORCH,
}

var TILES = [
	TILE_NONE,
	TILE_WALL,
	TILE_SPIRAL,
	TILE_FLOOR,
	DECO_PILLAR,

	FLOOR_RUBBLE,
	FLOOR_INDENT,

	ENEMY_SLURG,
	ENEMY_FRY,
	ENEMY_TARRAGON,

	OBJ_SPIKES,
	OBJ_DOOR,
	OBJ_SWITCH,
	OBJ_PRESSUREPLATE,
	OBJ_CHEST,
	OBJ_BOX,
	OBJ_BLOCK,
	OBJ_TORCH,
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
