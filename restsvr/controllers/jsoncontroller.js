var fs = require("fs");
var dtFmt = require("./dateformat.js");

function ackdata(req, res)
{
    console.log('> ackdata at ' + dtFmt.toISODateTime(Date.now()));
	console.log('  ' + JSON.stringify(req.body));
	// for (const [key, val] of Object.entries(req.body)) {
		// console.log("  %s: %s", key, val);
	// }

	let json = '{"status": "OK", "appname": "app2", "endpoint": "ackdata"}';
	res.end(json);
}

module.exports.ackdata = ackdata;
