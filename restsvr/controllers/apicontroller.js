import { readFile } from "fs";
import { toISODateTime } from "./dateformat.js";
import path from 'path';
import { fileURLToPath } from 'url';

import sql from 'mssql';
import config from '../mssql_config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var mCache = {};
var mTemplate = {}

var nextId = 601;

function setNextId()
{
	if (Reflect.has(mCache, 'rows')) {
		nextId = mCache.rows.reduce((currId, row) => (row.simId > currId ? row.simId : currId), 100);
		nextId++;
		console.log('NextId: ', nextId);
	}
}

function init() {
	const jfn = "db_prolog_sim_rc.json";	
    readFile( __dirname + "/data/" + jfn, 'utf8', function (err, data) {
		mTemplate = JSON.parse(data);
    });

	sql.connect(config, (err) => {
		if (err) return console.error(err);
		  console.log("SQL DATABASE CONNECTED");
		});
}

function newItem(req, res)
{
	let dttm = toISODateTime(Date.now()); 
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
	let dttm = toISODateTime(Date.now()); 
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

function allItems(req, res) {
	const contentType = {'content-type': 'application/json; charset=utf-8' };
    console.log('\n--- ' + toISODateTime(Date.now()) + ' ---' );
	if (Reflect.has(mCache, 'rows')) {
		console.log('cache');
		let data = JSON.stringify(mCache);
		res.set(contentType);
		res.end(data);
		return;
	}

	const request = new sql.Request();
	const stmt = 'SELECT [wrk_id] simId, [wrk_name] simName, [wrk_date] simDate, [categ], [descr], [value_n1] qty, [value_d1] price, [dttm] ' +
				 'FROM [wsp].[dbo].[WorkDev] where wrk_name is not null';
	request.query(stmt, function (err, recordset) {      
		if (err) {
			console.log(err)
			return;
		}
		mCache = Object.assign({}, mTemplate);
		mCache.rows = recordset.recordset;
		setNextId();
		let data = JSON.stringify(mCache);
		res.set(contentType);
		res.send(data);					
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

const _allItems = allItems;
export { _allItems as allItems };
const _deleteItem = deleteItem;
export { _deleteItem as deleteItem };
const _newItem = newItem;
export { _newItem as newItem };
const _updateItem = updateItem;
export { _updateItem as updateItem };

const _init = init;
export { _init as init };
