import React from 'react';
import ReactDOM from 'react-dom';
import ReactDataGrid from "react-data-grid";

import { grid_data }  from './components/algorithm.js';
import "./app.css";

const datadef = grid_data();
const rows = datadef.rows;
	
class Example extends React.Component {
 
 constructor(props) {
    super(props);
    this.state = {
      rows
    };
	this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
  }

  onGridRowsUpdated({fromRow, toRow, updated}) {
    this.setState(state => {
      const rows = state.rows.slice(0);
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };
  
  render() {
    return (
      <ReactDataGrid
        columns={this.props.columns}
        rowGetter={i => this.state.rows[i]}
        rowsCount={rows.length}
        onGridRowsUpdated={this.onGridRowsUpdated}
        enableCellSelect={true}
      />
    );
  }
}

ReactDOM.render(
  <Example columns={datadef.columns} />,
  document.getElementById('root')
);
