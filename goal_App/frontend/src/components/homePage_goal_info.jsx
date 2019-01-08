import React from 'react';

export default class GoalInfo extends React.Component {
 
  render() {
    return (
      <div className="goal-info">
        <label>Goal:
          <input type="text" name="name" onChange={this.props.handleGoalDetails} onBlur={this.props.submitGoalDetails} value={this.props.goal.name} required maxLength="100"></input>
        </label>
        <label>Owner:
          <input type="text" value={this.props.goal.owner.name} readOnly></input>
        </label>
        <label>Initial score:
          <input type="number" name="initScore" onChange={this.props.handleGoalDetails} onBlur={this.props.submitGoalDetails} value={this.props.goal.initScore || ''} maxLength="11"></input>
        </label>
        <label>Target score:
          <input type="number" name="targScore" onChange={this.props.handleGoalDetails} onBlur={this.props.submitGoalDetails} value={this.props.goal.targScore || ''} maxLength="11"></input>
        </label>
        <label>Comment:
          <input type="text" name="comment" onChange={this.props.handleGoalDetails} onBlur={this.props.submitGoalDetails} value={this.props.goal.comment || ''} maxLength="400"></input>
        </label>
        <label>Created:
          <input type="text" value={this.props.goal.created_formatted} readOnly></input>
        </label>
        {this.props.goal.updated_formatted && <label>Updated:
          <input type="text" value={this.props.goal.updated_formatted} readOnly></input>
        </label>}
      </div>
    )
  }
}

/*


              
              
              

*/