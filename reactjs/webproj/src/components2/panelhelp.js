import React from "react";
import ReactDOM from "react-dom";

class PanelHelp extends React.Component
{	
	constructor(props) {
		super(props);		
		this.handleClick = this.handleClick_impl.bind(this);
	}

	handleClick_impl() {
	};

	render() {
		 return <div><h2>{this.props.heading}</h2>
		 Simple test platform
		 </div>;
	}
}

export default PanelHelp;