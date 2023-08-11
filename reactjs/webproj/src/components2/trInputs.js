import React from "react";
import ReactDOM from "react-dom";

import viewdata from '../view/viewdata.js';

const appFormData = viewdata();

const SelOptions = () => appFormData.categOptions().map( (opt, idx) => {
	let displayText = appFormData.categText(opt);
	return <option value={opt} key={idx} >{displayText}</option>
});

const TdInput = (props) => {
	let propName = props.name;
	let inputType = appFormData.typeByID(propName);
	if (inputType === 'select') {
		return <td><select name={propName} defaultValue={props.defaultValue}><SelOptions /></select></td>;
	}
	return <td><input type={inputType} name={propName} defaultValue={props.defaultValue} /></td>;		
}

class TrInputs extends React.Component
{	
	constructor(props) {
		super(props);		
	}
	render() {		
		let propName = this.props.name;
		let caption = appFormData.columnDfn(propName).caption;
		return (<tr><td>{caption}</td><TdInput name={propName} defaultValue={this.props.value}/></tr>);
	}
}

export default TrInputs;