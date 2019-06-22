import React from 'react';
import ReactDOM from 'react-dom';
import "./app.css";

import MyGrid from './components/mygrid.js';

//
const MenuBar = function MenuBar(props)
{
 let items = ['File', 'Search', 'Options'];
 return (
	<div><ul>
		{items.map(mi => (<li className="menuitem">{mi}</li>))}
	</ul></div>
 );
}

//
class DataComponent extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
	  griddata: {}
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/gridview")
      .then(res => res.json())
      .then(
        (result) => {
			let gd = {};
			gd.columns = result.columns;
			gd.rows = result.rows;
			this.setState({
				isLoaded: true,
				griddata: gd
			});
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  
  render()
  {
    const {error, isLoaded} = this.state;
    if (error)
	{
      return <div>Error: {error.message}</div>;
    }
	if (!isLoaded)
	{
      return <div>Loading...</div>;
    }
    return (
        <div><MyGrid data={this.state.griddata} /></div>
    );
  }
}

//
ReactDOM.render
(
  <div>
	<MenuBar />
	<DataComponent />
  </div>,
  document.getElementById('root')
);

