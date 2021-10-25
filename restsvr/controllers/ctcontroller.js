var fs = require("fs");
var dtFmt = require("dateformat");
var path = require('path');

const contentType = {'content-type': 'application/json; charset=utf-8' };

var mCache = {};

var containerRaw = null;

function rgJsonFile(rgId) {
	// There is only state1.json for the moment	
	return __dirname + "/data/state1.json";	
}

function getPathParam(req, res)
{
	const rgId = req.params.id;
	const idMsg = 'Id.' + rgId + ' at ' + dtFmt(Date.now(), 'isoTime');

	if (Reflect.has(mCache, rgId)) {
		console.log('> get cache: ' + idMsg);
		let data = mCache[rgId];
		res.set(contentType);
		res.end(data);
		return;
	}
	
    console.log('> getPathParam: ' + idMsg);
	let filePath = rgJsonFile(rgId)
	fs.readFile(filePath, 'utf8', (err, data) => {
		mCache[rgId] = data;
		res.set(contentType);
		res.end(data);
	});
}

function updateState(req, res)
{
	const rgId = req.params.id;	
	const idMsg = 'Id.' + rgId + ' at ' + dtFmt(Date.now(), 'isoTime');

	// containerRaw meant to contain state of RG(rgId) 
	if (containerRaw != null) {
		console.log('> get update cache: ' + idMsg);
		//console.log('! ' +  containerRaw);		
		res.set(contentType);
		res.end(containerRaw);
		return;
	}
	
    console.log('> updateState: ' + idMsg);
    console.log('> ** Error - No cached data!');
	let json = '{"status": "Warning", "details": "No cached data!"}';
	res.end(json);
}

function receiveUpdate(req, res)
{
    console.log('> receiveUpdate: at ' + dtFmt(Date.now(), 'isoTime'));	
	containerRaw = JSON.stringify(req.body);
	// console.log('# ' + containerRaw); // OK
	// console.dir(req); // diag: show empty body: {}
	
	let json = '{"status": "OK", "details": "req.body to constainer raw"}';
	res.end(json);
}

module.exports.getPathParam = getPathParam;
module.exports.receiveUpdate = receiveUpdate;
module.exports.updateState = updateState;
