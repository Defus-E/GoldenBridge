const { HttpError } = require('../error');
const nodemailer = require('nodemailer');
const formidable = require('formidable');
const config = require('../config');

const accept = {
	ru: "Ваша заявка успешно отправлена!",
	en: "Your request has been sent successfully!"
}

const deny = {
	ru: "Ваша заявка отклонена! Произошла ошибка. Возможно, файл не поддерживается.",
	en: "Your application has been rejected! An error has occurred. Perhaps, the file is not supported."
}

exports.post = (req, res, next) => {
	const form = new formidable.IncomingForm();

	form.multiples = true;

	form.parse(req, (err, fields, files) => {
		if (err) return next(err);

		sendMail(fields, files)
			.then(() => res.send(accept[req.session.language]))
			.catch(err => {
				console.log(err);
				next(new HttpError(403, deny[req.session.language]))
			});
	});
}

async function sendMail({name, phone, email, message}, files) {
	const attachments = [];

	if (files && Object.keys(files).length !== 0) {
		for(const key in files) {
			const file = files[key];
			const params = {
				filename: file.name,
				path: file.path
			}

			attachments.push(params);
		}	
	}

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
		from: `"${name}" <${email}>`,
		to: 'info@gnbridge.com',
		subject: "Заказ перевода",
		text: message,
		html: `
				${message}
				<h3>С уважением, ${name}</h3>
				<p style="margin-bottom: 0">Почта - <a href="mailto:${email}">${email}</a></p>
				<p style="margin-top: 0">Телефон - <a href="tel:+${phone}">${phone}</a></p>
			`,
		attachments: attachments
	};

	await transporter.sendMail(mailOptions);
}