import React from 'react';
import axios from 'axios';

export default class FormAcceptOffer extends React.Component {
  
  handleSubmit = () => {
    axios.post('/acceptOffer', { id: this.props.goal._id })
    .then( response => {
      if (response.status === 200) {
        this.props.updateOwnerGoals();
        let event = new Event('fake');
        this.props.toggleDisplayForm("formAcceptOffer", null, event);
      }
    });
  }
  
  render() {
    return (
      <div className="overlay" onClick={(event) => this.props.toggleDisplayForm("formAcceptOffer", null, event)}>
        <div className="form-acceptOffer">
          <div className="form-header">Accept an offer</div>
          <div className="form-body">
            <form>
              <label>Goal:</label>
              <input type="text" value={this.props.goal.offer.name} readOnly></input>
              <label>Initial score:</label>
              <input type="text" value={this.props.goal.offer.initScore} readOnly></input>
              <label>Target score:</label>
              <input type="text" value={this.props.goal.offer.targScore} readOnly></input>
              <label>Comment:</label>
              <input type="text" value={this.props.goal.offer.comment} readOnly></input>
              <input className="form-btn" type="submit" value="Accept" onClick={this.handleSubmit}></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}