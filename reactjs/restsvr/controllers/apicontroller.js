var fs = require("fs");
var dtFmt = require("dateformat");

const cache = {};

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
	if (Reflect.has(cache, jfn)) {
		res.end(cache[jfn]);
	} else {
		fs.readFile( __dirname + "/data/" + jfn, 'utf8', function (err, data) {
			cache[jfn] = data;
			console.log('> ' + jfn + ' (cached)');
			res.end(data);
		});
	}	
}

function deleteItem(req, res)
{
	let id = req.params.id;
	
	console.log('> Deleted ' + id);
	
	return res.status(200);	
}

module.exports.allItems = allItems;
module.exports.deleteItem = deleteItem;
module.exports.newItem = newItem;
 