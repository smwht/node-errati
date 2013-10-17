"use strict";
/* jshint unused:false */
/* global describe:true, it:true, before:true, after:true, beforeEach:true, afterEach:true */

var expect = require('chai').expect;
var Errati = require('../errati');

//
// Helpers
//
var forEach = function( obj, fn ){
	for( var key in obj ){
		if( obj.hasOwnProperty( key ) )
			fn( obj[key], key );
	}
};


describe('Errati', function() {

	//
	// If test fails, log snapshot of Errati
	//
	afterEach(function() {
		if (this.currentTest.state === 'failed')
			console.log( 'Errati snapshot:\n' + Errati);
	});


	//
	// Indexing tests dictionary
	//
	var dict = {
		101: "Error one",
		102: {
			name: 'Error two'
		},
		103: {
			name: 'Error four',
			code: '104'
		}
	};


	//
	// Mapping and Indexing
	//
	it('should default to indexing by name but not code', function(){
		var opts = {
			dictionary: dict,
		};

		Errati.dispose();
		Errati.setup(opts);

		expect(Errati).to.include.keys(['ErrorOne', 'ErrorTwo', 'ErrorFour']);
		expect(Errati).to.not.include.keys(['101', '102', '103', '104']);
	});

	it('should index values and code', function() {
		var opts = {
			dictionary: dict,
			fields: {
				'code': true
			}
		};

		Errati.dispose();
		Errati.setup(opts);

		expect(Errati).to.include.keys(['101', '102', '104']);
		expect(Errati).to.not.include.keys(['103']);
		expect(Errati).to.not.include.keys(['ErrorOne', 'ErrorTwo', 'ErrorFour']);
	});


	//
	// Parse dictionary
	//
	it('should parse dictionary from defaults', function(){
		var opts = {
			dictionary: dict,
		};

		Errati.dispose();
		Errati.setup(opts);

		expect( Errati.ErrorOne ).to.have.property( '_name', 'Error one');
		expect( Errati.ErrorOne ).to.have.property( 'code', '101');
	});

	it('should parse dictionary as array from defaults', function(){
		var array = [
			'Error one',
			{
				name:'Error two'
			},
			{
				name:'Error three',
				some:'value'
			}
		];

		var opts = {
			dictionary: array
		};

		Errati.dispose();
		Errati.setup(opts);

		expect(Errati).to.include.keys(['ErrorOne', 'ErrorTwo', 'ErrorThree']);

		expect( Errati.ErrorOne ).to.have.property( '_name', 'Error one');
		expect( Errati.ErrorOne ).to.not.have.property( 'code' );

		expect( Errati.ErrorThree ).to.have.property( 'some', 'value' );
	});

	//
	// Remap field
	//
	it('should map and index dictionary string values', function () {
		var opts = {
			dictionary: dict,
			fields:{
				map: {
					_value: 'test'
				},

				'test':true
			}
		};

		Errati.dispose();
		Errati.setup(opts);

		expect(Errati.ErrorOne).to.have.property( 'test' );
		expect(Errati.ErrorOne.test).to.equal( 'Error one' );
	});

	it('should map and index dictionary indexes', function() {
		var opts = {
			dictionary: dict,
			fields:{
				map: {
					_index: 'test'
				},

				'test':true
			}
		};

		Errati.dispose();
		Errati.setup(opts);

		expect(Errati['101']).to.have.property( 'test', '101' );
		expect(Errati['101']).to.not.have.property( 'code' );
	});



	//
	// Reflow
	//
	it('should reflow to underscore', function() {
		var opts = {
			dictionary: dict,
			reflow: 'underscore'
		};

		Errati.dispose();
		Errati.setup(opts);

		expect(Errati).to.include.keys(["Error_one", "Error_two", "Error_four"]);
		expect(Errati).to.not.include.keys(['101', '102', '103', '104']);
		expect(Errati).to.not.include.keys(['ErrorOne', 'ErrorTwo', 'ErrorThree']);

	});

	it('should reflow to nospace', function() {
		var opts = {
			dictionary: dict,
			reflow: 'nospace'
		};

		Errati.dispose();
		Errati.setup(opts);

		expect(Errati).to.include.keys(["Errorone", "Errortwo", "Errorfour"]);
		expect(Errati).to.not.include.keys(['101', '102', '103', '104']);
	});

	it('should reflow to function', function() {
		var opts = {
			dictionary: dict,
			reflow: function( str ){
				return str.replace(' ', '-' );
			}
		};

		Errati.dispose();
		Errati.setup(opts);

		expect(Errati).to.include.keys(["Error-one", "Error-two", "Error-four"]);
		expect(Errati).to.not.include.keys(['101', '102', '103', '104']);
		expect(Errati).to.not.include.keys(['ErrorOne', 'ErrorTwo', 'ErrorThree']);

	});


	//
	// Prefix
	//
	it('should prefix indexes', function() {
		var opts = {
			dictionary: dict,
			fields:{
				'name': 'name_',
				'code': 'code_'
			}
		};

		Errati.dispose();
		Errati.setup(opts);

		expect(Errati).to.include.keys(['code_101', 'code_102', 'code_104']);
		expect(Errati).to.include.keys(['name_ErrorOne', 'name_ErrorTwo', 'name_ErrorFour']);

		expect(Errati).to.not.include.keys(['101', 'name_102']);
		expect(Errati).to.not.include.keys(['ErrorOne', 'code_ErrorTwo']);
	});

	it('should have same Class reference in Class indexes', function() {
		var opts = {
			dictionary: dict,
			fields:{
				'code': 'code',
				'name': true
			}
		};

		Errati.dispose();
		Errati.setup(opts);

		expect( Errati.ErrorOne ).to.equal( Errati.code101 );
		expect( Errati.ErrorOne ).to.not.equal( Errati.code102 );
	});




	//
	// Values
	//
	it('should have same values for Class and instance of Class', function() {
		var opts = {
			dictionary: dict
		};

		Errati.dispose();
		Errati.setup(opts);

		expect( Errati.ErrorTwo.code ).to.equal( new Errati.ErrorTwo().code );
		expect( Errati.ErrorFour.code ).to.equal( new Errati.ErrorFour().code );
		expect( Errati.ErrorTwo._name ).to.equal( new Errati.ErrorTwo().name );
		expect( Errati.ErrorFour._name ).to.equal( new Errati.ErrorFour().name );
	});


	//
	// Inheritence
	//
	it('should inherit instances from Class', function () {
		var opts = {
			dictionary: dict
		};

		Errati.dispose();
		Errati.setup(opts);

		var errorOne = new Errati.ErrorOne();

		expect( errorOne instanceof Errati.ErrorOne ).to.equal( true );
		expect( errorOne instanceof Errati.ErrorTwo ).to.equal( false );
	});

	it('should inherit instances from Error', function () {
		var opts = {
			dictionary: dict
		};

		Errati.dispose();
		Errati.setup(opts);

		var errorOne = new Errati.ErrorOne();

		expect( errorOne instanceof Errati.ErrorOne ).to.equal( true );
		expect( errorOne instanceof Error ).to.equal( true );
	});

	//
	// Extend
	//
	it('should extend a Class and instance', function () {
		var dict = {
			101: "Error one",
			102: {
				name: 'Error two',
				test1: 'value1',
				test2: function(){
					return 'value2';
				}
			}
		};

		var opts = {
			dictionary: dict
		};

		Errati.dispose();
		Errati.setup(opts);

		var errorTwo = new Errati.ErrorTwo();

		expect( errorTwo.test1 ).to.equal( 'value1' );
		expect( errorTwo.test2() ).to.equal( 'value2' );

		expect( Errati.ErrorTwo.test1 ).to.equal( 'value1' );
		expect( Errati.ErrorTwo.prototype.test2() ).to.equal( 'value2' );
	});

	it('should extend all Classes and instances', function () {
		var opts = {
			dictionary: dict,
			extend: {
				test1: 'value1',
				test2: function(){
					return 'value2';
				}
			}
		};

		Errati.dispose();
		Errati.setup(opts);

		var errorOne = new Errati.ErrorOne();

		expect( errorOne.test1 ).to.equal( 'value1' );
		expect( errorOne.test2() ).to.equal( 'value2' );

		expect( Errati.ErrorOne.test1 ).to.equal( 'value1' );
		expect( Errati.ErrorOne.prototype.test2() ).to.equal( 'value2' );
	});


	//
	// Extend instantiation
	//
	it('should extend instantiation for a single Class', function () {
		var dict = {
			101: "Error one",
			102: {
				name: 'Error two',
				init: function(){
					this.test = 'value';
				}
			}
		};

		var opts = {
			dictionary: dict
		};

		Errati.dispose();
		Errati.setup(opts);

		var errorOne = new Errati.ErrorOne();
		var errorTwo = new Errati.ErrorTwo();

		expect( errorTwo ).to.have.property( 'test' );
		expect( errorTwo.test ).to.equal( 'value' );
		expect( errorOne ).to.not.have.property( 'test' );
	});

	it('should extend instantiation for all Classes', function () {
		var opts = {
			dictionary: dict,
			extend: {
				init: function(){
					this.test = 'value';
				}
			}
		};

		Errati.dispose();
		Errati.setup(opts);

		var errorOne = new Errati.ErrorOne();
		var errorTwo = new Errati.ErrorTwo();

		expect( errorOne ).to.have.property( 'test' ).equal( 'value' );
		expect( errorTwo ).to.have.property( 'test' ).equal( 'value' );
	});


	//
	// Overrides
	//
	it('should override toString, toObject, toJson for a single class', function () {
		var dict = {
			101: "Error one",
			102: {
				name: 'Error two',
				toString: function(){
					return 'custom toString';
				},
				toObject: function(){
					return { custom:'toObject' };
				},
				toJson:function(){
					return '{"custom":"toJson"}';
				}
			}
		};

		var opts = {
			dictionary: dict,
		};

		Errati.dispose();
		Errati.setup(opts);

		var errorOne = new Errati.ErrorOne();
		var errorTwo = new Errati.ErrorTwo();

		expect( errorTwo.toString() ).to.equal( 'custom toString' );
		expect( errorTwo.toObject() ).to.deep.equal( { custom:'toObject' } );
		expect( errorTwo.toJson() ).to.equal( '{"custom":"toJson"}' );

		expect( errorOne.toString() ).to.not.equal( 'custom toString' );
		expect( errorOne.toObject() ).to.not.deep.equal( { custom:'toObject' } );
		expect( errorOne.toJson() ).to.not.equal( '{"custom":"toJson"}' );
	});

	it('should override toString, toObject, toJson for all classes', function () {
		var opts = {
			dictionary: dict,
			override: {
				toString: function(){
					return 'custom toString';
				},
				toObject: function(){
					return { custom:'toObject' };
				},
				toJson:function(){
					return '{"custom":"toJson"}';
				}
			}
		};

		Errati.dispose();
		Errati.setup(opts);

		forEach( Errati, function( Err, key ){
			var err = new Err();
			expect( err.toString() ).to.equal( 'custom toString' );
			expect( err.toObject() ).to.deep.equal( { custom:'toObject' } );
			expect( err.toJson() ).to.equal( '{"custom":"toJson"}' );
		});
	});


	//
	// Override Arguments
	//
	it('should override parseArgs for all classes', function () {
		var opts = {
			dictionary: dict,
			override: {
				parseArgs:function( args ){
					Error.apply( this, args );
					this.test = Array.prototype.slice.call( args );
				}
			}
		};

		Errati.dispose();
		Errati.setup(opts);

		var errorOne = new Errati.ErrorOne('some', 'arguments');
		expect( errorOne ).to.have.property( 'test' );
		expect( errorOne.test ).to.deep.equal( [ 'some', 'arguments' ]);
	});


	//
	// Override Stack
	//
	it('should override parseStack for all classes', function () {
		var opts = {
			dictionary: dict,
			override: {
				parseStack:function( stack ){
					this.stack = 'custom';
				}
			}
		};

		Errati.dispose();
		Errati.setup(opts);

		var errorOne = new Errati.ErrorOne();

		expect( errorOne ).to.have.property( 'stack' );
		expect( errorOne.stack ).to.equal( 'custom' );
	});


	//
	// Extending Errati
	//
	it('should extend Errati with custom functions', function(){
		var opts = {
			errati:{
				extend:{
					test:function(){ return 'value'; }
				}
			}
		};

		Errati.dispose();
		Errati.setup(opts);
		expect( Errati.test() ).to.equal( 'value' );
	});

});
