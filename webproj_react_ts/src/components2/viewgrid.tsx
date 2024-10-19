import React from "react";
import "./viewgrid.css";

import {ISimRec, GridData} from '../view/viewdata';

const appGridData = new GridData();

interface TdListProps {
    notifyChange: (id: string) => void,
    row: ISimRec,
    rowIndex: number,
    checked: boolean
}

class TdList extends React.Component<TdListProps>
{
	onUpdateValue: (evt: React.ChangeEvent<HTMLInputElement>) => void;

	constructor(props: TdListProps) {
		super(props);
		this.onUpdateValue = this.onUpdateValue_impl.bind(this);
	}
		
	onUpdateValue_impl(evt: React.ChangeEvent<HTMLElement>) {
        const { target } = evt
        if (target && (target as HTMLInputElement).checked) {
            this.props.notifyChange((target as Element).id);		// use row index as input Id
        }
	};

	render() {
		const {op, ...rest} = this.props.row;
		const simRec:ISimRec = {simId:rest.simId, simName:rest.simName, simDate:rest.simDate, category:rest.category, desc:rest.desc, qty:rest.qty, price:rest.price, dttm: rest.dttm};
		const Values = () => Object.values(simRec).map( (v,i) => {
			return <td key={i}>{v}</td>;
		});

		return <tr>
			<td><input type='radio' id={this.props.rowIndex.toString()} onChange={this.onUpdateValue} checked={this.props.checked} /></td>
			<Values /></tr>;
	}
}

const tdStyle = {
	textAlign: 'center' as const
};

const BtnStyle = {
	backgroundColor: 'Transparent', backgroundRepeat: 'no-repeat',
	border: 'none', cursor: 'pointer', overflow: 'hidden', outline: 'none',
	fontWeight : 'bold'
}

interface ViewGridProps {
	rowIndex: number,
    onRowSelected: (row: number) => void,
    notifyChange?: (id: string) => void,
    btnAction: (btnValue: string) => void,
	rows: ISimRec[],
    selected?: number
}

interface ViewGridStateState {
	selectedRowIndex: number
}

interface GridRowsProps {
    rows: ISimRec[],
    selected: number,
    notifyChange: (id: string) => void
}

class ViewGrid extends React.Component<ViewGridProps, ViewGridStateState>
{	
	constructor(props: ViewGridProps) {
		super(props);
		this.state = {
			selectedRowIndex: this.props.rowIndex
		}
		this.notifyChange = this.notifyChange.bind(this);
		this.btnClick = this.btnClick.bind(this);
	}

	notifyChange(rowIndexString: string) {
		let rowIndex: number = +rowIndexString;
		this.setState({
			selectedRowIndex: rowIndex
		})
		this.props.onRowSelected(rowIndex);
	};
	 
	btnClick(evt: React.MouseEvent<HTMLElement>) {
        const { target } = evt
        if (target)   {
            this.props.btnAction((target as HTMLButtonElement).value);
        }
	};
	 
	render() {
		const HeaderRow = () => appGridData.keys().map( (k, idx) => {
			let dfn = appGridData.columnDfn(k);
			if (dfn === undefined)	return <th key={idx} />;
			return <th key={idx}>{dfn.caption}</th>;
		});
		const GridRows = (props: GridRowsProps) => props.rows.map( (r, idx) => {
			let selected = (idx==props.selected);
			return <TdList key={idx} rowIndex={idx} row={r} checked={selected} notifyChange={props.notifyChange} />
		});

		return (<div><table className="noborder">
			<thead><tr><th/><HeaderRow /></tr></thead>
			<tbody>
				<GridRows rows={this.props.rows} selected={this.props.rowIndex} notifyChange={this.notifyChange} />
				<tr><td colSpan={2}/><td colSpan={2}>
					<input type="button" value="Load" onClick={this.btnClick} />&nbsp;&nbsp;
					<input type="button" value="Delete" onClick={this.btnClick} /></td>
					<td colSpan={3}/>
					<td style={tdStyle} colSpan={2}>
						<button style={BtnStyle} value="Prev" disabled>&#10229;</button>&nbsp;
						<button style={BtnStyle} value="Next" disabled>&#10230;</button>
					</td>
				</tr>
			</tbody></table></div>);
	}
}

export default ViewGrid;