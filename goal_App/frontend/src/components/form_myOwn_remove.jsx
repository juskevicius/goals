import React from 'react';
import axios from 'axios';

export default class FormRemove extends React.Component {
  
  handleSubmit = () => {
    axios.post('/delete', {id: this.props.goal._id})
      .then(response => {
        if (response.status === 200) {
          this.props.updateOwnerGoals();
          let event = new Event('fake');
          this.props.toggleDisplayForm("formRemove", null, event);
        }
      })
      .catch(error => {
        const errorMessage = error.response.data.errors.message;
        if (errorMessage.constructor === Array) {
          for (let i = 0; i < errorMessage.length; i++) {
            alert("Something went wrong with the field '" + errorMessage[i].param + "'\nError message: " + errorMessage[i].msg);
          }
        } else {
          alert(errorMessage);
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
              <label>Do you really want to remove this goal?
                <input type="text" name="name" value={this.props.goal.name} readOnly></input>
              </label>
              <input className="form-btn" type="submit" onClick={this.handleSubmit} value="Remove"></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}