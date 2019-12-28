import React from "react";
import ReactDOM from "react-dom";
import CellInput from './cell_input.js';
import "./tabgrid.css";

const HeaderRow = (props) => {
	//console.log('*** ' + props.columns);
	return (<tr key="1" >{props.columns.forEach( (hd, idx) => (<th>{hd.name}</th>) )}</tr>);
}

const findColumnTypeByRowKey = (columns, cn) => {
	var dfn = columns.find(function(element) {
		return element['colId'] === cn;
	});	
	if (!dfn || !dfn["editable"])
		return null;
	var dateType = dfn.hasOwnProperty('fmt') ? (dfn['fmt'] === 'date') : false;
	return (dateType) ? "date" : "text";
}

class TabGrid extends React.Component
{	
  	constructor(props) {
		super(props);	
		this.state = {
			columns: props.griddata['columns'],
			rows: props.griddata['rows']
		};
		this.notifyChange = this.notifyChange.bind(this);
	}

	notifyChange(rowIndex, cn, value) {
		this.state.rows[rowIndex][cn] = value;
	};
  	
	render() {
		var TdList = function(props) {
			var rec = props.rowData;
			/* rec: { 
				"id": 1,
				"name" : "mahesh",
				"start-date" : "2015-12-01",
				"profession" : "teacher"
				}
			*/
			return Object.keys(rec).map( function(k, idx) {
				let inpType = findColumnTypeByRowKey(props.columns, k);
				if (inpType == null) {
					return (<td key={idx}>{rec[k]}</td>)
				}
				return (<td key={idx}>
					<CellInput
						type={inpType} rowIndex={props.rowIndex}
						cn={k} value={rec[k]}
						notifyChange={props.onChange} />
				</td>)
			});
		}
		
		/*
		prop.rows: [
			{
				"id": 1,
				"name" : "mahesh",
				"start-date" : "2015-12-01",
				"profession" : "teacher"
			},
			...
		]
		*/
		var GridRows = function (props) {
			return props.rows.map( function(row, index) {
				return (<tr key={row.id}><TdList columns={props.columns} rowData={row} rowIndex={index} onChange={props.onChange} /></tr>)
			});
		}

		return (<div>
			<table className="noborder">
				<thead><HeaderRow columns={this.state.columns} /></thead>
				<tbody>
					<GridRows columns={this.state.columns} rows={this.state.rows} onChange={this.notifyChange} />
				</tbody>
			</table>
		</div>);
	}
}

export default TabGrid;