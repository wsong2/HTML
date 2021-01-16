var fs = require("fs");
var dtFmt = require("dateformat");

const cache = {};

function gridView(req, res)
{
	const jfn = "griddata.json";
	
    fs.readFile( __dirname + "/data/" + jfn, 'utf8', function (err, data) {
      console.log('--- ' + dtFmt(Date.now(), 'isoTime') + ' ---' );
      console.log('from ' + jfn);
      res.end( data );
   });
}

function allItems(req, res)
{
	//console.log(req.query);
	
	const jfn = "db_prolog_sim11.json";
	
	console.log('--- ' + dtFmt(Date.now(), 'isoTime') + ' ---' );
	
	if (Reflect.has(cache, jfn)) {
		console.log('--- ' + jfn + ' (cached)');
		res.end(cache[jfn]);
	} else {
		fs.readFile( __dirname + "/data/" + jfn, 'utf8', function (err, data) {
			cache[jfn] = data;
			res.end(data);
		});
	}	
}

function deleteItem(req, res)
{
	let id = req.params.id;
	
	console.log('> Deleted ' + id);
	
	return res.status(200);	
}


function postResp(req, res)
{
	console.log('--- Req ---' );

	// let cont_type = req.headers['content-type'];	
	//if ('application/x-www-form-urlencoded' == cont_type) {
		for (let key in req.body) {
			if (req.body[key] == '') {
				console.log(key);
			} else {
				parseMultiPartFormData(key+'='+req.body[key]);
			}
		}
	//} 
		
	const jfn = "ack.json";		
	if (cache.hasOwnProperty(jfn)) {
		res.end(cache[jfn]);
	} else {
		fs.readFile( __dirname + "/data/" + jfn, 'utf8', function (err, data) {
			cache[jfn] = data;
			res.end(data);
		});
	}	
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

module.exports.allItems = allItems;
module.exports.deleteItem = deleteItem;

module.exports.gridView = gridView;
module.exports.postResp = postResp;
 