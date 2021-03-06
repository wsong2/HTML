import React from 'react';
import ReactDOM from 'react-dom';

import {Tabs, TabList, Tab, TabPanel} from 'react-tabs';

import ViewGrid from './components2/viewgrid.js';
import FormAdd from './components2/formadd.js';
import FormUpdate from './components2/formupdate.js';
import viewdata from './data/viewdata.js';

const appGridData = viewdata();

const sortRows = (rows, cn) => rows.sort((a,b) => appGridData.fieldCmp(a, b, cn));

var warningOnClosing = false;

class App extends React.Component
{
constructor(props) {
	super(props);    
    this.state = {
		rowIndex: -1,
		rows: appGridData.rows(),
		order: 'origin',
		recA: {simName:'', simDate:'', categ: '', descr:'', dttm:''},			// for FormAdd
		flags: {simName:true, simDate:true, categ:true, descr:true, dttm:false}	// for FormUpdate
	}
	this.expectResponse = false;
	
	this.notifyChange = this.notifyChange.bind(this);
	this.notifyNew = this.notifyNew.bind(this);
	this.notifyFlag = this.notifyFlag.bind(this);
	this.notifyUpd = this.notifyUpd.bind(this);
	this.notifyField = this.notifyField.bind(this);
	this.notifySortOrder = this.notifySortOrder.bind(this);	
	this.btnAction = this.btnAction.bind(this);
	this.handleUnload = this.handleUnload.bind(this);
};

componentDidMount() { window.addEventListener('beforeunload', this.handleUnload); }

componentWillUnmount() { window.removeEventListener('beforeunload', this.handleUnload); }

handleUnload(e) {
	if (warningOnClosing) {
		let message = "\o/";
		(e || window.event).returnValue = message;
		return message;
	} else {
		e.preventDefault();
	}
}
	
notifyChange(rIndex) { this.setState({ rowIndex: rIndex }) };

notifyNew(row) {
	warningOnClosing = true;
	this.state.rows.push(row);
	this.setState({
		rowIndex: -1,
		rows: this.state.rows,
		order: 'origin'
	})
};

notifyFlag(key) {
	this.state.flags[key] = !this.state.flags[key];
	this.setState({flags: this.state.flags});
};

notifyUpd(rec) {
	warningOnClosing = true;
	let currRows = this.state.rows;
	const ix = currRows.findIndex((el) => el.simId === rec.simId);
	if (ix >= 0) {
		currRows[ix] = Object.assign(currRows[ix], rec);
		this.setState({ rows: currRows });
	}
};

notifyField(key, val) {
	this.state.recA[key] = val;
	this.setState({
		recA: this.state.recA
	})
};

notifySortOrder(sortorder) {
	if (this.state.order == sortorder) {
		return;
	}
	if (this.state.rows.length < 3 || sortorder == 'origin') {
		this.setState({ order: 'origin' });		
		return;
	}
	sortRows(this.state.rows, sortorder);
	this.setState({
		rowIndex: -1,
		rows: this.state.rows,
		order: sortorder
	});
};

btnAction(btnValue)
{	 
	if (this.expectResponse)
		return;
	this.expectResponse = true;
	
	if (btnValue == 'Load') {
		fetch("/api/rec/list").then(
			(response) => response.json()
		).then(
			(data) => {
				this.expectResponse = false;
				this.setState({
					rowIndex: -1,
					rows: data,
					order: 'origin'
				});
			}
		).catch(
			(err) => {
				this.expectResponse = false;
				console.log(err);
			}
		);
		return;
	}
	
	if (btnValue == 'Save') {
		fetch("/api/task/dbexec").then(
			(response) => response.json()
		).then(
			(data) => {
				this.expectResponse = false;
				warningOnClosing = false;
			}
		).catch(
			(err) => {
				this.expectResponse = false;
				console.log(err);
			}
		);
		return;
	}
	
	if (btnValue == 'Delete' && this.state.rowIndex >= 0) {
		let rec = this.state.rows[this.state.rowIndex];
		let urlDel = "/api/rec/" + rec.simId;
	
		fetch(urlDel, {method: 'DELETE'}).then(
			(response) => response.json()
		).then(
			(data) => {
				warningOnClosing = true;
				this.expectResponse = false;
				let rowsM1 = this.state.rows.filter(obj => obj.simId != data.rowId);
				this.setState({
					rowIndex: -1,
					rows: rowsM1,
					order: 'origin'
				});
			}
		).catch(
			(err) => {
				this.expectResponse = false;
				console.log(err);
			}
		);		
	}
};
  
render() {
	let recU = {};
	let updateText = "Update";
	let rIndex = -1;
	if (this.state.rowIndex >= 0) {
		recU = this.state.rows[this.state.rowIndex]; 
		updateText = "Update " + recU.simId;
		rIndex = this.state.rowIndex;
	}
	return (<Tabs>
		<TabList><Tab>Grid</Tab><Tab>{updateText}</Tab><Tab>Add New</Tab></TabList>
		<TabPanel>
			<ViewGrid caption={appGridData.caption} sortOrder={this.state.order} rows={this.state.rows} rowIndex={rIndex}
				onRowSelected={this.notifyChange} btnAction={this.btnAction} notifySortOrder={this.notifySortOrder}  />
		</TabPanel>
		<TabPanel><FormUpdate rec={recU} flags={this.state.flags} notifyFlag={this.notifyFlag} notifyUpd={this.notifyUpd} /></TabPanel>
		<TabPanel><FormAdd rec={this.state.recA} notifyNew={this.notifyNew} notifyField={this.notifyField} /></TabPanel>
	</Tabs>);
}
//
}

ReactDOM.render(<App/>, document.getElementById('root'));
