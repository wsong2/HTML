import React from 'react';

const constants = require("./constants");

const SimpleMsg = (props) => (<div><h2>Hello, {props.text}!</h2></div>);

class SimContent extends React.Component
{
 constructor(props) {
	super(props);
      
	this.state = {
		status: 'init',
		data: '',
		doQry: true
	}
	this.handleChange = this.handleChangeImpl.bind(this);
 };
   
 handleChangeImpl(e) {
	if (e.target.name == "fstatus") {
		this.setState({status: e.target.value, doQry: true});			
	} else {
		this.setState({data: e.target.value, doQry: true});		
	}
 }
	
 componentDidMount()
 {
	if (!this.state.doQry)	return;
		
	let myUrl = constants.HOST1 + "/chargePts";
/*
		fetch(myUrl).then(res => res.json())
		.then(
			(result) => {
				this.setState({
					status: result.status,
					data: result['charging-point-id'],
					doQry: false
				});
			},
			(error) => {
				this.setState({
					status: 'Error',
				});
				console.log('[**] ' + error);
			}
		) */
	this.setState({
		status: 'loaded',
		data: 'Mounted Data',
		doQry: false
	});
 }
  
 render() {
	return (<div>
		<SimpleMsg text={this.props.msg} /><br/>
		<fieldset><legend>LocalJson:</legend>
			<form id="myform">
				Status: <input type="text" id="fstatus" name="fstatus" value={this.state.status} onChange={this.handleChange} /><br/><br/>
				Data: <input type="text" id="fdata" name="fdata" value={this.state.data} onChange={this.handleChange} /><br/><br/>
			</form>
		</fieldset>
	</div>);
 }
}

export default SimContent;