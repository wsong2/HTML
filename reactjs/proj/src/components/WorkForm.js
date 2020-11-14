import React from 'react';

const SimpleMsg = (props) => {
	return (<div><h2>Hello, {props.text}!</h2></div>);
};

class SimContent extends React.Component
{
	constructor(props) {
		super(props);
      
		this.state = {
			status: 'init',
			value1: '1',
			value2: ''
		}
		this.handleChange = this.handleChangeImpl.bind(this);
		this.updateState = this.updateState.bind(this);
	};
   
   	handleChangeImpl(e) {
		if (e.target.name == "fstatus") {
			this.setState({status: e.target.value});			
		} else if (e.target.name == "value1") {
			this.setState({value1: e.target.value});			
		} else {
			this.setState({value2: e.target.value});			
		}
	}
	
	updateState() {
		let formData = new FormData(document.getElementById('myform'));
		
		fetch('http://localhost:3000/simjson', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData
		})
		.then(res => res.json())
		.then(
			(result) => {
				this.setState({
					status: result.status,
					value1: result.details + ' 1',
					value2: result.details + ' 2'
				});
			},
			(error) => {
				this.setState({
					status: 'Error',
					error
				});
			}
		)
	}
	
	render() {
		return (
			<div>
				<SimpleMsg text={this.props.msg} />
				<br/>
				<fieldset>
					<legend>SimJson:</legend>
					<form id="myform">
					Status: <input type="text" id="fstatus" name="fstatus" value={this.state.status} onChange={this.handleChange} /><br/><br/>
					Value1: <input type="text" id="value1" name="value1" value={this.state.value1} onChange={this.handleChange} /><br/><br/>
					Value2: <input type="text" id="value2" name="value2" value={this.state.value2} onChange={this.handleChange} /><br/><br/>
					</form>
					<button onClick = {this.updateState}>CLICK</button>
				</fieldset>
			</div>
		);
	}
}

export default SimContent;