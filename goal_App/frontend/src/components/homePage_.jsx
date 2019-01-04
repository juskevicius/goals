import React from 'react';
import axios from 'axios';
import Navbar from './homePage_navbar';
import GaugeChart from './homePage_chart_gauge';
import LineChart from './homePage_chart_line';
import GoalInfo from './homePage_goal_info';
import Nesting from './homePage_nesting';
import FormAdd from './form_add.jsx';
import FormMyOwn from './form_myOwn_';
import FormOthers from './form_others_';
import Units from './units_';
import Users from './users_';

export default class HomePage extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
    }
   }

  toggleDisplayForm = (form, event) => {
    event.preventDefault();
    if (this.state[form]) { 
      if (event.target === event.currentTarget) {
        this.setState({ /* if the form is currently visible, then hide it */
          [form]: false
        });
      }
    } else {
      this.setState({
        [form]: true
      });
    }
    if (form === 'users') {
      this.setState({
        units: false
      })
    } else if (form === 'units') {
      this.setState({
        users: false
      })
    }
  }

  logout = (event) => {
    event.preventDefault();
    axios
      .get('/logout')
      .then(
        this.props.logout()
      );
  }

  render() {
    

    const children = this.props.ownerUnit.parentTo.length > 0 ? this.props.ownerUnit.parentTo.map((child) => { return child; }) : '';

    return (
      <div>
        <div className="grid-container">
          <div className="l-margin">
            <Navbar toggleDisplayForm={this.toggleDisplayForm} chart={this.props.orgChart} userRole={this.props.userRole} updateGoalToDisplay={this.props.updateGoalToDisplay}/>
          </div>
          <div className="r-margin">
            <a href="/logout" onClick={this.logout}><i className="fa fa-sign-out" style={{fontSize:54 + "px"}}></i></a>
          </div>
          <div className="header">
            <h1>
              {this.props.goalToDisplay ? this.props.goalToDisplay.name : 'Welcome to Norian Grow!'}
            </h1>
          </div>
          <div className="l-main1">
            {this.props.goalToDisplay && <GaugeChart key={this.props.goalToDisplay._id} goal={this.props.goalToDisplay} updateGoalToDisplay={this.props.updateGoalToDisplay} targscore={this.props.goalToDisplay.targScore}/>}
          </div>
          <div className="r-main1">
            {this.props.goalToDisplay && <LineChart key={this.props.goalToDisplay._id} goal={this.props.goalToDisplay}/>}
          </div>
          <div className="l-main2">
            {this.props.goalToDisplay && <GoalInfo key={this.props.goalToDisplay._id} goal={this.props.goalToDisplay}/>}
          </div>
          <div className="r-main2">
            {this.props.goalToDisplay && <Nesting key={this.props.goalToDisplay._id} children={this.props.goalToDisplay.parentTo} task={this.props.goalToDisplay.task} id={this.props.goalToDisplay._id} updateGoalToDisplay={this.props.updateGoalToDisplay}/>}
          </div>
        </div>
        {this.state.formAdd && <FormAdd toggleDisplayForm={this.toggleDisplayForm}/>}
        {this.state.formMyOwn && <FormMyOwn toggleDisplayForm={this.toggleDisplayForm} children={children} updateGoalToDisplay={this.props.updateGoalToDisplay}/>}
        {this.state.formOthers && <FormOthers toggleDisplayForm={this.toggleDisplayForm} children={children}/>}
        {this.state.units && <Units toggleDisplayForm={this.toggleDisplayForm} />}
        {this.state.users && <Users toggleDisplayForm={this.toggleDisplayForm} />}
      </div>
    )
  }
}
