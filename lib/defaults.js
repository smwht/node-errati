"use strict";

/**
	Errors prototype defaults

	Overriding, see docs.
*/
module.exports.proto = {
	/**
		To String

		Returns the string 'Error.name: Error.message'.
	*/
	toString:function() {
		return this.name + (this.message ? ': ' + this.message : '');
	},


	/**
		To Object

		Returns a shallow object copy.
		Filters, see docs.
	*/
	toObject:function( opts ) {
		var obj = {};

		for (var key in this) {
			if ( this.hasOwnProperty(key) ){
				if( !opts )
					obj[key] = this[key];
				else if( opts.in ){
					if( opts.in.indexOf( key ) !== -1 )
						obj[key] = this[key];
				}
				else if( opts.ex ){
					if( opts.ex.indexOf( key ) === -1 )
						obj[key] = this[key];
				}
			}
		}
		return obj;
	},


	/**
		To JSON

		Returns JSON object of error.
		Filters, see docs.
	*/
	toJson:function( opts ) {
		return JSON.stringify( this.toObject( opts ) );
	},


	/**
		Default instantiation arguments parser

	*/
	parseArgs:function( args ){
		/* jshint shadow:true */

		// Test arguments
		if ( args.length === 1 ) {

			//
			// Single argument
			//

			var arg = args[0];

			if ( arg ) {
				switch ( arg.constructor ) {

				// Single argument is string, use for instance.message
				case String:
					this.message = arg;
					break;

				// Single argument is object, populate to instance
				case Object:
					for ( var key in arg ) {
						this[key] = arg[key];
					}
					break;


				// Drop single argument in instance.args
				default:
					this.args = arg;
				}
			}
		} else {

			//
			// Multiple arguments
			//

			// If first argument is string, use for instance.message

			if ( args[0].constructor === String ) {
				this.message = args[0];
				delete args[0];
			}

			// Clean up and push arguments to instance.args

			this.args = [];
			for ( var key in args )
				this.args.push( args[key] );
		}
	},


	/**
		Default instantiation stack parser

	*/
	parseStack:function( stack ){
		var arr = stack.split('\n');

		// Change error message
		arr[0] = 'Error: ' + this.name + '. ';
		if( this.message )
			arr[0] += '"' + this.message + '"';

		// Remove line to Errati.js
		arr.splice(1,1);

		// Join array back to string
		this.stack = arr.join('\n');
	}
};


/**
	Reflow functions

*/
module.exports.reflow = {

	/**
		Camel Case
		'error name' -> 'ErrorName'
	*/
	camelCase:function( input ){
		return input.toString().replace(/(\s*)(\w)(\w*)(\s*)/gi, function(a, b, c, d) {
			return c.toUpperCase() + d;
		}).replace(/\W*/g, '');
	},


	/**
		Underscore
		'error name' -> 'error_name'
	*/
	underscore:function( input ){
		return input.toString().replace(/\s+/g, '_' );
	},


	/**
		Nospace
		'error name' -> 'errorname'
	*/
	nospace:function( input ){
		return input.toString().replace(/\s+/g, '' );
	}
};
