import React from 'react';
import FormRemove from './form_myOwn_remove.jsx';
import FormAcceptOffer from './form_myOwn_acceptOffer.jsx';
import FormNegotiateOffered from './form_myOwn_negotiateOffered.jsx';
import FormNegotiateOwn from './form_myOwn_negotiateOwn.jsx';
import FormEdit from './form_myOwn_edit.jsx';
import FormOfferTo from './form_myOwn_offerTo.jsx';
export default class FormMyOwn extends React.Component {
  
  render() {

    const headers = () => {
      return <div className="col-headers-row"><div className="col-header col-header-goal-name">Goal</div><div className="col-header">Initial score</div><div className="col-header">Target score</div><div className="col-header">Status</div><div className="col-header">Actions</div></div>;
    }

    const goalsOfferedToMe = () => {
      let goals = this.props.offeredToMe.map((goal) => { return  <div className="col-data-row" key={goal.id}><div className="col-data col-data-goal-name">{goal.name}</div><div className="col-data">{goal.initScore}</div><div className="col-data">{goal.targScore}</div><div className="col-data">{goal.status}</div><div className="col-data"><i className="far fa-check-square triggerAccept" title="Accept"></i><i className="far fa-comment triggerNegotiateOffered" title="Negotiate"></i><i className="fa fa-remove triggerRemove" title="Reject"></i></div><FormRemove goal={goal}/><FormAcceptOffer goal={goal}/><FormNegotiateOffered goal={goal}/></div>;});
      return goals;
    }

    const goalsCreatedByMe = () => {
      let goals = this.props.createdByMe.map((goal) => { return  <div className="col-data-row" key={goal.id}><div className="col-data col-data-goal-name">{goal.name}</div><div className="col-data">{goal.initScore}</div><div className="col-data">{goal.targScore}</div><div className="col-data">{goal.status}</div><div className="col-data"><i className="far fa-comment triggerNegotiateOwn" title="Negotiate"></i><i className="fa fa-remove triggerRemove" title="Reject"></i></div><FormRemove goal={goal}/><FormNegotiateOwn goal={goal}/></div>;});
      return goals;
    }

    const myApprovedGoals = () => {
      let goals = this.props.myApproved.map((goal) => { return  <div className="col-data-row" key={goal.id}><div className="col-data col-data-goal-name">{goal.name}</div><div className="col-data">{goal.initScore}</div><div className="col-data">{goal.targScore}</div><div className="col-data">{goal.status}</div><div className="col-data"><i className="fa fa-edit triggerEdit" title="Edit"></i><i className="fa fa-remove triggerRemove" title="Delete"></i><i className="fa fa-share-alt triggerOfferTo" title="Ofer to..."></i></div><FormRemove goal={goal}/><FormEdit goal={goal}/><FormOfferTo goal={goal} children={this.props.currentGoal.owner.parentTo}/></div>;});
      return goals;
    }

    return (
      <div className="r-overlay form-myOwn-overlay">
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
            
          </div>
        </div>
      </div>
    )
  }
}