function createConstainer(vState)
{
	var mGrids = vState.grids;
	function findProp(propId) {
		return vState.props.find(g => g.prop_id === propId);
	}
	function findGrid(gridId) {
		return mGrids.find(g => g.grid_id === gridId);
	}
	function getCell(iRow, iCol) {
		return mGrids.rows[iRow][iCol];
	}
	function setValueIfNoConflict(obj, val, actnId) {
		let setby = obj.hasOwnProperty('setby') ? obj.setby : -1;
		if (setby < 0) {
			obj.val = val;
			obj.setby = actnId;
			return true;
		}
		return (obj.val === val);
	}
	return {
		findProp: findProp,
		findGrid: findGrid,
		getCell: getCell,
		setValueIfNoConflict: setValueIfNoConflict
	};
};

