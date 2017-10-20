/*jshint esversion: 6 */

// Error dispar inte ordentlgit vid registrering! Få in sessions i videon som du lagt i titta senare

var express = require('express');
var router = express.Router();
var database = require('../database.js');
var passport = require('passport');
var flash = require('connect-flash');
var csrf = require("csurf");

var csrfProtection = csrf();
router.use(csrfProtection);


/* GET home page. */
router.get('/', function (req, res, next) {
  req.flash('info', "Hej jag är en tjej");  
  var loginStatus = "Login";
  if(res.locals.login)
  {
    loginStatus = "Logout"
  }
  // if(sessionStorage.getItem("isLoggedIn") == 1){
  res.render('index', {
    title: 'Project IQ',
    login: loginStatus
  });
  req.session.errors = null;
  // }
  // else{
  // res.render('index', { title: 'Project IQ', login: "Login" });        
  // }
});

router.get("/about", function (req, res) {
  res.render("about", {
    title: 'About Us'
  });
});

router.get("/contact", function (req, res) {
  res.render("contact", {
    title: 'Contact'
  });
});

// router.post("/registered", passport.authenticate("local-signup", {
//   successRedirect: "/profile",
//   failuerRedirect: "/login/register",
//   failureFlash: true
// }));



router.get("/register", function (req, res) {
	var messages = req.flash('error');
	res.render("register", {
		title: "Register",
		success: req.session.success,
		errors: req.session.errors,
		csrfToken: req.csrfToken(),
		messages: messages,
		hasErrors: messages.isLength > 0
	});
	req.session.success = null;
});

router.post("/registering", (req, res, next) => {

	req.check('email', 'Invalid email address').isEmail();
	req.check('password', 'Password is not valid').isLength({
		min: 4
	}).equals(req.body.passwordCheck);
	req.check('userType', "Must pick a user").notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		req.session.errors = errors;
		req.session.success = false;
		res.redirect('/user/register');
	} else {
		next();
	}
}, passport.authenticate("local-signup", {
	successRedirect: '/user/login',
	failureRedirect: '/register',
	failureFlash: true
}));



module.exports = router;