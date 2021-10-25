'use strict';

const VIEW_SIZE = 10;

const appCategOptions = { 
	App: "App",
	Test: "Test",
	Device: "Device",
	Sim: "Sim",
	Product: "Product"
};

const gridData = {
 keys: ["simId", "simName", "simDate", "categ", "descr", "qty", "price", "dttm"],
 columns : {
	"simId": { "caption": "Id"},
	"simName": { "caption": "Name", "sorting": "U" },
	"simDate": { "caption": "Date", "sorting": "D" },
	"categ": { "caption": "Category"},
	"descr": { "caption": "Description"},
	"qty": { "caption": "Quantity"},
	"price": { "caption": "Price"},
	"dttm": { "caption": "Timestamp"}
 },
 rows : [
   {
    "simId": 1,
    "simName": "Accessory",
    "simDate": "2020-04-01",
    "categ": "Device",
    "descr": "£7.99",
    "qty": 1, 
	"price": 7.99,
    "dttm": "2021-01-02T18:21:13.787"
  },
  {
    "simId": 2,
    "simName": "Stool2",
    "simDate": "2021-03-01",
    "categ": "Product",
    "descr": "£23.99",
    "qty": 1, 
	"price": 25,
    "dttm": "2021-01-02T16:46:13.787"
  },
   {
    "simId": 3,
    "simName": "Accessory",
    "simDate": "2021-04-01",
    "categ": "Sim",
    "descr": "What so ever",
    "qty": 2, 
	"price": 19.8,
    "dttm": "2021-01-13T18:46:45.787"
  }
 ]
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
