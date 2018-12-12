import React from 'react';

export default class FormApprove extends React.Component {
  render() {
    return (
      <div className="overlay2 form-approve-overlay">
        <div className="form-approve">
          <div className="form-header">Approve a goal</div>
          <div className="form-body">
            <form action="/approve" method="post" href="">
              <label>Owner:</label>
              <input type="text" value={this.props.goal.owner.name} readOnly></input>
              <label>Goal:</label>
              <input type="text" value={this.props.goal.name} readOnly></input>
              <label>Initial score:</label>
              <input type="text" value={this.props.goal.initScore} readOnly></input>
              <label>Target score:</label>
              <input type="text" value={this.props.goal.targScore} readOnly></input>
              <label>Comment:</label>
              <input type="text" value={this.props.goal.comment} readOnly></input>
              <input type="hidden" name="id" value={this.props.goal.id} readOnly></input>
              <input className="form-btn" type="submit" value="Approve"></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}