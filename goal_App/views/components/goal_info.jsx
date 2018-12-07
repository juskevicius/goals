import React from 'react';

export default class GoalInfo extends React.Component {
  render() {
    return (
      <div className="l-main2">
        <h4>Goal:</h4>
        <p>{this.props.goal.name}</p>
        <h4>Owner:</h4>
        <p>{this.props.goal.owner.name} ({this.props.goal.owner.owner.name})</p>
        <h4>Initial value:</h4>
        <p>{this.props.goal.initScore}</p>
        <h4>Target value:</h4>
        <p>{this.props.goal.targScore}</p>
        <h4>Details:</h4>
        <p>{this.props.goal.comment}</p>
        <h4>Created:</h4>
        <p>{this.props.goal.created_formatted}</p>
        {this.props.goal.updated && <h4>Updated:</h4> }
        <p>{this.props.goal.updated_formatted}</p>
      </div>
    )
  }
}