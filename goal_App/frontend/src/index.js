import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Login from './components/login';
import HomePage from './components/homePage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginSuccessful: false
    }
  }

  loadData = (response) => {
    this.setState({
      goalToDisplay: response.data.goalToDisplay,
      orgChart: response.data.orgChart,
      childrenGoals: response.data.childrenGoals,
      ownerUnit: response.data.ownerUnit,
      loginSuccessful: true,
    });
  }

  render() {

    return (
      <div>
        {this.state.loginSuccessful ? 
          <HomePage goalToDisplay={this.state.goalToDisplay} orgChart={this.state.orgChart} ownerUnit={this.state.ownerUnit}/> :
          <Login loadData={this.loadData}/>
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
