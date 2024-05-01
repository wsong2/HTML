// Constraints
const constraint1 = (vCategory, vDelta, vEventDate) => {
    if (vCategory === 'DR' && vDelta > 1) {
		return (vEventDate > '2024-04-17');
    }
    return true;
};

var mConstrains = [
	(form) => {
		//console.log('Constraint: ' + form.sCateg.value + ', ' + form.vDelta.value + ', ' + form.dtEvent.value);
		return constraint1(form.sCateg.value, form.vDelta.value, form.dtEvent.value);
	}
];

// Actions
const action1 = (form) => {
    if (form.sCateg.value !== 'DR' || form.vLevel.value < 2)	return;
	let elt = form.dt2;
	let dtValue0 = elt.value ? new Date(elt.value) : new Date(1970,1,1);
	let dtValue1 = datePlusDays(form.dtEvent.value, form.vLevel.value);
	if (!equalDate(dtValue0, dtValue1)) {
		elt.value = dtValue1.toISOString().slice(0, 10);
		elt.title = 'Set by action 1';
	}
};

var mActions = [
	(form) => action1(form)
]

//
function trigger(form, name0, logger) {
	if (!checkConstrains(form, logger)) return;
	for (let prcAction of mActions) {
		prcAction(form);
		if (!checkConstrains(form, logger))	
			break;
	}
}

function checkConstrains(form, logger) {
	for (let i=0; i<mConstrains.length; i++) {
		let fnt = mConstrains[i];
		if (!fnt(form)) {
			logger('Constraint ' + i + ' failed');
			return false;
		}
	}
	return true;
}

function datePlusDays(dt0, nDays) {
	let tm = new Date(dt0).getTime() + nDays * 24 * 60 * 60 * 1000;
	return new Date(tm);
}

const equalDate = (dt1, dt2) => dt1.getFullYear() === dt2.getFullYear() && dt1.getMonth() === dt2.getMonth() && dt1.getDate() === dt2.getDate();

