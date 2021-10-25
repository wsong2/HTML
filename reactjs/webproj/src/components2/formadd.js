import React from "react";
import ReactDOM from "react-dom";

import TrInputs from './trInputs.js';

var expectingResponse = false;

const BtnStyle = {
	backgroundColor: 'Transparent', backgroundRepeat: 'no-repeat',
	border: 'none', cursor: 'pointer', overflow: 'hidden', outline: 'none'
}

class FormAdd extends React.Component
{	
	constructor(props) {
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

	toggleID_impl(event) {
		//console.log(this.state.simId + ' ~ ' + this.state.recForm.simId);
		let toggledSimId = (this.state.simId === '') ? this.state.recForm.simId : '';
		this.setState({
			simId: toggledSimId
		});		
	}
	notifyChange_impl(event) {
		this.state.recForm[event.target.name] = event.target.value;
		this.setState({
			recForm: this.state.recForm
		});
	}
	handleSubmit_impl(event) {
		if (expectingResponse)
			return;
		expectingResponse = true;
		
		event.preventDefault();
		
		const encodes = [];
		const rec = {};
		const formData = new FormData(event.target);
		for (let [key,value] of formData.entries()) {
			rec[key] = value;
			let encodedKey = encodeURIComponent(key);
			let encodedValue = encodeURIComponent(value);
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
			let resp = Object.assign({}, rec, data);
			this.props.notifyServerResponse(resp);
		}).catch( err => console.log(err) ); 
		
	}
	pullGridRow_impl(event) {
		this.props.pullRecForm(this.state.recForm);
		this.setState({
			simId: this.state.recForm.simId,
			recForm: this.state.recForm
		});
	}

	render() {
		const InputRows = (props) => ['simName', 'simDate', 'categ', 'descr'].map( (nm, idx) => {
				let val = props.rec[nm];
				return <TrInputs key={idx} name={nm} value={val} onChange={props.notifyChange} />
			});
		let recForm = this.state.recForm;
		return (<form onSubmit={this.handleSubmit}><table className="noborder"><tbody>
			<tr><td>Id</td><td><input type="text" name="simId" value={this.state.simId} readOnly={true} size="5" />
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