var mysql = require('mysql');
const { migrateFacility } = require('./migrate/facility');
const { migrateContracts } = require('./migrate/contract');
const { migrateUsers } = require('./migrate/users');
const { migrateAdminUsers } = require('./migrate/admin_users');

var srcConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'medigle'
});

var dstConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'newMedigle'
});

srcConnection.connect();
dstConnection.connect();

migrateFacility(srcConnection, dstConnection);
migrateContracts(srcConnection, dstConnection);
migrateUsers(srcConnection, dstConnection);
migrateAdminUsers(srcConnection, dstConnection);
