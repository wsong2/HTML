function stateHelper(gridID, objState, logger)
{
	function setActualValue(actnId, actn, cell) {
		let expr = actn.setval;
		let iCol = actn.col_idx;
		let cellValue = expr;
		
		if (typeof expr === 'string' && expr.charAt(0) === '@') {
			let refPropId = parseInt(expr.substring(1));
			let prop = objState.findProp(refPropId);
			if (prop === undefined) {
				logger('  Col.' + iCol + ' -> E('+expr+')');
				return;
			}
			cellValue = prop.val;
		}
		if (objState.setValueIfNoConflict(cell, cellValue, actnId)) {
			logger('  Col.' + iCol + ' -> ' + cellValue);
		} else {
			logger('  Col.' + iCol + ': cell value conflict ' + cell.val + ' ~ ' + cellValue);
		}
	}
	
	function checkCell(rowIdx, colIdx) {
		let grid = objState.findGrid(gridID);
		let cell = grid.rows[rowIdx][colIdx];	// ATTN: out of range unchecked
		if (cell.hasOwnProperty('isnull')) {
			delete cell.isnull;
			logger('  Col.' + colIdx + ' (null) -> (new)');
			cell.isNew = true;
		}
		return cell;
	}
	
	return {
		checkCell: checkCell,
		setActualValue: setActualValue
	}
}

function createGridView(vGridView, logger)
{
	function rowPredicate(vPredicate, vRecRow) {
		logger(' <Row.' + vPredicate + '>');		
		vRecRow.rowIdx = parseInt(vPredicate);
	}
	
	function launch(actnId, arrAction, objState) {
		logger('Action.' + actnId + ', Grid.' + vGridView.grid_id);
		let helper = stateHelper(vGridView.grid_id, objState, logger);
		arrAction.forEach(arrActn => {
			let recRow = {};
			rowPredicate(arrActn[0].row, recRow);
			if (isNaN(recRow.rowIdx))
				return;
			for (let i=1; i<arrActn.length; i++) {
				let actn = arrActn[i];
				let cell = helper.checkCell(recRow.rowIdx, actn.col_idx);
				helper.setActualValue(actnId, actn, cell); 
			}				
		});
	}
	
	return {
		launch: launch
	};
}
