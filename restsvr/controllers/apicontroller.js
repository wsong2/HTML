import { readFile } from "fs";
import { toISODateTime } from "./dateformat.js";
import path from 'path';
import { fileURLToPath } from 'url';

import sql from 'mssql';
import config from '../mssql_config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var mTemplate = {}

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

function newItem(req, res) {
	let dttm = toISODateTime(Date.now()); 
    console.log('\n--- A: ' + dttm + ' ---' );
	let item = {};
	for (let [key,val] of Object.entries(req.body)) {
		console.log(`+ ${key}: ${val}`);
		item[key] = val;
	}
	item.dttm = dttm;
	
	const request = new sql.Request();
	request
		.input('SimName', sql.Text, item.simName)
		.input('SimDate', sql.Date, item.simDate)
		.input('Categ', sql.Text, item.categ)
		.input('Descr', sql.Text, item.descr)
		.input('Qty', sql.Int, item.qty)
		.input('Price', sql.Decimal, item.price)
		.execute('[dbo].[AddSimItem]').then(function (result) {
			let simId = result .returnValue;
			console.log("** simId " + simId);
			let itemResponse = {op: 'new', simId: simId, dttm: item.dttm};
			let json = JSON.stringify(itemResponse);
			res.end(json);
		}).catch(function(error) {
   			console.log(error)
			let itemResponse = {op: 'new', simId: -1, dttm: item.dttm};
			let json = JSON.stringify(itemResponse);
			res.end(json);
			res.end(json); 
		});
}

function updateItem(req, res) {
	const stmt = 'UPDATE WorkDev set ' + 
		'wrk_name = @simName, wrk_date = @simDate, categ = @categ, descr = @descr, value_n1 = @qty, value_d1 = @price, dttm = @dttm ' + 
		'where wrk_id = @simId';

	let dttm = toISODateTime(Date.now()); 
    console.log('\n--- U: ' + dttm + ' ---' );

	let row = req.body;
	let item = Object.assign({op: 'update'}, row);
	item.dttm = dttm;

	for (let [key,val] of Object.entries(row)) {
		console.log(`U ${key}: ${val}`);
	}

	const request = new sql.Request();
	request
		.input('simName', sql.Text, row.simName)
		.input('simDate', sql.Date, row.simDate)
		.input('categ', sql.Text, row.categ)
		.input('descr', sql.Text, row.descr)
		.input('qty', sql.Int, row.qty)
		.input('price', sql.Decimal(12,4), row.price)
		.input('dttm', sql.DateTime, row.dttm)
		.input('simId', sql.Int, row.simId)
		.query(stmt).then(function (result) {
			let count = result .rowsAffected;
			if (count < 1) {
				console.log('** Not found: ' + row.simId);				
			}
			console.log("** " + count);
			let json = JSON.stringify(item);
			res.end(json); 
		}).catch(function(error) {
   			console.log(error)
			let json = JSON.stringify(item);
			res.end(json); 
		});
}

function deleteItem(req, res) {
	let id = req.params.id;	// :id
	console.log('\n> To delete ' + id);
	
	const stmt = 'DELETE from WorkDev where wrk_id = @psimId';
	const request = new sql.Request();
	request.input('simId', sql.DateTime, id)
		.query(stmt).then(function (result) {
			let count = result .rowsAffected;
			if (count == 0) {
				console.log('** Not found: ' + id);				
				res.status(202).send({simId: id, status: 'WARNING', details: 'Not found'});	// Accepted
			} else {
				res.status(200).send({simId: id, status: 'OK', details: 'Deleted'});
			}
		}).catch(function(error) {
   			console.log(error)
			res.status(202).send({simId: id, status: 'ERR', details: 'Query Error'});	
		});	
}

function allItems(req, res) {
	const contentType = {'content-type': 'application/json; charset=utf-8' };
    console.log('\n--- ' + toISODateTime(Date.now()) + ' ---' );

	const stmt = 'SELECT [wrk_id] simId, [wrk_name] simName, [wrk_date] simDate, [categ], [descr], [value_n1] qty, [value_d1] price, [dttm] ' +
				 'FROM [wsp].[dbo].[WorkDev] where wrk_name is not null';
	const request = new sql.Request();
	request.query(stmt, function (err, recordset) {      
		let rowsData = Object.assign({}, mTemplate);
		if (err) {
			console.log(err)
		} else {
			rowsData.rows = recordset.recordset;
            for (let rec of rowsData.rows) {
				// mssql date colume gives rise of datatime format, so needs to be truncated to date
                rec.simDate = rec.simDate.toISOString().substring(0,10);
            }
		}
		let data = JSON.stringify(rowsData);
		res.set(contentType);
		res.send(data);					
	});
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
