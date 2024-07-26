/**
 * Module dependencies.
 */

var express = require('express');
var mysql = require('mysql');

var app = express();

var { insert, update, remove } = require('./sync/sync');

//Routes
app.post('/sync', function (req, res) {
    var mgConnection = mysql.createConnection({
        host: 'medigle-db-dev-main-mariadb.c3kt6elpaaoa.ap-northeast-1.rds.amazonaws.com',
        user: 'admin',
        password: 'g.(?gcv*m7AT8]Jf-loolEV)rH9Q',
        database: 'newMedigle'
    });

    const { action, table, data } = req.body;
    switch (action) {
        case "INSERT":
            insert(mgConnection, table, data);
            break;
        case "UPDATE":
            update(mgConnection, table, data);
            break;
        case "DELETE":
            remove(mgConnection, table, data);
            break;
    }
});

//delete an employee

app.listen(process.env.PORT || 3000, () => {
    console.log(`process running on port ${process.env.PORT || 3000}`);
});