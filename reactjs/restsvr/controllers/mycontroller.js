var fs = require("fs");
var dateFMT = require("dateformat");

module.exports.listUsers = function(req, res) {

	const jfn = "users.json";
    fs.readFile( __dirname + "/data/" + jfn, 'utf8', function (err, data) {
      console.log('--- ' + dateFMT(Date.now(), 'isoTime') + ' ---' );
      console.log( data );
      res.end( data );
   });

}