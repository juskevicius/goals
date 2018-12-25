import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import * as serviceWorker from './serviceWorker';
import Login from './components/login';
import HomePage from './components/homePage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      empId: "your empID",
      password: "your passsword",
      loginSuccessful: false
    }
  }
  
  loginChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  loginSubmit = (event) => {
    event.preventDefault();
    axios.post('/login', {
      empId: this.state.empId,
      password: this.state.password
    })
    .then( response => {
      if (response.status === 200) {
        this.setState({
          orgChart: response.data.orgChart,
          ownerGoals: response.data.ownerGoals,
          childrenGoals: response.data.childrenGoals,
          ownerUnit: response.data.ownerUnit,
          loginSuccessful: true,
        });
        
      } else if (response.status === 422) {
        console.log("either username or password is incorrect");
      } else {
        console.log("something went wrong");
      }
    });
  }

  updateOwnerGoals = () => {
    axios.get('/myOwn').then(
      response => {
        this.setState({
          ownerGoals: response.data.ownerGoals
        });
      }
    );
  }

  

  render() {

    return (
      <div>
        {this.state.loginSuccessful ? 
          <HomePage orgChart={this.state.orgChart} ownerGoals={this.state.ownerGoals} updateOwnerGoals={this.updateOwnerGoals} ownerUnit={this.state.ownerUnit}/> :
          <Login empId={this.state.empId} password={this.state.password} handleChange={this.loginChange} handleSubmit={this.loginSubmit}/>
        }
        
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
