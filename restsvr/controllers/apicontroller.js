var fs = require("fs");
var dtFmt = require("dateformat");

var mCache = {};

var nextId = 601;

function setNextId()
{
	if (Reflect.has(mCache, 'rows')) {
		nextId = mCache.rows.reduce((currId, row) => (row.simId > currId ? row.simId : currId), 100);
		nextId++;
		console.log('NextId: ', nextId);
	}
}

function newItem(req, res)
{
    console.log('\n--- A: ' + dtFmt(Date.now(), 'isoTime') + ' ---' );
	let item = {};
	for (let [key,val] of Object.entries(req.body)) {
		console.log(`+ ${key}: ${val}`);
		item[key] = val;
	}
	item.dttm = dtFmt(Date.now(), 'isoUtcDateTime');
	item.simId = nextId++;
	
	mCache.rows.push(item);
	
	let itemResponse = {op: 'new', simId: item.simId, dttm: item.dttm};
	let json = JSON.stringify(itemResponse);
	res.end(json);
}

function updateItem(req, res)
{
    console.log('\n--- U: ' + dtFmt(Date.now(), 'isoTime') + ' ---' );
	let item = {op: 'update'};
	let row = mCache.rows.find(r => r.simId == req.body.simId);
	if (row === undefined) {
		console.log('** Not found: ' + req.body.simId);
	} else {
		item.simId = row.simId;
	}
	item.dttm = dtFmt(Date.now(), 'isoUtcDateTime');
	for (let [key,val] of Object.entries(req.body)) {
		console.log(`U ${key}: ${val}`);
		if (row !== undefined) {
			row[key] = val;
		}
	}
	let json = JSON.stringify(item);
	res.end(json);
}

function allItems(req, res)
{
	const contentType = {'content-type': 'application/json; charset=utf-8' };
    console.log('\n--- ' + dtFmt(Date.now(), 'isoTime') + ' ---' );
	if (Reflect.has(mCache, 'rows')) {
		console.log('cache');
		let data = JSON.stringify(mCache);
		res.set(contentType);
		res.end(data);
		return;
	}
	const jfn = "db_prolog_sim_rc.json";	
    fs.readFile( __dirname + "/data/" + jfn, 'utf8', function (err, data) {
      console.log('from ' + jfn);
	  mCache = JSON.parse(data);
	  setNextId();
	  res.set(contentType);
      res.end(data);
   });
}

function deleteItem(req, res)
{
	let id = req.params.id;	// :id
	console.log('\n> Deleted ' + id);
	
	let rowIndex = mCache.rows.findIndex(r => r.simId == id);
	if (rowIndex === -1) {
		console.log('** Not found: ' + req.body.simId);
		res.status(202).send({simId: id, status: 'ERR', details: 'Not found'});	// Accepted
		return;
	}
	mCache.rows.splice(rowIndex, 1);
	console.log('** Deleted row #' + rowIndex);
	res.status(200).send({simId: id, status: 'OK', details: 'Deleted'});
}

module.exports.allItems = allItems;
module.exports.deleteItem = deleteItem;
module.exports.newItem = newItem;
module.exports.updateItem = updateItem;

 