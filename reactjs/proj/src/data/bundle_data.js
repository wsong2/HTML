const arrRows = [
	{"group":0, "id":"Soup-x1", 
	"unit":"tin", "price":0.65, "categ": "A", "date": "01-05-2001"},
	
	{"group":0, "id":"Bread-y0",
	"unit":"loaf", "price":0.80, "categ": "B", "date": "15-05-2001"},
			
	{"group":0, "id":"Milk",
	"unit":"bottle", "price":1.30, "categ": "A", "date": "01-07-2001"},
			
	{"group":0, "id":"Apples",
	"unit":"bag", "price":1.10, "categ": "B", "date": "01-04-2001"},
			
	{"group":0, "id":"Pepsi-1",
	"unit":"bottle", "price":1.05, "categ": "A", "date": "01-05-2001"},
	
	{"group":0, "id":"Pepsi-2",
	"unit":"bottle", "price":1.05, "categ": "A", "date": "01-05-2001"}
];

const arrColumns = [
	{ key: "group", name: "Group", editable: false },
	{ key: "id", name: "ID", editable: false },
	{ key: "unit", name: "Unit", editable: true },
	{ key: "price", name: "Price", editable: true },
	{ key: "categ", name: "Category", editable: true },
	{ key: "date", name: "Date", editable: true }
];

export function grid_columns() { return(arrColumns); }

export function grid_rows() { return(arrRows); }
