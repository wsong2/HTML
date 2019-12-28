import React from 'react';
import ReactDOM from 'react-dom';

import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import MyGrid from './mygrid.js';

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
		<TabPanel><MyGrid data={this.state.griddata} /></TabPanel>
		<TabPanel>Panel 2</TabPanel>
	</Tabs>
	);
  }
}

export default MyTabs;