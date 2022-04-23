function addBlankRow(vGrid) {
	let blankRow = [];
	for (let n=vGrid.cols.length; n>0; n--) {
		blankRow.push({isnull:'Y'});
	}
	vGrid.rows.push(blankRow);
	return blankRow;
}

function launchGridAction(actn, vState, logger)
{		
	let actnId = actn.actn_id;
	let aaColUpd = actn.col_upd;
	
	let gridId = actn.grid_id;
	let mGrid = vState.findGrid(gridId);
	if (mGrid === undefined) {
		logger('  Undef gridId: ' + gridId);
		return;
	}
	/*
	if (!checkActnCond()) {
		logger('  Action condition failed: ' + actn.actn_id);			
		return;
	}	*/
	logger('Action.' + actnId + ', Grid.' + gridId);
	
	let ss = actn.row_sel.split(':');
	let fnc = ss[0];
	if (fnc === '$list') {
		ss[1].split(',').forEach(strRownum => actionAtRow(strRownum));	
		return;
	}
	if (fnc === '$plus') {
		let rowCols = addBlankRow(mGrid);
		let onlyArr = aaColUpd[0]; // aaColUpd should be of single element
		onlyArr.forEach((colUpd) => setActualValue(rowCols, actnId, colUpd));
		return;
	}
	logger('  Unexpected row selector - ' + fnc);		
	
	//
	function setActualValue(rowCols, actnId, actn) {
		
		let iCol = actn.col_idx;
		let cell = rowCols[iCol];
		if (cell.hasOwnProperty('isnull')) {
			delete cell.isnull;
			logger('  Col.' + actn.col_idx + ' (null) -> (new)');
			cell.isNew = true;
		}
		
		let expr = actn.setval;
		let cellValue = expr;		
		if (typeof expr === 'string' && expr.charAt(0) === '@') {
			let refPropId = parseInt(expr.substring(1));
			let prop = vState.findProp(refPropId);
			if (prop === undefined) {
				logger('  Col.' + iCol + ' -> E('+expr+')');
				return;
			}
			cellValue = prop.val;
		}
		if (vState.setValueIfNoConflict(cell, cellValue, actnId)) {
			logger('  Col.' + iCol + ' -> ' + cellValue);
		} else {
			logger('  Col.' + iCol + ': cell value conflict ' + cell.val + ' ~ ' + cellValue);
		}
	}
	
	function actionAtRow(strRownum) {
		let rowIdx = parseInt(strRownum, 10);
		if (isNaN(rowIdx)) {
			logger('  E: Invalid row index' + s);
			return;
		}
		// Should be TRUE: mGrid.rows.length === aaColUpd.length
		if (rowIdx < 0 || rowIdx >= mGrid.rows.length || rowIdx >= aaColUpd.length) {
			logger('  E: Out of range index: ' + rowIdx);
			return;
		}
		let rowCols = mGrid.rows[rowIdx];
		aaColUpd[rowIdx].forEach((colUpd) => setActualValue(rowCols, actnId, colUpd));
	}	
}
	
