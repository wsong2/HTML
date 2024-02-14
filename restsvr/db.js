import express from 'express';
import sql from 'mssql';
import config from './mssql_config.js';

var app = express();

app.get('/', function (req, res) {
   
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
        let stmt =  'SELECT [wrk_id] simId, [wrk_name] simName, [wrk_date] simDate, [categ], [descr], [value_n1] qty, [value_d1] price, [dttm] ' +
                    'FROM [wsp].[dbo].[WorkDev] where wrk_name is not null';
           
        // query to the database and get the records
        request.query(stmt, function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            let count = recordset.rowsAffected;
            console.log("** " + count);

            for (let rec of recordset.recordset) {
                console.log("** " + rec.categ);               
            }
            res.send(recordset);
            
        });
    });
});

var server = app.listen(3000, function () {
    console.log('Server is running..');
});