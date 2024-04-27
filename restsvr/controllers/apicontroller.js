import { toISODateTime, toISOTimeStamp } from "../util/dateformat.js";
import { MongoClient } from "mongodb";

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
	keys: ["simId", "simName", "simDate", "categ", "descr", "qty", "price", "dttm"]
}

function newItem(req, res) {
	const simIdOfset = 1000;

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

	async function run() {
        const filter = { title: "SIM next Id" };
        const options = { upsert: false };
		try {
			const database = client.db("prolog");
			const simCounter = database.collection("simCounter");
			const result = await simCounter.findOneAndUpdate(filter, {$inc : { count: 1}}, options);
			item.simId = simIdOfset + result.count;

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

	let row = req.body;
	let currentId = row.simId;
	if (typeof row.simId === 'string') {
		row.simId = parseInt(row.simId);
	}
	if (typeof row.qty === 'string') {
		row.qty = parseInt(row.qty);
	}
	if (typeof row.price === 'string') {
		row.price = parseFloat(row.price);
	}
	let item = Object.assign({op: 'update'}, row);
	item.dttm = dttm;

	for (let [key,val] of Object.entries(row)) {
		console.log(`U ${key}: ${val}`);
	}

	async function run() {
		try {
			const database = client.db("prolog");
			const items = database.collection("simItems");

			const result = await items.replaceOne( {simId: currentId}, row);
		  	console.log(result);
			if (result.result === 0) {
				result = await items.replaceOne( {simId: row.simId}, row);
				console.log(result);
			}

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
  
	async function run() {
	try {
	  	const database = client.db("prolog");
	  	const items = database.collection("simItems");
	  	const cursor = items.find({}, {projection: {_id:0}});
		griddata.rows = [];
	  	for await (const doc of cursor) {
			griddata.rows.push(doc);
	  	}
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
	let id = parseInt(req.params.id);	// :id
	console.log('\n> To delete ' + id);
	
	async function run() {
		try {
			const database = client.db("prolog");
			const items = database.collection("simItems");
			const query = { simId: id};
			const result = await items.deleteOne(query);
			if (result.deletedCount === 1) {
				console.log('** Deleted simId: ' + id);
				res.status(200).send({simId: id, status: 'OK', details: 'Deleted'});
		  	} else {
				console.log('** Not found: ' + id);
				res.status(202).send({simId: id, status: 'ERR', details: 'Not found'});						
		  	}
		} finally {
		  	//await client.close();
		}
	  }
	  run().catch(console.dir);
}

const _allItems = allItems;
export { _allItems as allItems };
const _deleteItem = deleteItem;
export { _deleteItem as deleteItem };
const _newItem = newItem;
export { _newItem as newItem };
const _updateItem = updateItem;
export { _updateItem as updateItem };
