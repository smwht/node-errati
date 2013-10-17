# Errati

Errati is a flexible errors index for NodeJS. It is style agnostic and aims to be adapted to the developers needs instead of the other way round. There are no dependencies and no learning curve to speak of. Register your errors from a dictionary (or use the provided HTTP Standard Codes) and you are ready to go.

The design goals are:

1. Efficiency
2. Flexibility
3. Ease of use


Released under BSD licence.  
Mikael Konttinen / Somewhat Original.

----------

## Table of contents
- [Table of contents](#table-of-contents)
- [Description](#description)
- [Installation](#installation)
- [Options](#options)
- [Dictionaries](#dictionaries)
- [Instance parsers](#instance-parsers)
- [Instance helpers](#instance-helpers)
- [Errati helpers](#errati-helpers)
- [Final notes](#final-notes)
- [Change log](#change-log)

## Description

Start with registering errors from a dictionary, either the provided http codes or a custom dictionary. Errati uses a singletonish pattern to have the indexed errors be consistently provided wherever required. Errors can be used interchangably as reference and/or instances.

The dictionary can be a Javascript Object or Array, depending on your preferences and needs. The dictionary specifies error codes, names, custom values and functions. All definitions are made by the order of generic to specific, meaning you can define values or functions for the entire dictionary and progressively override them for the class and the error instance.

Errati adds a couple of helpers for common needs, all of which can be overridden. The helpers are toString(), toObject() and toJson(). You can easily add custom helpers in your desired scope. Errati also comes with internal parsers for instantiation arguments and stack traces, and a post-instantiation hook. All of these can also be overridden with custom functions.

Errati comes with two dictionaries of HTTP Standard Codes. One "short" dictionary of most used HTTP Standard Errors, and one "full" dictionary of HTTP Standard Codes. Using one of these is optional, as is extending the index with custom dictionaries. Multiple dictionaries can be registered and separated in the index by prefixes.

Errati aims to be as straightforward as possible. All registered Errors are Javascript functions that inherit the prototype from the Javascript Error. 

The code is well documented in case you would need additional functionality that is not provided out of the box. 

Tests are included to verify the functionality of Errati.


----------

## Installation
```javascript
	npm install errati
	
	app.js:
		var options = { /* ... */ };
		var Errati = require('errati').setup( options );
	
	myfile.js:
		var Errati = require('errati');
```

...and you are ready to go. Note that you must call the .setup() function to initialize Errati. If no options are provided, the included "http-short" dictionary of the most common HTTP Standard Errors is loaded.

To load the "http-full" dictionary of HTTP Standard Codes, use the following options.
```javascript
	var options = { dictionary:'http-full' };
	var Errati = require('errati').setup( options );
	
	console.log( Errati );
	// List of registered errors
```
Note that the HTTP dictionaries are not more than collections of standardized codes and names. You can use them for any desired application. 

And to load your custom list of errors:
```javascript
	var myErrors = { '101':'First error', '102':'Second error' };
	var options = { dictionary: myErrors };
	var Errati = require('errati').setup( options );
	
	console.log( Errati )
	// { FirstError: { [Function] _name: 'First error', code: '101' },
	//   SecondError: { [Function] _name: 'Second error', code: '102' } }
	
	console.log( Errati.FirstError );
	// { _name:'First error', code:'101' }
	
	console.log( new Errati.FirstError( 'This is a message') );
	// { name:'First error', code:'101', message:'This is a message' }
```
Note that 'name' is a reserved field for javascript functions, so error classes use the underscore prefixed field '_name' instead.

----------


## Options

Configuration of Errati is done by passing a configuration object (from here; 'options') to the Errati.setup() function. The options specify how the jointly passed [dictionary](#dictionaries) is parsed.


The options are divided in the following main parts:
```javascript
	var options = {
	  /* Defines the errors that are to be parsed and indexed */
	  dictionary: {},
	  
	  /* Defines how the errors are parsed and indexed */
	  fields: {
		map: {}
	  },
	  reflow: '',
	  
	  /* Defines functionality for indexed errors */
	  extend: {},
	  override: {},
	  
	  /* Defines the functionality of Errati itself */
	  errati: {}
	};
```

Options passed to Errati.setup() are a configuration for that particular dictionary. No changes are made to errors already indexed by Errati.

The only exception is the field [options.errati](#.errati) that adds functionality to Errati itself.



### .dictionary

A dictionary of Errors.
```javascript
dictionary:	{}|[]|'http-short'|'http-full'|false
```

- **'http-short'**: Most common HTTP Errors (default)
- **'http-full'**: Full set of HTTP Status Codes

See: [Dictionaries](#dictionaries).

### .fields and .fields.map
Configuration of mapping and indexing of dictionary data.

```javascript
fields: {
	// Mapping
	map: {
		_index: 'field1',		// Dictionary indexes to field1
		_value: 'field2',		// Dictionary string values to field2
	},

	// Indexing and prefixing
	'field1': true,				// Index field1
	'field2': 'prefix1',		// Index field2 with 'prefix1'
	'field3': {					// Index field3 with 'prefix2'
		prefix: 'prefix2'
	},

	//'field4': false			// Superfluous
}
```


Options.fields.map determines how the index and string values (not objects) from the dictionary are to be interpreted. The mapping uses two special fields, _index and _value, prefixed with an underscore to signify that they are not referring to the fields 'index' and 'value', but references to the dictionary.
```javascript
dictionary[ _index ] = _value
```
By default, _index is set to 'code' and _value is set to 'name'. Hence with the default settings:
```javascript
	var options = {
		dictionary: { '100': 'My Error' }
	};
	Errati.setup( options );
	
	console.log( Errati );
	// { MyError: { _name: 'My Error', code: '100' } }
	console.log( Errati.MyError );
	// { _name: 'My Error', code: '100' }
```

Say we'd like to preserve the default mapping of dictionary index to the field 'code' but remap dictionary string values to 'title'. Also, we'd like to index the field 'code' and prefix it with 'code_'.
```javascript
	var options = {
		dictionary: { '100': 'My Error' },
		fields: {
			map: {
				_value: 'title'
			},
			'code': 'code_'
		}
	};
	Errati.setup( options );
	
	console.log( Errati );
	// { code_100: { title: 'My Error', code: '100' } }
	console.log( Errati.code_100 );
	// { title: 'My Error', code: '100' }
```

We can also map the dictionary index and values to something totally different:
```javascript
	var myErrors = { 'emergency': 'Tommy' };
	var options = {
		dictionary: myErrors,
		fields: {
			map: {
				_index: 'state',
				_value: 'blame'
			},
			'state': 'stateOf'
		}
	};
	Errati.setup( options );

	console.log( Errati );
	// { stateOfEmergency: { blame: 'Tommy', state: 'emergency' } }
	console.log( Errati.stateOfEmergency );
	// { blame: 'Tommy', state: 'emergency' }
```


### .reflow
Reflowing of error fields to be indexed to code friendly indexes.
```javascript
reflow:	'CamelCase'|'underscore'|'nospace'|function|false
```

| Reflow     | 'error name '|
|------------|--------------|
| CamelCase  | 'ErrorName'  |
| Underscore | 'error_name' |
| Nospace    | 'errorname'  |


Example of a custom function:
```javascript
	reflow: function( string ){
		return string;
	}
```


### .extend

Extending all errors in dictionary with fields and functions.
```javascript
extend: {
	// Extend all classes and instances with field
	myField: 'value',
	
	// Extend all instances with function
	myHelper: function(){
		/* this... */
	},
	
	// Custom function called after error instantiation
	init: function(){
		/* this... */
	}
},
```
As all fields are populated in the order from generic to specific (Dictionary > Class > Instance), you can also add default values that are later specified per class or instance.

For example:
```javascript
	var myErrors = {
		'101': { name: 'Error One' 	},
		'102': { name: 'Error Two', message: 'Class message' }
	};
	var options = {
		dictionary: myErrors,
		extend: {
			message: 'Dictionary message'
		}
	};
	Errati.setup( options );

	console.log( Errati.ErrorOne.message );
	// Dictionary message
	console.log( Errati.ErrorTwo.message );
	// Class message
	console.log( new Errati.ErrorTwo('Instance message').message );
	// Instance message
```


#### .extend.init
There is also the "hook" options.extends.init (actually just a field) for a function to be run post instantiation of an error.

The init function takes no arguments, but is scoped to the instance, meaning you have the full instance with the keyword "this". Init follows the same chain of population, so you can define generic and custom init functions. Note that init is called at instantiation only.

For example:
```javascript
	var myErrors = {
		'101': { name: 'Error One' 	},
		'102': { 
			name: 'Error Two',
			init: function(){
				console.log( 'I am totally second:', this.toString() );
			}
		}
	};
	var options = {
		dictionary: myErrors,
		extend: {
			init: function(){
				console.log( 'I am error:', this.toString() );
			}
		}
	};
	Errati.setup( options );
	
	new Errati.ErrorOne();
	// I am error: Error One
	new Errati.ErrorTwo();
	// I am totally second: Error Two
```





### .override

Overriding default functions for error instances.
```javascript
override:{
	toString:function(){ /* this... */ return string; },
	toObject:function(){ /* this... */ return object; },
	toJson:function(){ /* this... */ return json; },
	parseArgs:function(args){ /* this... */ },
	parseStack:function(stacktrace){ /* this... */ this.stack = stacktrace }
}
```

The sections extend and override function in a near identical fashion, meaning options.override also populates from generic to specific, with the exception that functions in the options.override are already populated by default functions. The separation of these in to two fields is somewhat by principle but mostly for legibility.

These helper functions are also available for class use in the class prototype
(Errati.MyError.prototype).


### .errati
This section is for configuring Errati itself. Currently the only field is options.errati.extend that extends Errati with custom functions.

For example:
```javascript
errati:{
	extend: {
		getNames:function(){
			var names = [];
			for( var key in this ){
				if( this.hasOwnProperty( key ) )
					names.push( key );
			}
			return names;
		}
	}
}
```

---
## Dictionaries

The dictionary can be either an Object or an Array, depending on needs and preferences.

```javascript
	var myErrors = [ 'First error', 'Second error', 'Third error' ];
	
	var myErrors = {
		// Plain
		'101':'Error one',
		
		// Extends
		'102':{
			name: 'Error two',
			some: 'value',
			my: function(){ /* code */ }
		},
		
		// Overrides		
		'103':{
			name: 'Error four',
			code: '104',
			toString: function(){ /* code */ }
		}
	}
```

Errati.setup() can be called multiple times for multiple dictionaries, sets with different values/functions and/or for some other structural divisions. 

Be sure to have unique indexes for all errors. Make use of prefixes ([see Fields](#.fields-and-.fields.map)) for different sets with identical error codes or names. Errati throws an error if you attempt to register duplicates with identical index.


----------


## Instance parsers

### Arguments parser

The instatiation arguments parser aims to provide a flexible error constructor with the assumption that errors are commonly instantiated with a message.

It works by the following principles, in order:

1. If the first argument is a String, it is the message.
2. If the first argument is an Object with the field 'message', all its fields are merged to the instance.
3. Additional arguments are passed to an array in the field 'args'.
4. If the first argument is not a String and has no field 'message', all arguments are passed to the field 'args'.

Examples:
```javascript
	new Errati.MyError( 'My message' );
	-> { name:'My Error', message:'My message', ... }
	
	new Errati.MyError( 'My message', { some:'value' } );
	-> { name:'My Error', message:'My message', args:[{ some:'value' }], ...  }
	
	new Errati.MyError( { message: 'My message', some:'value' } );
	-> { name:'My Error', message:'My message', some:'value', ... }
	
	new Errati.MyError( { some:'value' }, { another:'value' } );
	-> { name:'My Error', args:[{some:'value'}, {another:'value'}], ... }
```
Note that the arguments parser sidesteps the regular Error instantiation behaviour. 

If you wish to retain this, simply override the arguments parser with:
```javascript
	override: {
		parseArgs:function(){
			Error.apply( this, arguments );
		}
	}
```


### Stack parser

The single purpose of the instantiation stack parser is to provide a stack trace that tops on where the error was instantiated. It simply removes the lines that refer to Errati from the stack trace.

It can be overridden as:
```javascript
	override: {
		parseStack:function( stacktrace ){
			/* do something */
			this.stack = stacktrace;
		}
	}
```

----------

## Instance Helpers

Instanced errors have by default the following helper functions with the following behaviour. All of these can be [overridden with custom functions](#.override).

### .toString()

Returns a string representation that is limited to the error name and a colon separated message, if a such exists.

Example:
```javascript
	console.log( new Errati.MyError('I am message').toString() );
	// My error: I am string.
	console.log( new Errati.MyError() );
	// My error
```


### .toObject()

Parameters:

	filters	{ in:[] || ex:[] }  (optional)


Returns a cloned object without the error prototype. Note that Errati returns a shallow (- only relevant if you want to work with the error instance or nested the values in intact form later).

This helper also has a simple filtering function for first level fields. The filtering is done either by including or excluding field names, but not both. Filtering is set by passing an Object with the fields 'in' or 'ex', containing an Array of field names to include or exclude.

Examples:
```javascript
	console.log( myError.toObject( { in:['name'] } ) );
	// { name:'My error' }
	console.log( myError.toObject( { ex:['name'] } ) );
	// { code:'100', some:'value' }
```


### .toJson()

Parameters:

	filters	{ in:[] | ex:[] }   (optional)


This is a wrapper for JSON.stringify that also applies the filtering function for toObject.

Examples:
```javascript
	console.log( myError.toJson( { in:['name'] } ) );
	// { "name":"My error" }
	console.log( myError.toJson( { ex:['name'] } ) );
	// { "code":"100", "some":"value" }
```


----------

## Errati helpers

### .toString()

Parameters:

	tabulator	string  (optional)


This helper returns a string representation of the Errati errorsIndex. You can pass a custom string for the tabulator. By default the tabulator is two spaces.

Examples:
```javascript
	console.log( Errati.toString() );
	// ErrorOne: {
	//   _name: "Error One",
	//   code: "101"
	// },
	// ErrorTwo: {
	//   _name: "Error Two",
	//   code: "102"
	// }
```
	

### .forEach()

Parameters:

	callback	function
	arguments	(optional)

Iterate through all registered errors. The callback should be formulated as:
```javascript
function( error, params ){}
```
And 'params' contain the following fields:

- **index**: The errors indexing value
- **errati**: The errati instance
- **args**: An array of addtional arguments

Example:
```javascript
	Errati.forEach( function( err, params){
		console.log( params.args, params.index, err._name );
	}, 'Hello' );
	// [ 'Hello' ] 'ErrorOne' 'Error One'
	// [ 'Hello' ] 'ErrorTwo' 'Error Two'
```


### .count()

Parameters:

	prefix	string  (optional)

Counts the number of registered errors. If a prefix string is provided, it returns the number of errors that starts with the provided string.

Example:
```javascript
	Errati.count();
	// 15
	Errati.count('dbs_');
	// 4
```


----------


## Final notes
Take a look at the examples directory and the code for in depth understanding of how Errati works. Some of you may find individual prototypes for errors classes an anti-pattern. I partly agree with this, but it was a conscious decision due to the following factors: 

1. Efficiency. Less lookup, less prototype chains to traverse. 
2. Legibility of code is largely improved by the current solution.
3. The overhead is neglible. 

I know there be Javascript-fu to name dynamic functions (http://marcosc.com/2012/03/dynamic-function-names-in-javascript/), but them being eval'y hacks, I decided to stick with the _name field in error classes. Please let me know if you know of a better way to do this.

I'm considering a plugin system to make Errati easier to extend with third party modules. Not sure if anyone would use it. Let me know if this would be a big improvement.


---


## Change log

0.9.0
Going public! Release candidate for version 1.0.0
Documentation.
Tests.
