import React from "react";
import ReactDOM from "react-dom";
import "./viewgrid.css";

class TdList extends React.Component
{	
	constructor(props) {
		super(props);
		this.onUpdateValue = this.onUpdateValue_impl.bind(this);
	}
	
	onUpdateValue_impl(evt) {
		if (evt.target.checked) {
			this.props.notifyChange(evt.target.id);		// row index as Id
		}
	};

	render() {
		let row = this.props.row;
		return <tr>
			<td><input type='radio' id={this.props.rowIndex} onChange={this.onUpdateValue} checked={this.props.checked} /></td>
			<td>{row['id']}</td>
			<td>{row['simName']}</td>
			<td>{row['simDate']}</td>
			<td>{row['descr']}</td>
			<td>{row['dttm']}</td>
		</tr>;
	}
}

class ViewGrid extends React.Component
{	
  	constructor(props) {
		super(props);
		this.state = {
			selectedRow: props.rowIndex
		}
		this.notifyChange = this.notifyChange.bind(this);
	}

	notifyChange(rowIndex) {
		this.setState({
			selectedRow: rowIndex
		})
		this.props.onRowSelected(rowIndex);
	};
  	
	render() {
		var GridRows = function (props) {
			return props.rows.map( function(r, idx) {
				let selected = (idx==props.selected);
				return <TdList key={idx} rowIndex={idx} row={r} checked={selected} notifyChange={props.notifyChange} />
			});
		}

		let griddata = this.props.griddata;
		let rows = griddata.rows();
		return (<div>
			<table className="noborder">
				<thead><tr>
					<th/>
					<th>{griddata.caption('id')}</th>
					<th>{griddata.caption('simName')}</th>
					<th>{griddata.caption('simDate')}</th>
					<th>{griddata.caption('descr')}</th>
					<th>{griddata.caption('dttm')}</th>
				</tr></thead>
				<tbody>
					<GridRows rows={rows} selected={this.state.selectedRow} notifyChange={this.notifyChange} />
				</tbody>
			</table>
		</div>);
	}
}

export default ViewGrid;