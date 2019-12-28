const gridData = 
{
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
 ],
 columns : [
	{ "key": "id", "name": "ID" },
	{ "key": "name", "name": "Name", "editable": true },
	{ "key": "start-date", "name": "Start Date", "editable": true },
	{ "key": "profession", "name": "Profession", "editable": true }
 ]
};

export function grid_data() { return(gridData); }
