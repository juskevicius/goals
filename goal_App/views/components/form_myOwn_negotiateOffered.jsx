import React from 'react';

export default class FormNegotiateOffered extends React.Component {
  render() {
    return (
      <div className="overlay2 form-negotiateOffered-overlay">
        <div className="form-negotiateOffered">
          <div className="form-header">Negotiate an offer</div>
          <div className="form-body">
            <form action="/acceptOffer" method="post" href="" style={{paddingBottom: 15 + "%"}}>
              <label>An offer from {this.props.goal.offer.owner.name} {this.props.goal.offer.updated_formatted ? this.props.goal.offer.updated_formatted : this.props.goal.offer.created_formatted}:</label>
              <br/>
              <br/>
              <label>Goal:</label>
              <input type="text" value={this.props.goal.offer.name} readOnly></input>
              <label>Initial score:</label>
              <input type="text" value={this.props.goal.offer.initScore} readOnly></input>
              <label>Target score:</label>
              <input type="text" value={this.props.goal.offer.targScore} readOnly></input>
              <label>Comment:</label>
              <input type="text" value={this.props.goal.offer.comment} readOnly></input>
              <input type="hidden" name="id" value={this.props.goal.id} readOnly></input>
              <input className="form-btn" type="submit" value="Accept the offer"></input>
            </form>
            <form action="/negotiate" method="post" href="">
              <label>My response{this.props.goal.updated_formatted ? ' ' + this.props.goal.updated_formatted : ''}:</label>
              <br/>
              <br/>
              <label>Goal:</label>
              <input type="text" name="name" defaultValue={this.props.goal.name}></input>
              <label>Initial score:</label>
              <input type="text" name="initScore" defaultValue={this.props.goal.initScore}></input>
              <label>Target score:</label>
              <input type="text" name="targScore" defaultValue={this.props.goal.targScore}></input>
              <label>Comment:</label>
              <input type="text" name="comment" defaultValue={this.props.goal.comment}></input>
              <input type="hidden" name="id" value={this.props.goal.id}></input>
              <input className="form-btn" type="submit" value="Submit my response"></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}