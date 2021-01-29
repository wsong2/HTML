import React from "react";
import ReactDOM from "react-dom";

var expectResponse = false;
var doNotifyNew;

function notifyNew(data) {
	doNotifyNew(data);
}
  
class FormAdd extends React.Component
{	
  constructor(props) {
	super(props);
	doNotifyNew = this.props.notifyNew;	
 	this.handleSubmit = this.handleSubmit.bind(this);
 	this.onUpdateValue = this.onUpdateValue.bind(this);
  }

  onUpdateValue(evt) {
	this.props.notifyField(evt.target.name, evt.target.value);
  };

  handleSubmit(event)
  {
    event.preventDefault();
	
	if (expectResponse) {
		return;
	}
	expectResponse = true;
	
	const formData = new FormData(event.target);	
	let formBody = [];
	let rec = {};
	for (let [key,val] of formData.entries()) {
		rec[key] = val;
		let encodedKey = encodeURIComponent(key);
		let encodedValue = encodeURIComponent(val);
		formBody.push(encodedKey + "=" + encodedValue);
	}
	formBody = formBody.join("&");

	fetch('/api/rec/addnew', {
		method: "post",
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: formBody	   
	}).then(function(response) { 
		return response.json();
	}).then(function(data) {
		expectResponse = false;
		if (Reflect.has(data,'simId')) {
			notifyNew(Object.assign(data, rec));
		} else {
			console.log(data);
		}
	}).catch(function(err) {
		expectResponse = false;
		console.log(err);
	});
  }

render() {
	let rec = this.props.rec;
	return (<form onSubmit={this.handleSubmit}><table className="noborder"><tbody>
		<tr><td>Name</td><td><input name="simName" type="text" value={rec.simName} onChange={this.onUpdateValue} /></td></tr>
		<tr><td>Category</td><td><input name="categ" type="text" value={rec.categ} onChange={this.onUpdateValue} /></td></tr>
		<tr><td>Description</td><td><input name="descr" type="text" value={rec.descr} onChange={this.onUpdateValue} /></td></tr>
		<tr><td>Date</td><td><input name="simDate" type="date" value={rec.simDate} onChange={this.onUpdateValue} /></td></tr>
		<tr><td /><td><input type="submit" value="Submit"/></td></tr>
	</tbody></table></form>);
}
 
}

export default FormAdd;