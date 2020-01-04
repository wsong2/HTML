const gridData = {
 columns : {
	"id": { "caption": "ID" },
	"name": { "caption": "Name" },
	"start-date": { "caption": "Start Date" },
	"profession": { "caption": "Profession" }
 },
 rows : [ 
	{
		"id": 1,
		"name" : "mahesh",
		"start-date" : "2015-12-01",
		"profession" : "teacher"
	},   
	{
		"id": 2,
		"name" : "suresh",
		"start-date" : "2016-11-11",
		"profession" : "librarian"
	},   
	{
		"id": 3,
		"name" : "ramesh",
		"start-date" : "2017-02-01",
		"profession" : "clerk"
	},
	{
		"id": 4,
		"name" : "Andy",
		"start-date" : "2019-05-01",
		"profession" : "manager"
	},   
	{
		"id": 5,
		"name" : "sally",
		"start-date" : "2019-12-01",
		"profession" : "sollicitor"
	},
	{
		"id": 6,
		"name" : "holy",
		"start-date" : "2018-08-01",
		"profession" : "actress"
	}
 ]
};

export function grid_data()
{
	function getColumn(cn) {
		let col = gridData.columns;
		return col.hasOwnProperty(cn) ? col[cn] : {};
	}
	
	function getCaption(cn) {
		let rec = getColumn(cn);
		return rec.hasOwnProperty('caption') ? rec['caption'] : cn;
	}
	
	function getRows() { return gridData.rows; }
	
	return {
		caption: getCaption,
		rows: getRows
	};
}

//var dfn = grid_data;
//console.log("> " + dfn().coltype('start-date'));
