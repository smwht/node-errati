"use strict";

var Defaults = require('./defaults');

/**
	Dictionary Parser

*/
module.exports=function( errorsIndex, options ) {
    /* jshint loopfunc:true, shadow:true */

    //
    // Shorthands
    //
    var dictionary = options.dictionary;
    var map = options.fields.map;


    //
    // Parse dictionary to Error Classes
    //
    for (var index in dictionary) {

        var data = dictionary[index];


        //
        // Ensure is object
        //
        if( data.constructor !== Object ){
            var object = {};

            //
            // Map data
            //
            if( map._value )
                object[ map._value ] = data;

            data = object;
        }

        //
        // Map index
        //
        if( map._index && data[map._index] === undefined )
            data[ map._index ] = index;


        //
        // Closure for constructor function
        //
        (function( index, data ) {

            //
            // Constructor
            //
            var ErrorClass = function(){

                //
                // Dictionary scope values
                // (Functions goes in the prototype)
                //
                if( options.extend ){
                    for( var key in options.extend ){
                        if( options.extend[key].constructor !== Function ){

                            // Assign _value
                            this[key] = options.extend[key];
                        }
                    }
                }


                //
                // Element scope values
                // (Functions goes in the prototype)
                //
                if( map._index ){
                    this[map._index] = data[ map._index ];
                }

                for( var key in data ){
                    if( data[key].constructor !== Function ){

                        // Assign data
                        this[key] = data[key];
                    }
                }


                //
                // Parse instantiation Arguments
                // (Calls parseArgs set in prototype)
                //
                if ( arguments && arguments.length ) {
                    this.parseArgs.call( this, arguments );
                }


                //
                // Parse instantiation stack
                // (Calls parseStack set in prototype)
                //
                if( this.parseStack ){
                    this.parseStack.call( this, new Error().stack );
                }

                //
                // Post init function
                // Calls init function, set in prototype)
                //
                if( this.init ){
                    this.init.call( this );
                }


                //
                // Return error
                //
                return this;
            };


            //
            // Prototype
            //
            ErrorClass.prototype = new Error();
            ErrorClass.prototype.stack = Error.prototype.stack;
            ErrorClass.prototype.constructor = ErrorClass;


            //
            // Prototype Defaults
            // (Overrides below)
            //
            for( var i in Defaults.proto ){
                ErrorClass.prototype[ i ] = Defaults.proto[ i ];
            }

            //
            // Shorthand for prototype.name
            // (As function.name are reserved)
            //
            if( data.name ) {
                ErrorClass.prototype.name = data.name;
                ErrorClass._name = data.name;
            }


            //
            // Dictionary scope Extends
            //
            if( options.extend ){
                for( var i in options.extend ){
                    if( options.extend[i].constructor === Function )
                        ErrorClass.prototype[i] = options.extend[i];
                    else
                        ErrorClass[i] = options.extend[i];
                }
            }


            //
            // Dictionary scope Overrides
            // (Does not care if named function is there or not.
            //  Options.extend vs override are primarily for readability)
            //
            if( options.override ){
                for( var i in options.override ){
                    if( options.override[i].constructor === Function )
                        ErrorClass.prototype[i] = options.override[i];
                }
            }


            //
            // Element Scope Values and Functions
            // (Overrides prototype.functions)
            //
            for( var i in data ){
                if( data[i].constructor === Function ){
                    ErrorClass.prototype[i] = data[i];
                }
                else
                    ErrorClass[i] = data[i];
            }


            //
            // Indexing
            //
            for( var i in options.fields ){
                if( data[i] === undefined || options.fields[i] === false ) continue;

                var indexAs = options.fields[i];
                if( indexAs === true || indexAs === undefined )
                    indexAs = '';

                if( options.reflow instanceof Function )
                    indexAs += options.reflow( data[i] );
                else {
                    switch( options.reflow ){
                    case 'underscore':
                        indexAs += Defaults.reflow.underscore( data[i] );
                        break;

                    case 'nospace':
                        indexAs += Defaults.reflow.nospace( data[i] );
                        break;

                    default:
                        indexAs +=  Defaults.reflow.camelCase( data[i] );
                    }
                }

                if( errorsIndex[ indexAs ] )
                    throw new Error( 'Error with index already exists: ' + indexAs );

                errorsIndex[ indexAs ] = ErrorClass;
            }

        }( index, data ));
        // End: Closure for constructor function
    }
};
