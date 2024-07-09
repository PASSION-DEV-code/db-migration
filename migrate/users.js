exports.migrateUsers = function(srcConnection, dstConnection) {
    const queryStart = Date.now();
    
    dstConnection.query("DROP TABLE IF EXISTS users", function (error, result, fields) {
        if (error) {
            throw error;
        }
    });
    let tableCreateQuery = "CREATE TABLE users (";
    tableCreateQuery += "id int(11) NOT NULL AUTO_INCREMENT";
    tableCreateQuery += ", facility_id int(11)";
    tableCreateQuery += ", user_id varchar(255)";
    tableCreateQuery += ", user_password_hash varchar(255)";
    tableCreateQuery += ", user_name varchar(255)";
    tableCreateQuery += ", user_role tinyint(4) DEFAULT 0";
    tableCreateQuery += ", is_active int(1) DEFAULT 0";
    tableCreateQuery += ", is_locked int(11) DEFAULT 0";
    tableCreateQuery += ", updated_by int(11) DEFAULT NULL";
    tableCreateQuery += ", created_at datetime";
    tableCreateQuery += ", updated_at datetime";
    tableCreateQuery += ", deleted_at datetime";
    tableCreateQuery += ", PRIMARY KEY (`id`) USING BTREE"
    tableCreateQuery += ") ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC";
    dstConnection.query(tableCreateQuery, function (error, result, fields) {
        if (error) {
            throw error;
        }
    });

    var query = srcConnection.query('SELECT * from user');

    var progress = 0;
    query.on('result', function(row) {
        srcConnection.pause();

        var newRow = {
            facility_id: row.medigle_id,
            user_id: row.user_name,
            user_password_hash: row.password,
            user_name: row.name,
            user_role: row.manage,
            is_active: row.use,
            is_locked: row.failed_count,
            updated_by: row.update_user,
            created_at: row.created,
            updated_at: row.modified
        };

        dstConnection.query("INSERT INTO users SET ?", newRow, function(error, result, fields) {
            if (error) throw error;
            progress = progress + 1;
            srcConnection.resume();
        });
    });
    query.on('end', function() {
        const queryEnd = Date.now();
        const queryExecutionTime = queryEnd - queryStart;
        console.log("Users Total count:",progress);
        console.log(`Query execution time: ${(queryExecutionTime / 1000).toFixed(2)} seconds.`);
    });
}