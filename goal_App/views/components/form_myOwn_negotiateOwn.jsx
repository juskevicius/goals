import React from 'react';

export default class FormNegotiateOwn extends React.Component {
  render() {
    return (
      <div className="overlay2 form-negotiateOwn-overlay">
        <div className="form-negotiateOwn">
          <div className="form-header">Negotiate my submitted goal</div>
          <div className="form-body">
            {this.props.goal.offer.updated_formatted &&
            <div><label>An offer from {this.props.goal.offer.owner.owner.name} ({this.props.goal.offer.owner.name}) {this.props.goal.offer.updated_formatted}:</label>
            <br/>
            <br/>
            <label>Goal:</label>
            <input type="text" value={this.props.goal.offer.name} readOnly></input>
            <label>Initial score:</label>
            <input type="text" value={this.props.goal.offer.initScore} readOnly></input>
            <label>Target score:</label>
            <input type="text" value={this.props.goal.offer.targScore} readOnly></input>
            <label>Comment:</label>
            <input type="text" value={this.props.goal.offer.comment} readOnly></input></div>}
            <form action="/negotiate" method="post" href="">
              <label>My goal{this.props.goal.updated_formatted ? ', ' + this.props.goal.updated_formatted : ''}:</label>
              <br/>
              <br/>
              <label>Goal:</label>
              <input type="text" defaultValue={this.props.goal.name}></input>
              <label>Initial score:</label>
              <input type="text" defaultValue={this.props.goal.initScore}></input>
              <label>Target score:</label>
              <input type="text" defaultValue={this.props.goal.targScore}></input>
              <label>Comment:</label>
              <input type="text" defaultValue={this.props.goal.comment}></input>
              <input type="hidden" name="id" value={this.props.goal.id} readOnly></input>
              <input className="form-btn" type="submit" value="Submit a new response"></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}