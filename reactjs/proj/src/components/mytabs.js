import React from 'react';
import ReactDOM from 'react-dom';

import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import TabGrid from './tabgrid.js';

const spanStyle = {
	display: 'block'
};
	
const MenuBar = function MenuBar(props)
{
	let items = ['File', 'Search', 'Options'];
	return (<div>{
		items.map((mi, i) => (<span key={i} style={spanStyle}>{mi}</span>))
	}</div>
 );
};

class MyTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		griddata: props.griddata
    };
  }

  render() {
    return (
	<Tabs>
		<TabList><Tab>Grid</Tab><Tab>Changes</Tab></TabList>
		<TabPanel><TabGrid griddata={this.state.griddata} /></TabPanel>
		<TabPanel><MenuBar /></TabPanel>
	</Tabs>
	);
  }
}

export default MyTabs;