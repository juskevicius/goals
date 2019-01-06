import React from 'react';
import axios from 'axios';
import FormRemove from './form_myOwn_remove.jsx';
import FormAcceptOffer from './form_myOwn_acceptOffer.jsx';
import FormNegotiateOffered from './form_myOwn_negotiateOffered.jsx';
import FormNegotiateOwn from './form_myOwn_negotiateOwn.jsx';
import FormEdit from './form_myOwn_edit.jsx';
import FormOfferTo from './form_myOwn_offerTo.jsx';

export default class FormMyOwn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      someGoal: {}
    }
  }

  toggleDisplayForm = (form, goal, event) => {
    if (this.state[form]) { 
      if (event.target === event.currentTarget) {
        this.setState({ /* if the form is currently visible, then hide it */
          [form]: false
        });
      }
    } else {
      this.setState({ /* if the form is not visible, then load the goal to handle and show the form */
        someGoal: goal
      },
        this.setState({
          [form]: true
        })
      );
    }
  }

  componentDidMount() {
    this.updateOwnerGoals();
  }

  updateOwnerGoals = () => {
    const path = this.props.unitID ? '/myOwn/' + this.props.unitID : '/myOwn';
    axios.get(path)
      .then( response => {
        this.setState({
          ownerGoals: response.data.ownerGoals
        });
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

  getGoalDetails = (event) => {
    event.preventDefault();
    const url = event.target.getAttribute('href');
    axios.get(url)
      .then(response => {
        if (response.status === 200) {
          this.props.updateGoalToDisplay(response);
          const event = new Event('fake');
          this.props.toggleDisplayForm("formMyOwn", event);
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

  render() {

    const headers = () => {
      return (
        <div className="col-headers-row">
          <div className="col-header col-header-goal-name">Goal</div>
          <div className="col-header">Initial score</div>
          <div className="col-header">Target score</div>
          <div className="col-header">Status</div>
          <div className="col-header">Actions</div>
        </div>);
    }

    const goalsOfferedToMe = () => {
      if (this.state.ownerGoals) {
        const offeredToMe = this.state.ownerGoals.filter((goal) => { return (goal.statusApprover === "Approved" && goal.statusOwner === "Pending");});
        if (offeredToMe.length > 0) {
          return (
            <div className="offeredToMe">
              <div className="section-header">Goals offered to me</div>
              {headers()}
              {offeredToMe.map((goal) => { return (
              <div className="col-data-row" key={goal._id}>
                <div className="col-data col-data-goal-name">{goal.approversOffer.name}</div>
                <div className="col-data">{goal.approversOffer.initScore}</div>
                <div className="col-data">{goal.approversOffer.targScore}</div>
                <div className="col-data">{goal.status}</div>
                <div className="col-data">
                  <i className="far fa-check-square" onClick={(event) => this.toggleDisplayForm("formAcceptOffer", goal, event)} title="Accept"></i>
                  <i className="far fa-comment" onClick={(event) => this.toggleDisplayForm("formNegotiateOffered", goal, event)} title="Negotiate" style={!goal.ownersOffer || ((goal.approversOffer.updated || goal.approversOffer.created) > (goal.ownersOffer.updated || goal.ownersOffer.created)) ? {color: '#515ad8', fontWeight: 'bold'} : {}}></i>
                  <i className="fa fa-remove" onClick={(event) => this.toggleDisplayForm("formRemove", goal, event)} title="Reject"></i>
                </div>
              </div>);})}
            </div>);
        }
      }
    }

    const goalsCreatedByMe = () => {
      if (this.state.ownerGoals) {
        const createdByMe = this.state.ownerGoals.filter((goal) => { return (goal.statusApprover === "Pending" && goal.statusOwner === "Approved");});
        if (createdByMe.length > 0) {
          return (
            <div className="myOffered">
              <div className="section-header">Goals submitted by me</div>
              {headers()}
              {createdByMe.map((goal) => { return  (
              <div className="col-data-row" key={goal._id}>
                <div className="col-data col-data-goal-name">{goal.ownersOffer.name}</div>
                <div className="col-data">{goal.ownersOffer.initScore}</div>
                <div className="col-data">{goal.ownersOffer.targScore}</div>
                <div className="col-data">{goal.status}</div>
                <div className="col-data">
                  <i className="far fa-comment" onClick={(event) => this.toggleDisplayForm("formNegotiateOwn", goal, event)} title="Negotiate" style={goal.approversOffer && ((goal.approversOffer.updated || goal.approversOffer.created) > (goal.ownersOffer.updated || goal.ownersOffer.created)) ?  {color: '#515ad8', fontWeight: 'bold'} : {}}></i>
                  <i className="fa fa-remove" onClick={(event) => this.toggleDisplayForm("formRemove", goal, event)} title="Reject"></i>
                </div>
              </div>);})}
            </div>
          );
        }
      } 
    }

    const myApprovedGoals = () => {
      if (this.state.ownerGoals) {
        const myApproved = this.state.ownerGoals.filter((goal) => { return (goal.statusApprover === "Approved" && goal.statusOwner === "Approved");});
        if (myApproved.length > 0) {
          return (
            <div className="myApproved">
              <div className="section-header">Approved goals</div>
              {headers()}
              {myApproved.map((goal) => { return  (
              <div className="col-data-row" key={goal._id}>
                <div className="col-data col-data-goal-name"><a href={'/details/' + goal._id} onClick={this.getGoalDetails}>{goal.name}</a></div>
                <div className="col-data">{goal.initScore}</div>
                <div className="col-data">{goal.targScore}</div>
                <div className="col-data">{goal.status}</div>
                <div className="col-data">
                  <i className="fa fa-edit" onClick={(event) => this.toggleDisplayForm("formEdit", goal, event)} title="Edit"></i>
                  <i className="fa fa-remove" onClick={(event) => this.toggleDisplayForm("formRemove", goal, event)} title="Delete"></i>
                  <i className="fa fa-share-alt" onClick={(event) => this.toggleDisplayForm("formOfferTo", goal, event)} title="Ofer to..."></i>
                </div>
              </div>);})}
            </div>
          );
        }
      } 
    }

    return (
      <div className="overlay" onClick={(event) => this.props.toggleDisplayForm("formMyOwn", event)}>
        <div className="form-myOwn">
          <div className="form-header">My goals</div>
          <div className="form-body form-myOwn-body">
            {goalsOfferedToMe()}
            {goalsCreatedByMe()}
            {myApprovedGoals()}
            {this.state.formRemove && <FormRemove toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOwnerGoals={this.updateOwnerGoals}/>}
            {this.state.formNegotiateOwn && <FormNegotiateOwn toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOwnerGoals={this.updateOwnerGoals}/>}
            {this.state.formAcceptOffer && <FormAcceptOffer toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOwnerGoals={this.updateOwnerGoals}/>}
            {this.state.formNegotiateOffered && <FormNegotiateOffered toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOwnerGoals={this.updateOwnerGoals}/>}
            {this.state.formEdit && <FormEdit toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOwnerGoals={this.updateOwnerGoals}/>}
            {this.state.formOfferTo && <FormOfferTo toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOwnerGoals={this.updateOwnerGoals} children={this.props.children}/>}
          </div>
        </div>
      </div>
    )
  }
}