function toHHMMSS(dtNow) {
	let strDTTM = new Date(dtNow).toISOString();
	return strDTTM.substring(11,19);
}

function toHHMMSSNow() {
	return toHHMMSS(Date.now());
}

function toISODateTime(dtNow) {
	let strDTTM = new Date(dtNow).toISOString().substring(0,19);	// 2015-12-02T21:45:22
	return strDTTM.substring(0,10) + ' ' +  strDTTM.substring(11);
}

function toISOTimeStamp(dtNow) {
	return new Date(dtNow).toISOString().substring(0,23);	// 2015-12-02T21:45:22.000
}

function lpad0(n, width) {	// 0 < width <= 5
	let str = '00000' + n;
	let len = str.length;
	return str.substring(len - width);
}

const _toHHMMSS = toHHMMSS;
export { _toHHMMSS as toHHMMSS };
const _toHHMMSSNow = toHHMMSSNow;
export { _toHHMMSSNow as toHHMMSSNow };
const _toISODateTime = toISODateTime;
export { _toISODateTime as toISODateTime };

const _toISOTimeStamp = toISOTimeStamp;
export { _toISOTimeStamp as toISOTimeStamp };