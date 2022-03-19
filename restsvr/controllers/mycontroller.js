var fs = require("fs");
var dtFmt = require("./dateformat.js");
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
	let dttm = dtFmt.toISODateTime(Date.now());
	let json = '{"id": ' + recId + ', "dttm": "' + dttm + '"}';
	res.end(json);
}

function getPathParam(req, res)
{
    console.log('> getPathParam: ' + req.params.tagId + ' at ' + dtFmt.toHHMMSS(Date.now()));
	let json = '{"status": "OK", "details": "' + req.params.tagId + '"}';
	res.end(json);
}

function getQryParam(req, res)
{
    console.log('> getQryParam: ' + req.query.tagId + ' at ' + dtFmt.toHHMMSS(Date.now()));
	let json = '{"status": "OK", "details": "' + req.query.tagId + '"}';
	res.end(json);
}

function postAckJson(req, res)
{
	let dttm = dtFmt.toHHMMSS(Date.now());
	console.log('> postAckJson: %s %s at %s', req.method, req.url, dttm);
	//console.log(req);
	for (const [key, val] of Object.entries(req.body)) {
		console.log("  %s: %s", key, val);
	}
	let json = '{"status": "OK", "dttm": "' + dttm +'"}';
	res.end(json);
}

function postAckForm2(req, res)
{
	let dttm = dtFmt.toISODateTime(Date.now());
    console.log('> ackdata at ' + dttm);
	console.log('  ' + JSON.stringify(req.body));
	// for (const [key, val] of Object.entries(req.body)) {
		// console.log("  %s: %s", key, val);
	// }
	let json = '{"status": "OK", "appname": "app2", "endpoint": "ack ' + dttm + '"}';
	res.end(json);
}

function parseMultiPartFormData(bodyText)
{
	let cdfd = 'Content-Disposition: form-data; name=';
	let len = cdfd.length;
	let prop, val;
	let lines = bodyText.split('\r\n');
	for (let i=0; i<lines.length; i++) {
		let line = lines[i];
		if (line.startsWith('------')) {
			if (prop) {
				console.log(propName(prop) + ': ' + val);
			}
			continue;
		}
		if (line.startsWith(cdfd)) {
			prop = line.substr(len);
		} else if (line == '') {
			val = '';
		} else {
			val += line;
		}
	}
}

function propName(prop)
{
	let arr = /"([^"]+)"/.exec(prop);
	return arr ? arr[1] : prop;
}

module.exports.htmlPost = htmlPost;
module.exports.pagePost = pagePost;

module.exports.getPathParam = getPathParam;
module.exports.getQryParam = getQryParam;
module.exports.postAckJson = postAckJson;
module.exports.postAckForm2 = postAckForm2;
