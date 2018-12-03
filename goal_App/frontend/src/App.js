import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      empId: "your empID",
      password: "your passsword"
    }
  }
  
  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    axios.post('/login', {
      empId: this.state.empId,
      password: this.state.password
    })
    .then( function(response) {
      console.log(response);
    });
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <form onSubmit={this.handleSubmit}>
            <label>empID:</label>
            <input type="text" name="empId" value={this.state.empId} onChange={this.handleChange}></input>
            <label>Password:</label>
            <input type="password" name="password" value={this.state.password} onChange={this.handleChange}></input>
            <input type="submit" value="login"></input>
          </form>
          <p>Test321</p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
