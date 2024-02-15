import express from 'express';
import sql from 'mssql';
import config from './mssql_config.js';

var app = express();

app.get('/', function (req, res) {
   
    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        const stmpType = 'S';

        // create Request object
        var request = new sql.Request();

        if (stmpType === 'S') {
            let stmt =  'SELECT [wrk_id] simId, [wrk_name] simName, [wrk_date] simDate, [categ], [descr], [value_n1] qty, [value_d1] price, [dttm] ' +
            'FROM [wsp].[dbo].[WorkDev] where wrk_name is not null';
   
            // query to the database and get the records
            request.query(stmt, function (err, recordset) {
    
            if (err) console.log(err)

            // send records as a response
            let count = recordset.rowsAffected;
            console.log("** " + count);

            for (let rec of recordset.recordset) {
                //console.log("** " + rec.categ);
                //rec.simDate = new Date(rec.simDate.toDateString());   
                rec.simDate = rec.simDate.toISOString().substring(0,10);
            }
            res.send(recordset);
    
            });
            
            return;
        }

        const stmtU = 'UPDATE WorkDev set wrk_date = @param1, value_d1 = @param2 where wrk_id = @param3';
           
        request
            .input('param1', sql.Date, '2024-02-15')
            .input('param2', sql.Decimal, 13.37)
            .input('param3', sql.Int, 110)
            .query(stmtU).then(function (result) {
            let count = result .rowsAffected;
            console.log("** " + count);    
            res.send(result);
        }).catch(function(error) {
           console.log(error)
        });

    });
});

var server = app.listen(3000, function () {
    console.log('Server is running..');
});