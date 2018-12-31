import React from 'react';
import axios from 'axios';
import FormReject from './form_others_reject.jsx';
import FormNegotiateMyOffered from './form_others_negotiateMyOffered.jsx';
import FormNegotiateTheirOwn from './form_others_negotiateTheirOwn.jsx';

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
    axios.get('/others').then(
      response => {
        this.setState({
          othersGoals: response.data.othersGoals
        });
      }
    );
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
              <div className="section-header">Created by others</div>
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
          <div className="form-header">Unapproved others' goals</div>
          <div className="form-body form-others-body">
            {goalsOfferedByMe()}
            {goalsCreatedByOthers()}
            {this.state.formNegotiateMyOffered && <FormNegotiateMyOffered toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOthersGoals={this.updateOthersGoals}/>}
            {this.state.formNegotiateTheirOwn && <FormNegotiateTheirOwn toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOthersGoals={this.updateOthersGoals}/>}
            {this.state.formReject && <FormReject toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOthersGoals={this.updateOthersGoals}/>}
          </div>
        </div>
      </div>
    )
  }
}