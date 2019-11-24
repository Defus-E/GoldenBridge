const HttpError = require('../error').HttpError;

module.exports = (req, res, next) => {
	if (!req.session.admin) {
		return next(new HttpError(404, {
			ru: "Страница не найдена",
			en: "Page not found"
		}));
	} else {
		next();
	}
}