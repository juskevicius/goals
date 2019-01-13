import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import * as serviceWorker from './serviceWorker';
import Login from './components/login';
import HomePage from './components/homePage_';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginSuccessful: false
    }
  }

  logout = (event) => {
    event.preventDefault();
    axios.get('/logout')
      .then(
        this.setState({
          loginSuccessful: false
        })
      )
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

  loginSuccessful = () => {
    this.setState({
      loginSuccessful: true
    });
  }

  render() {

    return (
      <div>
        {this.state.loginSuccessful ? 
          <HomePage logout={this.logout}/> :
          <Login loginSuccessful={this.loginSuccessful}/>
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
