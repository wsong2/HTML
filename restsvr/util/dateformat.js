function toHHMMSS(dttm) {
	return dttm.toLocaleTimeString();
}

function toHHMMSSNow() {
	return toHHMMSS(new Date());
}

function toISODateTime(dtNow) {
	let strDTTM = new Date(dtNow).toISOString().substring(0,19);	// 2015-12-02T21:45:22
	return strDTTM.substring(0,10) + ' ' +  strDTTM.substring(11);
}

const _toHHMMSS = toHHMMSS;
export { _toHHMMSS as toHHMMSS };
const _toHHMMSSNow = toHHMMSSNow;
export { _toHHMMSSNow as toHHMMSSNow };
const _toISODateTime = toISODateTime;
export { _toISODateTime as toISODateTime };
