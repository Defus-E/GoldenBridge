const Admin = require('../models/admin').Admin;
const HttpError = require('../error').HttpError;
const AuthError = require('../models/admin').AuthError;

exports.rName = (req, res, next) => {
	const data = req.body;

	Admin.changeName(data, err => {
		if (err) return next(err);

		res.send("Имя админисратора успешно изменено!");
	});
}

exports.rPassword = (req, res, next) => {
	const data = req.body;

	Admin.changePassword(data, err => {
		if (err) {
			if (err instanceof AuthError) {
				return next(new HttpError(403, err.message));
			} 
			
			return next(err);
		}

		res.send("Пароль успешно изменён!");
	});
}