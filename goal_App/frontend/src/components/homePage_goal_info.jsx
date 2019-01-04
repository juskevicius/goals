import React from 'react';

export default class GoalInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.goal.name,
      owner: this.props.goal.owner.name,
      initScore: this.props.goal.initScore,
      targScore: this.props.goal.targScore,
      comment: this.props.goal.comment,
      created: this.props.goal.created_formatted,
      updated: this.props.goal.updated_formatted
    }
  }
  
  
  render() {
    return (
      <div>
        <h4>Goal:</h4>
        <p>{this.state.name}</p>
        <h4>Owner:</h4>
        <p>{this.state.owner}</p>
        {this.state.initScore && <h4>Initial value:</h4>}
        <p>{this.state.initScore}</p>
        {this.state.targScore && <h4>Target value:</h4>}
        <p>{this.state.targScore}</p>
        {this.state.comment && <h4>Details:</h4>}
        <p>{this.state.comment}</p>
        <h4>Created:</h4>
        <p>{this.state.created}</p>
        {this.state.updated && <h4>Updated:</h4>}
        <p>{this.state.updated}</p>
      </div>
    )
  }
}