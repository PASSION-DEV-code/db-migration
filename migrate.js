var mysql = require('mysql');
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

dstConnection.query("DROP TABLE IF EXISTS facilities", function (error, result, fields) {
    if (error) {
        throw error;
    }
});
dstConnection.query("CREATE TABLE facilities (id int(11) NOT NULL AUTO_INCREMENT, facility_name varchar(200) DEFAULT NULL, facility_name_kana varchar(200) DEFAULT NULL, facility_zip varchar(200) DEFAULT NULL, facility_prefecture int(10) DEFAULT NULL, facility_address varchar(200) DEFAULT NULL, facility_other_address varchar(200) DEFAULT NULL, facility_tel varchar(200) DEFAULT NULL, facility_fax varchar(200) DEFAULT NULL, facility_website_url varchar(200) DEFAULT NULL, updated_by int(11) DEFAULT NULL, created_at date DEFAULT NULL, updated_at datetime DEFAULT NULL, PRIMARY KEY (`id`) USING BTREE) ENGINE=InnoDB AUTO_INCREMENT=249453 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC"
    ,function (error, result, fields) {
        if (error) {
            throw error;
        }
    }
);

var query = srcConnection.query('SELECT * FROM epark_facility');

var progress = 0;
query.on('result', function(row) {
    srcConnection.pause();

    var newRow = {
        id: row.id,
        facility_name: row.facility_name,
        facility_name_kana: row.facility_name_kana,
        facility_zip: row.zip,
        facility_prefecture: row.epark_pref_id,
        facility_address: row.address,
        facility_other_address: row.building,
        facility_tel: row.tel,
        facility_fax: row.fax,
        facility_website_url: row.facility_url,
        updated_by: row.update_user,
        created_at: row.reg_date,
        updated_at: row.modified,
    };

    dstConnection.query("INSERT INTO facilities SET ?", newRow, function(error, result, fields) {
        console.log(`No ${progress} row inserted successfully`);
        progress = progress + 1;
        srcConnection.resume();
    });
});

srcConnection.end();