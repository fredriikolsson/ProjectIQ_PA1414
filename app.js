var express = require('express');
var hbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mysql = require("mysql");
var session = require("express-session");
var expressValidator = require("express-validator");
var MySQLStore = require('express-mysql-session')(session);
var passport = require('passport');
var flash = require('connect-flash');

var index = require('./routes/index');
var users = require('./routes/user');

var app = express();

var database = require('./database.js');

// })

/* Database */

var connection = null;

var options = {
	host: 'localhost',
	user: 'root',
	password: 'falukorv',
	database: 'piq',
	multipleStatements: true
};

connection = mysql.createConnection(options);

require("./config/passport.js");


// app.queryPromise = (sql, param) => {
//     return new Promise((resolve, reject) => {
//         connection.query(sql, param, (err, res) => {
//             if (err) {
//                 reject(err);
//             }
//             resolve(res);
//         });
//     });
// };


//--------------------------------------


// view engine setup
app.set('views', path.join(__dirname, 'views'));
// If I'd like to use HoganJS again
// app.set('view engine', 'hjs');

app.engine('hbs', hbs({
	extname: 'hbs'
}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

//Session setup
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
//app.enable('trust proxy'); // add this line

//Session continue
var sessionStore = new MySQLStore({}, connection);
app.use(session({
	secret: "falukorv",
	saveUninitialized: false,
	resave: false,
	store: sessionStore,
	cookie: {
		maxAge: 180 * 60 * 1000
	}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
	res.locals.allowed = false;
	next();
});


app.use('/user', users);
app.use('/', index);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

exports.connection = connection;
module.exports = app;
