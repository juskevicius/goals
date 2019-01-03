import React from 'react';

export default class GoalInfo extends React.Component {
  render() {
    return (
      <div>
        <h4>Goal:</h4>
        <p>{this.props.goal.name}</p>
        <h4>Owner:</h4>
        <p>{this.props.goal.owner.name}</p>
        {this.props.goal.initScore && 
        <h4>Initial value:</h4>}
        <p>{this.props.goal.initScore}</p>
        {this.props.goal.targScore && <h4>Target value:</h4>}
        <p>{this.props.goal.targScore}</p>
        {this.props.goal.comment && <h4>Details:</h4>}
        <p>{this.props.goal.comment}</p>
        <h4>Created:</h4>
        <p>{this.props.goal.created_formatted}</p>
        {this.props.goal.updated && <h4>Updated:</h4>}
        <p>{this.props.goal.updated_formatted}</p>
      </div>
    )
  }
}