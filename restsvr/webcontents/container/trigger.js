function trigger(vExecutor, vState, logger)
{
	vExecutor.actions.forEach(actn => {
		if (actn.hasOwnProperty('grid_id')) {
			gridAction(actn.actn_id, actn.grid_id, actn.action);
		} else {
			simpleAction(actn.actn_id, actn.action);
		}
	});
	
	//
	function gridAction(actnId, gridId, vAction) {
		let grid = vState.findGrid(gridId);
		if (grid === undefined) {
			logger('  Undef gridId: ' + gridId);
		} else {
			let gridview = createGridView(grid, logger);
			gridview.launch(actnId, vAction, vState);
		}
	}
	
	function simpleAction(actnId, vAction) {
		let prop = vState.findProp(vAction.prop_id);
		if (prop === undefined) {
			logger('  Undef propId: ' + vAction.prop_id);
		} else if (vAction.hasOwnProperty('setval') && !vState.setValueIfNoConflict(prop, vAction.setval, actnId)) {
			logger('  prop. ' + vAction.prop_id + ': value conflict ' + prop.val + ' ~ ' + vAction.setval);
		} else {
			logger('Action.' + actnId + ': OK');
		}
	}
}
