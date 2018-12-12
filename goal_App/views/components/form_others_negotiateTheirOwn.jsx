import React from 'react';

export default class FormNegotiateTheirOwn extends React.Component {
  render() {
    return (
      <div className="overlay2 form-negotiateTheirOwn-overlay">
        <div className="form-negotiateTheirOwn">
          <div className="form-header">Negotiate a goal</div>
          <div className="form-body">
            
            <label>A goal set by {this.props.goal.owner.name} {this.props.goal.updated_formatted ? this.props.goal.offer.updated_formatted : this.props.goal.offer.created_formatted}:</label>
            <br/>
            <br/>
            <label>Goal:</label>
            <input type="text" value={this.props.goal.name} readOnly></input>
            <label>Initial score:</label>
            <input type="text" value={this.props.goal.initScore} readOnly></input>
            <label>Target score:</label>
            <input type="text" value={this.props.goal.targScore} readOnly></input>
            <label>Comment:</label>
            <input type="text" value={this.props.goal.comment} readOnly></input>
            
            <form action="/negotiateOthers" method="post" href="">
              <label>My offer{this.props.goal.offer.updated_formatted ? ', ' + this.props.goal.offer.updated_formatted : ''}:</label>
              <br/>
              <br/>
              <label>Goal:</label>
              <input type="text" name="name" defaultValue={this.props.goal.offer.name}></input>
              <label>Initial score:</label>
              <input type="text" name="initScore" defaultValue={this.props.goal.offer.initScore}></input>
              <label>Target score:</label>
              <input type="text" name="targScore" defaultValue={this.props.goal.offer.targScore}></input>
              <label>Comment:</label>
              <input type="text" name="comment" defaultValue={this.props.goal.offer.comment}></input>
              <input type="hidden" name="id" value={this.props.goal.id}></input>
              <input className="form-btn" type="submit" value="Submit a new offer"></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}