const Admin = require('../models/admin').Admin;

module.exports = (req, res, next) => {
	req.admin = res.locals.admin = null;

	if (!req.session.admin) return next();

	Admin.findById(req.session.admin, (err, admin) => {
		if (err) next(err);

		req.admin = res.locals.admin = admin;
		next();
	});
}