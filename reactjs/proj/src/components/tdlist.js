import React from "react";

class TdList extends React.Component
{	
	constructor(props) {
		super(props);
		this.state = props.row;
		this.onUpdateValue = this.onUpdateValue_impl.bind(this);
	}
	
	onUpdateValue_impl(evt) {
		this.setState({
			[evt.target.id]: evt.target.value
		});
		this.props.notifyChange(this.state.id, evt.target.id, evt.target.value);
	};

	render() {
		let row = this.state;
		return <tr>
			<td>{row['id']}</td>
			<td><input type='text' id='name' value={row['name']} onChange={this.onUpdateValue} required/></td>
			<td><input type='date' id='start-date' value={row['start-date']} onChange={this.onUpdateValue} required/></td>
			<td><input type='text' id='profession' value={row['profession']} onChange={this.onUpdateValue} required/></td>
		</tr>;
	}
}

export default TdList;