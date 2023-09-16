var dtFmt = require("./dateformat.js");
var mongo = require("mongodb");

var mCache = {};

var nextId = 601;

const uri = "mongodb://localhost:27017";
const client = new mongo.MongoClient(uri);

const columns = {
	simId: {caption: "ID"},
	simName: {caption: "Name", sorting: "U"},
	simDate: {caption: "Date", sorting: "D" },
	categ: {caption: "Category"},
	descr: {caption: "Description"},
	qty: {caption: "Quantity"},
	price: {caption: "Price"},
	dttm: {caption: "Timestamp"}
}

const griddata = {
  rows: [],
  columns: Object.assign({}, columns),
  keyss: ["simId", "simName", "simDate", "categ", "descr", "qty", "price", "dttm"]
}


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
	let dttm = dtFmt.toISODateTime(Date.now()); 
    console.log('\n--- A: ' + dttm + ' ---' );
	let item = {};
	for (let [key,val] of Object.entries(req.body)) {
		console.log(`+ ${key}: ${val}`);
		item[key] = val;
	}
	item.dttm = dttm;
	item.simId = nextId++;
	
	mCache.rows.push(item);
	
	let itemResponse = {op: 'new', simId: item.simId, dttm: item.dttm};
	let json = JSON.stringify(itemResponse);
	res.end(json);
}

function updateItem(req, res)
{
	let dttm = dtFmt.toISODateTime(Date.now()); 
    console.log('\n--- U: ' + dttm + ' ---' );
	let item = {op: 'update'};
	let row = mCache.rows.find(r => r.simId == req.body.simId);
	if (row === undefined) {
		console.log('** Not found: ' + req.body.simId);
	} else {
		item.simId = row.simId;
	}
	item.dttm = dttm;
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
    console.log('\n--- ' + dtFmt.toISODateTime(Date.now()) + ' ---' );
	if (Reflect.has(mCache, 'rows')) {
		console.log('cache');
		let data = JSON.stringify(mCache);
		res.set(contentType);
		res.end(data);
		return;
	}
  
   async function run() {
	try {
	  // Get the database and collection on which to run the operation
	  const database = client.db("prolog");
	  const items = database.collection("simItems");
	  const cursor = items.find({}, {projection: {_id:0}});
	  for await (const doc of cursor) {
		griddata.rows.push(doc);
	  }
	  //console.log(JSON.stringify(griddata, null, 2));
	  mCache = Object.assign({}, griddata),
	  setNextId();
	  res.set(contentType);
      res.end(JSON.stringify(griddata));	  
	} finally {
	  await client.close();
	}
  }
  run().catch(console.dir);
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

