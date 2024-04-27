import { readFileSync } from "fs";
import { toISODateTime, toHHMMSSNow } from "../util/dateformat.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var htmP1, htmP2;

function init()
{
	htmP1 = readFileSync(__dirname + '/data/template1_Begin.txt', {encoding:'utf8', flag:'r'});
	htmP2 = readFileSync(__dirname + '/data/template1_End.txt', {encoding:'utf8', flag:'r'});
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
	console.log('> getPathParam: ' + req.params.tagId + ' at ' + toHHMMSSNow());
 	let json = '{"status": "OK", "detail": "' + req.params.tagId + '"}';
	res.end(json);
}

function getQryParam(req, res)
{
    console.log('> getQryParam at ' + toHHMMSSNow());
    console.log('  tagId: ' + req.query.tagId);

	let rec = {status: "OK", tagId: req.query.tagId};
	if (Object.hasOwn(req.query, 'optId2')) {
		rec.optId2 = req.query.optId2;
   		console.log('  optId2: ' + rec.optId2);
	}
	if (Object.hasOwn(req.query, 'optId3')) {
		rec.optId3 = req.query.optId3;
   		console.log('  optId3: ' + rec.optId3);
	}
	res.end(JSON.stringify(rec));
}

function postAckJson(req, res)
{
	let dttm = toHHMMSSNow();
	let rec = {status: "OK"};

	console.log('> postAckJson: %s %s at %s', req.method, req.url, dttm);
	for (const [key, val] of Object.entries(req.body)) {
		if (key === 'Note') {
			rec.hasNote = true;
		}
		console.log("  %s: %s", key, val);
	}
	rec.dttm = dttm;

	res.end(JSON.stringify(rec));
}

function postAckForm2(req, res)
{
	let dttm = toISODateTime(Date.now());
	let rec = {status: "OK", app2: "endpoint"};
	if (Object.hasOwn(req.body, 'Note')) {
		rec.hasNote = true;
	}
    console.log('> ackdata at ' + dttm);
	rec.ack = dttm;
	res.end(JSON.stringify(rec));
}

/* function parseMultiPartFormData(bodyText)
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
 */
const _init = init;
export { _init as init };
const _htmlPost = htmlPost;
export { _htmlPost as htmlPost };
const _getPathParam = getPathParam;
export { _getPathParam as getPathParam };
const _getQryParam = getQryParam;
export { _getQryParam as getQryParam };
const _postAckJson = postAckJson;
export { _postAckJson as postAckJson };
const _postAckForm2 = postAckForm2;
export { _postAckForm2 as postAckForm2 };
