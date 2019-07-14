const arrRows = [
			{
				"group":0,
				"id":"Soup-x1",
				"unit":"tin",
				"price":0.65,
				"categ": "A",
				"date": "01-05-2001"
			},
			{
				"group":0,
				"id":"Bread-y0",
				"unit":"loaf",
				"price":0.80,
				"categ": "B",
				"date": "15-05-2001"
			},
			{
				"group":0,
				"id":"Milk",
				"unit":"bottle",
				"price":1.30,
				"categ": "A",
				"date": "01-07-2001"
			},
			{
				"group":0,
				"id":"Apples",
				"unit":"bag",
				"price":1.10,
				"categ": "B",
				"date": "01-06-2001"
			},
			{
				"group":0,
				"id":"Pepsi-1",
				"unit":"bottle",
				"price":1.05,
				"categ": "A",
				"date": "01-05-2001"
			},
			{
				"group":0,
				"id":"Pepsi-2",
				"unit":"bottle",
				"price":1.05,
				"categ": "A",
				"date": "01-05-2001"
			}
	];

function processGroupNo(arrRecs)
{	
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
		return (eqObjs===true) ? null : mask;
	}
	
	function hashMask(mask)
	{
		var hashNo = mask[0].toString(36);
		for (var i=1; i<mask.length; i++)
		{
			hashNo += ".";
			hashNo += mask[i].toString(36);
		}
		return hashNo;
	}

	var arrGroups = [];		// array of List of indexes	
	
	var arrPointers = [];	// to be populated to [0, 1, 2, ...]
	for (var i=0; i<arrRecs.length; i++) {
		arrPointers.push(i);
	}

	var queueWorkList = Array.of(arrPointers);	
	for (var loopId = 0; queueWorkList.length > 0; loopId++)
	{
		var currPointerArr = queueWorkList.shift();	// == arrPointers the very 1st time 		
		var ptr0 = currPointerArr[0];
		
		var rec0 = arrRecs[ptr0];
		var grp0 = [ptr0];
		
		var mapList = {};
		for (var ptrRec=1; ptrRec<currPointerArr.length; ptrRec++)
		{
			var currPtr = currPointerArr[ptrRec];
			var currRec = arrRecs[currPtr];
			var arrMask = diffMask(rec0, currRec);
			if (arrMask == null) {
				grp0.push(currPtr);
			} else {
				
				var hm = hashMask(arrMask);
				if (mapList.hasOwnProperty(hm)) {
					mapList[hm].push(currPtr);
				} else {
					mapList[hm] = Array.of(currPtr);
				}
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
	
	for (var i=0; i<arrGroups.length; i++)
	{
		var arr = arrGroups[i];
		for (var n=0, gn=(i+1); n<arr.length; n++) {
			arrRecs[arr[n]]["group"] = gn;
		}
	}
}


export function grid_data() {
	processGroupNo(arrRows);
    return {
		columns: [
		  { key: "group", name: "Group", editable: false },
		  { key: "id", name: "ID", editable: false },
		  { key: "unit", name: "Unit", editable: true },
		  { key: "price", name: "Price", editable: true },
		  { key: "categ", name: "Category", editable: true },
		  { key: "date", name: "Date", editable: true }
		],
		rows: arrRows
	};
}
