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
  }

  handleSubmit(event)
  {
    event.preventDefault();
	
	if (expectResponse) {
		return;
	}
	expectResponse = true;
	
	const formData = new FormData(event.target);	
	let formBody = [];
	for (let pair of formData.entries()) {
		let encodedKey = encodeURIComponent(pair[0]);
		let encodedValue = encodeURIComponent(pair[1]);
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
		console.log('Add> ' + JSON.stringify(data));
		notifyNew(data);
	}).catch(function(err) {
		expectResponse = false;
		console.log(err);
	});
  }

 render() {
	return (<form onSubmit={this.handleSubmit}><table className="noborder"><tbody>
		<tr><td>Name</td><td><input name="simName" type="text" required={true} /></td></tr>
		<tr><td>Category</td><td><input name="categ" type="text" required={true} /></td></tr>
		<tr><td>Description</td><td><input name="descr" type="text" required={true} /></td></tr>
		<tr><td>Date</td><td><input name="simDate" type="date" required={true} /></td></tr>
		<tr><td /><td><input type="submit" value="Submit"/></td></tr>
	</tbody></table></form>);
 }
}

export default FormAdd;