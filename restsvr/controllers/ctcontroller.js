'use strict';

var fs = require("fs");
var path = require('path');
var dtFmt = require("./dateformat.js");

const contentType = {'content-type': 'application/json; charset=utf-8' };

const mSharedArrBuffer = new SharedArrayBuffer(4);
const mA4 = new Uint8Array(mSharedArrBuffer);
mA4[0] = 2;	// Just use first one

var mCache = {};

function reponseCachedData(queryId, res) {
	let data = mCache[queryId];
	res.set(contentType);
	res.end(JSON.stringify(data));
}

function addClientCacheAndRespond(clientId, res) {
	let data = Object.assign({client_id: clientId}, mCache[1]);	// Currently, all clients share the initial data state1.json
	mCache[clientId] = data;
	res.set(contentType);
	res.end(JSON.stringify(data));
}

// PATH: /data/:id
function getPathParam(req, res)
{
	const queryId = parseInt(req.params.id, 10);
	
	let msg;
	if (queryId !== 1) {
		msg = 'cache: Id.' + queryId + ' at ' + dtFmt.toHHMMSSNow();
		console.log('> ' + msg);
		reponseCachedData(queryId, res);
		return;
	}
	
	let clientId = Atomics.add(mA4, 0, 1);
	if (Reflect.has(mCache, 1)) {
		msg = 'cache1: Id.' + clientId + ' at ' + dtFmt.toHHMMSSNow();
		console.log('> ' + msg);
		addClientCacheAndRespond(clientId, res);
	} else {
		msg = 'getPathParam: Id.' + clientId + ' at ' + dtFmt.toHHMMSSNow();
		console.log('> ' + msg);
		let filePath = __dirname + "/data/state1.json";		// Currently, all clients share the initial data state1.json
		fs.readFile(filePath, 'utf8', (err, data) => {
			mCache[1] = JSON.parse(data);
			addClientCacheAndRespond(clientId, res);
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

module.exports.getPathParam = getPathParam;
module.exports.receiveUpdate = receiveUpdate;
module.exports.updateState = updateState;
