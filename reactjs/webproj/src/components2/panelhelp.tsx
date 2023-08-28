import React from "react";

interface PaneHelpProps {
	heading: string
}


class PanelHelp extends React.Component<PaneHelpProps>
{	
	handleClick: (evt: React.MouseEvent<HTMLInputElement>) => void;

	constructor(props: PaneHelpProps) {
		super(props);		
		this.handleClick = this.handleClick_impl.bind(this);
	}

	handleClick_impl(event: React.MouseEvent<HTMLElement>) {
	};

	render() {
		 return <div><h2>{this.props.heading}</h2>
		 Simple test platform
		 </div>;
	}
}

export default PanelHelp;