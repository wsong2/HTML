const gridData = {
 columns : {
	"id": { "caption": "ID" },
	"name": { "caption": "Name" },
	"start-date": { "caption": "Start Date" },
	"profession": { "caption": "Profession" },
	"select1": { "caption": "Choices" }
 },
 rows : [ 
	{
		"id": 1,
		"name" : "mahesh",
		"start-date" : "2015-12-01",
		"profession" : "teacher",
		"select1" : "dog"
	},   
	{
		"id": 2,
		"name" : "suresh",
		"start-date" : "2016-11-11",
		"profession" : "librarian",
		"select1" : "cat"
	},   
	{
		"id": 3,
		"name" : "ramesh",
		"start-date" : "2017-02-01",
		"profession" : "clerk",
		"select1" : "hamster"
	},
	{
		"id": 4,
		"name" : "Andy",
		"start-date" : "2019-05-01",
		"profession" : "manager",
		"select1" : "parrot"
	},   
	{
		"id": 5,
		"name" : "sally",
		"start-date" : "2019-12-01",
		"profession" : "sollicitor",
		"select1" : "spider"
	},
	{
		"id": 6,
		"name" : "holy",
		"start-date" : "2018-08-01",
		"profession" : "actress",
		"select1" : "goldfish"
	}
 ],
 options : {
	"select1": { 
		"dog": "Dog",
		"cat": "Cat",
		"hamster": "Hamster",
		"parrot": "Parrot",
		"spider": "Spider",
		"goldfish": "Goldfish"
	}
 } 
};

export function grid_data()
//function grid_data()
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
	
	function getOptions(cn) {
		let col = gridData.options;
		return col.hasOwnProperty(cn) ? col[cn] : {"none":"None"};
	}
	
	return {
		caption: getCaption,
		options: getOptions,
		rows: getRows
	};
}

//var dfn = grid_data;
//console.log("> " + dfn().caption('select1'));
//console.log("> " + dfn().options('select1').goldfish);
