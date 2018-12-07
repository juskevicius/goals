import React from 'react';

export default class FormCurrent extends React.Component {
  render() {
    const currDate = Date(Date.now());
    return (
      <div className="r-overlay">
        <div className="form-current">
          <div className="form-header">Add current score</div>
          <div className="form-body">
            <form action="/addCurrentScore" method="post" href="">
              <label>Goal:</label>
              <input type="text" name="name" value={this.props.goal.name} readOnly></input>
              <label>Current score:</label>
              <input type="text" name="value"></input>
              <label>Date:</label>
              <input id="date-picker" type="date" name="date"></input>
              <input type="hidden" name="id" value={this.props.goal.history.id}></input>
              <input className="form-btn" type="submit" value="Add"></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
