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

  handleInput = (event) => {
    if (event.target.validity.patternMismatch) {
      event.target.setCustomValidity("User ID pattern is incorrect. Should be 5029***");
    } else {
      event.target.setCustomValidity("");
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    axios.post('/login', {
        empId: this.state.empId,
        password: this.state.password
      })
      .then(response => {
        if (response.status === 200) {
          this.props.loadData(response);
        }
      })
      .catch(error => {
        const errorMessage = error.response.data.errors.message;
        if (errorMessage.constructor === Array) {
          for (let i = 0; i < errorMessage.length; i++) {
            alert("Something went wrong with the field '" + errorMessage[i].param + "'\nError message: " + errorMessage[i].msg);
          }
        } else {
          alert(errorMessage);
        }
      });
  }

  render() {
    return (
      <div className="login-screen">
        <img className="logo" alt="logo" src="/images/Norian_grow_logo2.png"></img>
        <form onSubmit={this.handleSubmit}>
          <label>id:</label>
          <input type="text" name="empId" value={this.state.empId} onChange={this.handleChange} onInput={this.handleInput} required pattern="5029[a-z]{3}"></input>
          <label>password:</label>
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange} required></input>
          <button type="submit" value="submit">Submit</button>
        </form>
      </div>
    );
  }
}
