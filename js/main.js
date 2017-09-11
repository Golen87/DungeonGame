var DungeonGame = DungeonGame || {};

var ROOM_WIDTH = 16;
var ROOM_HEIGHT = 11;
var SCREEN_WIDTH = ROOM_WIDTH * 16;
var SCREEN_HEIGHT = ROOM_HEIGHT * 16;
DungeonGame.game = new Phaser.Game( SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS, 'DungeonGame', null, false, false );

DungeonGame.game.state.add( 'Boot', DungeonGame.Boot );
DungeonGame.game.state.add( 'Preload', DungeonGame.Preload );
DungeonGame.game.state.add( 'MainMenu', DungeonGame.MainMenu );
DungeonGame.game.state.add( 'Game', DungeonGame.Game );

DungeonGame.game.state.start( 'Boot' );

DungeonGame.debug = false;
DungeonGame.shadow = false;
DungeonGame.pause = false;