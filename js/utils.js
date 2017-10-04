
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

function randFloat( min, max )
{
	return DungeonGame.game.rnd.realInRange( min, max );
}

function extend(base, sub) {
	// Avoid instantiating the base class just to setup inheritance
	// Also, do a recursive merge of two prototypes, so we don't overwrite 
	// the existing prototype, but still maintain the inheritance chain
	// Thanks to @ccnokes
	var origProto = sub.prototype;
	sub.prototype = Object.create(base.prototype);
	for (var key in origProto)	{
		 sub.prototype[key] = origProto[key];
	}
	// The constructor property was set wrong, let's fix it
	Object.defineProperty(sub.prototype, 'constructor', { 
		enumerable: false, 
		value: sub 
	});
}

Object.defineProperties(Array.prototype, {
	count: {
		value: function(query) {
			var count = 0;
			for(let i=0; i<this.length; i++)
				if (this[i]==query)
					count++;
			return count;
		}
	}
});

var RED = 'rgba(255,0,0,0.4)';
var GREEN = 'rgba(0,255,0,0.4)';
var BLUE = 'rgba(0,0,255,0.4)';
