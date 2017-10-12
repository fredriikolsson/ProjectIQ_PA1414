'use strict'

var mysql = require('mysql');

var database = {};

database.queryPromise = (sql, param) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, param, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
};

module.exports = database;
