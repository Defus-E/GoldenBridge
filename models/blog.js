const mongoose = require('../libs/mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	title: {
		en: {
			type: String,
			required: true
		},
		ru: {
			type: String,
			required: true
		}
	},
	content: {
		en: {
			type: String,
			required: true
		},
		ru: {
			type: String,
			required: true
		}
	},
	cover: {
		type: String,
		default: '/blogs_img/default/hero.png'
	},
	created: {
		type: Date,
		default: Date.now
	}
});

schema.statics.addPost = function (fields, files, callback) {
	const Blog = this;
	const { ru_title, ru_content, en_title, en_content } = fields;

	const newBlog = new Blog({
		title: {
			ru: ru_title,
			en: en_title
		},
		content: {
			ru: ru_content,
			en: en_content
		}
	});

	if (Object.entries(files).length !== 0) {
		const file = files[Object.keys(files)[0]];
		newBlog.cover = `/blogs_img/${file.name}`;
	}
	
	newBlog.save()
		.then(() => callback(null));
}

schema.statics.editPost = function (fields, files, callback) {
	const Blog = this;
	const { id, title, content } = fields;

	Blog.findById(id, (err, blog) => {
		if (err) callback(err);

		if (Object.entries(files).length !== 0) {
			const file = files[Object.keys(files)[0]];
			blog.cover = `/blogs_img/${file.name}`;
		}

		blog.title = title;
		blog.content = content;
	
		blog.save()
			.then(() => callback(null))
			.catch(err => callback(err));
	});
}

exports.Blog = mongoose.model('Blog', schema);