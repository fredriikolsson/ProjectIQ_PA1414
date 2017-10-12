/*jshint esversion: 6 */

// Error dispar inte ordentlgit vid registrering! Få in sessions i videon som du lagt i titta senare

var express = require('express');
var router = express.Router();
var database = require('../database.js');
var passport = require('passport');
var csrf = require("csurf");

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function (req, res, next) {
  // if(sessionStorage.getItem("isLoggedIn") == 1){
  res.render('index', {
    title: 'Project IQ',
    login: "Logout"
  });
  req.session.errors = null;
  // }
  // else{
  // res.render('index', { title: 'Project IQ', login: "Login" });        
  // }
});

router.get("/login", function (req, res) {
  // if(sessionStorage.getItem("isLoggedIn") == 1){

  // }
  // else {
  res.render("login", {
    title: 'Login'
  });
  // }
});

// router.post("/redirect", (req, res) => {
//     var data = {};

//     data.sql = `SELECT id FROM Users
//     WHERE email = ? AND pass = ?;`;  
//     data.param = [req.body.email, req.body.password];

//     database.queryPromise(data.sql, data.param)
//         .then((result) => {
//           let theResult = result.shift();
//           if(theResult.id == 1) {
//             console.log("result är 1");
//             res.redirect("/");
//           }
//           res.redirect(`/`);
//         })
//         .catch((err) => {
//           throw err;
//         });
//   });

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

router.get("/login/register", function (req, res) {
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

// router.post("/registered", passport.authenticate("local-signup", {
//   successRedirect: "/profile",
//   failuerRedirect: "/login/register",
//   failureFlash: true
// }));

router.post("/register", (req, res, next) => {
  var data = {};

  req.check('email', 'Invalid email address').isEmail();
  req.check('password', 'Password is not valid').isLength({
    min: 4
  }).equals(req.body.passwordCheck);
  req.check('userType', "Must pick a user").notEmpty();

  console.log("WARNING ------------- STAGE 1");

  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
    res.redirect('/login/register');
  } else {
    next();
  }
}, passport.authenticate("local-signup", {
  successRedirect: "/profile",
  failuerRedirect: "/login",
  failureFlash: true
}));


module.exports = router;