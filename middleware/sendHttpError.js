module.exports = (req, res, next) => {
	res.sendHttpError = (error) => { // Создаём метод sendHttpError
		res.status(error.status); // Ставим соответствующий статус

		// Если Ajax-запрос, то отправить ошибку в JSON-формате
		if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
			res.json(error);
		} else {
			res.render("error", {
				error: error
			});
		}
	};

	next(); // Передаём управление дальше
};