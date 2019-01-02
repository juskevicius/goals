import React from 'react';
import axios from 'axios';
import UsersEdit from './users_edit';

export default class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = () => {
    axios
    .get('/users')
    .then(response => {
      this.setState({
        users: response.data.users
      });
    });
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
    const { empId, name, password, role } = this.state;
    axios
      .post('/users', { empId, name, password, role })
      .then(response => {
        if (response.status === 200) {
          if (response.data.constructor === Array) {
            for (let i = 0; i < response.data.length; i++) {
              alert("Something went wrong with the field '" + response.data[i].param + "'\nError message: " + response.data[i].msg);
            }
            return;
          }
          alert('successfuly added a user');
          this.loadUsers();
        }
      });
  }


  render() {

    return (
    <div className="form-users">
      <div className="form-header">Users</div>
      <div className="form-body">
        <form>
          <label>Id:
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
          <input type='submit' value='Add a new user' onClick={this.handleSubmit}></input>
        </form>

        {this.state.users && this.state.users.map((user) => { return (
            <UsersEdit loadUsers={this.loadUsers} key={user._id} user={user}/>
            );})}

      </div>
    </div>
    );
  }
  
}