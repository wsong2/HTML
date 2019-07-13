import React from 'react';
import ReactDOM from 'react-dom';

//import MyComponent from './components/mycomp.js';

import ReactDataGrid from "react-data-grid";
import "./app.css";

/* const columns = [
  { key: "id", name: "ID", editable: true },
  { key: "title", name: "Title", editable: true },
  { key: "complete", name: "Complete", editable: true }
];
 */
const columns = [
  { key: "id", name: "ID", editable: false },
  { key: "unit", name: "Unit", editable: true },
  { key: "price", name: "Price", editable: true },
  { key: "categ", name: "Category", editable: true },
  { key: "date", name: "Date", editable: true }
];


const rows = //[
//  { id: 0, title: "Task 1", complete: 20 },
//  { id: 1, title: "Task 2", complete: 40 },
//  { id: 2, title: "Task 3", complete: 60 }
//];
	[
		{
			"id":"Soup-x1",
			"unit":"tin",
			"price":0.65,
			"categ": "A",
			"date": "01-05-2001"
		},
		{
			"id":"Bread-y0",
			"unit":"loaf",
			"price":0.80,
			"categ": "B",
			"date": "15-05-2001"
		},
		{
			"id":"Milk",
			"unit":"bottle",
			"price":1.30,
			"categ": "A",
			"date": "01-07-2001"
		},
		{
			"id":"Apples",
			"unit":"bag",
			"price":1.10,
			"categ": "B",
			"date": "01-06-2001"
		},
		{
			"id":"Pepsi-1",
			"unit":"bottle",
			"price":1.05,
			"categ": "A",
			"date": "01-05-2001"
		},
		{
			"id":"Pepsi-2",
			"unit":"bottle",
			"price":1.05,
			"categ": "A",
			"date": "01-05-2001"
		}
	];
	
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
        columns={columns}
        rowGetter={i => this.state.rows[i]}
        rowsCount={6}
        onGridRowsUpdated={this.onGridRowsUpdated}
        enableCellSelect={true}
      />
    );
  }
}

ReactDOM.render(
  <Example />,
  document.getElementById('root')
);

