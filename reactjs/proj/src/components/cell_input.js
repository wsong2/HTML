import React from "react";

class CellInput extends React.Component
{	
	constructor(props)
	{
		super(props);
		this.state = {
			value: props.value
		};
		this.onUpdateValue = this.onUpdateValue_impl.bind(this);
	}
	
	onUpdateValue_impl(evt) {
		this.props.notifyChange(this.props.rowIndex, this.props.cn, evt.target.value);
		this.setState({
			value: evt.target.value
		});
	};
  
	render() {
		return (
			<input type="text" 
				value={this.state.value} 
				//onChange={evt => this.onUpdateValue(evt)}
				onChange={this.onUpdateValue}
				required />
		);
	}
}

export default CellInput;