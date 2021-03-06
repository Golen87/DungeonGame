var DungeonGame = DungeonGame || {};

VERSION = 'v1.4';

const ROOM_WIDTH = 16;
const ROOM_HEIGHT = 12;
const SCREEN_WIDTH = ROOM_WIDTH * 16;
const SCREEN_HEIGHT = ROOM_HEIGHT * 16;

var config = {
	width: SCREEN_WIDTH,
	height: SCREEN_HEIGHT,
	renderer: Phaser.CANVAS,
	parent: "Dragon's Crypt",
	state: null,
	transparent: false,
	antialias: false,
	physicsConfig: null,
}

DungeonGame.game = new Phaser.Game( config );

DungeonGame.game.state.add( 'Boot', DungeonGame.Boot );
DungeonGame.game.state.add( 'Preload', DungeonGame.Preload );
DungeonGame.game.state.add( 'MainMenu', DungeonGame.MainMenu );
DungeonGame.game.state.add( 'Game', DungeonGame.Game );
DungeonGame.game.state.add( 'Credits', DungeonGame.Credits );

DungeonGame.game.state.start( 'Boot' );

DungeonGame.input = {};
DungeonGame.inputScale = new Phaser.Point( 0, 0 );
DungeonGame.inputOffset = new Phaser.Point( 0, 0 );

DungeonGame.debug = false;
DungeonGame.shadow = false;
DungeonGame.paused = false;
DungeonGame.cinematic = false;

/* Options */
DungeonGame.music = true;
DungeonGame.sound = true;

DungeonGame.skip = false;