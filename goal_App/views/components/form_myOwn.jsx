import React from 'react';

export default class FormMyOwn extends React.Component {
  render() {


    let displayGoals = (goals, property) => {
      let goalsToDisplay = goals.map((goal) => {return <li key={goal.id}>{goal[property]}</li>;} );
      return <ul>{goalsToDisplay}</ul>;
    }

    let displayActions = (goals) => {
      let actionsToDisplay = goals.map((goal) => { return <li key={goal.id}><a href={"/acceptOffer/" + goal.id} title="Accept"><i className="far fa-check-square"></i></a><a href={"/negotiateOffered/" + goal.id} title="Negotiate"><i className="far fa-comment"></i></a><a href={"/delete/" + goal.id} title="Reject"><i className="fa fa-remove"></i></a></li>;});
      return <ul>{actionsToDisplay}</ul>;
    }

    return (
      <div className="r-overlay">
        <div className="form-myOwn">
          <div className="form-header">My goals</div>
          <div className="form-body form-myOwn-body">

            {this.props.offeredToMe.length > 0 && <div className="offeredToMe">
              <div className="section-header">Goals offered to me</div>
              <div className="col-header col-header1">Goal</div>
              <div className="col-header col-header2">Initial score</div>
              <div className="col-header col-header3">Target score</div>
              <div className="col-header col-header4">Status</div>
              <div className="col-header col-header5">Actions</div>
              <div className="col-data col-data1">
                {displayGoals(this.props.offeredToMe, "name")}
              </div>
              <div className="col-data col-data2">
                {displayGoals(this.props.offeredToMe, "initScore")}
              </div>
              <div className="col-data col-data3">
                {displayGoals(this.props.offeredToMe, "targScore")}
              </div>
              <div className="col-data col-data4">
                {displayGoals(this.props.offeredToMe, "status")}
              </div>
              <div className="col-data col-data5">
                {displayActions(this.props.offeredToMe)}
              </div>
            </div>}

            {this.props.createdByMe.length > 0 && <div className="myOffered">
              <div className="section-header">Goals offered by me</div>
              <div className="col-header col-header1">Goal</div>
              <div className="col-header col-header2">Initial score</div>
              <div className="col-header col-header3">Target score</div>
              <div className="col-header col-header4">Status</div>
              <div className="col-header col-header5">Actions</div>
              <div className="col-data col-data1">
                {displayGoals(this.props.createdByMe, "name")}
              </div>
              <div className="col-data col-data2">
                {displayGoals(this.props.createdByMe, "initScore")}
              </div>
              <div className="col-data col-data3">
                {displayGoals(this.props.createdByMe, "targScore")}
              </div>
              <div className="col-data col-data4">
                {displayGoals(this.props.createdByMe, "status")}
              </div>
              <div className="col-data col-data5">
                {displayActions(this.props.createdByMe)}
              </div>
            </div>}

            {this.props.myApproved.length > 0 && <div className="myApproved">
              <div className="section-header">Approved goals</div>
              <div className="col-header col-header1">Goal</div>
              <div className="col-header col-header2">Initial score</div>
              <div className="col-header col-header3">Target score</div>
              <div className="col-header col-header4">Status</div>
              <div className="col-header col-header5">Actions</div>
              <div className="col-data col-data1">
                {displayGoals(this.props.myApproved, "name")}
              </div>
              <div className="col-data col-data2">
                {displayGoals(this.props.myApproved, "initScore")}
              </div>
              <div className="col-data col-data3">
                {displayGoals(this.props.myApproved, "targScore")}
              </div>
              <div className="col-data col-data4">
                {displayGoals(this.props.myApproved, "status")}
              </div>
              <div className="col-data col-data5">
                {displayActions(this.props.myApproved)}
              </div>
            </div>}

          </div>
        </div>
      </div>
    )
  }
}