import React from 'react';
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
      formRemove: false,
      formAcceptOffer: false,
      formNegotiateOffered: false,
      formNegotiateOwn: false,
      formEdit: false,
      formOfferTo: false,
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
      this.setState({ /* if the form is not visible, then load the goal to remove and show the form */
        someGoal: goal
      },
        this.setState({
          [form]: true
        })
      );
    }
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
      return this.props.offeredToMe.map((goal) => { return  (
        <div className="col-data-row" key={goal._id}>
          <div className="col-data col-data-goal-name">{goal.offer.name}</div>
          <div className="col-data">{goal.offer.initScore}</div>
          <div className="col-data">{goal.offer.targScore}</div>
          <div className="col-data">{goal.status}</div>
          <div className="col-data">
            <i className="far fa-check-square" onClick={(event) => this.toggleDisplayForm("formAcceptOffer", goal, event)} title="Accept"></i>
            <i className="far fa-comment" title="Negotiate" style={goal.offer.updated > goal.updated || !goal.updated ? {color: '#515ad8', fontWeight: 'bold'} : {}}></i>
            <i className="fa fa-remove" onClick={(event) => this.toggleDisplayForm("formRemove", goal, event)} title="Reject"></i>
          </div>
        </div>
      );});
    }

    const goalsCreatedByMe = () => {
      return this.props.createdByMe.map((goal) => { return  (
        <div className="col-data-row" key={goal._id}>
          <div className="col-data col-data-goal-name">{goal.name}</div>
          <div className="col-data">{goal.initScore}</div>
          <div className="col-data">{goal.targScore}</div>
          <div className="col-data">{goal.status}</div>
          <div className="col-data">
            <i className="far fa-comment" title="Negotiate" style={goal.offer.updated > goal.updated || (!goal.updated && goal.offer.updated) ?  {color: '#515ad8', fontWeight: 'bold'} : {}}></i>
            <i className="fa fa-remove" onClick={(event) => this.toggleDisplayForm("formRemove", goal, event)} title="Reject"></i>
          </div>
        </div>
      );});
    }

    const myApprovedGoals = () => {
      return this.props.myApproved.map((goal) => { return  (
        <div className="col-data-row" key={goal._id}>
          <div className="col-data col-data-goal-name"><a href={'/details/' + goal.id}>{goal.name}</a></div>
          <div className="col-data">{goal.initScore}</div>
          <div className="col-data">{goal.targScore}</div>
          <div className="col-data">{goal.status}</div>
          <div className="col-data">
            <i className="fa fa-edit" onClick={(event) => this.toggleDisplayForm("formEdit", goal, event)} title="Edit"></i>
            <i className="fa fa-remove" onClick={(event) => this.toggleDisplayForm("formRemove", goal, event)} title="Delete"></i>
            <i className="fa fa-share-alt" onClick={(event) => this.toggleDisplayForm("formOfferTo", goal, event)} title="Ofer to..."></i>
          </div>
        </div>
      );});
    }


    return (
      <div className="overlay" onClick={this.props.toggleDisplayMyOwnForm}>
        <div className="form-myOwn">
          <div className="form-header">My goals</div>
          <div className="form-body form-myOwn-body">
          {this.props.offeredToMe.length > 0 && <div className="offeredToMe">
              <div className="section-header">Goals offered to me</div>
              {headers()}
              {goalsOfferedToMe()}
            </div>}
            {this.props.createdByMe.length > 0 && <div className="myOffered">
              <div className="section-header">Goals submitted by me</div>
              {headers()}
              {goalsCreatedByMe()}
            </div>}
            {this.props.myApproved.length > 0 && <div className="myApproved">
              <div className="section-header">Approved goals</div>
              {headers()}
              {myApprovedGoals()}
            </div>}
            {this.state.formRemove && <FormRemove toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOwnerGoals={this.props.updateOwnerGoals}/>}
            {this.state.formNegotiateOwn && <FormNegotiateOwn toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal}/>}
            {this.state.formAcceptOffer && <FormAcceptOffer toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOwnerGoals={this.props.updateOwnerGoals}/>}
            {this.state.formNegotiateOffered && <FormNegotiateOffered toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal}/>}
            {this.state.formEdit && <FormEdit toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOwnerGoals={this.props.updateOwnerGoals}/>}
            {this.state.formOfferTo && <FormOfferTo toggleDisplayForm={this.toggleDisplayForm} goal={this.state.someGoal} updateOwnerGoals={this.props.updateOwnerGoals} children={this.props.children}/>}

          </div>
        </div>
      </div>
    )
  }
}