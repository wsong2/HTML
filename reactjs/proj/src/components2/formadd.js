import React from "react";
import ReactDOM from "react-dom";

class FormAdd extends React.Component
{	
  	constructor(props) {
		super(props);
	}

	render() {
		return (<div>
			<table className="noborder">
				<tr><td>Name</td><td><input name="simName" type="text" required /></td></tr>
				<tr><td>Category</td><td><input name="simCateg" type="text" required /></td></tr>
				<tr><td>Description</td><td><input name="simDescr" type="text" required /></td></tr>
				<tr><td>Date</td><td><input name="simDate" type="date"/></td></tr>
				<tr><td /><td><button>Add</button></td></tr>
			</table>
		</div>);
	}
}

export default FormAdd;