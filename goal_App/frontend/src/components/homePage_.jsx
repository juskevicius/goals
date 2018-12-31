import React from 'react';
import Navbar from './homePage_navbar';
import GaugeChart from './homePage_chart_gauge';
import LineChart from './homePage_chart_line';
import GoalInfo from './homePage_goal_info';
import Nesting from './homePage_nesting';
import FormAdd from './form_add.jsx';
import FormMyOwn from './form_myOwn_';
import FormOthers from './form_others_';

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
  }

  render() {
    

    const children = this.props.ownerUnit.parentTo.length > 0 ? this.props.ownerUnit.parentTo.map((child) => { return child; }) : '';

    return (
      <div>
        <div className="grid-container">
          <div className="l-margin">
            <Navbar toggleDisplayForm={this.toggleDisplayForm} chart={this.props.orgChart}/>
          </div>
          <div className="r-margin">
            <a href="/logout"><i className="fa fa-sign-out" style={{fontSize:54 + "px"}}></i></a>
          </div>
          <div className="header">
            <h1>
              {this.props.goalToDisplay ? this.props.goalToDisplay.name : 'Welcome to Norian Grow!'}
            </h1>
          </div>
          <div className="l-main1">
            {this.props.goalToDisplay && <GaugeChart goal={this.props.goalToDisplay} updateGoalToDisplay={this.props.updateGoalToDisplay} targscore={this.props.goalToDisplay.targScore} /*current={currentScore}*//>}
          </div>
          <div className="r-main1">
            {this.props.goalToDisplay && <LineChart goal={this.props.goalToDisplay}/>}
          </div>
          <div className="l-main2">
            {this.props.goalToDisplay && <GoalInfo goal={this.props.goalToDisplay}/>}
          </div>
          <div className="l-main2">
            {this.props.goalToDisplay && <GoalInfo goal={this.props.goalToDisplay}/>}
          </div>
          <div className="r-main2">
            {this.props.goalToDisplay && <Nesting goal={this.props.goalToDisplay}/>}
          </div>
          
        </div>
        {this.state.formAdd && <FormAdd toggleDisplayForm={this.toggleDisplayForm}/>}
        {this.state.formMyOwn && <FormMyOwn toggleDisplayForm={this.toggleDisplayForm} children={children} updateGoalToDisplay={this.props.updateGoalToDisplay}/>}
        {this.state.formOthers && <FormOthers toggleDisplayForm={this.toggleDisplayForm} children={children}/>}
      </div>
    )
  }
}
