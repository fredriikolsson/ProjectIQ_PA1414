"use strict";
// FIXA MESSAGES FLASH GREJEN KOLLA VIDEON
var passport = require('passport');
var mysql = require('mysql');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

var connection = null;

var options = {
    host: 'localhost',
    user: 'root',
    password: 'falukorv',
    database: 'piq',
    multipleStatements: true
};

connection = mysql.createConnection(options);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    connection.query("select * from Users where id = " + id, function (err, rows) {
        done(err, rows[0]);
    });
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
}, function (req, email, password, done) {
    connection.query("select * from Users where email = '" + email + "'", function (err, rows) {
        if (err)
            return done(err);
        if (rows.length) {
            return done(null, false, {
                message: 'That email is already taken.'
            });
        } else {
            var newUser = new Object();
            newUser.email = email;
            newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
            newUser.userType = req.body.userType;
            connection.query(`INSERT INTO Users(email, password, userType) 
                            VALUES('` + newUser.email + `','` + newUser.password + `','` + newUser.userType + `')`,
                function (error){
                        return done(null, newUser);
                    }
                );
        }
    });
}));

passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) { // callback with email and password from our form

        connection.query("SELECT * FROM `users` WHERE `email` = '" + email + "'", function (err, rows) {
            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            if (!(rows[0].password == password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, rows[0]);

        });

    }));


// bcrypt.compareSync(password, this.password) ???????