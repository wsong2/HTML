var fs = require("fs");
var dtFmt = require("dateformat");
var path = require('path');

var mRecId = 1001;

function htmlPost(req, res)
{
	console.log("> HTML post");
	//console.log(req.body);
	for (let key in req.body) {
		console.log("> " + key + ": " + req.body[key]);
	}
	res.sendFile(path.join(__dirname + '/data/response.html'));
}

function pagePost(req, res)
{
	console.log('\n-- pagePost --');
    //console.log(req);
	
	let gotId = null;
	for (const [key, val] of Object.entries(req.body)) {
		if (key == 'simId' && val && val != '') {
			gotId = val;
		}
		console.log("> %s: %s", key, val);
	}
	let recId = (gotId != null) ? gotId : mRecId++;
	let dttm = dtFmt(Date.now(), 'isoDateTime');
	let json = '{"id": ' + recId + ', "dttm": "' + dttm + '"}';
	res.end(json);
}

function getPathParam(req, res)
{
    console.log('> getPathParam: ' + req.params.tagId + ' at ' + dtFmt(Date.now(), 'isoTime'));
	let json = '{"status": "OK", "details": "' + req.params.tagId + '"}';
	res.end(json);
}

function getQryParam(req, res)
{
    console.log('> getQryParam: ' + req.query.tagId + ' at ' + dtFmt(Date.now(), 'isoTime'));
	let json = '{"status": "OK", "details": "' + req.query.tagId + '"}';
	res.end(json);
}

function postResp(req, res)
{
	console.log('> postResp: %s %s at %s', req.method, req.url, dtFmt(Date.now(), 'HH:MM:ss'));
	//console.log(req);
	for (const [key, val] of Object.entries(req.body)) {
		console.log("  %s: %s", key, val);
	}
	let json = '{"status": "OK", "details": "None"}';
	res.end(json);
}

function parseMultiPartFormData(bodyText)
{
	let cdfd = 'Content-Disposition: form-data; name=';
	let len = cdfd.length;
	let att, val;
	let lines = bodyText.split('\r\n');
	for (let i=0; i<lines.length; i++) {
		let line = lines[i];
		if (line.startsWith('------')) {
			if (att) {
				console.log(attName(att) + ': ' + val);
			}
			continue;
		}
		if (line.startsWith(cdfd)) {
			att = line.substr(len);
		} else if (line == '') {
			val = '';
		} else {
			val += line;
		}
	}
}

function attName(att)
{
	let arr = /"([^"]+)"/.exec(att);
	return arr ? arr[1] : att;
}

module.exports.htmlPost = htmlPost;
module.exports.pagePost = pagePost;

module.exports.getPathParam = getPathParam;
module.exports.getQryParam = getQryParam;
module.exports.postResp = postResp;
