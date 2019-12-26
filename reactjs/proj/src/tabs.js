import React from 'react';
import ReactDOM from 'react-dom';

import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';

const App = () => (
  <Tabs>
    <TabList><Tab>Custom Tab 1</Tab><Tab>Custom Tab 2</Tab></TabList>
    <TabPanel>Panel 1</TabPanel>
    <TabPanel>Panel 2</TabPanel>
  </Tabs>
);

ReactDOM.render(
  <App />,
  document.getElementById('tabs')
);