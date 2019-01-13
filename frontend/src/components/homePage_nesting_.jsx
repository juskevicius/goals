import React from 'react';
import ChildrenGoals from './homePage_nesting_goals';
import Tasks from './homePage_nesting_tasks';

export default class Nesting extends React.Component {

  render() {
    return (
      <div>
        <ChildrenGoals children={this.props.children} updateGoalToDisplay={this.props.updateGoalToDisplay}/>
        <Tasks children={this.props.children} task={this.props.task} id={this.props.id} updateGoalToDisplay={this.props.updateGoalToDisplay}/>
      </div>
    );
  }
}