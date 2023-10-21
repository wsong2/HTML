import { readdirSync, readFileSync } from 'fs';
import { extname, basename } from 'path';

const fileLoc = (process.argv.length < 3) ? './HTML/data/dfn' : process.argv[2];
const files = readdirSync(fileLoc);

const arrBN = [];
const mapRefFN = new Map();

// Check COLUMN reference only - not row_<num>
function gatherRefs(bn) {
	let pa = fileLoc + '/grid' + bn + '.json';
	let data = readFileSync(pa,{encoding:'utf8', flag:'r'});	
	let grid = JSON.parse(data);
	let refCols = grid.columns.filter(c => c.coltype === 'Ref');
	for (const col of refCols) {
		let refId = bn + '_C' + col.column;
		if (!mapRefFN.has(refId)) {
			console.log('Undefined ' + refId);
			process.exit(1);
		}
		mapRefFN.set(refId, 1);
	}	
}

files.forEach(file => {
	if (extname(file) != ".json" || !file.startsWith('grid'))	return;
	let bn = basename(file, '.json').substr(4);
	arrBN.push(bn);
	if (bn.indexOf('_') > 0 ) // e.g. '2_1'
		mapRefFN.set(bn, 0);		
});

arrBN.forEach(bn => {
	console.log(bn);
	gatherRefs(bn);
});

mapRefFN.forEach((k, v) => {
	if (v === 0) console.log('Unused ' + k);
});