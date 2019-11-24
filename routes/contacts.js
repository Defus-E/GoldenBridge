const { HttpError } = require('../error');
const config = require('../config');

const accept = {
	ru: "Мы вам перезвоним!",
	en: "We'll call you back!"
}

const deny = {
	ru: "Ваша заявка отклонена! Файл, который вы пытаетесь отослать не поддерживается.",
	en: "Your application has been rejected! The file you are trying to send is not supported."
}

exports.get = (req, res, next) => {
	res.render('contacts');
}

exports.post = (req, res, next) => {
	const {name, phone} = req.body;

	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			type: config.get('google-api-auth:type'),
			user: config.get('google-api-auth:user'),
			clientId: config.get('google-api-auth:clientId'),
			clientSecret: config.get('google-api-auth:clientSecret'),
			refreshToken: config.get('google-api-auth:refreshToken'),
			accessToken: config.get('google-api-auth:accessToken')
		}
	});

	const mailOptions = {
		from: `"${name}"`,
		to: 'info@gnbridge.com',
		subject: "Обратный звонок",
		text: phone,
		html: `
				<h1>Пожалуйста, перезвоните!</h1>
				<h3>С уважением, ${name}</h3>
				<p style="margin-top: 0">Телефон - <a href="tel:+${phone}">${phone}</a></p>
			`
	};

	transporter.sendMail(mailOptions, (err) => {
		if (err) return next(new HttpError(403, deny[req.session.language]));

		res.send(accept[req.session.language]);
	});
}