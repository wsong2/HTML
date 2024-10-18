var mDataGrid = {
	rows : [ 
	   	{	simId: 12,
		   	simName: "Client-2", 
			simDate: "2019-08-26",
		   	caterory: "App", 
			desc: "Rest client PUT",
			rate: 13.6,
		   	dttm: "2019-08-26T00:00:00"
	   	},
		{ 	simId: 15,
		   	simName: "ClientN3", 
			simDate: {eltId: 10001, val: "2020-08-06"},
		   	caterory: "Test", 
			desc: "Rest client loader",
			rate: 22.56,
		   	dttm: "2020-08-06T00:00:00"
	   	},
		{ 	simId: 110,
		   	simName: "中文 产品", 
			simDate: "2020-04-01",
		   	caterory: "Product", 
			desc: "生日18",
			rate: 7.99,
		   	dttm: "2021-03-18T18:46:13.787"
	   }
	],
	columns: [
		{name: "simId", caption: "ID"},
		{name: "simName", caption: "Name"},
		{name: "simDate", caption: "Date"},
		{name: "caterory", caption: "Category"},
		{name: "desc", caption: "Description"},
		{name: "rate", caption: "Rate"},
		{name: "dttm", caption: "DateTime"}
	]
};

function insertTBodyRow(tbody) {
	var vColumns = mDataGrid.columns;
	var vRows = mDataGrid.rows;

	function getCellElt(cellValue) {
		if (typeof cellValue !== 'object') {
			return document.createTextNode(cellValue);
		}
		let inp = document.createElement('input');
		inp.type = 'date';
		inp.value = cellValue.val;
		inp.id = cellValue.eltId;
		inp.readOnly = true;
		return inp;
	}

	function insertRowCells(htmRow, rowCellRec) {
		vColumns.forEach((col,iCol) => {
			let cellTD = htmRow.insertCell(iCol);
			cellTD.className = "grid";
			let cellValue = rowCellRec[col.name];
			let elt = getCellElt(cellValue);
			cellTD.appendChild(elt);		
		});
	}
	
	function insertHeadCells() {
		let header = tbody.parentElement.createTHead();
		header.className = "grid";
		let row = header.insertRow(0); 
		vColumns.forEach((col, iCol) => {
			let cell = row.insertCell(iCol);
			cell.className = "grid";
			cell.innerHTML = '<b>' + col.caption + '</b>';		
		});
	}

	//
	insertHeadCells();
	
	vRows.forEach((row, iRow) => {
		let newRow = tbody.insertRow(iRow);	
		insertRowCells(newRow, row);
	});
}
