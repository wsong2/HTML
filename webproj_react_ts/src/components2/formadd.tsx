import React from "react";

import TrInputs from './trInputs';
import {ISimRec} from '../view/viewdata';

var expectingResponse = false;

const BtnStyle = {
	backgroundColor: 'Transparent', backgroundRepeat: 'no-repeat',
	border: 'none', cursor: 'pointer', overflow: 'hidden', outline: 'none'
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

export interface FormAddProps {
	simId: number | null,
	notifyServerResponse: (data: ISimRec) => void,
	pullRecForm: (data: ISimRec) => void
}

interface FormAddState {
	simId: string
	recForm: IFormRec
}

interface InputRowsProps {
	//rec: string[]
	rec: IFormRec,
	notifyChange: (evt: React.ChangeEvent<HTMLInputElement>) => void
}


class FormAdd extends React.Component<FormAddProps, FormAddState> {	
	toggleID: (evt: React.MouseEvent<HTMLButtonElement>) => void;
	notifyChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	handleSubmit: (evt: React.FormEvent<HTMLElement>) => void;
	pullGridRow: (evt: React.MouseEvent<HTMLInputElement>) => void;

	constructor(props:FormAddProps) {
		super(props);
		this.state = {
			simId: '',
			recForm: {simId:'', simName:'', simDate:'', categ:'', descr:'', qty:'', price:''}
		}		
		this.toggleID = this.toggleID_impl.bind(this);
		this.notifyChange = this.notifyChange_impl.bind(this);
		this.handleSubmit = this.handleSubmit_impl.bind(this);
		this.pullGridRow = this.pullGridRow_impl.bind(this);
	}

	toggleID_impl(event: React.MouseEvent<HTMLElement>) {
		//console.log(this.state.simId + ' ~ ' + this.state.recForm.simId);
		let toggledSimId = (this.state.simId === '') ? this.state.recForm.simId : '';
		this.setState({
			simId: toggledSimId
		});		
	}
	notifyChange_impl(event: React.ChangeEvent<HTMLElement>) {
		const { target } = event;
		if (target) {
			let elt = target as HTMLInputElement;
			this.state.recForm[elt.name] = elt.value;			
		}
		this.setState({
			recForm: this.state.recForm
		});
	}
	handleSubmit_impl(event: React.FormEvent<HTMLElement>) {
		if (expectingResponse)
			return;
		expectingResponse = true;
		
		//event.preventDefault();	TODO
		
		const encodes = [];
		//const rec = {};
		const formData = new FormData(event.target as HTMLFormElement);
		for (let [key,value] of formData.entries()) {
			//rec[key] = value;
			let encodedKey = encodeURIComponent(key);
			let encodedValue = encodeURIComponent(value.toString());
			encodes.push(encodedKey + "=" + encodedValue);			
		}
		let url = (this.state.simId === '') ? '/api/rec/addnew' : '/api/rec/update';
		fetch(url, {
			method: "post",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: encodes.join("&")	   
		}).then( response => {
			expectingResponse = false;
			return response.json();
		}).then( data => {
			//console.log('** R2: ' + JSON.stringify(rec));
			//let resp = Object.assign({}, rec, data); 	TODO
			//this.props.notifyServerResponse(resp);	TODO
		}).catch( err => console.log(err) ); 
		
	}
	pullGridRow_impl(event: React.MouseEvent<HTMLElement>) {
		//this.props.pullRecForm(this.state.recForm);	TODO
		this.setState({
			simId: this.state.recForm.simId,
			recForm: this.state.recForm
		});
	}

	render() {
		const InputRows = (props: InputRowsProps) => ['simName', 'simDate', 'categ', 'descr'].map( (nm:string, idx:number) => {
				let val = props.rec[+nm];	// TODO
				//return <TrInputs key={idx} name={nm} defaultValue={val} onChange={props.notifyChange} />	TODO notifyChange
				return <TrInputs key={idx} name={nm} defaultValue={val} />
			});
		let recForm = this.state.recForm;
		return (<form onSubmit={this.handleSubmit}><table className="noborder"><tbody>
			<tr><td>Id</td><td><input type="text" name="simId" value={this.state.simId} readOnly={true} size={5} />
				<button type="button" onClick={this.toggleID} style={BtnStyle}>&#8646;</button></td></tr>
			<InputRows rec={recForm} notifyChange={this.notifyChange} />
			<tr><td>Price</td><td>
				<input name="qty" type="number" step="1" min="1" max="999" defaultValue={recForm.qty}/> 
				<input name="price" type="number" step="0.01" min="0.01" defaultValue={recForm.price}/></td></tr>
			<tr><td><input type="submit" value="Submit" /></td>
				<td><input type="button" value="Pull &#8607;" onClick={this.pullGridRow} /></td></tr>
		</tbody></table></form>);
	}
}

export default FormAdd;