import React from 'react';
import ReactDOM from 'react-dom';

import { grid_columns, grid_rows, process_group }  from './components/algorithm.js';
import "./app.css";

const columnDefs = grid_columns();
const rowsG0 = grid_rows();
	
const TdList = function(rec)
{
	return Object.keys(rec).map( function(k) {
		return (<td>{rec[k]}</td>)
	});
}

const HeaderRow = function(props)
{
	return (
		<tr>{columnDefs.map( hd => (<th>{hd.name}</th>) )}</tr>
	);
}

const GridRows = function(props)
{
	var rows = process_group(rowsG0);
	return rows.map( function(rec) {
		var data = TdList(rec);
        return (<tr>{data}</tr>)
    });
}

const DataGrid = function(props)
{
    return (<table className="noborder">
		<HeaderRow />
		<GridRows />
     </table>);
}

ReactDOM.render(
	<DataGrid />,
	document.getElementById('root')
);
