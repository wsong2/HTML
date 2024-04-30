const constraint1 = (vCategory, vDelta, vEventDate) => {
    if (vCategory === 'DR' && vDelta > 1) {
		return (vEventDate > '2024-04-17');
    }
    return true;
};

var mConstrains = [
	(ctxt) => {
		let vCategory = ctxt['s10'];
		let vDelta = ctxt['vDelta'];
		let vEvtDate = ctxt['dtEvent'];
		return constraint1(vCategory, vDelta, vEvtDate);
	}
];

function trigger(ctxt, logger) {
	for (let i=0; i<mConstrains.length; i++) {
		let fnt = mConstrains[i];
		if (!fnt(ctxt)) {
			logger('Constraint ' + i + ' failed');
			return;
		}
	}
}
