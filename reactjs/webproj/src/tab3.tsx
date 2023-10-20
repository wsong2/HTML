import React from 'react';
import ReactDOM from 'react-dom';
import {Tabs, TabList, Tab, TabPanel} from 'react-tabs';

import ViewGrid from './components2/viewgrid.js';
import FormAdd from './components2/formadd.js';
import PanelHelp from './components2/panelhelp.js';
import viewdata from './view/viewdata.js';

const FieldSetStyle = {
	border: '1px solid cyan',
    MozBorderRadius: '8px',
    WebkitBorderRadius: '8px',
    borderRadius: '8px',
	maxWidth: '250px'
}
 
const appGridData = viewdata();

var expectingResponse = false;

interface MainState {
	rowIndex: number,
	rows: () => ISimRec[]
}

class App extends React.Component<{}, MainState>
{
	constructor(props = {}) {
		super(props);
		this.state = {
			rowIndex: -1,
			rows: appGridData.rows()
		}		
		this.handleRowIndexChange = this.handleRowIndexChange.bind(this);
		this.handleServerResponse = this.handleServerResponse.bind(this);
		this.btnAction = this.btnAction.bind(this);
		this.setComponentData = this.setComponentData.bind(this);
	};
	
	setComponentData(rec: ISimRec) {
		if (this.state.rowIndex >= 0) {
			Object.assign(rec, this.state.rows()[this.state.rowIndex]);
		}
	}

	handleRowIndexChange(rIndex: number) {
		this.setState({ 
			rowIndex: rIndex
		});
	}

	handleServerResponse(data: ISimRec) {
		if (!data.hasOwnProperty('simId')) {
			console.log('No SimId: ' + JSON.stringify(data));
			return;
		}			
		//console.log('** fetchUpdate: ' + JSON.stringify(data));

		if (data.op === 'new')
		{
			appGridData.add(data);
			this.setState({
				rowIndex: -1,
				rows: appGridData.rows()
			});
		}
		else if (data.op === 'update')
		{
			if (this.state.rowIndex >= 0) {
				appGridData.update(this.state.rowIndex, data);
				this.setState({
					rows: appGridData.rows()
				});
			} else {
				console.log('** update for rowIndex -1');
			}
		}
		else {
			console.log('** unexpected Op:', data.op);
		}
	};

	btnAction(btnValue: string) {
		if (expectingResponse)
			return;
		expectingResponse = true;
	
		if (btnValue == 'Load')
		{
			fetch("/api/rec/list").then( response => response.json()
			).then( data => {
				expectingResponse = false;
				appGridData.reload(data.rows);
				this.setState({
					rowIndex: -1,
					rows: appGridData.rows()
				});
			}).catch( err => {
				expectingResponse = false;
				console.log(err);
			});
		}
		else if (btnValue === 'Prev' || btnValue === 'Next')
		{
			let fwd = (btnValue === 'Next');
			if (appGridData.shiftView(fwd)) {
				// TODO
			}
			expectingResponse = false;
		} 
		else if (btnValue == 'Delete' && this.state.rowIndex >= 0)
		{
			let urlDel = "/api/rec/" + this.state.rows()[this.state.rowIndex].simId;
			fetch(urlDel, {method: 'DELETE'}).then( response => {
				let json = response.json();
				expectingResponse = false;
				return json;
			}).then( data => {
				if (this.state.rowIndex >= 0 && data.simId && data.status === 'OK') {
					appGridData.remove(this.state.rowIndex);
					this.setState({
						rowIndex: -1,
						rows: appGridData.rows()
					});
				} else {
					console.log('** DEL error: ' + data)
				}
			}).catch( err => console.log(err) );
		}
		else
		{
			expectingResponse = false;
		}
	};

	render() {
		let rIndex = this.state.rowIndex;
		let simId = (rIndex >= 0) ? this.state.rows()[rIndex].simId : null;
		let fileProto = (window.location.protocol === 'file:');
	
		return (<Tabs forceRenderTabPanel>
			<TabList><Tab>Grid</Tab><Tab>Settings</Tab><Tab>Help</Tab></TabList>
			<TabPanel>
				<FormAdd simId={simId} notifyServerResponse={this.handleServerResponse} pullRecForm={this.setComponentData} />
				<hr/>
				<ViewGrid rowIndex={rIndex} rows={this.state.rows} onRowSelected={this.handleRowIndexChange} btnAction={this.btnAction} />
			</TabPanel>
			<TabPanel><fieldset style={FieldSetStyle}><legend>Data Mode:</legend>
				<input type="radio" value="Off" id="ra1" name="mode" defaultChecked={fileProto} disabled={!fileProto} /><label htmlFor="ra1">Built-in</label><br/>
				<input type="radio" value="On"  id="ra2" name="mode" defaultChecked={!fileProto} disabled={fileProto} /><label htmlFor="ra2">Online</label>
				</fieldset>
			</TabPanel>
			<TabPanel><PanelHelp heading="About This Help" /></TabPanel>
		</Tabs>);
	}
}

ReactDOM.render(<App/>, document.getElementById('root'));
