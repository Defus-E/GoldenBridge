const checkAuth = require('../middleware/checkAuth');

module.exports = (app) => {
	// Все GET запросы
	app.get('/', require('./frontpage').get);
	app.get('/blogs/:id?', require('./blogs').get);
	app.get('/backend/', checkAuth, require('./backend').home);
	app.get('/backend/blog/', checkAuth, require('./backend').blog);
	app.get('/backend/blog/add-post/', checkAuth, require('./backend').add);
	app.get('/backend/blog/edit-post/:id?', checkAuth, require('./backend').edit);
	app.get('/backend/settings/', checkAuth, require('./backend').settings);
	app.get('/backend.login/', require('./login').get);
	app.get('/industries/', require('./industries').get);
	app.get('/contacts/', require('./contacts').get);
	app.get('/services/', require('./services').get);
	app.get('/team/', require('./team').get);

	// Все POST запросы
	app.post('/order-transfer', require('./order-transfer').post);
	app.post('/delete-post', require('./backend').removePost);
	app.post('/add-post', require('./backend').addPost);
	app.post('/edit-post', require('./backend').editPost);
	app.post('/change-name', require('./settings').rName);
	app.post('/change-password', require('./settings').rPassword);
	app.post('/login', require('./login').post);
	app.post('/logout', require('./logout').post);
	app.post('/change-language', require('./change-language').post);
	app.post('/contact-us', require('./contacts').post);
	app.post('/upload-blogs', require('./blogs').post);
}