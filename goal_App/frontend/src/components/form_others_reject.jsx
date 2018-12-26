import React from 'react';
import axios from 'axios';

export default class FormReject extends React.Component {
  
  handleSubmit = () => {
    axios.post('/reject', {
      id: this.props.goal._id
    }).then( response => {
      if (response.status === 200) {
        this.props.updateOthersGoals();
        let event = new Event('fake');
        this.props.toggleDisplayForm("formReject", null, event);
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
              <label>Do you really want to reject this goal?</label>
              <input type="text" name="name" value={this.props.goal.name} readOnly></input>
              <label>Owner</label>
              <input type="text" name="owner" value={this.props.goal.owner.name} readOnly></input>
              <input className="form-btn" type="submit" value="Reject" onClick={this.handleSubmit}></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}