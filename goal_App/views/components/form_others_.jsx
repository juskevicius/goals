import React from 'react';
import FormReject from './form_others_reject.jsx';
import FormApprove from './form_others_approve.jsx';
import FormNegotiateMyOffered from './form_others_negotiateMyOffered.jsx';
import FormNegotiateTheiOwn from './form_others_negotiateTheirOwn.jsx';

export default class FormOthers extends React.Component {
  
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
      let goals = this.props.offeredByMe.map((goal) => { return  (
        <div className="col-data-row" key={goal.id}>
          <div className="col-data col-data-goal-name">{goal.offer.name}</div>
          <div className="col-data">{goal.owner.name}</div>
          <div className="col-data">{goal.offer.initScore}</div>
          <div className="col-data">{goal.offer.targScore}</div>
          <div className="col-data">{goal.status}</div>
          <div className="col-data">
            <i className="far fa-comment triggerNegotiateMyOffered" title="Negotiate" style={goal.updated > goal.offer.updated || (!goal.offer.updated && goal.updated) ? {color: '#515ad8', fontWeight: 'bold'} : {}}></i>
            <i className="fa fa-remove triggerReject" title="Remove"></i>
          </div>
          <FormNegotiateMyOffered goal={goal}/>
          <FormReject goal={goal}/>
        </div>
        );});
      return goals;
    }

    const goalsCreatedByOthers = () => {
      let goals = this.props.createdByOthers.map((goal) => { return  (
        <div className="col-data-row" key={goal.id}>
          <div className="col-data col-data-goal-name">{goal.name}</div>
          <div className="col-data">{goal.owner.name}</div>
          <div className="col-data">{goal.initScore}</div>
          <div className="col-data">{goal.targScore}</div>
          <div className="col-data">{goal.status}</div>
          <div className="col-data">
            <i className="far fa-check-square triggerApprove" title="Approve"></i>
            <i className="far fa-comment triggerNegotiateTheirOwn" title="Negotiate" style={goal.updated > goal.offer.updated || !goal.offer.updated ? {color: '#515ad8', fontWeight: 'bold'} : {}}></i>
            <i className="fa fa-remove triggerReject" title="Reject"></i>
          </div>
          <FormApprove goal={goal}/>
          <FormNegotiateTheiOwn goal={goal}/>
          <FormReject goal={goal}/>
        </div>
        );});
      return goals;
    }


    return (
      <div className="r-overlay form-others-overlay" style={this.props.display ? {display: 'initial'} : {display: 'none'}}>
        <div className="form-others">
          <div className="form-header">Unapproved others' goals</div>
          <div className="form-body form-others-body">
            {this.props.offeredByMe.length > 0 && <div className="offeredByMe">
              <div className="section-header">Offered by me</div>
              {headers1()}
              {goalsOfferedByMe()}
            </div>}
            {this.props.createdByOthers.length > 0 && <div className="createdByOthers">
              <div className="section-header">Created by others</div>
              {headers2()}
              {goalsCreatedByOthers()}
            </div>}
          </div>
        </div>
      </div>
    )
  }
}