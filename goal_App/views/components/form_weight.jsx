import React from 'react';

export default class FormWeight extends React.Component {
  render() {
    return (
      <div className="r-overlay">
        <div className="form-weight">
          <div className="form-header">Edit the weight of the current score</div>
          <div className="form-body">
            <form action="/addCurrentScore" method="post" href="">
              <label>Owner:</label>
              <input type="text" name="name" value={this.props.goal.owner.name} readOnly></input>
              <label>Goal:</label>
              <input type="text" name="name" value={this.props.goal.name} readOnly></input>
              <label>Weight:</label>
              <input type="text" name="weight" value={this.props.goal.weight}></input>
              <input type="hidden" name="id" value={this.props.goal.id}></input>
              <input className="form-btn" type="submit" value="Save"></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}