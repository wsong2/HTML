import React from 'react';
import ReactDOM from 'react-dom';

import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';

import SimContent from './components/SimContent.js';
import WorkForm from './components/WorkForm.js';

class Content extends React.Component {
   render() {
      return (
         <div>
            <button onClick = {this.props.updateStateProp}>CLICK</button>
            <h3>{this.props.myDataProp}</h3>
         </div>
      );
   }
}

class App extends React.Component {
   constructor(props) {
      super(props);
      
      this.state = {
         data: 'Initial data...'
      }
      this.updateState = this.updateState.bind(this);
   };
   updateState() {
      this.setState({data: 'Data updated from the child component...'})
   }
   render() {
	  return (
		<Tabs>
			<TabList><Tab>Welcome</Tab><Tab>Changes</Tab><Tab>Work</Tab></TabList>
			<TabPanel>
				<SimContent msg="World" />
			</TabPanel>
			<TabPanel>
				<div>
					<Content myDataProp = {this.state.data} updateStateProp = {this.updateState}></Content>
				</div>
			</TabPanel>
			<TabPanel>
				<WorkForm msg="Folk" />
			</TabPanel>
		</Tabs>
	);
   }
}

ReactDOM.render(<App/>, document.getElementById('root'));
