import React from 'react';
import axios from 'axios';

export default class FormReject extends React.Component {
  
  handleSubmit = () => {
    axios.post('/reject', { id: this.props.goal._id })
      .then( response => {
        if (response.status === 200) {
          this.props.updateOthersGoals();
          if (this.props.goalInTheBackground === this.props.goal.childTo[0]) {
            this.props.updateGoalToDisplay();
          }
          let event = new Event('fake');
          this.props.toggleDisplayForm("formReject", null, event);
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
      <div className="overlay" onClick={(event) => this.props.toggleDisplayForm("formReject", null, event)}>
        <div className="form-reject">
          <div className="form-header">Reject a goal</div>
          <div className="form-body">
            <form>
              <label>Do you really want to reject this goal?
                <input type="text" name="name" value={this.props.goal.name} readOnly></input>
              </label>
              <label>Owner
                <input type="text" name="owner" value={this.props.goal.owner.name} readOnly></input>
              </label>
              <input className="form-btn" type="submit" value="Reject" onClick={this.handleSubmit}></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}