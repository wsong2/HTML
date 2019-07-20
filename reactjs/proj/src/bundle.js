import React from 'react';
import ReactDOM from 'react-dom';
import DataGrid from './datagrid.js';

function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    alert('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}

const element = <div><DataGrid /><br/><ActionLink /></div>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
/*
ReactDOM.render(
	<DataGrid />,
	document.getElementById('root')
);
*/