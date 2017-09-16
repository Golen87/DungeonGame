
// Constructor
function AudioManager()
{
	this.sounds = {};

	this.init();
};

AudioManager.prototype.init = function ()
{
	//addMarker(name, start, duration, volume, loop)

	var name = 'footsteps';
	var vol = 0.05;
	this.sounds[name] = {};
	this.sounds[name].sound = DungeonGame.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.0, 0.3, vol );
	this.sounds[name].sound.addMarker( '2', 0.4, 0.3, vol );
	this.sounds[name].sound.addMarker( '3', 0.8, 0.3, vol );
	this.sounds[name].sound.addMarker( '4', 1.2, 0.3, vol );
	this.sounds[name].markers = ['1', '2', '3', '4'];

	var name = 'swing';
	var vol = 0.2;
	this.sounds[name] = {};
	this.sounds[name].sound = DungeonGame.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.0, 0.4, vol );
	this.sounds[name].sound.addMarker( '2', 0.5, 0.4, vol );
	this.sounds[name].sound.addMarker( '3', 1.0, 0.4, vol );
	this.sounds[name].sound.addMarker( '4', 1.5, 0.4, vol );
	this.sounds[name].markers = ['1', '2', '3', '4'];

	var name = 'chop';
	var vol = 0.3;
	this.sounds[name] = {};
	this.sounds[name].sound = DungeonGame.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.0, 0.2, vol );
	this.sounds[name].sound.addMarker( '2', 0.3, 0.2, vol );
	this.sounds[name].sound.addMarker( '3', 0.6, 0.2, vol );
	this.sounds[name].markers = ['1', '2', '3'];

	var name = 'eating';
	var vol = 0.4;
	this.sounds[name] = {};
	this.sounds[name].sound = DungeonGame.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.0, 0.95, vol );
	this.sounds[name].sound.addMarker( '2', 1.0, 0.95, vol );
	this.sounds[name].sound.addMarker( '3', 2.0, 0.95, vol );
	this.sounds[name].markers = ['1', '2', '3'];

	var name = 'death';
	var vol = 0.3;
	this.sounds[name] = {};
	this.sounds[name].sound = DungeonGame.game.add.audio( name );

	var name = 'hurt';
	var vol = 0.4;
	this.sounds[name] = {};
	this.sounds[name].sound = DungeonGame.game.add.audio( name );


	var vol = 0.4;

	var name = 'rat';
	this.sounds[name] = {};
	this.sounds[name].sound = DungeonGame.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'cry_1', 0.0, 0.5, vol );
	this.sounds[name].sound.addMarker( 'cry_2', 0.6, 0.5, vol );
	this.sounds[name].sound.addMarker( 'cry_3', 1.2, 0.5, vol );
	this.sounds[name].sound.addMarker( 'hurt_1', 1.8, 0.35, vol );
	this.sounds[name].sound.addMarker( 'hurt_2', 2.25, 0.35, vol );
	this.sounds[name].sound.addMarker( 'hurt_3', 2.7, 0.35, vol );
	this.sounds[name].sound.addMarker( 'death_1', 3.15, 0.55, vol );
	this.sounds[name].sound.allowMultiple = true;
	this.sounds[name].markers = [];
	this.sounds[name].markers['cry'] = ['cry_1', 'cry_2', 'cry_3']
	this.sounds[name].markers['hurt'] = ['hurt_1', 'hurt_2', 'hurt_3']
	this.sounds[name].markers['death'] = ['death_1']

	var name = 'mouse';
	this.sounds[name] = {};
	this.sounds[name].sound = DungeonGame.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'cry_1', 0.0, 0.2, vol );
	this.sounds[name].sound.addMarker( 'cry_2', 0.3, 0.2, vol );
	this.sounds[name].sound.addMarker( 'cry_3', 0.6, 0.2, vol );
	this.sounds[name].sound.addMarker( 'hurt_1', 0.9, 0.4, vol );
	this.sounds[name].sound.addMarker( 'hurt_2', 1.4, 0.4, vol );
	this.sounds[name].sound.addMarker( 'hurt_3', 1.9, 0.4, vol );
	this.sounds[name].sound.addMarker( 'death_1', 2.4, 0.3, vol );
	this.sounds[name].markers = [];
	this.sounds[name].markers['cry'] = ['cry_1', 'cry_2', 'cry_3']
	this.sounds[name].markers['hurt'] = ['hurt_1', 'hurt_2', 'hurt_3']
	this.sounds[name].markers['death'] = ['death_1']

	var name = 'rhino';
	this.sounds[name] = {};
	this.sounds[name].sound = DungeonGame.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'cry_1', 0.0, 1.1, vol );
	this.sounds[name].sound.addMarker( 'cry_2', 1.2, 1.1, vol );
	this.sounds[name].sound.addMarker( 'cry_3', 2.4, 1.1, vol );
	this.sounds[name].sound.addMarker( 'cry_4', 3.6, 1.3, vol );
	this.sounds[name].sound.addMarker( 'hurt_1', 5.0, 0.6, vol );
	this.sounds[name].sound.addMarker( 'hurt_2', 5.7, 0.5, vol );
	this.sounds[name].sound.addMarker( 'hurt_3', 6.3, 0.7, vol );
	this.sounds[name].sound.addMarker( 'hurt_4', 7.1, 0.6, vol );
	this.sounds[name].sound.addMarker( 'death_1', 7.8, 0.9, vol );
	this.sounds[name].markers = [];
	this.sounds[name].markers['cry'] = ['cry_1', 'cry_2', 'cry_3', 'cry_4']
	this.sounds[name].markers['hurt'] = ['hurt_1', 'hurt_2', 'hurt_3', 'hurt_4']
	this.sounds[name].markers['death'] = ['death_1']

	var name = 'spider';
	this.sounds[name] = {};
	this.sounds[name].sound = DungeonGame.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'cry_1', 0.0, 0.9, vol );
	this.sounds[name].sound.addMarker( 'cry_2', 1.0, 0.9, vol );
	this.sounds[name].sound.addMarker( 'cry_3', 2.0, 0.9, vol );
	this.sounds[name].sound.addMarker( 'cry_4', 3.0, 0.9, vol );
	this.sounds[name].sound.addMarker( 'hurt_1', 4.0, 0.7, vol );
	this.sounds[name].sound.addMarker( 'hurt_2', 4.8, 0.7, vol );
	this.sounds[name].sound.addMarker( 'hurt_3', 5.6, 0.7, vol );
	this.sounds[name].sound.addMarker( 'death_1', 6.4, 0.8, vol );
	this.sounds[name].sound.addMarker( 'death_2', 7.3, 0.8, vol );
	this.sounds[name].markers = [];
	this.sounds[name].markers['cry'] = ['cry_1', 'cry_2', 'cry_3', 'cry_4']
	this.sounds[name].markers['hurt'] = ['hurt_1', 'hurt_2', 'hurt_3']
	this.sounds[name].markers['death'] = ['death_1', 'death_2']

	var name = 'slime';
	this.sounds[name] = {};
	this.sounds[name].sound = DungeonGame.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'cry_1', 0.0, 1.2, vol );
	this.sounds[name].sound.addMarker( 'cry_2', 1.3, 1.2, vol );
	this.sounds[name].sound.addMarker( 'cry_3', 2.6, 1.2, vol );
	this.sounds[name].sound.addMarker( 'hurt_1', 3.9, 1.2, vol );
	this.sounds[name].sound.addMarker( 'hurt_2', 5.2, 1.2, vol );
	this.sounds[name].sound.addMarker( 'hurt_3', 6.5, 1.2, vol );
	this.sounds[name].sound.addMarker( 'death_1', 7.8, 1.2, vol );
	this.sounds[name].markers = [];
	this.sounds[name].markers['cry'] = ['cry_1', 'cry_2', 'cry_3']
	this.sounds[name].markers['hurt'] = ['hurt_1', 'hurt_2', 'hurt_3']
	this.sounds[name].markers['death'] = ['death_1']

	var name = 'creature';
	this.sounds[name] = {};
	this.sounds[name].sound = DungeonGame.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'cry_1', 0.0, 1.6, vol );
	this.sounds[name].sound.addMarker( 'cry_2', 1.7, 1.3, vol );
	this.sounds[name].sound.addMarker( 'cry_3', 3.1, 1.3, vol );
	this.sounds[name].sound.addMarker( 'cry_4', 4.5, 1.7, vol );
	this.sounds[name].sound.addMarker( 'hurt_1', 6.3, 1.4, vol );
	this.sounds[name].sound.addMarker( 'hurt_2', 7.8, 1.4, vol );
	this.sounds[name].sound.addMarker( 'hurt_3', 9.3, 1.4, vol );
	this.sounds[name].sound.addMarker( 'death_1', 10.8, 1.1, vol );
	this.sounds[name].sound.addMarker( 'death_2', 12.0, 1.3, vol );
	this.sounds[name].markers = [];
	this.sounds[name].markers['cry'] = ['cry_1', 'cry_2', 'cry_3', 'cry_4']
	this.sounds[name].markers['hurt'] = ['hurt_1', 'hurt_2', 'hurt_3']
	this.sounds[name].markers['death'] = ['death_1', 'death_2']
};

AudioManager.prototype.getMarkers = function ( name, marker=null )
{
	if ( marker )
		return this.sounds[name].markers[marker];
	else
		return this.sounds[name].markers;
};

AudioManager.prototype.play = function ( name, marker=null )
{
	var markers = this.getMarkers( name, marker );
	if ( markers )
	{
		do
		{
			var index = markers.choice();
		}
		while (
			this.sounds[name].lastPlayed == index && markers.length > 1 );

		this.sounds[name].lastPlayed = index;
		this.sounds[name].sound.play( index );
	}
	else
	{
		this.sounds[name].sound.play();
	}
};
