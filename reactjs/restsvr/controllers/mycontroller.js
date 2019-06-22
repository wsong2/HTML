var fs = require("fs");
var dateFMT = require("dateformat");

function listUsers(req, res)
{
	const jfn = "users.json";
	
    fs.readFile( __dirname + "/data/" + jfn, 'utf8', function (err, data) {
      console.log('--- ' + dateFMT(Date.now(), 'isoTime') + ' ---' );
      console.log('from ' + jfn);
      res.end( data );
   });
}

function gridView(req, res)
{
	const jfn = "griddata.json";
	
    fs.readFile( __dirname + "/data/" + jfn, 'utf8', function (err, data) {
      console.log('--- ' + dateFMT(Date.now(), 'isoTime') + ' ---' );
      console.log('from ' + jfn);
      res.end( data );
   });
}

function chargingPoints(req, res)
{
	console.log(req.query);
	res.json({ status: 'OK', "charging-point-id": '7:7 (dummy)' });
}

module.exports.listUsers = listUsers;
module.exports.gridView = gridView;
module.exports.chargingPoints = chargingPoints;
