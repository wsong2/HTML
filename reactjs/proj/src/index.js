import React from 'react';
import ReactDOM from 'react-dom';
import "./app.css";

import MyGrid from './components/mygrid.js';

const MenuBar = function MenuBar(props)
{
 let items = ['File', 'Search', 'Options'];
 return (
	<div><ul>
		{items.map(mi => (<li className="menuitem">{mi}</li>))}
	</ul></div>
 );
}

ReactDOM.render
(
  <div>
	<MenuBar />
	<div><MyGrid /></div>
  </div>,
  document.getElementById('root')
);