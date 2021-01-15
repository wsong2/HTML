import React from 'react';
import ReactDOM from 'react-dom';

import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import ViewGrid from './components2/viewgrid.js';
import FormAdd from './components2/formadd.js';
import FormUpdate from './components2/formupdate.js';
import viewdata from './data/viewdata.js';

const appGridData = viewdata();

const constants = require("./constants");

const spanStyle = {
	display: 'block'
};
	
const LogLines = (props) => (<div>{props.lines.map((mi, i) => (<span key={i} style={spanStyle}>{mi}</span>))}</div>);

const Content  = (props) => (<div><h3>{props.myText}</h3></div>);

class App extends React.Component
{
 constructor(props) {
	super(props);    
    this.state = {
		rowIndex: -1,
		rows: appGridData.rows()
	}
	this.expectResponse = false;
	this.notifyChange = this.notifyChange.bind(this);
	this.doReload = this.doReload.bind(this);
 };
	
 notifyChange(rIndex) {
	this.setState({
		rowIndex: rIndex
	})
 };

 doReload() {
	if (this.expectResponse) {
		return;
	}
	this.expectResponse = true;
	
	let myUrl = constants.HOST1 + "/rec/list";
	
	fetch(myUrl).then(
		(response) => response.json()
	).then(
		(data) => {
			this.expectResponse = false;
			this.setState({
				rowIndex: -1,
				rows: data
			});
			//console.log(data);
		}
	).catch(
		(err) => {
			this.expectResponse = false;
			console.log(err);
		}
	);
 };
  
 render() {
	let rec = {};
	let updateText = "Update";
	if (this.state.rowIndex >= 0) {
		rec = this.state.rows[this.state.rowIndex]; 
		updateText = "Update " + rec['id'];
	}
	return (
		<Tabs>
			<TabList><Tab>Grid</Tab><Tab>{updateText}</Tab><Tab>Add New</Tab></TabList>
			<TabPanel>
				<ViewGrid caption={appGridData.caption} rows={this.state.rows} rowIndex={this.state.rowIndex} onRowSelected={this.notifyChange} reload={this.doReload} />
			</TabPanel>
			<TabPanel>
				<FormUpdate data={rec} />
			</TabPanel>
			<TabPanel>
				<FormAdd/>
			</TabPanel>
		</Tabs>
	);
 }
}

ReactDOM.render(<App/>, document.getElementById('root'));
