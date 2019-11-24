const HttpError = require('../error').HttpError;
const Blog = require('../models/blog').Blog;

let total_count = 0;
let count;

exports.get = (req, res, next) => {
	const url = req.params.id;
	
	count = 3;

	if (!url) {
		Blog.countDocuments().then(count => total_count = count);

		Blog.find({})
			.limit(6)
			.select('_id title cover')
			.exec()
			.then(blogs => {
				if (blogs.length === 0) return next(new HttpError(404, {
					ru: "Информация отсутствует",
					en: "Information not found"
				}));
				
				res.render("blogs", { blogs });
			})
			.catch(err => next(err));
	} else if (url) {
		const id = /^id=\d\w+$/.test(url) ? url.match(/[^=]+$/g)[0].trim() : 0;

		Blog.findById(id).exec()
			.then(blog => res.render('blog', {blog: blog}))
			.catch(err => next(new HttpError(404, {
				ru: "Страница не найдена",
				en: "Page not found"
			})));
	} else {
		return next(new HttpError(404, {
			ru: "Страница не найдена",
			en: "Page not found"
		}));
	}
}

exports.post = (req, res, next) => {
	count += 3;

	Blog.find({})
		.skip(count)
		.limit(3)
		.select('_id title cover')
		.exec()
		.then(blogs => {
			const is_admin = req.session.admin ? true : false;
			const total_elements = count + 3 >= total_count ? true : false;
			res.send({blogs, is_admin, total_elements});
		})
		.catch(err => next(err));
}