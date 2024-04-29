function trigger(id0, vProps, constraints, logger)
{
	for (let rec of constraints) {
		let ss = rec.expr.split('_');	// e.g. $EQ_@s5_$ADD_@s4_@s12
		try {
			if (doEval(ss, rec.id))
				continue;
			if (rec.level === 'error') {
				log('Error - constraint.' + rec.id);
				return false;
			}
			if (rec.level === 'error') {
				log('Warning - constraint.' + rec.id);
			}
		} catch(err) {
			logger(err);
			return false;
		}
	}
	
	//
	function doEval(ss, constraintID)
	{		
		let mStackFnc = [];
		let mStackArg = [];
		let currOptr = null;
		let lazyIndex = -1;

		let op = ss.shift();
		while (typeof(op) !== 'undefined')
		{
			if (op.startsWith('$')) {
				if (currOptr != null) mStackFnc.push(currOptr);
				currOptr = makeOptr(op);
				if (parentLaziness(mStackArg)) 
					currOptr.lazy = true;
			} else {
				let arg = getOpValue(op, vProps);
				if (currOptr == null) {
					mStackArg.push(arg);
					break;
				}
				if ((currOptr.startArgIndex + currOptr.arity) <= (mStackArg.length+1)) {	// arg not in stack yet
					evalLoop(arg);
				} else {	// arg list moy completed yet
					if (lazyIndex < 0 && currOptr.internalName === 'IF' && currOptr.startArgIndex === mStackArg.length)
						lazyIndex = mStackArg.length + (arg ? 1 : 2);				
					mStackArg.push(arg);
				}					
			}
			op = ss.shift()
		}
		if (mStackArg.length !== 1) throw 'Operants Stack length error!';
		return mStackArg[0];
		
		//
		function makeOptr(optr)
		{
			let rec = {arity: 2, startArgIndex: mStackArg.length, cttId: constraintId};
			if (rec.startIndex === lazyIndex) {
				rec.lazy = true; 
			}		
			if (optr === '$IF') {
				rec.arity = 3;
				rec.internalName = 'IF';
				rec.fnc = a => a[0] ? a1[1] : a2[2];
				return rec;		
			}
			if (optr === '$ADD') {
				rec.fnc = doAdd;
				return rec;
			}
			if (optr === '$EQ')  {
				rec.fnc = checkEQ;
				return rec;
			}
			throw 'Unimplemented operattor ' + optr;
		}
		
		function evalLoop(operantIn) {
			let operant = operantIn;
			while (true) {
				let arrArgs = [];
				fillArguments((currOptr.arity-1), operant, arrArgs);
				if (currOptr.laze) {
					operant = false;	// false as dummy value
				} else {
					operant = currOptr.fnc(arrArgs);
					if (lazyIndex > currOptr.startArgIndex)	
						lazyIndex = -1;
				}
				if (mStackFnc.length === 0) {
					mStackArg.push(operant);
					break;	
				}
				currOptr = mStackFnc.pop();
				if ((mStackArg.length + 1) < currOptr.arity)
					break;
			}
		}		
	
		function fillArguments(nLen, op, arrArgs) {
			if (currOptr.startArgIndex + nLen > mStackArg.length) {
				throw 'mStackArg size error: length = ' + mStackArg.length + ', expected >= ' + (currOptr.startArgIndex + nLen);
			}
			arrArgs.length = nLen + 1;
			arrArgs[nLen] = op;
			for (let i=nLen-1; i>=0; i--) {
				let prevOp = mStackArg.pop();
				arrArgs[i] = prevOp;
			}
		}				
	}
}

//
function parentLaziness(argStack) {
	let parentOptr = (argStack.length > 0) ? argStack[argStack.length-1] : null;
	return (Reflect.has(parentOptr, 'lazy') && parentOptr.lazy);
}

function getOpValue(op, vProps) {
	if (!op.startsWith('@')) return op;
	let val = vProps.find(p => p.prop_id === op);
	if (typeof val === 'undefined') throw 'Undefined prop_id: ' + op;
	return val;
}

//		
// vtype: bool, date, dummy, text
// Reflect.has() or Object.hasOwn()
//
function simpleType(arg) {
	let valType = typeof arg;
	return (valType === 'boolean' || valType === 'number' || valType === 'string');
}

function checkEQ(args) {
	if (simpleType(args[0]) || simpleType(args[1]))	return (args[0] === args[1]);
	return (args[0].vtype === args[1].vtype && args[0].val === args[1].val);
}

function doAdd(args) {
	let v1 = args[0]
	let v2 = args[1];
	if ((typeof v1) === 'number' && (typeof v2) === 'number')	return (v1 + v2);
	return (typeof v1 === 'number') ? datePlusDays(v2, v1) : datePlusDays(v1, v2);
}

function datePlusDays(vDate, nDays)
{
	if (typeof nDays !== 'number')	throw 'datePlusDays - Invalid 2nd argument ' + nDays;
	
	let valDate;
	if (Object.hasOwn(vDate, 'vtype')) {
		if (vDate.vtype !== 'date') throw 'datePlusDays - Invalid 1st argument type ' + vDate;
		valDate = vDate.val;	
	} else {
		valDate = Date.parse(vDate);
		if (isNaN(valDate))	throw 'datePlusDays - Invalid 1st argument value ' + vDate; 
	}	
	valDate.setDate(valDate.getDate() + nDays);
	return {vtype: 'date', val: valDate};
}

/*
	function setValueIfNoConflict(obj, val, actnId) {
		let setby = obj.hasOwnProperty('setby') ? obj.setby : -1;
		if (setby < 0) {
			obj.val = val;
			obj.setby = actnId;
			return true;
		}
		return (obj.val === val);
	}	
*/