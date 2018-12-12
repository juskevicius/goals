import React from 'react';

export default class FormReject extends React.Component {
  render() {
    return (
      <div className="overlay2 form-reject-overlay">
        <div className="form-reject">
          <div className="form-header">Reject a goal</div>
          <div className="form-body">
            <form action="/reject" method="post" href="">
              <label>Do you really want to reject this goal?</label>
              <input type="text" name="name" value={this.props.goal.name} readOnly></input>
              <label>Owner</label>
              <input type="text" name="owner" value={this.props.goal.owner.name} readOnly></input>
              <input type="hidden" name="id" value={this.props.goal.id} readOnly></input>
              <input className="form-btn" type="submit" value="Reject"></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}