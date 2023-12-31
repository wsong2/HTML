import { toISODateTime, toISOTimeStamp } from "./dateformat.js";
import { MongoClient } from "mongodb";

var mCache = {};

var nextId = 601;

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

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

function setNextId() {
	if (Reflect.has(mCache, 'rows')) {
		nextId = mCache.rows.reduce((currId, row) => (row.simId > currId ? row.simId : currId), 5);
		nextId++;
		console.log('NextId: ', nextId);
	}
}

function newItem(req, res)
{
    console.log('\n--- A: ' + toISODateTime(Date.now()) + ' ---' );
	let item = {};
	for (let [key,val] of Object.entries(req.body)) {
		console.log(`+ ${key}: ${val}`);
		if (key === 'qty' && val) {
			item[key] = parseInt(val);
		} else if (key === 'price' && val) {
			item[key] = parseFloat(val);
		} else {
			item[key] = val;
		}
	}
	item.dttm = toISOTimeStamp(Date.now());
	item.simId = nextId++;

	if (Reflect.has(mCache, 'rows')) {
		mCache.rows.push(item);
	} else {
		console.log('\n--- Warning: Unintialised cahce!' );
	}

	async function run() {
		try {
		  const database = client.db("prolog");
		  const items = database.collection("simItems");
		  await items.insertOne(item);

		  item.op = 'new';
		  let json = JSON.stringify(item);
		  res.end(json);
		} finally {
		  //await client.close();
		}
	}
	run().catch(console.dir);

}

function updateItem(req, res)
{
	let dttm = toISODateTime(Date.now()); 
    console.log('\n--- U: ' + dttm + ' ---' );
	let item = {}; //{op: 'update'};
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

	async function run() {
		try {
		  const database = client.db("prolog");
		  const items = database.collection("simItems");
		  const filter = { simId: row.simId };

		  const options = { upsert: false };
		  await items.replaceOne(filter, item, options);

		  item.op = 'update';
		  let json = JSON.stringify(item);
		  console.log('** API: ' + json);
		  res.end(json);
		} finally {
		  //await client.close();
		}
	}
	run().catch(console.dir);	
}

function allItems(req, res)
{
	const contentType = {'content-type': 'application/json; charset=utf-8' };
    console.log('\n--- ' + toISODateTime(Date.now()) + ' ---' );
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
	  //await client.close();
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

const _allItems = allItems;
export { _allItems as allItems };
const _deleteItem = deleteItem;
export { _deleteItem as deleteItem };
const _newItem = newItem;
export { _newItem as newItem };
const _updateItem = updateItem;
export { _updateItem as updateItem };
