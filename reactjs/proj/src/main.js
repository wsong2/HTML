import React from 'react';
import ReactDOM from 'react-dom';
import "./app.css";

const LOC = (location.protocol == 'file:') 
			? 'http://localhost:3000/chargePts'
			: '/chargingpoint/nearest/';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		btnEabled: true,
		latitude: props.latitude,
		longitude: props.longitude,
		inputText: "",
		resultText: ""
    };
	this.updateLatitude = this.updateLatitude.bind(this);
	this.updateLongitude = this.updateLongitude.bind(this);
	this.handleClick = this.handleClick.bind(this);
  }

  updateLatitude(evt) {
    this.setState({
      latitude: evt.target.value
    });
  }
  
  updateLongitude(evt) {
    this.setState({
      longitude: evt.target.value
    });
  }
  
  handleClick(evt) {
	var params = { latitude: this.state.latitude, longitude: this.state.longitude };
	this.setState({ btnEabled: false });

	var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
	fetch(LOC + "?"+queryString)
      .then(res => res.json())
      .then(
        (result) => {
			let valIn = '';
			let valPt = '(none)';
			if (result.status == 'OK') {
				valIn = this.state.latitude + '::' + this.state.longitude;
				valPt = result['charging-point-id'];
			}
			this.setState({ 
				btnEabled: true,
				inputText: valIn,
				resultText: valPt
			});			
			//alert(JSON.stringify(result));
        },
        (error) => {
			this.setState({ 
				btnEabled: true,
				resultText: 'ERR'
			});
			console.error(error);
        }
      )
  }
  
  render() {
    return (<table className="noborder">
	  <tr><td>Latitude</td><td>
		<input name="latitude" type="text" value={this.state.latitude} onChange={evt => this.updateLatitude(evt)} required />
		</td></tr>
	  <tr><td>Longitute</td><td>
		<input name="longitude" type="text" value={this.state.longitude} onChange={evt => this.updateLongitude(evt)} required/>
		</td></tr>
	  <tr><td /><td>
		<button onClick={evt => this.handleClick(evt)} disabled={!this.state.btnEabled} >Find Nearest Point</button>
	  </td></tr>
	  <tr><td>{this.state.inputText}</td><td>{this.state.resultText}</td></tr>
     </table>);
  }
}

ReactDOM.render(
  <MyComponent latitude="50.25" longitude="-1.22"/>,
  document.getElementById('root')
);