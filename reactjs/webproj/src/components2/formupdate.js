import React from "react";
import ReactDOM from "react-dom";

class FormUpdate extends React.Component
{	
 constructor(props) {
	super(props);
	
	let data0 = {simName:'', simDate:'', categ: '', descr:'', dttm:''};
    this.state = {
		simName: true,
		simDate: true,
		categ: true,
		descr: true,
		dttm: false,
		rec: Object.assign(data0, props.rec)
	}
	this.handleClick = this.handleClick_impl.bind(this);
 }

  onClickName() {
    this.setState({ simName: !this.state.simName });
  }
  onClickDate() {
    this.setState({ simDate: !this.state.simDate });
  }
  onClickCateg() {
    this.setState({ categ: !this.state.categ });
  }
  onClickDescr() {
    this.setState({ descr: !this.state.descr });
  }
  onClickDttm() {
    this.setState({ dttm: !this.state.dttm });
  }

 onUpdateValue(evt) {
	let fields = this.state.rec;
	fields[evt.target.id] = evt.target.value;
	this.setState({
		rec: fields
	})
 };

 handleClick_impl() {
	let recSrc = this.state.rec;
	if (!recSrc.hasOwnProperty('id')) {
		return;
	}
	let rec = {};
	rec.id = recSrc.id;
	for (let key in recSrc) {
		if (this.state[key]) {
			//console.log('U> ' + key);
			rec[key] = recSrc[key];
		}
	}
	this.props.notifyUpdate(rec);
 };

 render() {
	 let rec = this.state.rec;
	 return (<div><table className="noborder"><tbody>
		<tr><td><input type="checkbox" onChange={e => this.onClickName()} checked={this.state.simName} /></td>
			<td>Name</td><td><input id="simName" type="text" value={rec.simName} onChange={e => this.onUpdateValue(e)} /></td></tr>
		<tr><td><input type="checkbox" onChange={e => this.onClickDate()} checked={this.state.simDate} /></td>
			<td>Date</td><td><input id="simDate" type="date" value={rec.simDate} onChange={e => this.onUpdateValue(e)} /></td></tr>
		<tr><td><input type="checkbox" onChange={e => this.onClickCateg()} checked={this.state.categ} /></td>
			<td>Category</td><td><input id="categ" type="text" value={rec.categ} onChange={e => this.onUpdateValue(e)} /></td></tr>
		<tr><td><input type="checkbox" onChange={e => this.onClickDescr()} checked={this.state.descr} /></td>
			<td>Description</td><td><input id="descr" type="text" value={rec.descr} onChange={e => this.onUpdateValue(e)} /></td></tr>
		<tr><td><input type="checkbox" onChange={e => this.onClickDttm() } checked={this.state.dttm} /></td>
			<td>Date Time</td><td><input id="dttm" type="datetime-local" value={rec.dttm} onChange={e => this.onUpdateValue(e)} /></td></tr>
		<tr><td/><td><button onClick={this.handleClick}>Update</button></td></tr>
	 </tbody></table></div>);
 }
}

export default FormUpdate;