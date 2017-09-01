var DungeonGame = DungeonGame || {};

var SCREEN_WIDTH = 256;
var SCREEN_HEIGHT = 240;
DungeonGame.game = new Phaser.Game( SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS, 'DungeonGame' );

DungeonGame.game.state.add( 'Boot', DungeonGame.Boot );
DungeonGame.game.state.add( 'Preload', DungeonGame.Preload );
DungeonGame.game.state.add( 'Game', DungeonGame.Game );

DungeonGame.game.state.start( 'Boot' );

DungeonGame.debug = false;
