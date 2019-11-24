exports.post = (req, res, next) => {
	const {lang} = req.body;

	req.session.language = lang;
	res.sendStatus(200);
}