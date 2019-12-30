import React from "react";
import ReactDOM from "react-dom";
import CellInput from './cell_input.js';
import "./tabgrid.css";

const hlper = require('./helper.js');

const HeaderRow = (props) => {
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

function ActionLink(props)
{
	function handleClick(e) {
		e.preventDefault();
		props.sendLogs();
	}
	return (<a href="#" onClick={handleClick}>{props.text}</a>);
}

class TabGrid extends React.Component
{	
  	constructor(props) {
		super(props);
		let rows = props.rows;
		this.state = {
			rows,
			loglines: hlper.log_record()
		};
		this.notifyChange = this.notifyChange.bind(this);
		this.sendLogs = this.sendLogs.bind(this);
	}

	notifyChange(rowIndex, cn, value) {
		this.state.rows[rowIndex][cn] = value;
		let rowId = this.state.rows[rowIndex]['id'];
		let msg = 'Id(' + rowId + ').' + cn + ': ' + value;
		this.state.loglines.addMessage(rowId, msg);		
	};
  	
	sendLogs() {
		if (this.state.loglines.hasRecord()) {
			this.props.onCellChange(this.state.loglines.getList());
		}
	};
  
	render() {
		var TdList = function(props) {
			var rec = props.rowData;
			return Object.keys(rec).map( function(k, idx) {
				let inpType = findColumnTypeByRowKey(props.columns, k);
				if (inpType == null) {
					return (<td key={idx}>{rec[k]}</td>)
				}
				return (<td key={idx}>
					<CellInput
						type={inpType}
						rowIndex={props.rowIndex}
						cn={k}
						value={rec[k]}
						notifyChange={props.onChange} />
					</td>)
			});
		}
		
		var GridRows = function (props) {
			return props.rows.map( function(row, index) {
				return (<tr key={row.id}><TdList columns={props.columns} rowData={row} rowIndex={index} onChange={props.onChange} /></tr>)
			});
		}

		return (<div>
			<table className="noborder">
				<thead><HeaderRow columns={this.props.columns} /></thead>
				<tbody>
					<GridRows columns={this.props.columns} rows={this.state.rows} onChange={this.notifyChange} />
				</tbody>
			</table>
			<br/><ActionLink text="Change Logs" sendLogs={this.sendLogs} />
		</div>);
	}
}

export default TabGrid;