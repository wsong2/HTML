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

function prRecs(arr)
{
	function toShortText(r)
	{
		return '[' + r["id"] + ", " + r["date"] + ']'
	}
	var txt = "";
	for (var n=0; n<arr.length; n++) {
		txt += toShortText(arr[n]) + "  ";
	}
	return txt;
}

const RE = /(\d+)-(\d+)-(\d+)/;
function convDMY(dmy)
{
	var arr = RE.exec(dmy);
	var dtval = parseInt(arr[3])*10000 + parseInt(arr[2])*100 + parseInt(arr[1]);
	//console.log("D=" + dtval);
	return dtval;
}

export function process_group(arrRecs)
{	
	function hashMask(mask)
	{
		var hasNo = mask[0].toString(36);
		for (var i=1; i<mask.length; i++)
		{
			hasNo += ".";
			hasNo += mask[i].toString(36);
		}
		return hasNo;
	}

	function diffMask(vObj1, vObj2)
	{
		var MASK32 = (1 << 32); 
		var keys1 = Object.keys(vObj1).filter(k => (k !== "group" && k !== "id"));
		var eqObjs = true;
		var mask = Array.of(0);
		for (var i=0, iMask=0, nMask=1; i<keys1.length; i++)
		{
			var key = keys1[i];
			if (vObj1[key] !== vObj2[key])
			{
				mask[iMask] |= nMask;
				eqObjs = false;
			}
			nMask = (nMask << 1);
			if (nMask === MASK32)
			{
				nMask = 1;
				mask.push(0);
				iMask++;
			}
		}
		return eqObjs ? null : hashMask(mask);
	}
	
	var arrGroups = [];	
	
	var queueWorkList = Array.of(arrRecs);
	for (var loopId = 0; queueWorkList.length > 0; loopId++)
	{
		var arrRecs = queueWorkList.shift();
		var rec0 = arrRecs[0];
		var grp0 = Array.of(rec0);
		
		var mapList = {};
		for (var iRec=1; iRec<arrRecs.length; iRec++)
		{
			var currRec = arrRecs[iRec];
			var hm = diffMask(rec0, currRec);
			if (hm == null) {
				grp0.push(currRec);
			} else if (mapList[hm]) {
				mapList[hm].push(currRec);
			} else {
				mapList[hm] = Array.of(currRec);
			}
		}
		
		arrGroups.push(grp0);
		for (const k of Object.keys(mapList))
		{
			if (mapList[k].length === 1) {
				arrGroups.push(mapList[k]);
			} else {
				queueWorkList.push(mapList[k]);
			}
		}
	}
	
	arrGroups.sort(function(a1, a2) {
		return convDMY(a1[0]["date"]) - convDMY(a2[0]["date"]);
	});
	
	var sortedRows = [];
	for (var i=0; i<arrGroups.length; i++)
	{
		var arr = arrGroups[i];
		for (var n=0, gn=(i+1); n<arr.length; n++) {
			//console.log(gn + ": " + arr[n]["id"] + ", " + arr[n]["date"]);
			arr[n]["group"] = gn;
			sortedRows.push(arr[n]);
		}
	}
	return sortedRows;
}

export function grid_columns() {
    return(arrColumns);
}

export function grid_rows() {
    return(arrRows);
}
