function trigger(vExecutor, vState, logger)
{
	vExecutor.actions.forEach(actn => launchGridAction(actn, vState, logger));

	vExecutor.constraints.forEach(cstn => applyConstraint(cstn));
	
	//	
	function applyConstraint(vCstn) {
		let rec = {};		
		doEval(vCstn.dfn, rec);
		
		if (!rec.hasOwnProperty('verbe')) return;
		if (!rec.hasOwnProperty('val'))	return;
		
		let propId = rec.hasOwnProperty('propId') ? rec.propId : vCstn.prop_id;
		let prop = vState.findProp(propId);
		if (prop === undefined) {
			logger('  Undef propId: ' + propId);
		} else if (!vState.setValueIfNoConflict(prop, rec.val, vCstn.cstn_id)) {
			logger('  prop. ' + propId + ': value conflict ' + prop.val + ' ~ ' + rec.val);
		} else {
			logger('Constraint.' + vCstn.cstn_id + ': OK');
		}
	}
	
	function doEval(arrDfn, vRec) {
		if (arrDfn[0] !== 'setval') return;	// TMP
		
		let ss = arrDfn[1].split(':');	// Example - $eq:@10:ZH
		if (ss[0] !== '$eq') return // TMP
		
		let v1 = getRawValue(ss[1]);
		let v2 = getRawValue(ss[2]);
		if (v1 == null || v2 == null)	return;

		vRec.verbe = arrDfn[0];
		if (v1 === v2) {
			vRec.val = arrDfn[2];
		} else if (arrDfn.length > 3) {
			vRec.val = arrDfn[3];
		}
	}
	
	function getRawValue(str) {
		if (!str.startsWith('@')) return str;
		
		let propId = parseInt(str.substr(1), 10);
		if (isNaN(propId))	return null;
		
		let prop = vState.findProp(propId);
		return (prop === undefined) ? null : prop.val;
	}
}
