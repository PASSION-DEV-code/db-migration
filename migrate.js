var mysql = require('mysql');
require('dotenv');
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

var mgConnection = mysql.createConnection({
    host: 'medigle-db-dev-main-mariadb.c3kt6elpaaoa.ap-northeast-1.rds.amazonaws.com',
    user: 'admin',
    password: 'g.(?gcv*m7AT8]Jf-loolEV)rH9Q',
    database: 'newMedigle'
});

srcConnection.connect();
dstConnection.connect();
mgConnection.connect();

function migrateConnection(dstConnection) {
    dstConnection.query("DROP TABLE IF EXISTS db_connection", function (error, result, fields) {
        if (error) {
            throw error;
        }
    });
    let tableCreateQuery = "CREATE TABLE db_connection (";
    tableCreateQuery += "oldDB varchar(255)";
    tableCreateQuery += ", newDB varchar(255)";
    tableCreateQuery += ", old_id int(11)";
    tableCreateQuery += ", new_id int(11)";
    tableCreateQuery += ") ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC";
    dstConnection.query(tableCreateQuery, function (error, result, fields) {
        if (error) {
            throw error;
        }
    });

    var query = dstConnection.query('DELETE FROM db_connection');

    query.on('result', function (row) {
    });
}

migrateConnection(mgConnection);
migrateFacility(srcConnection, dstConnection, mgConnection);
migrateContracts(srcConnection, dstConnection, mgConnection);
migrateUsers(srcConnection, dstConnection, mgConnection);
migrateAdminUsers(srcConnection, dstConnection, mgConnection);
