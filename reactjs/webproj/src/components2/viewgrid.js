import React from "react";
import ReactDOM from "react-dom";
import "./viewgrid.css";

import viewdata from '../view/viewdata.js';

const appGridData = viewdata();

class TdList extends React.Component
{
	constructor(props) {
		super(props);
		this.onUpdateValue = this.onUpdateValue_impl.bind(this);
	}
		
	onUpdateValue_impl(evt) {
		if (evt.target.checked) {
			this.props.notifyChange(evt.target.id);		// use row index as input Id
		}
	};

	render() {
		const Values = () => Object.values(this.props.row).map( (v,i) => {
			return <td key={i}>{v}</td>
		});

		return <tr>
			<td><input type='radio' id={this.props.rowIndex} onChange={this.onUpdateValue} checked={this.props.checked} /></td>
			<Values /></tr>;
	}
}

const spanStyle = {
	fontStyle: 'italic'
};
const tdStyle = {
	textAlign: 'center'
};
const BtnStyle = {
	backgroundColor: 'Transparent', backgroundRepeat: 'no-repeat',
	border: 'none', cursor: 'pointer', overflow: 'hidden', outline: 'none',
	fontWeight : 'bold'
}

class ViewGrid extends React.Component
{	
	constructor(props) {
		super(props);
		this.state = {
			selectedRowIndex: this.props.rowIndex
		}
		this.notifyChange = this.notifyChange.bind(this);
		this.btnClick = this.btnClick.bind(this);
	}

	notifyChange(rowIndex) {
		this.setState({
			selectedRowIndex: rowIndex
		})
		this.props.onRowSelected(rowIndex);
	};
	 
	btnClick(evt) {
		this.props.btnAction(evt.target.value);
	};
	 
	render() {
		const HeaderRow = () => appGridData.keys().map( (k, idx) => {
			let dfn = appGridData.columnDfn(k);
			if (dfn === undefined)	return <th key={idx} />;
			//if (dfn.sorting === 'U') return <th key={idx}>{dfn.caption}  &#8593;</th>;
			//if (dfn.sorting === 'D') return <th key={idx}>{dfn.caption}  &#8595;</th>;
			return <th key={idx}>{dfn.caption}</th>;
		});
		const GridRows = (props) => props.rows.map( (r, idx) => {
			let selected = (idx==props.selected);
			return <TdList key={idx} rowIndex={idx} row={r} checked={selected} notifyChange={props.notifyChange} />
		});

		return (<div><table className="noborder">
			<thead><tr><th/><HeaderRow /></tr></thead>
			<tbody>
				<GridRows rows={this.props.rows} selected={this.props.rowIndex} notifyChange={this.notifyChange} />
				<tr><td colSpan="2"/><td colSpan="2">
					<input type="button" value="Load" onClick={this.btnClick} />&nbsp;&nbsp;
					<input type="button" value="Delete" onClick={this.btnClick} /></td>
					<td colSpan="3"/>
					<td style={tdStyle} colSpan="2">
						<button style={BtnStyle} value="Prev" onClick={this.btnClick}>&#10229;</button>&nbsp;
						<button style={BtnStyle} value="Next" onClick={this.btnClick}>&#10230;</button>
					</td>
				</tr>
			</tbody></table></div>);
	}
}

export default ViewGrid;