'use strict';

import gridData from './data/grid_data_0.json';

const VIEW_SIZE = 10;

const appCategOptions = { 
	App: "App",
	Test: "Test",
	Device: "Device",
	Sim: "Sim",
	Product: "Product"
};

export default function viewdata()
{
	var mStart = 0;
	var mGridRows = gridData.rows;
	
	function shiftView(bFwd)
	{
		let iStart, changed;
		
		if (bFwd) {
			iStart = mStart + VIEW_SIZE - 1;
			changed = (iStart + VIEW_SIZE <= mGridRows.length);
		} else {
			iStart = mStart - (VIEW_SIZE - 1);
			changed = (iStart >= 0);
		}	
		if (!changed && mGridRows.length >= VIEW_SIZE) {
			iStart = mGridRows.length - VIEW_SIZE;
			changed = bFwd ? (iStart > mStart) : (iStart < mStart);
		}
		if (!changed)	return false;
		
		mStart = iStart;
		setViewRows();
		return true;
	}

	function addRec(rec) {
		let row = {};
		for (let i=0; i<gridData.keys.length; i++) {
			let key = gridData.keys[i];
			row[key] = rec[key];
		}
		mGridRows.push(row);
		return row;
	}
	
	function removeRow(rIndex) {
		let idx = parseInt(mStart) + parseInt(rIndex);
		mGridRows.splice(idx, 1);
	}

	function updateRow(rIndex, rec) {
		let idx = parseInt(mStart) + parseInt(rIndex);
		let row = mGridRows[idx];
		for (let [key,val] of Object.entries(rec)) {
			if (gridData.columns.hasOwnProperty(key))
				row[key] = val;
		}
	}

	function typeByID(nm) {
		if (nm === 'dttm')		return 'datetime-local';
		if (nm === 'simDate')	return 'date';
		if (nm === 'categ')		return 'select';
		return 'text';
	};
	
	return {
		keys: () => gridData.keys,
		columnDfn: (id) => gridData.columns[id],
		rows: () => mGridRows,
		add: addRec,
		reload: (rows) => {mGridRows = [...rows]},
		remove: removeRow,
		update: updateRow,
		shiftView: shiftView,
		categOptions: () => Object.keys(appCategOptions),
		categText: (opt) => appCategOptions[opt],
		typeByID: typeByID
	};
}
