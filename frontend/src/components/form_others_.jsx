import React from 'react';
import axios from 'axios';
import FormReject from './form_others_reject.jsx';
import FormNegotiateMyOffered from './form_others_negotiateMyOffered.jsx';
import FormNegotiateTheirOwn from './form_others_negotiateTheirOwn.jsx';
import FormNegotiateApproved from './form_others_negotiateApproved.jsx';
import FormCopy from './form_others_copy.jsx';

export default class FormOthers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      someGoal: {}
    }
  }

  toggleDisplayForm = (form, goal, event) => {
    event.preventDefault();
    if (this.state[form]) { 
      if (event.target === event.currentTarget) {
        this.setState({ /* if the form is currently visible, then hide it */
          [form]: false
        });
      }
    } else {
      this.setState({ /* if the form is not visible, then load the goal to remove and show the form */
        someGoal: goal
      },
        this.setState({
          [form]: true
        })
      );
    }
  }

  componentDidMount() {
    this.updateOthersGoals();
  }

  updateOthersGoals = () => {
    axios.get('/others')
      .then(response => {
        if (response.status === 200) {
          this.setState({
            othersGoals: response.data.othersGoals
          });
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

  getGoalDetails = (event, goalId) => {
    event.preventDefault();
    const ev = new Event('fake');
    this.props.toggleDisplayForm("formOthers", ev);
    this.props.updateGoalToDisplay(goalId);
  } 

  render() {

    const headers1 = () => {
      return (
        <div className="col-headers-row">
          <div className="col-header col-header-goal-name">Goal</div>
          <div className="col-header">Offered to</div>
          <div className="col-header">Initial score</div>
          <div className="col-header">Target score</div>
          <div className="col-header">Status</div>
          <div className="col-header">Actions</div>
        </div>);
    }

    const headers2 = () => {
      return (
        <div className="col-headers-row">
          <div className="col-header col-header-goal-name">Goal</div>
          <div className="col-header">Created by</div>
          <div className="col-header">Initial score</div>
          <div className="col-header">Target score</div>
          <div className="col-header">Status</div>
          <div className="col-header">Actions</div>
        </div>);
    }

    const headers3 = () => {
      return (
        <div className="col-headers-row">
          <div className="col-header col-header-goal-name">Goal</div>
          <div className="col-header">Owner</div>
          <div className="col-header">Initial score</div>
          <div className="col-header">Current score</div>
          <div className="col-header">Target score</div>
          <div className="col-header">Actions</div>
        </div>);
    }

    const goalsOfferedByMe = () => {
      if (this.state.othersGoals) {
        const offeredByMe = this.state.othersGoals.filter((goal) => { return goal.statusOwner === "Pending" && goal.statusApprover === "Approved";});
        if (offeredByMe.length > 0) {
          return (
            <div className="offeredByMe">
              <div className="section-header">Offered by me</div>
              {headers1()}
              {offeredByMe.map((goal) => { return (
              <div className="col-data-row" key={goal._id}>
                <div className="col-data col-data-goal-name">{goal.approversOffer.name}</div>
                <div className="col-data">{goal.owner.name}</div>
                <div className="col-data">{goal.approversOffer.initScore}</div>
                <div className="col-data">{goal.approversOffer.targScore}</div>
                <div className="col-data">{goal.status}</div>
                <div className="col-data">
                  <i className="far fa-comment" title="Negotiate" style={goal.ownersOffer && ((goal.ownersOffer.updated_formatted || goal.ownersOffer.created_formatted) > (goal.approversOffer.updated_formatted || goal.approversOffer.created_formatted)) ? {color: '#515ad8', fontWeight: 'bold'} : {}} onClick={(event) => this.toggleDisplayForm("formNegotiateMyOffered", goal, event)}></i>
                  <i className="fa fa-remove" title="Remove" onClick={(event) => this.toggleDisplayForm("formReject", goal, event)}></i>
                  {goal.childTo.length === 0 &&
                  <i className="fas fa-bezier-curve" title="Copy" onClick={(event) => this.toggleDisplayForm("formCopy", goal, event)}></i>}
                </div>
              </div>);})}
            </div>
          );
        }
      }
    }

    const goalsCreatedByOthers = () => {
      if (this.state.othersGoals) {
        const createdByOthers = this.state.othersGoals.filter((goal) => { return goal.statusOwner === "Approved" && goal.statusApprover === "Pending";});
        if (createdByOthers.length > 0) {
          return (
            <div className="createdByOthers">
              <div className="section-header">Created by them</div>
              {headers2()}
              {createdByOthers.map((goal) => { return (
              <div className="col-data-row" key={goal._id}>
                <div className="col-data col-data-goal-name">{goal.ownersOffer.name}</div>
                <div className="col-data">{goal.owner.name}</div>
                <div className="col-data">{goal.ownersOffer.initScore}</div>
                <div className="col-data">{goal.ownersOffer.targScore}</div>
                <div className="col-data">{goal.status}</div>
                <div className="col-data">
                  <i className="far fa-comment triggerNegotiateTheirOwn" title="Negotiate" style={!goal.approversOffer || (goal.approversOffer && ((goal.ownersOffer.updated_formatted || goal.ownersOffer.created_formatted) > (goal.approversOffer.updated_formatted || goal.approversOffer.created_formatted))) ? {color: '#515ad8', fontWeight: 'bold'} : {}} onClick={(event) => this.toggleDisplayForm("formNegotiateTheirOwn", goal, event)}></i>
                  <i className="fa fa-remove" title="Reject" onClick={(event) => this.toggleDisplayForm("formReject", goal, event)}></i>
                  {goal.childTo.length === 0 &&
                  <i className="fas fa-bezier-curve" title="Copy" onClick={(event) => this.toggleDisplayForm("formCopy", goal, event)}></i>}
                </div>
              </div>);})}
            </div>
          );
        }
      }
    }

    const goalsApproved = () => {
      if (this.state.othersGoals) {
        const approved = this.state.othersGoals.filter((goal) => { return goal.statusOwner === "Approved" && goal.statusApprover === "Approved";});
        if (approved.length > 0) {
          return (
            <div className="approved">
              <div className="section-header">Approved</div>
              {headers3()}
              {approved.map((goal) => { return (
              <div className="col-data-row" key={goal._id}>
                <div className="col-data col-data-goal-name"><a href={'/details/' + goal._id} onClick={event => this.getGoalDetails(event, goal._id)}>{goal.name}</a></div>
                <div className="col-data">{goal.owner.name}</div>
                <div className="col-data">{goal.initScore}</div>
                <div className="col-data">{goal.history.data && goal.history.data.length > 0 && (goal.history.data.reduce((prev, curr) => { return (prev.date > curr.date) ? prev : curr;})).value}</div>
                <div className="col-data">{goal.targScore}</div>
                <div className="col-data">
                  <i className="far fa-comment" title="Negotiate" onClick={(event) => this.toggleDisplayForm("formNegotiateApproved", goal, event)}></i>
                  {goal.childTo.length === 0 &&
                  <i className="fas fa-bezier-curve" title="Copy" onClick={(event) => this.toggleDisplayForm("formCopy", goal, event)}></i>}
                </div>
              </div>);})}
            </div>
          );
        }
      }
    }


    return (
      <div className="overlay" onClick={(event) => this.props.toggleDisplayForm("formOthers", event)}>
        <div className="form-others">
          <div className="form-header">Goals of my subordinates</div>
          <div className="form-body form-others-body">
            {goalsOfferedByMe()}
            {goalsCreatedByOthers()}
            {goalsApproved()}
            {this.state.formNegotiateMyOffered && <FormNegotiateMyOffered toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOthersGoals={this.updateOthersGoals}/>}
            {this.state.formNegotiateTheirOwn && <FormNegotiateTheirOwn toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOthersGoals={this.updateOthersGoals}/>}
            {this.state.formNegotiateApproved && <FormNegotiateApproved toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOthersGoals={this.updateOthersGoals}/>}
            {this.state.formReject && <FormReject toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOthersGoals={this.updateOthersGoals} updateGoalToDisplay={this.props.updateGoalToDisplay} goalInTheBackground={this.props.goalToDisplay}/>}
            {this.state.formCopy && <FormCopy toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOthersGoals={this.updateOthersGoals} updateGoalToDisplay={this.props.updateGoalToDisplay} goalInTheBackground={this.props.goalToDisplay}/>}
          </div>
        </div>
      </div>
    )
  }
}