import React from 'react';

export default class Login extends React.Component {

  render() {
    return (
      <div className="login-screen">
        <img className="logo" alt="logo" src="/images/Norian_grow_logo2.png"></img>
        <form onSubmit={this.props.handleSubmit}>
          <label>id:</label>
          <input type="text" name="empId" value={this.props.empId} onChange={this.props.handleChange}></input>
          <label>password:</label>
          <input type="password" name="password" value={this.props.password} onChange={this.props.handleChange}></input>
          <button type="submit" value="submit">Submit</button>
        </form>
      </div>
    );
  }
}
