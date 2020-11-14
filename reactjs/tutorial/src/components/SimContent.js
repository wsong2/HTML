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
			data: ''
		}
		this.handleChange = this.handleChangeImpl.bind(this);
		this.updateState = this.updateState.bind(this);
	};
   
   	handleChangeImpl(e) {
		if (e.target.name == "fstatus") {
			this.setState({status: e.target.value});			
		} else {
			this.setState({data: e.target.value});			
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
					data: result.details
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
   
	componentDidMount() {
		fetch("http://localhost:3000/chargePts").then(res => res.json())
		.then(
			(result) => {
				this.setState({
					status: result.status,
					data: result['charging-point-id']
				});
			},
			(error) => {
				this.setState({
					status: 'Error',
				});
				console.log('[**] ' + error);
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
					Data: <input type="text" id="fdata" name="fdata" value={this.state.data} onChange={this.handleChange} /><br/><br/>
					</form>
					<button onClick = {this.updateState}>CLICK</button>
				</fieldset>
			</div>
		);
	}
}

export default SimContent;