const gridData = {
 columns : {
	"simId": { "caption": "Id" },
	"simName": { "caption": "Name" },
	"simDate": { "caption": "Date" },
	"categ": { "caption": "Category" },
	"descr": { "caption": "Description" },
	"dttm": { "caption": "Timestamp" }
 },
 rows : [
   {
    "simId": 1,
    "simName": "Accessory",
    "simDate": "2020-04-01",
    "categ": "DIY",
    "descr": "£7.99",
    "dttm": "2021-01-02T18:46:13.787"
  }
 ]
};

export default function viewdata()
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
