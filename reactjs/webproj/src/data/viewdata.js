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
	
	function fieldCmp(a, b, cn) {
		let aVal = Reflect.has(a,cn) ? a[cn] : '';
		let bVal = Reflect.has(b,cn) ? b[cn] : '';
		let cmp = aVal.localeCompare(bVal);
		if (cmp == 0) {		
			cmp = a.simId - b.simId;
		}
		return cmp;
	}

	return {
		caption: getCaption,
		rows: () => gridData.rows,
		fieldCmp: fieldCmp
	};
}
