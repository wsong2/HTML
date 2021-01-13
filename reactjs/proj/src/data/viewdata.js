const gridData = {
 columns : {
	"id": { "caption": "Id" },
	"simName": { "caption": "Name" },
	"simDate": { "caption": "Date" },
	"descr": { "caption": "Description" },
	"dttm": { "caption": "Timestamp" }
 },
 rows : [ 
  {
    "id": 2,
    "simName": "Client-2",
    "descr": "Rest client PUT",
    "dttm": "2019-08-26T00:00:00"
  },
  {
    "id": 5,
    "simName": "ClientN3",
    "descr": "Rest client loader",
    "dttm": "2020-08-06T00:00:00"
  },
  {
    "id": 7,
    "simName": "Asus ZenBook ux315",
    "simDate": "2020-12-26",
    "descr": "900 GBP",
    "dttm": "2020-12-26T00:00:00"
  },
  {
    "id": 8,
    "simName": "Sim00",
    "simDate": "2021-01-05",
    "descr": "Through Web Form",
    "dttm": "2021-01-05T19:30:41.02"
  },
  {
    "id": 9,
    "simName": "Seiko",
    "simDate": "2020-04-01",
    "descr": "£7.99",
    "dttm": "2021-01-07T18:46:13.787"
  }
 ]
};

export function viewdata()
{	
	function getCaption(cn) {
		let cols = gridData.columns;
		if (!Reflect.has(cols, cn)) {
			return cn;
		}
		return cols[cn]['caption'];
	}
		
	return {
		caption: getCaption,
		rows: () => gridData.rows
	};
}
