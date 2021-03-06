var fs = require("fs");
var dtFmt = require("dateformat");
var path = require('path');

function gridView(req, res)
{
	const jfn = "db_prolog_sim_rc.json";	
    fs.readFile( __dirname + "/data/" + jfn, 'utf8', function (err, data) {
      console.log('--- ' + dtFmt(Date.now(), 'isoTime') + ' ---' );
      console.log('from ' + jfn);
	  res.set({ 'content-type': 'application/json; charset=utf-8' });
      res.end( data );
   });
}

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
	console.log('-- pagePost --');
    //console.log(req);
	
	for (let key in req.body) {
		console.log("> " + key + ": " + req.body[key]);
	}
	let json = '{"id": 101, "details": "None"}';
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
	console.log('> postResp' );

	for (let key in req.body) {
		if (req.body[key] == '') {
			console.log("> Key");
			console.log(key);
		} else {
			console.log("> Multi-Part");
			parseMultiPartFormData(key+'='+req.body[key]);
		}
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
module.exports.gridView = gridView;

module.exports.getPathParam = getPathParam;
module.exports.getQryParam = getQryParam;
module.exports.postResp = postResp;
 