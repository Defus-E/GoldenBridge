const language = {
	en: require('../language/en.json'), // Загрузка английской версии
	ru: require('../language/ru.json') // Загрузка русской версии
}

module.exports = (req, res, next) => {
	// Загружаю русский язык, как язык по умолчанию
	// Делаю доступ к переменной "lang" всем страницам сайта
	req.lang = res.locals.lang = language.ru;
	
	// Если в сессии нет переменной "language", то присвоить ей значение по умолчанию 'ru'
	if (!req.session.language) req.session.language = 'ru';
	
	// После сета значения переменной language, делаем доступ к переменной lang всем страницам сайта, но уже с тем языком, чье значение лежит в сессии
	req.lang = res.locals.lang = language[req.session.language];

	next(); // Передаю управление дальше
}