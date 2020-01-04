import React from "react";
import ReactDOM from "react-dom";
import TdList from './tdlist.js';
import "./tabgrid.css";

const hlper = require('./helper.js');
/*
const HeaderRow = (props) => {
	return (<tr key="1" >{props.columns.forEach( (hd, idx) => (<th>{hd.name}</th>) )}</tr>);
}
*/
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
		this.state = {
			loglines: hlper.log_record()
		};
		this.notifyChange = this.notifyChange.bind(this);
		this.sendLogs = this.sendLogs.bind(this);
	}

	notifyChange(rowId, cn, value) {
		let msg = 'Id(' + rowId + ').' + cn + ': ' + value;
		this.state.loglines.addMessage(rowId, msg);		
	};
  	
	sendLogs() {
		if (this.state.loglines.hasRecord()) {
			this.props.onCellChange(this.state.loglines.getList());
		}
	};
  
	render() {
		var GridRows = function (props) {
			return props.rows.map( function(r, idx) {
				return <TdList key={idx} row={r} notifyChange={props.notifyChange} />
			});
		}

		let griddata = this.props.griddata;
		let rows = griddata.rows();
		return (<div>
			<table className="noborder">
				<thead><tr>
					<th>{griddata.caption('id')}</th>
					<th>{griddata.caption('name')}</th>
					<th>{griddata.caption('start-date')}</th>
					<th>{griddata.caption('profession')}</th>
				</tr></thead>
				<tbody>
					<GridRows rows={rows} notifyChange={this.notifyChange} />
				</tbody>
			</table>
			<br/><ActionLink text="Change Logs" sendLogs={this.sendLogs} />
		</div>);
	}
}

export default TabGrid;