import React from "react";
import ReactDOM from "react-dom";

class FormUpdate extends React.Component
{	
 constructor(props) {
	super(props);
	
	let data0 = {simName:'', simDate:'', categ: '', descr:'', dttm:''};
    this.state = {
		chkName: true,
		chkDate: true,
		chkCateg: true,
		chkDescr: true,
		chkDttm: false,
		data: Object.assign(data0, props.data)
	}
	this.handleClick = this.handleClick_impl.bind(this);
 }

  onClickName() {
    this.setState({ chkName: !this.state.chkName });
  }
  onClickDate() {
    this.setState({ chkDate: !this.state.chkDate });
  }
  onClickCateg() {
    this.setState({ chkCateg: !this.state.chkCateg });
  }
  onClickDescr() {
    this.setState({ chkDescr: !this.state.chkDescr });
  }
  onClickDttm() {
    this.setState({ chkDttm: !this.state.chkDttm });
  }

 onUpdateValue(evt) {
	let fields = this.state.data;
	fields[evt.target.id] = evt.target.value;
	this.setState({
		data: fields
	})
 };

 handleClick_impl() {
		//if (evt.target.checked) {
		//	this.props.notifyChange(evt.target.id);		
		//}
 };

 render() {
	 let rec = this.state.data;
	 return (<div><table className="noborder"><tbody>
		<tr><td><input type="checkbox" onChange={e => this.onClickName()} checked={this.state.chkName} /></td>
			<td>Name</td><td><input id="simName" type="text" value={rec.simName} onChange={e => this.onUpdateValue(e)} /></td></tr>
		<tr><td><input type="checkbox" onChange={e => this.onClickDate()} checked={this.state.chkDate} /></td>
			<td>Date</td><td><input id="simDate" type="date" value={rec.simDate} onChange={e => this.onUpdateValue(e)} /></td></tr>
		<tr><td><input type="checkbox" onChange={e => this.onClickCateg()} checked={this.state.chkCateg} /></td>
			<td>Category</td><td><input id="categ" type="text" value={rec.categ} onChange={e => this.onUpdateValue(e)} /></td></tr>
		<tr><td><input type="checkbox" onChange={e => this.onClickDescr()} checked={this.state.chkDescr} /></td>
			<td>Description</td><td><input id="descr" type="text" value={rec.descr} onChange={e => this.onUpdateValue(e)} /></td></tr>
		<tr><td><input type="checkbox" onChange={e => this.onClickDttm() } checked={this.state.chkDttm} /></td>
			<td>Date Time</td><td><input id="dttm" type="datetime-local" value={rec.dttm} onChange={e => this.onUpdateValue(e)} /></td></tr>
		<tr><td/><td><button onClick={this.handleClick}>Update</button></td></tr>
	 </tbody></table></div>);
 }
}

export default FormUpdate;