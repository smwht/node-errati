"use strict";

//
// Errors Index Object
//
var ErrorsIndex = function(){};

//
// Prototype
//
ErrorsIndex.prototype = {};


/**
	To String

	arguments:
		tab: Sets tabulator (optional)
*/
ErrorsIndex.prototype.toString = function( tab ){
	tab = tab || '  ';
	var nl = '\r\n';
	var tabs = '';
	var str = '';

	var stringify = function( object, tabs ){
		var errors = [];

		for( var index in object ){
			if( object.hasOwnProperty( index ) )
				errors.push( index );
		}

		for( var i = 0 ; i < errors.length ; i++ ){
			var key = errors[ i ];
			switch( object[key].constructor ){
			case Object:
			case Array:
			case Function:
				str += tabs + key + ': {' + nl;
				stringify( object[key], tabs + tab );
				str += tabs + '}';
				break;
			default:
				str += tabs + key + ': "' + object[key] + '"';
			}
			str += ( i < errors.length -1 ? ', ' : '' ) + nl;
		}



		return str;
	};

	return stringify( this, tabs );
};


/**
	For Each

	arguments:
		function:	function to call for each registered error
		additional, arguments:	arguments to pass along (optional)

	function calls
		function( error, {
			index: the errors indexing value,
			errati: the errati instance,
			args: [additional, arguments]
		})
*/
ErrorsIndex.prototype.forEach = function( fn ){
	var args = Array.prototype.slice.call(arguments);
	args.splice( 0, 1 );

	for( var key in this ){
		if( this.hasOwnProperty( key ) ){
			var data = { index:key, errors:this };
			if( args.length )
				data.args = args;
			fn( this[key], data );
		}
	}
};


/**
	Count

	arguments:
		prefix:	count only errors that start with (optional)

*/
ErrorsIndex.prototype.count = function( prefix ){
	var count = 0;

	for( var key in this ){
		if( this.hasOwnProperty( key ) ) {
			if( !prefix || ( prefix && key.indexOf( prefix ) === 0 ) )
				count++;
		}
	}

	return count;
};


module.exports = ErrorsIndex;
