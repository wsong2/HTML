'use strict';

var fs = require("fs");
var path = require('path');
var dtFmt = require("./dateformat.js");

const contentType = {'content-type': 'application/json; charset=utf-8' };

const mSharedArrBuffer = new SharedArrayBuffer(4);
const mA4 = new Uint8Array(mSharedArrBuffer);
mA4[0] = 2;	// 1 - Just use index 0. 2 - Client ID starts from 2

var mCache = {};
var mCacheGrid = {};

function reponseCachedData(queryId, res) {
	let data = mCache[queryId];
	res.set(contentType);
	res.end(JSON.stringify(data));
}

function addClientCacheAndRespond(clientId, res) {
	let data = Object.assign({client_id: clientId}, mCache[1]);	// Currently, all clients share the initial data state2.json (clientId 1)
	mCache[clientId] = data;
	res.set(contentType);
	res.end(JSON.stringify(data));
}

function addGridCacheAndRespond(data, rowsKey, res) {
	res.set(contentType);
	if (!Reflect.has(data, rowsKey)) {
		let json = '{"status": "Error", "details": "no rows key"}';
		res.end(json);
	} else {
		let rec = {columns: data.columns, rows: data[rowsKey]};
		res.end(JSON.stringify(rec));
	}
}

// PATH: /data/:id
function getPathParam(req, res)
{
	const queryId = parseInt(req.params.id, 10);
	
	if (queryId !== 0) {	// Requester has already its client_id and subsequently cached 
		console.log('> cache: Id.' + queryId + ' at ' + dtFmt.toHHMMSSNow());
		reponseCachedData(queryId, res);
		return;
	}
	
	let clientId = Atomics.add(mA4, 0, 1);
	if (Reflect.has(mCache, 1)) {	// Shared state2 (with clientId 1) already cached
		console.log('> cache1: Id.' + clientId + ' at ' + dtFmt.toHHMMSSNow());
		addClientCacheAndRespond(clientId, res);
	} else {
		// One off operation
		console.log('> getPathParam: Id.' + clientId + ' at ' + dtFmt.toHHMMSSNow());
		let filePath = __dirname + "/data/state2.json";
		fs.readFile(filePath, 'utf8', (err, data) => {
			mCache[1] = JSON.parse(data);
			addClientCacheAndRespond(clientId, res);
		});			
	}		
}

// PATH: /gridview?cid=CID&gid=GID&rn=RN
function getQryParam(req, res)
{
    //console.log('> getQryParam: ' + req.query.tagId + ' at ' + dtFmt.toHHMMSS(Date.now()));
	//const queryId = parseInt(req.query.cid, 10);
	const gridId =  req.query.gid;
	const rowsKey = Reflect.has(req.query, "rn") ? ("rows_" + req.query.rn) : "rows";
	if (Reflect.has(mCacheGrid, gridId)) {
		console.log('> cached grid ' + gridId + ' at ' + dtFmt.toHHMMSSNow());
		addGridCacheAndRespond(mCacheGrid[gridId], rowsKey, res);
	} else {
		let filePath = __dirname + "/data/grid" + gridId + ".json";
		if (!fs.existsSync(filePath)) {
			res.set(contentType);
			res.end('{"status": "Error", "details": "Invalid id ' + gridId + '"}');
			return;
		}
		let params = 'gridId=' + gridId;
		if (Reflect.has(req.query, "rn")) {
			params += ', rn=' +  req.query.rn;
		}
		console.log('> getQryParam: ' + params + ' at ' + dtFmt.toHHMMSSNow());
		fs.readFile(filePath, 'utf8', (err, data) => {
			let json = JSON.parse(data);			
			mCacheGrid[gridId] = json;
			addGridCacheAndRespond(json, rowsKey, res);
		});
	}
}

// PATH: /update/:id
function updateState(req, res)
{
	const clientId = parseInt(req.params.id, 10);	
	console.log('> updateState cache: ClientId.' + clientId + ' at ' + dtFmt.toHHMMSSNow());

	if (Reflect.has(mCache, clientId)) {
		reponseCachedData(clientId, res);
	} else {
		console.log('> ** Error: No cached data!');
		let json = '{"status": "Warning", "details": "No cached data!"}';
		res.end(json);
	}
}

// PATH: /upload/state
function receiveUpdate(req, res)
{
	// console.dir(req); // diag: show empty body: {}
	let rec = req.body;
	let clientId = rec.client_id;
    console.log('> receiveUpdate client.' + clientId + ' at ' + dtFmt.toHHMMSSNow());
	let jsonString = JSON.stringify(rec);	
	mCache[clientId] = JSON.parse(jsonString);
	
	let json = '{"status": "OK", "details": "req.body to constainer raw"}';
	res.end(json);
}

// XML
function getXmlData(req, res)
{
  let data = `<?xml version="1.0" encoding="UTF-8"?>`;
  data += `<products>`;

  for (let i = 0; i < 10; i++) {
    data += `<item> 
       <name>Product ${i}</name>
       <price>${i}</price>
    </item>`;
  }

  data += `</products>`;

  res.header("Content-Type", "application/xml");
  res.status(200).send(data);
}

module.exports.getPathParam = getPathParam;
module.exports.getQryParam = getQryParam;
module.exports.receiveUpdate = receiveUpdate;
module.exports.updateState = updateState;

//module.exports.getXmlData = getXmlData;
