import React from "react";

class SelectCell extends React.Component
{	
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		//console.log("!!> " + props.options.goldfish);
	}
	
	onChange(evt) {
		this.props.onSelect(evt);
	};

	render() {
		let opts = this.props.options;
		let saValue = this.props.value;
		let sqID = this.props.id;
		let selOpts = Object.keys(opts).map( (o, idx) => <option key={idx} value={o}>{opts[o]}</option> );
		return <select id={sqID} defaultValue={saValue} onChange={this.onChange} autoComplete="on" required>
			{selOpts}
		</select>;
	}
}

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
			<td><SelectCell id='select1' value={row['select1']} options={this.props.options} onSelect={this.onUpdateValue} /></td>
		</tr>;
	}
}

export default TdList;