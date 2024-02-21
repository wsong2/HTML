import React from "react";

import {ISimRec} from '../view/viewdata';

var expectingResponse = false;

const BtnStyle = {
	backgroundColor: 'Transparent', backgroundRepeat: 'no-repeat',
	border: 'none', cursor: 'pointer', overflow: 'hidden', outline: 'none'
}

export interface FormAddProps {
	simId: number,
	notifyServerResponse: (data: ISimRec) => void,
	pullRecForm: ISimRec
}

interface IFormRec {
    simId: string,
    simName: string,
    simDate: string,
    categ: string,
    descr: string,
    qty: string,
    price: string,
	[key:string] : string
}
interface FormAddSate {
	simId: string,
	recForm: IFormRec
}

class FormAdd extends React.Component<FormAddProps, FormAddSate> {	
	toggleID: (evt: React.MouseEvent<HTMLButtonElement>) => void;
	OnChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	OnSelectChange: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
	doUpate: (evt: React.MouseEvent<HTMLInputElement>) => void;
	pullGridRow: (evt: React.MouseEvent<HTMLInputElement>) => void;

	constructor(props:FormAddProps) {
		super(props);
		this.state = {
			simId: '',
			recForm: {simId:'', simName:'', simDate:'', categ:'', descr:'', qty:'', price:'', dttm: ''}
		}		
		this.toggleID = this.toggleID_impl.bind(this);
		this.OnChange = this.OnChange_impl.bind(this);
		this.OnSelectChange = this.OnSelectChange_impl.bind(this);
		this.doUpate = this.doUpate_impl.bind(this);
		this.pullGridRow = this.pullGridRow_impl.bind(this);
	}

	toggleID_impl(event: React.ChangeEvent<HTMLElement>) {
		
		let toggledSimId = (this.state.simId === '') ? this.state.recForm.simId.toString() : ''; 
		this.setState({
			simId: toggledSimId
		});
	}

	OnChange_impl(event: React.ChangeEvent<HTMLElement>) {
		const { target } = event;
		if (target) {
			let elt = target as HTMLInputElement;
			this.state.recForm[elt.name] = elt.value;		
			this.setState({
				recForm: this.state.recForm
			});
		}
	}

	OnSelectChange_impl(event: React.ChangeEvent<HTMLElement>) {
		const { target } = event;
		if (target) {
			let elt = target as HTMLSelectElement;
			this.state.recForm[elt.name] = elt.value;		
			this.setState({
				recForm: this.state.recForm
			});
		}
	}

	doUpate_impl(event: React.MouseEvent<HTMLElement>) {
		if (expectingResponse)
			return;
		expectingResponse = true;
		
		const encodes: string[] = [];
		let recForm = this.state.recForm;
		const keys = Object.keys(recForm);
		keys.forEach((key) => {
			let encodedKey = encodeURIComponent(key);
			let encodedValue = encodeURIComponent(recForm[key as keyof typeof recForm]);
            encodes.push(encodedKey + "=" + encodedValue);
			});

		let url = (this.state.simId === '') ? '/api/rec/addnew' : '/api/rec/update';
		fetch(url, {
			method: "post",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: encodes.join("&")	   
		}).then( response => {
			expectingResponse = false;
			return response.json();
		}).then( data => {
			console.log('** R2: ' + JSON.stringify(data));
			this.props.notifyServerResponse(data);
		}).catch(err => console.log(err)); 
		
	}

	pullGridRow_impl(event: React.MouseEvent<HTMLElement>) {
		let rec: ISimRec = this.props.pullRecForm;
		this.setState({
			simId: rec.simId.toString(),
			recForm: {simId:rec.simId.toString(), simName:rec.simName, simDate:rec.simDate, categ:rec.categ, descr:rec.descr, 
						qty:rec.qty.toString(), price:rec.price.toString(), dttm: rec.dttm}
		});
	}

	render() {
		let recForm: IFormRec = this.state.recForm;
		return (<form><table className="noborder"><tbody>
		<tr><td>Id</td><td><input type="text" name="simId" value={this.state.simId} readOnly={true} size={5} />
			<button type="button" onClick={this.toggleID} style={BtnStyle}>&#8646;</button></td></tr>
		<tr><td>Name</td><td><input name="simName" type="text" value={recForm.simName} onChange={this.OnChange} /></td></tr>
		<tr><td>Date</td><td><input name="simDate" type="date" value={recForm.simDate} onChange={this.OnChange} /></td></tr>
		<tr><td>Category</td><td>
			<select name="categ" value={recForm.categ} onChange={this.OnSelectChange}>
				<option value="App" key="0">App</option>
				<option value="Device" key="1">Device</option>
				<option value="Product" key="2">Product</option>
				<option value="Sim" key="3">Sim</option>
				<option value="Test" key="4">Test</option>
			</select></td></tr>
		<tr><td>Description</td><td><input name="descr" type="text" value={recForm.descr} onChange={this.OnChange} /></td></tr>
		<tr><td>Price</td><td>
			<input name="qty" type="number" step="1" min="1" max="999" value={+recForm.qty} onChange={this.OnChange} /> 
			<input name="price" type="number" step="0.01" min="0.01" value={+recForm.price} onChange={this.OnChange}/></td></tr>
		<tr><td><input type="button" value="update" onClick={this.doUpate}/></td><td><input type="button" value="Pull &#8607;" onClick={this.pullGridRow} /></td></tr>
	</tbody></table></form>);
}
}

export default FormAdd;