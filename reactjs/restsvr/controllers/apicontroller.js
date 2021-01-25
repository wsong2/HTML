var fs = require("fs");
var dtFmt = require("dateformat");

var originalData = null;
var arrItems = null;

function newItem(req, res)
{
	for (let key in req.body) {
		console.log("> " + key + ": " + req.body[key]);
	}
	let json = '{"status": "OK", "details": "Json Response"}';
	res.end(json);
}

function allItems(req, res)
{
	const jfn = "db_prolog_sim11.json";
	
	console.log('> allItems at ' + dtFmt(Date.now(), 'isoTime'));	
	if (originalData) {
		res.end(originalData);
	} else {
		fs.readFile( __dirname + "/data/" + jfn, 'utf8', function (err, data) {
			originalData = data;
			arrItems = JSON.parse(originalData);
			console.log('> ' + jfn + ' loaded');
			res.end(data);
		});
	}	
}

function deleteItem(req, res)
{
	let idStr = req.params.id;	// :id
	let id = idStr.substr(1);
	console.log('> Deleted ' + id);
	
	arrItems = arrItems.filter(rec => rec.id != id);
	
	let ack = {status: 'OK'};
	ack.rowId = id;
	res.status(200).send(ack);
}

module.exports.allItems = allItems;
module.exports.deleteItem = deleteItem;
module.exports.newItem = newItem;
 