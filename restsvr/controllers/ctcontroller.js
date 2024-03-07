'use strict';

import { readFile } from "fs";
import path from 'path';
import { toHHMMSSNow } from "./dateformat.js";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentType = {'content-type': 'application/json; charset=utf-8' };

const mSharedArrBuffer = new SharedArrayBuffer(4);
const mA4 = new Uint8Array(mSharedArrBuffer);
mA4[0] = 2;	// 1 - Just use index 0. 2 - Client ID starts from 2

var mCache = {};
var mProps = {};

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

// PATH: /data/:id
function getPathParam(req, res)
{
	const queryId = parseInt(req.params.id, 10);
	
	if (queryId !== 0) {	// Requester has already its client_id and subsequently cached 
		console.log('> cache: Id.' + queryId + ' at ' + toHHMMSSNow());
		reponseCachedData(queryId, res);
		return;
	}
	
	let clientId = Atomics.add(mA4, 0, 1);
	if (Reflect.has(mCache, 1)) {	// Shared state2 (with clientId 1) already cached
		console.log('> cache1: Id.' + clientId + ' at ' + toHHMMSSNow());
		addClientCacheAndRespond(clientId, res);
	} else {
		// One off operation
		console.log('> getPathParam: Id.' + clientId + ' at ' + toHHMMSSNow());
		let filePath = __dirname + "/data/state2.json";
		readFile(filePath, 'utf8', (err, data) => {
			mCache[1] = JSON.parse(data);
			addClientCacheAndRespond(clientId, res);
		});			
	}		
}

// PATH: /update/:id
function updateState(req, res)
{
	const clientId = parseInt(req.params.id, 10);	
	console.log('> updateState cache: ClientId.' + clientId + ' at ' + toHHMMSSNow());

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
    console.log('> receiveUpdate client.' + clientId + ' at ' + toHHMMSSNow());
	mProps[clientId] = rec;
	
	let json = '{"status": "OK", "details": "req.body to constainer raw"}';
	res.end(json);
}

// XML
/* function getXmlData(req, res)
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
 */

const _getPathParam = getPathParam;
export { _getPathParam as getPathParam };
const _receiveUpdate = receiveUpdate;
export { _receiveUpdate as receiveUpdate };
const _updateState = updateState;
export { _updateState as updateState };
