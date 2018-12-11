import React from 'react';

export default class FormEdit extends React.Component {
  render() {
    return (
      <div className="overlay2 form-edit-overlay">
        <div className="form-edit">
          <div className="form-header">Edit a goal</div>
          <div className="form-body">
            <form action="/edit" method="post" href="">
              <label>Goal:</label>
              <input type="text" name="name" defaultValue={this.props.goal.name}></input>
              <label>Initial score:</label>
              <input type="text" name="initScore" defaultValue={this.props.goal.initScore}></input>
              <label>Target score:</label>
              <input type="text" name="targScore" defaultValue={this.props.goal.targScore}></input>
              <label>Comment:</label>
              <input type="text" name="comment" defaultValue={this.props.goal.comment}></input>
              <input type="hidden" name="id" value={this.props.goal.id} readOnly></input>
              <input className="form-btn" type="submit" value="Save"></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}