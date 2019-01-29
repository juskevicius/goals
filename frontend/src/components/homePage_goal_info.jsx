import React from 'react';

export default class GoalInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    this.setState({
      textareaHeight: this.textarea.scrollHeight - 12
    })
  }

  resizeTextarea = () => {
    this.setState({
      textareaHeight: this.textarea.scrollHeight - 12
    })
  }
 
  render() {
    return (
      <div className='goal-info'>
        <label>Goal:
          <input type='text' name='name' onChange={this.props.handleGoalDetails} onBlur={this.props.submitGoalDetails} value={this.props.goal.name} required maxLength='100'></input>
        </label>
        {this.props.goal.status !== 'Approved' &&
        <label style={{ color: 'red' }}>Status:
          <input type='text' value={this.props.goal.status} style={{ color: 'red' }} readOnly></input>
        </label>}
        <label>Owner:
          <input type='text' value={this.props.goal.owner.name} readOnly></input>
        </label>
        <label>Initial score:
          <input type='number' name='initScore' onChange={this.props.handleGoalDetails} onBlur={this.props.submitGoalDetails} value={this.props.goal.initScore || ''} maxLength='11'></input>
        </label>
        <label>Target score:
          <input type='number' name='targScore' onChange={this.props.handleGoalDetails} onBlur={this.props.submitGoalDetails} value={this.props.goal.targScore || ''} maxLength='11'></input>
        </label>
        <label>Comment:
          <textarea ref={el => this.textarea = el} type='text' name='comment' style={{ height: this.state.textareaHeight + 'px', padding: 6 + 'px' }} onChange={event => { this.props.handleGoalDetails(event); this.resizeTextarea(event); }} onBlur={this.props.submitGoalDetails} value={this.props.goal.comment || ''} maxLength='400'></textarea>
        </label>
        <label>Created:
          <input type='text' value={this.props.goal.created_formatted} readOnly></input>
        </label>
        {this.props.goal.updated_formatted && <label>Updated:
          <input type='text' value={this.props.goal.updated_formatted} readOnly></input>
        </label>}
      </div>
    )
  }
}
