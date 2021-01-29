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
	
	function fieldCmp(a, b) {
		let aVal = a ? a : '';
		let bVal = b ? b : '';
		return aVal.localeCompare(bVal);
	}
	
	function sortRows(rows, col) {
		rows.sort((a,b) => fieldCmp(a[col], b[col]))
	}
	
	return {
		caption: getCaption,
		rows: () => gridData.rows,
		sortRows: sortRows
	};
}
