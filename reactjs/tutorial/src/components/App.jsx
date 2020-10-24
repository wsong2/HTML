import React from 'react';

import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';

const SimpleMsg = (props) => {
	return (<div><h2>Hello, {props.text}!</h2></div>);
};

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
			<TabList><Tab>Welcome</Tab><Tab>Changes</Tab></TabList>
			<TabPanel>
				<SimpleMsg text="World" />
			</TabPanel>
			<TabPanel>
				<div>
					<Content myDataProp = {this.state.data} updateStateProp = {this.updateState}></Content>
				</div>
			</TabPanel>
		</Tabs>
	);
   }
}

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

export default App;