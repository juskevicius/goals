import React from 'react';

export default class FormRemove extends React.Component {
  render() {
    return (
      <div className="overlay2 form-remove-overlay">
        <div className="form-remove">
          <div className="form-header">Remove a goal</div>
          <div className="form-body">
            <form action="/delete" method="post" href="">
              <label>Do you really want to remove this goal?</label>
              <input type="text" name="name" value={this.props.goal.name} readOnly></input>
              <input type="hidden" name="id" value={this.props.goal.id} readOnly></input>
              <input className="form-btn" type="submit" value="Remove"></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}