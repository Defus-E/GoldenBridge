const http = require('http');

class HttpError extends Error {
	constructor(status, reason) {
		super(...arguments);
		Error.captureStackTrace(this, HttpError);
		this.reason = reason || http.STATUS_CODES[status] || "Error";
		this.status = status;
	}

	get name() {
		return 'HttpError';
	}
}

exports.HttpError = HttpError;