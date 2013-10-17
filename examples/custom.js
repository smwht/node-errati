"use strict";
/* jshint unused:false, shadow:true */

var log = require('./lib/log');


// 
// Dictionary
// 
var myErrors = {
	'101':{
		name: 'Slow',
		state: 'Urgent',
		attn: 'Tommy',
		official: 'We are on it. Please try again later.'
	},
	'102':{
		name: 'Full',
		state: 'Critical',
		attn: 'TOMMMYYYY!!1!',
		official: 'Service down due to scheduled maintenence.'
	}
};

//
// Options
// 
var options = {
	dictionary: myErrors,
	fields: {
		// Index name field, prefix with 'DiskStorage'
		name: 'DiskStorage'
	},
	extend: {
		// Called at instantiation
		init:function(){
			log( 
				'/h3 Logger:', 
				'ERROR DISK STORAGE [' + this.state.toUpperCase() + ']: ' + this.name, 
				'ATTENTION:' + this.attn
			);
		},

		// Extend all errors with this function
		officialVersion:function(){
			return new Errati.ServerError( this.official );
		}
	}
};

// 
// Errati Setup
// 
var Errati = require('../Errati');

// Load default http errors
Errati.setup();

// Load custom errors
Errati.setup( options );



// 
// Indexed errors
// 
log( 
	'/h1 Indexed errors', 
	''
);
Errati.forEach( function( error, params ){
	log( params.index + ': ' + error._name );
});



// 
// Instantiation
// 
log( '/h1 Instantiation' );


// 
// [DiskStorage] Not accessible 
// 
log( '/h2 DiskStorageSlow' );

var error = new Errati.DiskStorageSlow();

log( '/h3 res.send', 
	error.officialVersion() 
);


// 
// [DiskStorage] Full
// 
log( '/h2 DiskStorageFull' );

var error = new Errati.DiskStorageFull();

log( '/h3 res.send', 
	error.officialVersion() 
);
