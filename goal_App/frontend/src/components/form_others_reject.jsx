import React from 'react';
import axios from 'axios';

export default class FormReject extends React.Component {
  
  handleSubmit = () => {
    axios.post('/reject', { id: this.props.goal._id })
      .then( response => {
        if (response.status === 200) {
          if (response.data.constructor === Array) {
            for (let i = 0; i < response.data.length; i++) {
              alert("Something went wrong with the field '" + response.data[i].param + "'\nError message: " + response.data[i].msg);
            }
          }
          this.props.updateOthersGoals();
          let event = new Event('fake');
          this.props.toggleDisplayForm("formReject", null, event);
        }
      })
      .catch(error => {
        if (error.response) {
          alert(error.response.data);
        }
      });
  }
  
  render() {
    return (
      <div className="overlay" onClick={(event) => this.props.toggleDisplayForm("formReject", null, event)}>
        <div className="form-reject">
          <div className="form-header">Reject a goal</div>
          <div className="form-body">
            <form action="/reject" method="post" href="">
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