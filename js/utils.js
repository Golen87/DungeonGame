
// First, checks if it isn't implemented yet.
if ( !String.prototype.format ) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace( /{(\d+)}/g, function( match, number ) { 
			return typeof args[number] != 'undefined'
				? args[number]
				: match
			;
		} );
	};
}

function isInt( value ) {
	if ( isNaN( value ) ) {
		return false;
	}
	var x = parseFloat( value );
	return ( x | 0 ) === x;
}

Number.prototype.clamp = function( min, max ) {
	return Math.min( Math.max( this, min ), max );
};

Array.prototype.choice = function() {
	return Phaser.ArrayUtils.getRandomItem( this );
};

function randInt( min, max )
{
	return DungeonGame.game.rnd.integerInRange( min, max );
}
