/**
 * Module dependencies.
 */

var express = require('express');

var app = express();

//Routes
app.post('/sync', function (req, res) {
    const { action, data } = req.body;
    switch (action) {
        case "INSERT":
            break;
        case "UPDATE":
            break;
        case "DELETE":
            break;
    }
});

//delete an employee
app.post('/employee/:id/delete', function(req, res) {
	employeeProvider.delete(req.param('_id'), function(error, docs) {
		res.redirect('/')
	});
});

app.listen(process.env.PORT || 3000);