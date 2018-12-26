import React from 'react';
import axios from 'axios';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      empId: '',
      password: ''
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
    .then( response => {
      if (response.status === 200) {
        this.props.loadData(response);
      } else if (response.status === 422) {
        console.log("either username or password is incorrect");
      } else {
        console.log("something went wrong");
      }
    });
  }

  render() {
    return (
      <div className="login-screen">
        <img className="logo" alt="logo" src="/images/Norian_grow_logo2.png"></img>
        <form onSubmit={this.handleSubmit}>
          <label>id:</label>
          <input type="text" name="empId" value={this.state.empId} onChange={this.handleChange}></input>
          <label>password:</label>
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange}></input>
          <button type="submit" value="submit">Submit</button>
        </form>
      </div>
    );
  }
}
