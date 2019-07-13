import React from "react";
import ReactDOM from "react-dom";
import ReactDataGrid from "react-data-grid";

class MyGrid extends React.Component
{	
  constructor(props) {
	super(props);
	this.state = {
		rows: props.data.rows.slice(0)
	};
	this.onGridRowsUpdated = this.onGridRowsUpdated_impl.bind(this);
  }
	
  onGridRowsUpdated_impl({ fromRow, toRow, updated }) {
    this.setState(state => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };
  
  render() {
    return (
      <ReactDataGrid
        columns={this.props.data.columns}
        rowGetter={i => this.state.rows[i]}
        rowsCount={this.state.rows.length}
        onGridRowsUpdated={this.onGridRowsUpdated}
        enableCellSelect={true}
      />
    );
  }
}

export default MyGrid;