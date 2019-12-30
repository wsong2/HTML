function log_record()
{
	var count = 0;
	var map = new Map();
	
	function addMsg(iKey, msg) {
		var rec = new Object();
		rec.msg = msg;
		rec.idx = count;
		count++;
		map.set(iKey, rec);
	}
	
	function mapToSortedArr() {
		var ret = new Array(map.size);
		for (let val of map.values()) {
			ret[val.idx] = val.msg;
		}
		return ret;
	}
	
	function hasRecord() {
		return (count>0);
	}
	
	return {
		addMessage: addMsg,
		hasRecord: hasRecord,
		getList: mapToSortedArr
	}
}

module.exports.log_record = log_record;