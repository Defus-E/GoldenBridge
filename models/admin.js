const crypto = require('crypto');
const config = require('../config');
const mongoose = require('../libs/mongoose');
const { Schema } = mongoose;

const ObjectID = config.get('admin:id');

const schema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	hashedPassword: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	}
});

schema.methods.encryptPassword = function (password) {
	return crypto.createHmac('sha256', this.salt).update(password).digest('hex');
};

schema.methods.checkPassword = function (password) {
	return this.encryptPassword(password) === this.hashedPassword;
};

schema.virtual('password')
	.set(function (password) {
		this._plainPassword = password;
		this.salt = Math.random() + '';
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function () {
		return this._plainPassword;
	});

schema.statics.signIn = function (data, callback) {
	const Admin = this;
	const {name, password} = data;

	Admin.findOne({name: name})
		.exec()
		.then(admin => {
			if (admin) {
				if (admin.checkPassword(password)) {
					callback(null, admin);
				} else {
					callback(new AuthError("Неверный пароль"));
				}
			} else {
				callback(new AuthError("Введено неверное имя администратора"));
			}
		})
		.catch(err => callback(err));
}

schema.statics.changeName = function (data, callback) {
	const Admin = this;
	const {name} = data;

	Admin.findById(ObjectID)
		.exec()
		.then(admin => {
			if (admin) {
				admin.name = name;
						
				admin.save()
					.then(() => callback(null));
			}
		})
		.catch(err => callback(err));
}

schema.statics.changePassword = function (data, callback) {
	const Admin = this;
	const {current_password, new_password, confirm} = data;

	Admin.findById(ObjectID)
		.exec()
		.then(admin => {
			if (admin.checkPassword(current_password)) {
				if (new_password === confirm) {
					admin.hashedPassword = admin.encryptPassword(new_password);
					
					admin.save()
						.then(admin => callback(null));
				} else {
					callback(new AuthError("Пароли не совпадают"));
				}
			} else {
				callback(new AuthError("Неверный текущий пароль"));
			}
		})
		.catch(err => callback(err));
}

exports.Admin = mongoose.model('Admin', schema);

class AuthError extends Error {
	constructor(message) {
		super(...arguments);
		Error.captureStackTrace(this, AuthError);
		this.message = message;
	}

	get name() {
		return 'AuthError';
	}
}

exports.AuthError = AuthError;