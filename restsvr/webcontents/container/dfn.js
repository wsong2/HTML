'use strict';

const dfnProp10 = {
	ZH: "类1 - 中文",
	FR: "C2 - Français",
	EN: "C3 - English"
};

function htmlChildElt(id)
{
	function selectBox(oDfn) {
		let selectList = document.createElement("select");
		for (const [key, value] of Object.entries(oDfn)) {
			let option = document.createElement("option");
			option.value = key;
			option.text = value;
			selectList.appendChild(option);
		}	
		return selectList;	
	}

	if (id === 's10') {
		let sel = selectBox(dfnProp10);
		sel.id = id;
		return sel
	}
	return null;
}
