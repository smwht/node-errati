"use strict";

//
// Quick'n'dirty output helper
//

var heading = function( str ){
	return str.replace( /(\/\w+)\s*(.*)/,
		function(org, a, b) {
			switch (a) {
			case '/h1':
				return '\n\n### ' + b;
			case '/h2':
				return '\n## ' + b;
			case '/h3':
				return '\n# ' + b;
			default:
				return b;
			}
		});
};

module.exports = function log() {
	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];

		if ( arg && arg.constructor === String)
			arg = heading( arg );

		console.log( arg );
	}
};
