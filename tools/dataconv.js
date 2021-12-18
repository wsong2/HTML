'use strict';

var fs = require("fs");

const filename = "state1.json"
const typeTEXT = 'T';
const typeREF = 'Ref';

function isNullVal(vType, vStr) {
	return (vType === typeTEXT && vStr === '(null)');
}

function convRow(arrTypes, arrStr) {
	const strToVal = (i) => {
		let str = arrStr[i];
		let typ = arrTypes[i];
		if (isNullVal(typ, str)) return {isnull: 'Y'};
		if (typ === typeREF) return {val: str.substr(2)};
		return {val: str};
	}
	
	let cells = [];
	for (let i=0; i<arrTypes.length; i++) {
		let val = strToVal(i);
		cells.push(val);
	}
	return cells;
}

function convRecGrid(rec) {
	rec.rows = [];	
	rec.types = [];
	
	let cols = rec.cols;
	for (let i=0, nLen=cols.length; i<nLen; i++) {
		let s2 = cols[i].split('/');
		cols[i] = s2[0];
		rec.types[i] = (s2.length > 1) ? s2[1] : typeTEXT;
	}
	for (let rowLine of rec.csv_rows) {
		let arrVal = rowLine.split(';');
		let row = convRow(rec.types, arrVal);
		rec.rows.push(row);
	}	
	delete rec.csv_rows;
	return rec;
}
	
function checkData(vJson)
{
	let arrProps = vJson.state.props;
	let arrGrids = vJson.state.grids;
	let arrActns = vJson.actions;

	let mSetID = new Set();
	
	const assertDistinctId = (arr, propn, msg) => {
		for (let i=0, nLen=arr.length; i<nLen; i++) {
			let idVal = arr[i][propn];
			if (mSetID.has(idVal)) {
				console.log(msg + i);
				return false;
			}
			mSetID.add(idVal);
		}
		return true;
	}
	
	if (!assertDistinctId(arrProps, 'prop_id', '[Props] duplicate prop_id at #')) {
		return false;
	}
	mSetID.clear();
	if (!assertDistinctId(arrGrids, 'grid_id', '[Grids] duplicate grid_id at #')) {
		return false;
	}
	mSetID.clear();
	if (!assertDistinctId(arrActns, 'actn_id', '[Actns] duplicate actn_id at #')) {
		return false;
	}
	
	arrGrids.forEach((gr) => convRecGrid(gr));
	return true;
}

var data = fs.readFileSync( __dirname + "/../data/dfn/" + filename, 'utf8');
var	json = JSON.parse(data);

if (checkData(json)) {
	fs.writeFileSync(__dirname + "/../data/converted/" + filename, JSON.stringify(json, null, 2));
	fs.writeFileSync(__dirname + "/../restsvr/controllers/data/" + filename, JSON.stringify(json));
}
