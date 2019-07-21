import React from 'react';

import { grid_columns, grid_rows } from './data/bundle_data.js';
import CellInput from './components/cell_input.js';
import { process_group }  from './components/algorithm.js';
import "./app.css";

const columnDefs = grid_columns();
const rowsG0 = grid_rows();
	
const HeaderRow = function(props)
{
	return (<tr>{columnDefs.map( hd => (<th>{hd.name}</th>) )}</tr>);
}

function ActionLink(props)
{
	function handleClick(e) {
		e.preventDefault();
		props.doRefresh();
	}
	return (<a href="#" onClick={handleClick}>{props.text}</a>);
}

class DataGrid extends React.Component
{
	constructor(props)
	{
		super(props);
		
		let rows = process_group(rowsG0);
		this.state = {
			rows
		};
		this.notifyChange = this.notifyChange.bind(this);
		this.doRefresh = this.doRefresh.bind(this);
	}

	notifyChange(rowIndex, cn, value) {
		this.state.rows[rowIndex][cn] = value;
	};
  
	doRefresh() {
		let rows = process_group(this.state.rows);
		this.setState({
			rows
		});
	};
  
	render()
	{
		var TdList = function(props)
		{
			var rec = props.rowData;
			return Object.keys(rec).map( function(k) {
				if (k==="price" || k==="date") {
					var inpType = (k==="price") ? "text" : "date";
					return (<td><CellInput 
									type={inpType}
									rowIndex={props.rowIndex}
									cn={k}
									value={rec[k]}
									notifyChange={props.onChange}
							/></td>)
				}
				return (<td>{rec[k]}</td>)
			});
		}

		var GridRows = function (props)
		{
			return props.rows.map( function(row, index) {
				return (<tr><TdList rowData={row} rowIndex={index} onChange={props.onChange} /></tr>)
			});
		}

		return (<div>
			<table className="noborder">
				<HeaderRow />
				<GridRows rows={this.state.rows} onChange={this.notifyChange} />
			</table>
			<br/><ActionLink text="Refresh" doRefresh={this.doRefresh} /></div>
		);
	}
}

export default DataGrid;