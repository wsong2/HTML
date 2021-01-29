import React from 'react';
import ReactDOM from 'react-dom';

import {Tabs, TabList, Tab, TabPanel} from 'react-tabs';

import ViewGrid from './components2/viewgrid.js';
import FormAdd from './components2/formadd.js';
import FormUpdate from './components2/formupdate.js';
import viewdata from './data/viewdata.js';

const appGridData = viewdata();

var warningOnClosing = false;

function sortRows(rows, sortKey) {
	/*
	if (sortKey == 'origin') {
		return rows;
	}
	let rows2 = [...rows];
	appGridData.sortRows(rows2, sortKey);
	return rows2;
	*/
	return rows;
}


class App extends React.Component
{
 
constructor(props) {
	super(props);    
    this.state = {
		rowIndex: -1,
		rows: appGridData.rows(),
		unsortedrows: appGridData.rows(),
		rec: {simName:'', simDate:'', categ: '', descr:'', dttm:''},
		order: 'origin'
	}
	this.expectResponse = false;
	this.notifyChange = this.notifyChange.bind(this);
	this.notifyNew = this.notifyNew.bind(this);
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
		//e.preventDefault();
		let message = "\o/";
		(e || window.event).returnValue = message;
		return message;
	}
}
	
notifyChange(rIndex) { this.setState({ rowIndex: rIndex }) };

notifyNew(row) {
	warningOnClosing = true;
	this.state.unsortedrows.push(row);
	this.state.rows = this.sortedRows(this.state.unsortedrows, this.state.order);
	this.setState({
		rowIndex: -1,
		rows: this.state.rows
	})
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
	this.state.rec[key] = val;
	this.setState({
		rec: this.state.rec
	})
};

notifySortOrder(sortorder) {
	if (this.state.order == sortorder) {
		return;
	}
	if (sortorder == 'origin') {
		this.setState({
			rowIndex: -1,
			rows: this.state.unsortedrows,
			order: sortorder
		});
		return;
	}
	this.state.rows = sortRows(this.state.unsortedrows, this.state.order);
	this.setState({
		rowIndex: -1,
		rows: this.state.rows,
		order: sortorder
	});
};

btnAction(btnValue)
{	 
	if (this.expectResponse) {
		return;
	}
	this.expectResponse = true;
	
	if (btnValue == 'Load')
	{
		fetch("/api/rec/list").then(
			(response) => response.json()
		).then(
			(data) => {
				this.expectResponse = false;
				let sortedRows = sortRows(data, this.state.order);
				this.setState({
					rowIndex: -1,
					unsortedrows: data,
					rows: sortedRows
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
	if (btnValue == 'Save')
	{
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
	if (btnValue == 'Delete' && this.state.rowIndex >= 0)
	{
		let rec = this.state.rows[this.state.rowIndex];
		let urlDel = "/api/rec/" + rec['simId'];
	
		fetch(urlDel, {method: 'DELETE'}).then(
			(response) => response.json()
		).then(
			(data) => {
				warningOnClosing = true;
				let rowsM1 = this.state.rows.filter(obj => obj.simId != data.rowId);
				this.expectResponse = false;
				this.setState({
					rowIndex: -1,
					rows: rowsM1
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
	let rec = {};
	let updateText = "Update";
	let rIndex = -1;
	if (this.state.rowIndex >= 0) {
		rec = this.state.rows[this.state.rowIndex]; 
		updateText = "Update " + rec['simId'];
		rIndex = this.state.rowIndex;
	}
	return (<Tabs>
		<TabList><Tab>Grid</Tab><Tab>{updateText}</Tab><Tab>Add New</Tab></TabList>
		<TabPanel>
			<ViewGrid caption={appGridData.caption} rows={this.state.rows} rowIndex={rIndex}
				onRowSelected={this.notifyChange} btnAction={this.btnAction} notifySortOrder={this.notifySortOrder}  />
		</TabPanel>
		<TabPanel><FormUpdate rec={rec} notifyUpd={this.notifyUpd} /></TabPanel>
		<TabPanel><FormAdd rec={this.state.rec} notifyNew={this.notifyNew} notifyField={this.notifyField} /></TabPanel>
	</Tabs>);
 }
}

ReactDOM.render(<App/>, document.getElementById('root'));
