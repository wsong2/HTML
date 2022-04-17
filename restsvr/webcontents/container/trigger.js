function trigger(id0, vProps, constraints, logger)
{
	for (let rec of constraints) {
		try {
			doEval(rec.expr, rec.cnstt_id);
		} catch(err) {
			logger(err);
			return false;
		}
	}
	return true;
	
	//
	function doEval(vExpr, vCnsttId)
	{		
		let ss = vExpr.split('_');	// e.g. $EQ_s5_$ADD_s4_s12
		
		let stackOptr = [];
		let stackArg = [];
		let currOptr = null;

		let op = ss.shift();
		while (typeof(op) !== 'undefined') {
			if (op.startsWith('$')) {
				if (currOptr != null) stackOptr.push(currOptr);
				currOptr = makeOptr(op);
				currOptr.cnsttId = vCnsttId
			} else {
				let arg = vProps.find(p => p.prop_id === op);
				if (typeof arg === 'undefined') throw ('Undefined prop_id: ' + op);
				if (currOptr == null) {
					stackArg.push(arg);
					break;
				}
				evalInChain(arg);
			}
			op = ss.shift()
		}
		if (stackArg.length !== 1) throw 'Operants Stack length error!';
		
		function evalInChain(arg0) {
			let operant = arg0;
			if ((stackArg.length + 1) < currOptr.arity) {
				stackArg.push(operant);
				return;
			}
			while (true) {
				let arrArgs = [];
				fillArguments((currOptr.arity-1), operant, arrArgs);
				operant = currOptr.fnc(arrArgs);
				if (stackOptr.length === 0) {
					stackArg.push(operant);
					break;	
				}
				currOptr = stackOptr.pop();
				if ((stackArg.length + 1) < currOptr.arity) break;
			}
		}		
	
		function fillArguments(nLen, op, arrArgs) {
			if (stackOp.length < nLen) {
				throw 'StackOp size error: length = ' + tackOp.length + ', expected = ' + nLen;
			}
			arrArgs.length = nLen + 1;
			arrArgs[nLen] = op;
			for (let i=nLen-1; i>=0; i--) {
				let prevOp = stackOp.pop();
				arrArgs[i] = prevOp;
			}
		}
	}
}

function makeOptr(optr)
{
	if (optr.startsWith('$IF')) {
		return {
			arity: (optr === '$IF3') ? 3 : 2,
			dummyIndex: 0
		}		
	}
	
	if (optr === '$EQ')  return {arity: 2, fnc: a => (a[0] === a[1])};
	
	if (optr === '$ADD') return {arity: 2, fnc: doAdd};
	
	throw 'Unimplemented operattor ' + optr;
}

function doAdd(args)
{
	let type0 = Reflect.has(args[0], 'valType') ? args[0].valType : '?';
	let type1 = Reflect.has(args[1], 'valType') ? args[1].valType : '?';
	
	if (type0 === 'D')	return datePlusDays(args[0].val, args[1].val)
	if (type1 === 'D') 	return datePlusDays(args[1].val, args[0].val)
	
	let v0 = parseInt(args[0].val);
	let v1 = parseInt(args[1].val);
	if (!isNaN(v0) && !isNaN(v1)) {
		return (v0 + v1);
	}
	throw 'Invalid arguments ' + args; 
}

function datePlusDays(vDateStr, nDays)
{
	let valDate = Date.parse(vDateStr);
	let valN = parseInt(nDays);
	if (!isNaN(valDate) && !isNaN(valN)) {
		valDate.setDate(valDate.getDate() + valN);
		return valDate;
	}
	throw 'datePlusDays - Invalid arguments ' + args; 
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