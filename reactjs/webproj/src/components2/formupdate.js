import React from "react";
import ReactDOM from "react-dom";

class FormUpdate extends React.Component
{	
 constructor(props) {
	super(props);
    this.state = {
		data: props.data
	}
	this.onUpdateValue = this.onUpdateValue_impl.bind(this);
	this.handleClick = this.handleClick_impl.bind(this);
 }

 onUpdateValue_impl(evt) {
		//if (evt.target.checked) {
		//	this.props.notifyChange(evt.target.id);		
		//}
 };

 handleClick_impl() {
		//if (evt.target.checked) {
		//	this.props.notifyChange(evt.target.id);		
		//}
 };

 render() {
	return (<div>
		<table className="noborder">
		<tr><td><input type="checkbox" onclick={this.onUpdateValue} checked="true" /></td>
			<td>Name</td><td><input name="simName" type="text" value={this.state.data['simName']} /></td></tr>
		<tr><td><input type="checkbox" onclick={this.onUpdateValue} checked="true" /></td>
			<td>Date</td><td><input name="simDate" type="date" value={this.state.data['simDate']} /></td></tr>
		<tr><td><input type="checkbox" onclick={this.onUpdateValue} checked="true" /></td>
			<td>Category</td><td><input name="descr" type="text" value={this.state.data['descr']} /></td></tr>
		<tr><td><input type="checkbox" onclick={this.onUpdateValue} /></td>
			<td>Date Time</td><td><input name="dttm" type="datetime-local" value={this.state.data['dttm']} /></td></tr>
		<tr><td/><td><button onClick={this.handleClick}>Update</button></td></tr>
		</table>
	</div>);
 }
}

export default FormUpdate;