exports.get = (req, res, next) => {
	const id = +req.query.id;

	if (id && typeof id === 'number' && (id >= 0 && id <= 8)) {
		if ((id >= 5 && id <= 7) && req.session.language == 'en') {
			res.render(`services/service_${id + 1}`, { id });
		} else if (id == 8 && req.session.language === 'en') {
			res.redirect('/services?id=1');
		} else {
			res.render(`services/service_${id}`, { id });
		}
	} else {
		res.redirect('/services?id=1');
	}
}