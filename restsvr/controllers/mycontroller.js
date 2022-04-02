var fs = require("fs");
var dtFmt = require("./dateformat.js");
var path = require('path');

var mRecId = 1001;

var htmP1, htmP2;

function init()
{
	htmP1 = fs.readFileSync(__dirname + '/data/template1_Begin.txt', {encoding:'utf8', flag:'r'});
	htmP2 = fs.readFileSync(__dirname + '/data/template1_End.txt', {encoding:'utf8', flag:'r'});
}

function htmlPost(req, res)
{
	console.log("> HTML post");
	let txtParams = '';
	for (let key in req.body) {
		let kv = key + ': ' + req.body[key];
		console.log("  " + kv);
		txtParams += kv + '<br>';
	}
	//res.sendFile(path.join(__dirname + '/data/response.html'));
	if (txtParams.length > 0) {
		res.send(htmP1 + '<div>' + txtParams + '</div>' + htmP2);
	} else {
		res.send(htmP1 + htmP2);
	}
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

module.exports.init = init;
module.exports.htmlPost = htmlPost;
module.exports.getPathParam = getPathParam;
module.exports.getQryParam = getQryParam;
module.exports.postAckJson = postAckJson;
module.exports.postAckForm2 = postAckForm2;
