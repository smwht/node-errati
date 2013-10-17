"use strict";

var log = require('./lib/log');



// 
// Setup defaults
// 
var Errati = require('../Errati');
Errati.setup();

// 
// Errati
// 
log( 
    '/h1 Errati default errors',
    Errati 
);

// 
// Class
// 
log( '/h1 Error class:',
    Errati.BadRequest
);

// 
// Instance
// 
log( '/h1 Error instance:',
    new Errati.BadRequest()
);

// 
// Messages
// 
log( '/h2 Messages' );

log( "/h3 new Errati.BadRequest( 'I am wrong' )", 
    new Errati.BadRequest( 'I am wrong' )
);

log( "/h3 new Errati.BadRequest( { message:'I am wrong', some:'value' } )", 
    new Errati.BadRequest( { message:'I am wrong', some:'value' } )
);

log( "/h3 new Errati.BadRequest( 'I am wrong', { some:'value' } )", 
    new Errati.BadRequest( 'I am wrong', { some:'value' } )
);

log( "/h3 new Errati.BadRequest( { some:'value' }, { another:'value' } )", 
    new Errati.BadRequest( { some:'value' }, { another:'value' } )
);

// 
// Handling errors
// 
log( '/h1 Handling errors' );

function firstFunction(){
    secondFunction();
}

function secondFunction(){
    finalFunction();
}

function finalFunction(){
    test( false, function( err, data ){
        if( err ) throw err;

        log( '/h2 Success:', data );
    });
}

function test( value, cb ){
    if( !value ) 
        return cb( new Errati.BadRequest( 'I can\'t believe this!' ) );

    cb( null, 'It might actually work.' );
}

try{
    firstFunction();
} catch( err ){
    log( '/h2 Error was thrown', err );
    log( '/h3 Stacktrace', err.stack );
}
