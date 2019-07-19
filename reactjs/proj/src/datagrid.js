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
	}

	notifyChange(rowIndex, cn, value) {
		//var rows = this.state.rows.slice(0);
		//rows[rowIndex][cn] = value;
		this.state.rows[rowIndex][cn] = value;
	};
  
	render()
	{
		var TdList = function(props)
		{
			var rec = props.rowData;
			var idx = props.rowIndex;
			return Object.keys(rec).map( function(k) {
				if (k==="price") {
					return (<td><CellInput 
									rowIndex={idx}
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

		return (<table className="noborder">
			<HeaderRow />
			<GridRows rows={this.state.rows} onChange={this.notifyChange} />
		</table>);
	}
}

export default DataGrid;