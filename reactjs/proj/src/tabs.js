import React from 'react';
import ReactDOM from 'react-dom';

import MyTabs from './components/mytabs.js';

import { grid_data } from './data/tab_data.js';

const appGridData = grid_data();

ReactDOM.render(
  <MyTabs griddata={appGridData} />,
  document.getElementById('tabs')
);
