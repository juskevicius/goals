import React from 'react';
import axios from 'axios';

export default class UsersEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.user._id,
      empId: this.props.user.empId,
      name: this.props.user.name,
      password: this.props.user.password,
      role: this.props.user.role
    }
  }

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { id, empId, name, password, role } = this.state;
    axios.post('/usersUpdate', { 
        id, 
        empId, 
        name, 
        password, 
        role 
      })
      .then(response => {
        if (response.status === 200) {
          alert("successfuly updated a user");
          this.props.loadUsers();
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

  handleSubmit2 = (event) => {
    event.preventDefault();
    const { id } = this.state;
    axios.post('/usersDelete', { id })
      .then(response => {
        if (response.status === 200) {
          alert("successfuly deleted a user");
          this.props.loadUsers();
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
    <div className="form-editUsers">
        <form>
          <label>Object id:
            <input type='text' name='empId' value={this.state.id || ''} readOnly></input>
          </label>
          <label>Id (5029***):
            <input type='text' name='empId' value={this.state.empId || ''} onChange={this.handleChange}></input>
          </label>
          <label>Name:
            <input type='text' name='name' value={this.state.name || ''} onChange={this.handleChange}></input>
          </label>
          <label>Password:
            <input type='text' name='password' value={this.state.password || ''} onChange={this.handleChange}></input>
          </label>
          <label>Role (Country Manager, Department Manager, Team Manager, etc.):
            <input type='text' name='role' value={this.state.role || ''} onChange={this.handleChange}></input>
          </label>
          <input type='submit' value='update' onClick={this.handleSubmit}></input>
          <input type='submit' value='remove' onClick={this.handleSubmit2}></input>
        </form>
    </div>
    );
  }
  
}