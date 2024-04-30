var mDataGrid = {
	rows : [ 
	   	{	simId: 12,
		   	simName: "Client-2", 
			simDate: "2019-08-26",
		   	categ: "App", 
			descr: "Rest client PUT",
		   	qty: 1, 
			price: 13.6,
		   	dttm: "2019-08-26T00:00:00"
	   	},
		{ 	simId: 15,
		   	simName: "ClientN3", 
			simDate: "2020-08-06",
		   	categ: "Test", 
			descr: "Rest client loader",
		   	qty: 1, 
			price: 22.56,
		   	dttm: "2020-08-06T00:00:00"
	   	},
		{ 	simId: 110,
		   	simName: "中文 产品", 
			simDate: "2020-04-01",
		   	categ: "Product", 
			descr: "生日18",
		   	qty: 1, 
			price: 7.99,
		   	dttm: "2021-03-18T18:46:13.787"
	   }
	],
	columns: [
		{name: "simId", caption: "ID"},
		{name: "simName", caption: "Name"},
		{name: "simDate", caption: "Date"},
		{name: "categ", caption: "Category"},
		{name: "descr", caption: "Description"},
		{name: "qty", caption: "Qty"},
		{name: "price", caption: "Price"},
		{name: "dttm", caption: "DateTime"}
	]
};

function insertTBodyRow(tbody) {
	var vColumns = mDataGrid.columns;
	var vRows = mDataGrid.rows;

	function insertRowCells(htmRow, rowCellRec) {
		vColumns.forEach((col,iCol) => {
			let cellTD = htmRow.insertCell(iCol);
			cellTD.className = "grid";
			let textValue = rowCellRec[col.name];
			let elt = document.createTextNode(textValue);
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
