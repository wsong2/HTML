function processGroup(arrRecs)
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
		//console.log("[**] %s ~ %s", a1[0]["date"], a2[0]["date"]);
		let tm1 = a1[0]["date"].toString();
		let tm2 = a2[0]["date"].toString();
		// return a1[0]["date"].localeCompare(a2[0]["date"]);
		return tm1.localeCompare(tm2);
	});
	
	var sortedRows = [];
	for (var i=0; i<arrGroups.length; i++)
	{
		var arr = arrGroups[i];
		for (var n=0, gn=(i+1); n<arr.length; n++) {
			arr[n]["group"] = gn;
			sortedRows.push(arr[n]);
		}
	}
	return sortedRows;
}

/*
const RE = /(\d+)-(\d+)-(\d+)/;
function convDMY(dmy)
{
	var arr = RE.exec(dmy);
	var dtval = parseInt(arr[3])*10000 + parseInt(arr[2])*100 + parseInt(arr[1]);
	return dtval;
}

function processGroupNo(arrRecs)
{
	function arraySN(vLen)
	{
		var ret = [];
		for (var i=0; i<vLen; i++)
			ret.push(i);
		return ret;
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
		return (eqObjs===true) ? null : hashMask(mask);
	}
	
	var arrGroups = [];		// array of List of indexes		

	var queueWorkList = Array.of( arraySN(arrRecs.length) );	
	for (var loopId = 0; queueWorkList.length > 0; loopId++)
	{
		var currPointerArr = queueWorkList.shift(); 		
		var ptr0 = currPointerArr[0];		
		var grp0 = [ptr0];
		
		var mapList = {};
		for (var ptrRec=1; ptrRec<currPointerArr.length; ptrRec++)
		{
			var currPtr = currPointerArr[ptrRec];
			var hm = diffMask(arrRecs[ptr0], arrRecs[currPtr]);
			if (hm == null) {
				grp0.push(currPtr);
			} else if (mapList[hm]) {
				mapList[hm].push(currPtr);
			} else {
				mapList[hm] = Array.of(currPtr);
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
		return convDMY(arrRecs[a1[0]]["date"]) - convDMY(arrRecs[a2[0]]["date"]);
	});
	
	for (var i=0; i<arrGroups.length; i++)
	{
		var arr = arrGroups[i];
		for (var n=0, gn=(i+1); n<arr.length; n++) {
			var idxRec = arr[n];
			var rec = arrRecs[idxRec];
			rec["group"] = gn;
			console.log(gn + ": " + rec["id"] + ", " + rec["date"]);
		}
	}
}

*/