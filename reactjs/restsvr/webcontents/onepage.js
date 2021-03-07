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

function addCell(row, idx, txt)
{
	let newCell = row.insertCell(idx);
	let newText = document.createTextNode(txt);
	newCell.appendChild(newText);
}

function addTBodyRows(tb)
{
	let newRow = tb.insertRow(-1);
	
	let cell0 = newRow.insertCell(0);
	let radiobox = document.createElement('input');
	radiobox.type = 'radio';
	radiobox.name = 'rsel';
	radiobox.value = '3';
	cell0.appendChild(radiobox);
	
	addCell(newRow, 1, '103');
	addCell(newRow, 2, 'N3');
	addCell(newRow, 3, '2021-03-06');
	addCell(newRow, 4, 'Categ3');
	addCell(newRow, 5, '1');
	addCell(newRow, 6, '99.05');
	addCell(newRow, 7, 'descr3');
	addCell(newRow, 8, '2021-03-06 10:15:00');
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

function populateTBody(idTBody)
{
	var old_tbody = document.getElementById(idTBody);
	var new_tbody = document.createElement('tbody');
	addTBodyRows(new_tbody);
	old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
	new_tbody.id = idTBody;
}

function getGridData(btn)
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
