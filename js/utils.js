
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

Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}

function pointCmp( point, coordList ) {
	if ( Phaser.Point.prototype.isPrototypeOf( point ) )
		point = [point.x, point.y];

	for ( var i=0; i<coordList.length; i++ )
	{
		var coords = coordList[i];
		if ( Phaser.Point.prototype.isPrototypeOf( coords ) )
			coords = [coords.x, coords.y];
		if ( coords[0] == null )
			console.error("Wrong coord type:", coords);

		if ( point[0] == coords[0] && point[1] == coords[1] )
			return true;
	}
	return false;
}

function tweenTint( obj, startColor, endColor, time )
{
	var colorBlend = {step: 0};
	var colorTween = DungeonGame.game.add.tween(colorBlend).to({step: 100}, time);

	colorTween.onUpdateCallback(function() {
		obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
	});

	obj.tint = startColor;
	colorTween.start();
};

// Warn if overriding existing method
if(Array.prototype.equals)
	console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
	// if the other array is a falsy value, return
	if (!array)
		return false;

	// compare lengths - can save a lot of time 
	if (this.length != array.length)
		return false;

	for (var i = 0, l=this.length; i < l; i++) {
		// Check if we have nested arrays
		if (this[i] instanceof Array && array[i] instanceof Array) {
			// recurse into the nested arrays
			if (!this[i].equals(array[i]))
				return false;	   
		}		   
		else if (this[i] != array[i]) { 
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;   
		}		   
	}	   
	return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

var RED = 'rgba(255,0,0,0.4)';
var YELLOW = 'rgba(255,255,0,0.4)';
var GREEN = 'rgba(0,255,0,0.4)';
var CYAN = 'rgba(0,255,255,0.4)';
var BLUE = 'rgba(0,0,255,0.4)';
var PURPLE = 'rgba(255,0,255,0.4)';
