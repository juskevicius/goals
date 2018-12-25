import React from 'react';
import axios from 'axios';

export default class FormRemove extends React.Component {
  
  handleSubmit = () => {
    axios.post('/delete', {
      id: this.props.goal._id
    }).then( response => {
      if (response.status === 200) {
        this.props.updateOwnerGoals();
        let event = new Event('fake');
        this.props.toggleDisplayForm("formRemove", null, event);
      }
    });
  }
  
  render() {
    return (
      <div className="overlay" onClick={(event) => this.props.toggleDisplayForm("formRemove", null, event)}>
        <div className="form-remove">
          <div className="form-header">Remove a goal</div>
          <div className="form-body">
            <form>
              <label>Do you really want to remove this goal?</label>
              <input type="text" name="name" value={this.props.goal.name} readOnly></input>
              <input className="form-btn" type="submit" onClick={this.handleSubmit} value="Remove"></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}