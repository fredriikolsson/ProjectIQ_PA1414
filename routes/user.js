var express = require('express');
var router = express.Router();
var database = require('../database.js');
var passport = require('passport');
var flash = require('connect-flash');
var csrf = require("csurf");

var app = require("../app.js");

var csrfProtection = csrf();

var connection = null;
var mysql = require("mysql")
var options = {
	host: 'localhost',
	user: 'root',
	password: 'falukorv',
	database: 'piq',
	multipleStatements: true
};

var allowed = false;

connection = mysql.createConnection(options);

router.use(csrfProtection);

router.get('/profile', isLoggedIn, isUser, function (req, res, next) {
	console.log(req.user.userType);
	res.render('userProfile', {
		login: "Logout",
		currentUser: req.user.email
	});
});

router.get("/addProject", isLoggedIn, isUser, (req, res, next) => {
	res.render("addProject", {
		login: "Logout",
		success: req.session.success,
		errors: req.session.errors,
		csrfToken: req.csrfToken(),
		currentUser: req.user.email
	});

	req.session.success = null;

});

router.post("/addingProject", isLoggedIn, isUser, (req, res, next) => {
	var data = {};

	req.check("name", "Can't leave 'Name' field empty").notEmpty();
	req.check("signDate", "Can't leave 'Sign date' field empty").notEmpty();
	req.check("deadline", "Can't leave 'Deadline' field empty").notEmpty();
	req.check("customer", "Can't leave 'Customer' field empty").notEmpty();
	req.check("budget", "Invalid budget").notEmpty().isNumeric();
	req.check("delivery", "Can't leave 'Delivery' field empty").notEmpty();
	req.check("purpose", "Can't leave 'Purpose' field empty").notEmpty();
	req.check("team", "Can't leave 'Team' field empty").notEmpty();
	req.check("technology", "Can't leave 'Technology' field empty").notEmpty();
	console.log(req.body.technology)

	var errors = req.validationErrors();
	console.log(errors);
	if (errors) {
		console.log("Im going into errors because there are errors");
		req.session.errors = errors;
		req.session.success = false;
		res.redirect('/user/addProject/');
		res.end();
	} else {

		data.params = [req.body.name, req.body.signDate, req.body.deadline, req.body.customer, req.body.budget, req.body.delivery, req.body.purpose, req.body.team, req.body.technology];
		data.sql = `INSERT INTO Project (name, signDate, deadline, customer, budget, delivery, purpose, team, technology, owners)
		VALUES('` + data.params[0] + `', '` + data.params[1] + `', '` + data.params[2] + `', '` + data.params[3] + `', '` + data.params[4] + `', '` + data.params[5] + `', '` + data.params[6] + `', '` + data.params[7] + `', '` + data.params[8] + `', '` + req.user.email + `')`;
		connection.query(data.sql, (error, results, fields) => {
			if (error)
				throw error;

			res.redirect("/user/projects");
		});
	}

});

router.get('/projects', isLoggedIn, isUser, (req, res, next) => {
	console.log("Är i projekt");
	var data = {};
	var projects;

	data.sql = "SELECT * FROM Project WHERE find_in_set('" + req.user.email + "' , owners);";

	connection.query(data.sql, (error, results, fields) => {
		if (error)
			throw error;
		projects = results;
		res.render('projects', {
			login: "Logout",
			projects: projects
		});
	});
});

router.get('/profile/admin', isLoggedIn, isAdmin, (req, res, next) => {
	var data = {};
	var users;
	var projects;
	data.users = "SELECT * FROM Users;";
	data.projects = "SELECT * FROM Project;";
	connection.query(data.projects, (error, results, fields) => {
		if (error)
			throw error;

		projects = results;
		connection.query(data.users, (err, results2, fields2) => {
			if (err)
				throw err;

			users = results2;
			res.render('admin', {
				csrfToken: req.csrfToken(),
				login: "Logout",
				user: users,
				projects: projects,
				currentUser: req.user.email
			});
		});
	});
});

router.post("/changeOwner", isLoggedIn, isAdmin, (req, res, next) => {
	var data = {};
	var emailToAdd = "," + req.body.toAdd;
	data.sql = "UPDATE Project SET owners = CONCAT(owners, '" + emailToAdd + "') WHERE id = '" + req.body.toChange + "'";
	console.log(data.sql);
	connection.query(data.sql, (err, results, fields) => {
		if (err)
			throw err;

		res.redirect('/user/profile/admin');
	});
});

router.get('/profile/boss', isLoggedIn, isBoss, (req, res, next) => {
	var data = {};
	var projects;
	data.users = "SELECT * FROM Project;";

	connection.query(data.users, (err, results, fields) => {
		if (err)
			throw err;

		projects = results;
		res.render('boss', {
			csrfToken: req.csrfToken(),
			login: "Logout",
			projects: projects,
			currentUser: req.user.email
		});
	});
});

var searchQuery = null;
var searchCategory = null;
var searchResult = null;

router.post("/search", isLoggedIn, (req, res, next) =>{
	var data = {};
	var projects;
	searchCategory = req.body.category;
	searchQuery = req.body.searchPhrase;

	data.sql = "SELECT * FROM Project WHERE " + searchCategory +" LIKE'%" + searchQuery + "%';";

	connection.query(data.sql, (err, results, fields) => {
		if (err)
			throw err;
		console.log(results);
		projects = results;
		searchResult = results;
		res.redirect("/user/profile/boss/search");
	});

});

router.get('/profile/boss/search', isLoggedIn, isBoss, (req, res, next) => {

		res.render('boss', {
			csrfToken: req.csrfToken(),
			login: "Logout",
			projects: searchResult,
			currentUser: req.user.email
		});
});

router.get("/logout", isLoggedIn, function (req, res, next) {
	req.logout();
	res.redirect("/");
});

router.use("/", notLoggedIn, function (req, res, next) {
	next();
});
/* GET users listing. */

router.get("/login", function (req, res) {

	var messages = req.flash('error');

	req.check('email', 'Invalid email address').isEmail();
	req.check('password', 'Password is not valid').isLength({
		min: 30000
	});

	res.render("login", {
		title: 'Login',
		messages: messages,
		csrfToken: req.csrfToken()

	});
});


router.post("/redirect", passport.authenticate('local-login', {
	failureRedirect: "/user/login",
	failureFlash: true
}), (req, res) => {
	if (req.user.userType === "admin") {
		res.redirect('/user/profile/admin');
	}
	if (req.user.userType === "boss") {
		res.redirect('/user/profile/boss');
	}
	if (req.user.userType === "user") {
		res.redirect('/user/profile');
	}
});

module.exports = router;

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		console.log("Is logged in");
		return next();
	}
	res.redirect("/user/profile/");
}

function notLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		console.log("Is not logged in");
		return next();
	}
	res.redirect("/user/login/");
}

function isUser(req, res, next) {
	if (req.user.userType == "user") {
		console.log("Is user");
		return next();
	}
	console.log("Is not user");
	res.redirect("/");
}

function isAdmin(req, res, next) {
	if (req.user.userType == "admin") {
		console.log("Is admin");
		return next();
	}
	res.redirect("/");
}

function isBoss(req, res, next) {
	if (req.user.userType == "boss") {
		console.log("Is boss");
		return next();
	}
	res.redirect("/");
}