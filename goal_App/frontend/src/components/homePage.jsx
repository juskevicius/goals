import React from 'react';
import Navbar from './navbar.jsx';
import FormAdd from './form_add.jsx';
import FormMyOwn from './form_myOwn_.jsx';
/*import FormOthers from './form_others_.jsx';
import FormCurrent from '.form_current.jsx';
import GoalInfo from './goal_info.jsx';
import Nesting from './nesting.jsx';*/

export default class HomePage extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      displayAddForm: false,
      displayMyOwnForm: false
    }
   }

   toggleDisplayAddForm = (event) => {
    event.preventDefault();
     if (event.target === event.currentTarget) {
      this.setState(prevState => ({
        displayAddForm: !prevState.displayAddForm
      }));
     }
   }

   toggleDisplayMyOwnForm = (event) => {
    event.preventDefault();
    if (event.target === event.currentTarget) {
     this.setState(prevState => ({
       displayMyOwnForm: !prevState.displayMyOwnForm
     }));
    }
  }

  /*
      
    <div>
      
        
        {this.props.goal ?
        <div className="l-main1">
          <div className="gauge-chart" targscore={this.props.goal ? this.props.goal.targScore : ''} current={currentScore}></div>
          <script src="/scripts/gauge-chart.js"></script> 
        </div> : ''}

        {this.props.goal ?
        <div className="r-main1">
          <div className="line-chart" targscore={this.props.goal ? this.props.goal.targScore : ''} dates={sortedDates} values={sortedValues}></div>
          <script src="/scripts/line-chart.js"></script>
        </div> : ''}

        {this.props.goal && <GoalInfo goal={this.props.goal}/>}
        {this.props.goal && <Nesting goal={this.props.goal}/>}
      </div>
      
      
      <FormOthers display={this.props.displayOthersForm} offeredByMe={this.props.offeredByMe} createdByOthers={this.props.createdByOthers}/>
      {this.props.goal && <FormCurrent goal={this.props.goal}/>}
      <script src="/scripts/form-control.js"></script>

  
  }*/
  
  render() {
    /*
    if (this.props.goal) {
      let sortedHistory = this.props.goal.history.data.sort((a, b) => { return a.date - b.date; });
      var currentScore = sortedHistory[sortedHistory.length - 1].value;
      var sortedDates = sortedHistory.map((entry) => { return entry.date});
      var sortedValues = sortedHistory.map((entry) => { return entry.value});

      
    }*/

    
    const theGoal = this.props.ownerGoals ? this.props.ownerGoals.filter((goal) => { return (goal.statusApprover === "Approved" && goal.statusOwner === "Approved");}) : '';
    const createdByMe = this.props.ownerGoals ? this.props.ownerGoals.filter((goal) => { return (goal.statusApprover === "Pending" && goal.statusOwner === "Approved");}) : '';
    const offeredToMe = this.props.ownerGoals ? this.props.ownerGoals.filter((goal) => { return (goal.statusApprover === "Approved" && goal.statusOwner === "Pending");}) : '';
    const myApproved = this.props.ownerGoals ? this.props.ownerGoals.filter((goal) => { return (goal.statusApprover === "Approved" && goal.statusOwner === "Approved");}) : '';
    const children = this.props.ownerUnit.parentTo.length > 0 ? this.props.ownerUnit.parentTo.map((child) => { return child; }) : '';
    
    return (
      <div>
        <div className="grid-container">
          <div className="l-margin">
            <Navbar toggleDisplayMyOwnForm={this.toggleDisplayMyOwnForm} toggleDisplayAddForm={this.toggleDisplayAddForm} chart={this.props.orgChart}/>
          </div>
          <div className="r-margin">
            <a href="/logout"><i className="fa fa-sign-out" style={{fontSize:54 + "px"}}></i></a>
          </div>
          <div className="header">
            <h1>
              {theGoal.length > 0 ? theGoal[0].name : 'Welcome to Norian Grow!'}
            </h1>
          </div>
        </div>
        {this.state.displayAddForm && <FormAdd updateOwnerGoals={this.props.updateOwnerGoals} toggleDisplayAddForm={this.toggleDisplayAddForm} display={this.state.displayAddForm}/>}
        {this.state.displayMyOwnForm && <FormMyOwn toggleDisplayMyOwnForm={this.toggleDisplayMyOwnForm} offeredToMe={offeredToMe} createdByMe={createdByMe} myApproved={myApproved} children={children} updateOwnerGoals={this.props.updateOwnerGoals}/>}
      </div>
    )
  }
}
