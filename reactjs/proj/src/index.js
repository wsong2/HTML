import React from 'react';
import ReactDOM from 'react-dom';

import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import ViewGrid from './components2/viewgrid.js';
import FormAdd from './components2/formadd.js';
import FormUpdate from './components2/formupdate.js';

import { viewdata } from './data/viewdata.js';

const appGridData = viewdata();

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

const Content = (props) => (<div><h3>{props.myText}</h3></div>);

class App extends React.Component
{
   constructor(props) {
      super(props);    
      this.state = {
         rowIndex: -1
      }
	  this.notifyChange = this.notifyChange.bind(this);
   };
	
	notifyChange(rIndex) {
		this.setState({
			rowIndex: rIndex
		})
	};
   
	render() {
		let rec = {};
		let updateText = "Update";
		if (this.state.rowIndex >= 0) {
			rec = appGridData.rows()[this.state.rowIndex]; 
			updateText = "Update " + rec['id'];
		}
		return (
		<Tabs>
			<TabList><Tab>Grid</Tab><Tab>{updateText}</Tab><Tab>Add New</Tab></TabList>
			<TabPanel>
				<ViewGrid griddata={appGridData} rowIndex={this.state.rowIndex} onRowSelected={this.notifyChange} />
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
