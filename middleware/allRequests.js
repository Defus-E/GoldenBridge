const { HttpError } = require('../error');
const iputil = require('ip');
const fs = require('fs');
const PATH = "./info.log";

module.exports = (req, res, next) => {
	const url = req.originalUrl;
	const php = /.php$/.test(url) ? url.match(/.php$/)[0] : null;

	let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||(req.connection.socket ? req.connection.socket.remoteAddress : null);

	if (!ipAddress) return next();
	if (iputil.isV6Format(ipAddress) && ~ipAddress.indexOf('::ffff')) ipAddress = ipAddress.split('::ffff:')[1];
	if (iputil.isV4Format(ipAddress) && ~ipAddress.indexOf(':')) ipAddress = ipAddress.split(':')[0];

	const fDate = new Date();

	const date = {
		day: fDate.getDate() < 10 ? `0${fDate.getDate()}` : fDate.getDate(),
		month: fDate.getMonth() + 1 < 10? `0${fDate.getMonth() + 1}` : fDate.getMonth() + 1,
		year: fDate.getFullYear(),
		hours: fDate.getHours() < 10 ? `0${fDate.getHours()}` : fDate.getHours(),
		minutes: fDate.getMinutes() < 10 ? `0${fDate.getMinutes()}` : fDate.getMinutes()
	};

	if (php) {
		console.log("\x1b[41m", `${ipAddress} - Попытка перейти по ссылке с окончанием .php`, '\x1b[0m');

		fs.exists(PATH, exst => {
			if (!exst) fs.writeFile('info.log', '', 'utf8', err => err ? next(err) : console.log('\x1b[32m','The file is created.', '\x1b[0m'));

			fs.readFile(PATH, 'utf8', (err, fd) => {
				if (err) return next(err);
				fd += `${ipAddress} - ${date.day}:${date.month}:${date.year} ${date.hours}:${date.minutes} - попытка перейти на .php\n`;

				fs.writeFile(PATH, fd, err => err ? next(err) : console.log('\x1b[33m','The file is changed.', '\x1b[0m'));
			});
		});
	} else {
		fs.exists(PATH, exst => {
			if (!exst) fs.writeFile('info.log', '', 'utf8', err => err ? next(err) : console.log('\x1b[32m','The file is created.', '\x1b[0m'));

			fs.readFile(PATH, 'utf8', (err, fd) => {
				if (err) return next(err);
				fd += `[${ipAddress} - ${date.day}:${date.month}:${date.year} ${date.hours}:${date.minutes} - ${url} - ${req.headers['user-agent']}]\n`;

				fs.writeFile(PATH, fd, err => err ? next(err) : console.log('\x1b[33m','The file is changed.', '\x1b[0m'));
			});
		});
	}

	return next(new HttpError(404, {
		ru: "Страница не найдена",
		en: "Page not found"
	}));
}