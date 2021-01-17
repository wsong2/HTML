import React from 'react';
import ReactDOM from 'react-dom';

import {Tabs, TabList, Tab, TabPanel} from 'react-tabs';

import TabGrid from './components/tabgrid.js';

import grid_data from './data/tab_data.js';
const appGridData = grid_data();

const spanStyle = {
	display: 'block'
};
	
const LogLines = (props) => {
	let items = props.lines;
	return (<div>{
		items.map((mi, i) => (<span key={i} style={spanStyle}>{mi}</span>))
	}</div>
 );
};

class MyTabs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loglines: []
		};
		this.notifyChange = this.notifyChange.bind(this);
		//console.log(">> " + this.props.griddata.options('select1').goldfish);
	}

	notifyChange(lines) {
		this.setState({
			loglines: lines
		})
	};
  	
	render() {
		return (
			<Tabs>
				<TabList><Tab>Grid</Tab><Tab>Changes</Tab></TabList>
				<TabPanel>
					<TabGrid griddata={appGridData} onCellChange={this.notifyChange} />
				</TabPanel>
				<TabPanel>
					<LogLines lines={this.state.loglines} />
				</TabPanel>
			</Tabs>
		);
	}
}

ReactDOM.render(<MyTabs/>, document.getElementById('root'));
