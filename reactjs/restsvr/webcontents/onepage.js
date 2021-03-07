function postForm(btn, srcForm)
{
	btn.disabled = true;
	//let srcForm = document.getElementById("form1");
	
	const formData = new URLSearchParams();	// new FormData();
	if (document.getElementById("id1").checked) {
		formData.append(srcForm.simName.name, srcForm.simName.value);
	}
	if (document.getElementById("id2").checked) {
		formData.append(srcForm.categ.name, srcForm.categ.value);
	}
	if (document.getElementById("id3").checked) {
		formData.append(srcForm.descr.name, srcForm.descr.value);
	}
	if (document.getElementById("id4").checked) {
		formData.append(srcForm.simDate.name, srcForm.simDate.value);
	}
	//alert(formData.get('categ'));
	/*
	let formBody = [];	
	const addKV = (k,v) => {
		let encodedKey = encodeURIComponent(k);
		let encodedValue = encodeURIComponent(v);
		formBody.push(encodedKey + "=" + encodedValue);
	};	*/
	fetch("/page/addnew", {
		method: 'post',
		body: formData,
	}).then(
		(response) => response.json()
	).then(
		(data) => {
			console.log(data);
			document.getElementById("id0").textContent = "" + data.id;
			btn.disabled = false;
		}
	).catch(
		(err) => {
			console.log(err);
			btn.disabled = false;
		}
	);
}

function loadGridData(btn)
{
	btn.disabled = true;
	fetch("/gridview").then(
		(response) => response.json()
	).then(
		(data) => {
			console.log(data);
			document.getElementById("id0").textContent = "" + data.id;
			btn.disabled = false;
		}
	).catch(
		(err) => {
			console.log(err);
			btn.disabled = false;
		}
	);
}

function insertCheckBoxLable(row, idVal, lableName)
{
	let cell0 = row.insertCell(0);
	let chkbox = document.createElement('input');
	chkbox.type = 'checkbox';
	chkbox.id = idVal;
	cell0.appendChild(chkbox);

	let cell1 = row.insertCell(1);
	let lbl = document.createElement('label');
	lbl.id = idVal;
	let lableText = document.createTextNode(lableName);
	lbl.appendChild(lableText);
	cell1.appendChild(lbl);
}

function insertFormTBodyRow(tbody, rowIdx, lableName, inputName, inputType)
{
	let newRow = tbody.insertRow(rowIdx);
	
	insertCheckBoxLable(newRow, 'id' + rowIdx, lableName)
	
	let cell2 = newRow.insertCell(2);
	let inp = document.createElement('input');
	inp.type = inputType;
	inp.name = inputName;
	if (inputType === 'text' || inputType === 'date') {
		inp.required = true;
	}
	cell2.appendChild(inp);
}

function insertFormTBodyPriceRow(tbody, rowIdx, lableName, inputName1, inputName2)
{
	let newRow = tbody.insertRow(rowIdx);
	
	insertCheckBoxLable(newRow, 'id' + rowIdx, lableName)
	
	let cell2 = newRow.insertCell(2);
	let inp1 = document.createElement('input');
	inp1.type = 'number';
	inp1.name = inputName1;
	cell2.appendChild(inp1);
	
	let txtBlanl = document.createTextNode(' ');
	cell2.appendChild(txtBlanl);
	
	let inp2 = document.createElement('input');
	inp1.type = 'number';
	inp1.name = inputName2;
	cell2.appendChild(inp2);
}

function addCell(row, idx, txt)
{
	let newCell = row.insertCell(idx);
	let newText = document.createTextNode(txt);
	newCell.appendChild(newText);
}

function addTBodyRows(tb, idRadioGroup)
{
	for (let i=0; i<gridRows.length; i++) {
		let rdata = gridRows[i];
		let newRow = tb.insertRow(i);
	
		let cell0 = newRow.insertCell(0);
		let radiobox = document.createElement('input');
		radiobox.type = 'radio';
		radiobox.name = idRadioGroup;
		radiobox.value = '' + (i+1);
		cell0.appendChild(radiobox);
	
		addCell(newRow, 1, '' + rdata.simId);
		addCell(newRow, 2, rdata.simName);
		addCell(newRow, 3, rdata.simDate);
		addCell(newRow, 4, rdata.categ);
		addCell(newRow, 5, '' + rdata.qty);
		addCell(newRow, 6, '' + rdata.price);
		addCell(newRow, 7, rdata.descr);
		addCell(newRow, 8, rdata.dttm);		
	}
}

function populateTBody(idTBody, idRadioGroup)
{
	var old_tbody = document.getElementById(idTBody);
	var new_tbody = document.createElement('tbody');
	addTBodyRows(new_tbody, idRadioGroup);
	old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
	new_tbody.id = idTBody;
}

function showValue(groupName)
{
	let val = 'none';
	let radios = document.getElementsByName( groupName );
    for (let i = 0; i < radios.length; i++ ) {
        if( radios[i].checked ) {
			val = radios[i].value;
            break;
        }
    }
	alert(val);
}
