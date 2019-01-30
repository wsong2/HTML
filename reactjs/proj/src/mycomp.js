import React, { Component } from 'react';

  const uvals = o => {
	var lv = '';
	Object.keys(o).forEach( function(k) {
		if (k != 'id')
			lv += ' ' + o[k];
	} );
	return lv.substring(1);
  };

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      users: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/listUsers")
      .then(res => res.json())
      .then(
        (result) => {
			var key1 = Object.keys(result)[0];
			var val1 = result[key1];
			this.setState({
				isLoaded: true,
				users: val1
			});
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  
  render() {
    const { error, isLoaded, users } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    }
	if (!isLoaded) {
      return <div>Loading...</div>;
    }
    return (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {uvals(user)}
            </li>
          ))}
        </ul>
      );
  }
}

export default MyComponent;