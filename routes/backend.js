const path = require('path');
const formidable = require('formidable');
const Blog = require('../models/blog').Blog;
const HttpError = require('../error').HttpError;

exports.home = (req, res, next) => {
	res.redirect('/');
}

exports.blog = (req, res, next) => {
	Blog.find({})
		.exec()
		.then(blogs => {
			const blogData = blogs.map(blog => {
				return {
					id: blog._id,
					title: blog.title.ru
				}
			});
			
			res.render("bc-blog", {blogData: blogData});
		})
		.catch(err => next(err));
}

exports.settings = (req, res, next) => {
	res.render('bc-settings');
}

exports.add = (req, res, next) => {
	res.render('add-post');	
}

exports.edit = (req, res, next) => {
	const url = req.params.id;
	
	if (!url) {
		Blog.find({}).exec()
			.then(blogs => res.render("blogs", {blogs: blogs}))
			.catch(err => next(err));
	} else if (url) {
		const id = /^id=\d\w+$/.test(url) ? url.match(/[^=]+$/g)[0].trim() : 0;

		Blog.findById(id).exec()
			.then(blog => blog ? res.render('edit-post', {blog}) : next(new HttpError(404, {ru: "Страница не найдена", en: "Page not found"})))
			.catch(err => next(new HttpError(404, {ru: "Страница не найдена", en: "Page not found"})));
	} else {
		return next(new HttpError(404, {
			ru: "Страница не найдена",
			en: "Page not found"
		}));
	}
}

exports.addPost = (req, res, next) => {
	const form = new formidable.IncomingForm();

	form.multiples = true;

	form.parse(req, (err, fields, files) => {
		if (err) return next(err);

		Blog.addPost(fields, files, (err) => {
			if (err) return next(err);
			
			res.send({});
		});
	});

	form.on('fileBegin', function (name, file){
		file.path = path.join(__dirname, '../public/blogs_img/' + file.name);
  	});
}

exports.editPost = (req, res, next) => {
	const form = new formidable.IncomingForm();

	form.multiples = true;

	form.parse(req, (err, fields, files) => {
		if (err) return next(err);

		Blog.editPost(fields, files, (err) => {
			if (err) return next(err);

			res.send({});
		});
	});
}

exports.removePost = (req, res, next) => {
	const {id} = req.body;

	Blog.findByIdAndRemove(id).exec()
		.then(() => res.sendStatus(200))
		.catch(err => next(err));
}