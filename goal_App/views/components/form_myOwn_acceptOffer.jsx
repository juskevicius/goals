import React from 'react';

export default class FormAcceptOffer extends React.Component {
  render() {
    return (
      <div className="overlay2 form-acceptOffer-overlay">
        <div className="form-acceptOffer">
          <div className="form-header">Accept an offer</div>
          <div className="form-body">
            <form action="/acceptOffer" method="post" href="">
              <label>Goal:</label>
              <input type="text" value={this.props.goal.offer.name} readOnly></input>
              <label>Initial score:</label>
              <input type="text" value={this.props.goal.offer.initScore} readOnly></input>
              <label>Target score:</label>
              <input type="text" value={this.props.goal.offer.targScore} readOnly></input>
              <label>Comment:</label>
              <input type="text" value={this.props.goal.offer.comment} readOnly></input>
              <input type="hidden" name="id" value={this.props.goal.id}></input>
              <input className="form-btn" type="submit" value="Accept"></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}