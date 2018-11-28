const TileTypes = {
	'None': 1,
	'Wall': 2,
	'Pit': 3,
	'Floor': 4,
	'Entity': 5,
	'Enemy': 6,
};

const Tiles = {
	'Wall': {
		'type': TileTypes.Wall,
		'color': [0, 0, 0],
		'spos': [0,0]
	},
	'Spiral': {
		'type': TileTypes.Wall,
		'color': [32, 32, 64],
		'spos': [1,0]
	},
	'Floor': {
		'type': TileTypes.Floor,
		'color': [255, 255, 255],
		'spos': [9,4]
	},
	'Pillar': {
		'type': TileTypes.Wall,
		'color': [32, 64, 64],
		'spos': [[15,0], [15,1], [15,2]],
	},
	'Rubble': {
		'type': TileTypes.Floor,
		'color': [255, 255, 128],
		'spos': [
			[[15,4], [15,5], [15,6], [15,7]], [12,4], [13,4], [14,4],
			[11,5], [12,5], [13,5], [14,5],
			[11,6], [12,6], [13,6], [14,6],
			[11,7], [12,7], [13,7], [14,7]
		]
	},
	'Indent': {
		'type': TileTypes.Floor,
		'color': [255, 128, 128],
		'spos': [[9,5], [10,5], [9,6], [10,6], [9,7], [10,7]]
	},


	'Water': {
		'type': TileTypes.Pit,
		'color': [0, 128, 255],
		'spos': [[13,0], [13,1]]
	},
	'WaterDithering': {
		'type': TileTypes.Pit,
		'spos': [[14,0], [14,1], [14,2]]
	},


	/* Ceiling */

	'Ceiling': {
		'name': 'Ceiling',
		'type': TileTypes.None,
		'spos': [1,6]
	},

	'Top_N': {
		'spos': [1,7]
	},
	'Top_W': {
		'spos': [2,6]
	},
	'Top_S': {
		'spos': [1,5]
	},
	'Top_E': {
		'spos': [0,6]
	},
	'Top_NW': {
		'spos': [2,7]
	},
	'Top_SW': {
		'spos': [2,5]
	},
	'Top_SE': {
		'spos': [0,5]
	},
	'Top_NE': {
		'spos': [0,7]
	},

	'Top_Inv_NW': {
		'spos': [4,6]
	},
	'Top_Inv_SW': {
		'spos': [4,5]
	},
	'Top_Inv_SE': {
		'spos': [3,5]
	},
	'Top_Inv_NE': {
		'spos': [3,6]
	},


	/* Shadows */

	'Edgeshade_Left': {
		'spos': [7,7]
	},
	'Edgeshade_Right': {
		'spos': [6,7]
	},

	'Floorshade': {
		'spos': [[3,7], [4,7], [5,7]]
	},


	/* Entities */

	'Box': {
		'type': TileTypes.Entity,
		'color': [255, 255, 0]
	},
	'Block': {
		'type': TileTypes.Entity,
		'color': [128, 128, 0]
	},
	'Switch': {
		'type': TileTypes.Entity,
		'color': [0, 255, 255]
	},
	'Door': {
		'type': TileTypes.Entity,
		'color': [0, 0, 255]
	},
	'Chest': {
		'type': TileTypes.Entity,
		'color': [0, 255, 0]
	},
	'Spikes': {
		'type': TileTypes.Entity,
		'color': [255, 0, 255]
	},
	'PressurePlate': {
		'type': TileTypes.Entity,
		'color': [0, 128, 255]
	},
	'Torch': {
		'type': TileTypes.Entity,
		'color': [128, 64, 0]
	},
	'Torch_Hidden': {
		'type': TileTypes.Entity,
	},

	
	/* Enemies */

	'Slurg': {
		'type': TileTypes.Enemy,
		'color': [255, 0, 0]
	},
	'Fry': {
		'type': TileTypes.Enemy,
		'color': [255, 128, 0]
	},
	'Tarragon': {
		'type': TileTypes.Enemy,
		'color': [128, 0, 0]
	},
};


function sposToIndex( spos )
{
	const tilesetWidth = 16;
	return spos[0] + spos[1] * tilesetWidth;
}

function getTileByColor( color )
{
	for ( var key in Tiles )
	{
		var tile = Tiles[key];
		if ( 'color' in tile && tile.color.toString() == color )
		{
			return tile;
		}
	}
}
