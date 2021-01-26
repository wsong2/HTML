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
			<td>{row['categ']}</td>
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
			selectedRow: this.props.rowIndex
		}
		this.notifyChange = this.notifyChange.bind(this);
		this.btnClick = this.btnClick.bind(this);
	}

	notifyChange(rowIndex) {
		this.setState({
			selectedRow: rowIndex
		})
		this.props.onRowSelected(rowIndex);
	};
 
	btnClick(evt) {
		this.props.btnAction(evt.target.value);
		//console.log('Button ' + evt.target.value);
	};
 
	render() {
		let GridRows = function (props) {
			return props.rows.map( function(r, idx) {
				let selected = (idx==props.selected);
				return <TdList key={idx} rowIndex={idx} row={r} checked={selected} notifyChange={props.notifyChange} />
			});
		}

		let caption = this.props.caption;
		let rows = this.props.rows;
		let rIndex = this.props.rowIndex;
		return (<div>
			<table className="noborder">
				<thead><tr>
					<th/>
					<th>{caption('id')}</th>
					<th>{caption('simName')}</th>
					<th>{caption('simDate')}</th>
					<th>{caption('categ')}</th>
					<th>{caption('descr')}</th>
					<th>{caption('dttm')}</th>
				</tr></thead>
				<tbody>
					<GridRows rows={rows} selected={rIndex} notifyChange={this.notifyChange} />
					<tr><td/><td/><td colSpan="4">
						<input type="button" value="Load" onClick={this.btnClick} />&nbsp;&nbsp;
						<input type="button" value="Delete" onClick={this.btnClick} />
					</td></tr>
				</tbody>
			</table>
		</div>);
	}
}

export default ViewGrid;