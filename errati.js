//
// Errati
// HTTP and Custom Errors for NodeJS
//
// By Mikael Konttinen
// mikael@smwht.org
//
// see LICENSE.txt
//

"use strict";

//
// Errors Index
//
var ErrorsIndex = require('./lib/errorsindex');
var errorsIndex = new ErrorsIndex();

//
// Dictionary Parser
//
var dictionaryParser = require('./lib/dictionaryparser');


/**
	Setup

	See documentation.
*/
ErrorsIndex.prototype.setup = function(options) {

	//
	// Options and Defaults
	//
	options = options || {};

	//
	// Dictionary
	//
	options.dictionary = options.dictionary || options.dict;
	delete options.dict;

	options.dictionary = ( options.dictionary === false ? false : options.dictionary || 'http-short' );

	//
	// Fields
	//
	options.fields = options.fields || { 'name':true };

	//
	// Map
	//
	options.fields.map = options.fields.map || {};

	//
	// _index
	//
	options.fields.map._index =
		( options.fields.map._index === false ) ?
		false : ( options.fields.map._index || 'code' );

	if( options.dictionary && options.dictionary.constructor === Array )
		options.fields.map._index = false;

	//
	// _value
	//
	options.fields.map._value =
		( options.fields.map._value === false ) ?
		false : ( options.fields.map._value || 'name' );

	//
	// Reflow
	//
	options.reflow = options.reflow || 'CamelCase';

	//
	// Extend
	//
	options.extend = options.extend || {};

	//
	// Override
	//
	options.override = options.override || {};

	//
	// Errati
	//
	if( options.errati || options.Errati ){
		var errati = options.errati || options.Errati;

		if( errati.extend ){
			for( var key in errati.extend ){
				ErrorsIndex.prototype[key] = errati.extend[key];
			}
		}

		// If no dictionary or http explicitly set, exit
		if( !options.dictionary && !options.http )
			return errorsIndex;

		delete options.errati;
		delete options.Errati;
	}


	//
	// Parse dictionary
	//
	if (options.dictionary) {
		switch( options.dictionary ){
		case 'http-short':
		case 'short':
			options.dictionary = require('./dictionaries/http-short');
			break;
		case 'http-full':
		case 'full':
			options.dictionary = require('./dictionaries/http-full');
			break;
		default:
		}
		dictionaryParser( errorsIndex, options );
	}

	//
	// Return Errors Index
	//
	return errorsIndex;
};


/**
	Dispose all indexed errors
*/
ErrorsIndex.prototype.dispose = function(){
	for( var key in errorsIndex ){
		if( errorsIndex.hasOwnProperty( key ) )
			delete errorsIndex[ key ];
	}

	return errorsIndex;
};


module.exports = exports = errorsIndex;
