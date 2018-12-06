import React from 'react';

export default class GoalInfo extends React.Component {
  render() {
    return (
      <div>
        <p>Goal:</p>
        <p>{this.props.goal.name}</p>
        <p>Owner:</p>
        <p>{this.props.goal.owner.name} ({this.props.goal.owner.owner.name})</p>
        <p>Initial value:</p>
        <p>{this.props.goal.initScore}</p>
        <p>Target value:</p>
        <p>{this.props.goal.targScore}</p>
        <p>Details:</p>
        <p>{this.props.goal.comment}</p>
        <p>Created:</p>
        <p>{this.props.goal.created_formatted}</p>
        {this.props.goal.updated && <p>Updated:</p> }
        <p>{this.props.goal.updated_formatted}</p>
      </div>
    )
  }
}