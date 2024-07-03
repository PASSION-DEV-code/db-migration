exports.migrateContracts = function(srcConnection, dstConnection) {
    
    dstConnection.query("DROP TABLE IF EXISTS contracts", function (error, result, fields) {
        if (error) {
            throw error;
        }
    });
    let tableCreateQuery = "CREATE TABLE contracts (";
    tableCreateQuery += "id int(11) NOT NULL AUTO_INCREMENT";
    tableCreateQuery += ", facility_id int(11)";
    tableCreateQuery += ", epark_id int(11)";
    tableCreateQuery += ", contract_plan int(1)";
    tableCreateQuery += ", contract_status tinyint(1)";
    tableCreateQuery += ", contract_start_date datetime DEFAULT NULL";
    tableCreateQuery += ", contract_end_date datetime DEFAULT NULL";
    tableCreateQuery += ", contract_contact_name varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL";
    tableCreateQuery += ", contract_contact_department varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL";
    tableCreateQuery += ", contract_contact_tel varchar(15)";
    tableCreateQuery += ", contract_contact_fax varchar(15)";
    tableCreateQuery += ", update_by int(11)";
    tableCreateQuery += ", created_at date";
    tableCreateQuery += ", updated_at datetime";
    tableCreateQuery += ", PRIMARY KEY (`id`) USING BTREE"
    tableCreateQuery += ") ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC";
    dstConnection.query(tableCreateQuery, function (error, result, fields) {
        if (error) {
            throw error;
        }
    });

    var query = srcConnection.query('SELECT medigle_facility.*, epark_facility.* FROM epark_facility INNER JOIN medigle_facility ON epark_facility.id = medigle_facility.epark_id');

    var progress = 0;
    query.on('result', function(row) {
        srcConnection.pause();

        var newRow = {
            facility_id: row.id,
            epark_id: row.epark_id,
            contract_plan: row.plan,
            contract_status: row.status,
            contract_start_date: row.start_date,
            contract_end_date: row.end_date,
            contract_contact_name: row.change_name,
            contract_contact_department: row.change_department,
            contract_contact_tel: row.tel,
            contract_contact_fax: row.fax,
            update_by: row.update_user,
            created_at: row.reg_date,
            updated_at: row.modified
        };

        dstConnection.query("INSERT INTO contracts SET ?", newRow, function(error, result, fields) {
            if (error) throw error;
            console.log(`No ${progress} row inserted successfully`);
            progress = progress + 1;
            srcConnection.resume();
        });
    });
}