exports.migrateAdminUsers = function(srcConnection, dstConnection) {
    
    dstConnection.query("DROP TABLE IF EXISTS admin_users", function (error, result, fields) {
        if (error) {
            throw error;
        }
    });
    let tableCreateQuery = "CREATE TABLE admin_users (";
    tableCreateQuery += "id int(11) NOT NULL AUTO_INCREMENT";
    tableCreateQuery += ", admin_user_id varchar(255)";
    tableCreateQuery += ", admin_user_password_hash varchar(255)";
    tableCreateQuery += ", admin_user_name varchar(100)";
    tableCreateQuery += ", is_active int(1)";
    tableCreateQuery += ", is_locked int(11)";
    tableCreateQuery += ", updated_by int(11)";
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

    var query = srcConnection.query('SELECT admin_user.*, epark_facility.* FROM epark_facility INNER JOIN medigle_facility ON epark_facility.id = medigle_facility.epark_id');

    var progress = 0;
    query.on('result', function(row) {
        srcConnection.pause();

        var newRow = {
            admin_user_id: row.login_id,
            admin_user_password_hash: row.password,
            admin_user_name: row.name,
            is_active: row.use,
            is_locked: row.failed_count,
            update_user: row.updated_by,
            created_at: row.created,
            updated_at: row.modified
        };

        dstConnection.query("INSERT INTO admin_users SET ?", newRow, function(error, result, fields) {
            if (error) throw error;
            console.log(`No ${progress} row inserted successfully`);
            progress = progress + 1;
            srcConnection.resume();
        });
    });
}