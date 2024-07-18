var mysql = require('mysql');
const { migrateFacility } = require('./migrate/facility');
const { migrateContracts } = require('./migrate/contract');
const { migrateUsers } = require('./migrate/users');
const { migrateAdminUsers } = require('./migrate/admin_users');

var srcConnection = mysql.createConnection({
    host: 'medigle-db-dev-main-mariadb.c3kt6elpaaoa.ap-northeast-1.rds.amazonaws.com',
    user: 'admin',
    password: 'g.(?gcv*m7AT8]Jf-loolEV)rH9Q',
    database: 'medigle'
});

var dstConnection = mysql.createConnection({
    host: 'medigle-db-dev-main-mariadb.c3kt6elpaaoa.ap-northeast-1.rds.amazonaws.com',
    user: 'admin',
    password: 'g.(?gcv*m7AT8]Jf-loolEV)rH9Q',
    database: 'newMedigle'
});

srcConnection.connect();
dstConnection.connect();

migrateFacility(srcConnection, dstConnection);
migrateContracts(srcConnection, dstConnection);
migrateUsers(srcConnection, dstConnection);
migrateAdminUsers(srcConnection, dstConnection);
