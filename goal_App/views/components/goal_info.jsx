import React from 'react';

export default class GoalInfo extends React.Component {
  render() {
    
    
    return (
      <div>
        <p>Goal:</p>
        <p>{this.props.info.name}</p>
        <p>Owner:</p>
        <p>{this.props.info.owner.name} ({this.props.info.owner.owner.name})</p>
        <p>Initial value:</p>
        <p>{this.props.info.initScore}</p>
        <p>Target value:</p>
        <p>{this.props.info.targScore}</p>
        <p>Details:</p>
        <p>{this.props.info.comment}</p>
        <p>Created:</p>
        <p>{this.props.info.created_formatted}</p>
        {this.props.info.updated && <p>Updated:</p> }
        <p>{this.props.info.updated_formatted}</p>
      </div>
    )
  }
}