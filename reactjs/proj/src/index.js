import React from 'react';
import ReactDOM from 'react-dom';
import "./app.css";

const MenuBar = function MenuBar(props) {
	let items = ['File', 'Search', 'Options'];
	
	return (
		<div><ul>
			{items.map(mi => (<li className="menuitem">{mi}</li>))}
		</ul></div>
	);
}

ReactDOM.render(
  <MenuBar />,
  document.getElementById('root')
);