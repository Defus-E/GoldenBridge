const app = require('express')();
const path = require('path');
const morgan = require('morgan');
const static = require('serve-static');
const PORT = 80;
const config = require('./config');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('express-error-handler');
const { HttpError } = require('./error');
const helmet = require('helmet');
process.title = 'total: Golden Bridge';
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1);

app.use(helmet());
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cookieParser(config.get('session:secret')));

const sessionStore = require('./libs/sessionStore');

app.use(session({
	secret: config.get('session:secret'),
	key: config.get('session:name'),
	cookie: config.get('session:cookie'),
	saveUninitialized: true,
	resave: false,
	store: sessionStore
}));

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadAdmin'));
app.use(require('./middleware/loadLanguage'));

require('./routes')(app);

app.use(static(path.join(__dirname, 'public')));
app.use('*',  require('./middleware/allRequests'));

app.use((err, req, res, next) => {
	if (typeof err === 'number') {
		err = new HttpError(err);
	}

	if (err instanceof HttpError) {
		res.sendHttpError(err);
	} else {
		console.error(err);
		if (app.get('env') === "development") {
			errorHandler()(err, req, res, next);
		} else {
			err = new HttpError(500);
			res.sendHttpError(err);
		}
	}
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
