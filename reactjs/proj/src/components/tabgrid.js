import React from "react";
import ReactDOM from "react-dom";
import TdList from './tdlist.js';
import "./tabgrid.css";

const hlper = require('./helper.js');

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
		//console.log("!> " + props.griddata.options('select1').goldfish);
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
				return <TdList key={idx} row={r} options={props.options} notifyChange={props.notifyChange} />
			});
		}

		let griddata = this.props.griddata;
		let rows = griddata.rows();
		let options = griddata.options('select1');
		return (<div>
			<table className="noborder">
				<thead><tr>
					<th>{griddata.caption('id')}</th>
					<th>{griddata.caption('name')}</th>
					<th>{griddata.caption('start-date')}</th>
					<th>{griddata.caption('profession')}</th>
					<th>{griddata.caption('select1')}</th>
				</tr></thead>
				<tbody>
					<GridRows rows={rows} options={options} notifyChange={this.notifyChange} />
				</tbody>
			</table>
			<br/><ActionLink text="Change Logs" sendLogs={this.sendLogs} />
		</div>);
	}
}

export default TabGrid;