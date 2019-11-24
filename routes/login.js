const Admin = require('../models/admin').Admin;
const HttpError = require('../error').HttpError;
const AuthError = require('../models/admin').AuthError;

exports.get = (req, res, next) => {
	req.session.destroy();

	res.render('admin-login');
}

exports.post = (req, res, next) => {
	const data = req.body;

	Admin.signIn(data, (err, admin) => {
		if (err) {
			if (err instanceof AuthError) {
				return next(new HttpError(403, err.message));
			} 
			
			return next(err);
		}

		req.session.admin = admin._id;
		res.send({});
	});
}