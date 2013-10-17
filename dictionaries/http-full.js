//
// HTTP Status Codes
//

module.exports = {

	//
	// 1xx: Informational
	// Request received, continuing process
	//
	100: 'Continue',
	101: 'Switching Protocols',
	102: 'Processing',

	//
	// 2xx: Success
	// The action was successfully received, understood, and accepted
	//
	200: 'OK',
	201: 'Created',
	202: 'Accepted',
	203: 'Non-Authoritative Information',
	204: 'No Content',
	205: 'Reset Content',
	206: 'Partial Content',
	207: 'Multi-Status',
	208: 'Already Reported',
	226: 'IM Used',

	//
	// 3xx: Redirection
	// Further action must be taken in order to complete the request
	//
	300: 'Multiple Choices',
	301: 'Moved Permanently',
	302: 'Found',
	303: 'See Other',
	304: 'Not Modified',
	305: 'Use Proxy',
	306: 'Reserved',
	307: 'Temporary Redirect',
	308: 'Permanent Redirect',

	//
	// 4xx: Client Error
	// The request contains bad syntax or cannot be fulfilled
	//
	400: 'Bad Request',
	401: 'Unauthorized',
	402: 'Payment Required',
	403: 'Forbidden',
	404: 'Not Found',
	405: 'Method Not Allowed',
	406: 'Not Acceptable',
	407: 'Proxy Authentication Required',
	408: 'Request Timeout',
	409: 'Conflict',
	410: 'Gone',
	411: 'Length Required',
	412: 'Precondition Failed',
	413: 'Request Entity Too Large',
	414: 'Request-URI Too Long',
	415: 'Unsupported Media Type',
	416: 'Requested Range Not Satisfiable',
	417: 'Expectation Failed',
	422: 'Unprocessable Entity',
	423: 'Locked',
	424: 'Failed Dependency',
	425: 'Unassigned',
	426: 'Upgrade Required',
	427: 'Unassigned',
	428: 'Precondition Required',
	429: 'Too Many Requests',
	430: 'Unassigned',
	431: 'Request Header Fields Too Large',

	//
	// 5xx: Server Error
	// The server failed to fulfill an apparently valid request
	//
	500: 'Server Error',
	501: 'Not Implemented',
	502: 'Bad Gateway',
	503: 'Service Unavailable',
	504: 'Gateway Timeout',
	505: 'HTTP Version Not Supported',
	506: 'Variant Also Negotiates', //(Experimental)
	507: 'Insufficient Storage',
	508: 'Loop Detected',
	509: 'Unassigned',
	510: 'Not Extended',
	511: 'Network Authentication Required',
	550: 'Permission Denied'
};
