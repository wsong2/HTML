var fs = require("fs");
var dtFmt = require("dateformat");

var originalData = null;
var nextId = 11;

function newItem(req, res)
{
	let item = {simId: nextId++, dttm: "2021-01-25T20:21:05"};
	for (const [key, val] of Object.entries(req.body)) {
		console.log("+ " + key + ": " + val);
		//item[key] = key.toLowerCase().endsWith('date') ? Date.parse(val) : val;
		//item[key] = val;
	}
	let json = JSON.stringify(item);
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
	
	let ack = {status: 'OK'};
	ack.rowId = id;
	res.status(202).send(ack);
}

function updateItem(req, res)
{
	Object.entries(req.body).forEach(([key, value]) => console.log(`U> ${key}: ${value}`)); 
	res.status(200).send('Update OK');
}

function runTask(req, res)
{
	console.log('> dbexec ' + dtFmt(Date.now(), 'isoTime'));	
	res.status(200).send('OK');
}

module.exports.allItems = allItems;
module.exports.deleteItem = deleteItem;
module.exports.newItem = newItem;
module.exports.updateItem = updateItem;
module.exports.runTask = runTask;
 