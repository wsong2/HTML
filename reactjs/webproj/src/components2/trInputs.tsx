import React from "react";

import {GridData} from '../view/viewdata';

const appFormData = new GridData();

const SelOptions = () => appFormData.categOptions().map( (opt, idx) => {
	let displayText = appFormData.categText(opt);
	return <option value={opt} key={idx} >{displayText}</option>
});

interface TdProps {
    name: string,
	defaultValue: string
}

const TdInput = (props: TdProps) => {
	let propName = props.name;
	let inputType = appFormData.typeByID(propName);
	if (inputType === 'select') {
		return <td><select name={propName} defaultValue={props.defaultValue}><SelOptions /></select></td>;
	}
	return <td><input type={inputType} name={propName} defaultValue={props.defaultValue} /></td>;		
}

interface TrInputProps {
    name: string
	defaultValue: string
}

class TrInputs extends React.Component<TrInputProps>
{	
	constructor(props: TrInputProps) {
		super(props);		
	}
	render() {		
		let propName = this.props.name;
		let caption = appFormData.columnDfn(propName).caption;
		return (<tr><td>{caption}</td><TdInput name={propName} defaultValue={this.props.defaultValue}/></tr>);
	}
}

export default TrInputs;