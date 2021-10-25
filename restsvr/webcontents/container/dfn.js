'use strict';

const dfnAtt10 = {
	ZH: "中文",
	FR: "Français",
	EN: "English"
};

function selectBoxAtt10() {
	let selectList = document.createElement("select");
	for (const [key, value] of Object.entries(dfnAtt10)) {
		let option = document.createElement("option");
		option.value = key;
		option.text = value;
		selectList.appendChild(option);
	}	
	return selectList;	
}

function htmlChildElt(id)
{
	if (id === '10')	return selectBoxAtt10();
	return null;
}

function columnCellContent(rg_id, col_id, row_idx, val)
{
	let inp = document.createElement('input');
	inp.id = rg_id + '.C2.' + row_idx;
	inp.value = val;
	if (rg_id === 2 && col_id === "C.2") {
		inp.type = 'date';
	} else {
		inp.type = 'text';
	}
	return inp;
}
