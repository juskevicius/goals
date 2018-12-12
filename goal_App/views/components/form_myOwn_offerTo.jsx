import React from 'react';

export default class FormOfferTo extends React.Component {
  render() {

    const children = () => {
      let units = this.props.children.map((unit) => { return <option key={unit.id} value={unit.id}>{unit.name}</option>;})
      return units;
    }

    return (
      <div className="overlay2 form-offerTo-overlay">
        <div className="form-offerTo">
          <div className="form-header">Offer the goal</div>
          <div className="form-body">
            <label>Goal:</label>
            <input type="text" value={this.props.goal.name} readOnly></input>
            <label>Initial score:</label>
            <input type="text" value={this.props.goal.initScore} readOnly></input>
            <label>Target score:</label>
            <input type="text" value={this.props.goal.targScore} readOnly></input>
            <label>Comment:</label>
            <input type="text" value={this.props.goal.comment} readOnly></input>
            <input className="form-btn" type="submit" value="Accept"></input>
            <form action="/offerTo" method="post" href="">
              <div className="offer-group">
                <div className="offer-elm">
                  <label>Offer to:</label>
                  <label>Weight:</label>
                  <select className="offer-unit" name="owner[0]">
                    <option value="">Choose</option>
                    {children()}
                  </select>
                  <input type="text" name="weight[0]" placeholder="100%"></input>
                  <label>Initial score:</label>
                  <label>Target score:</label>
                  <input type="text" name="oInitScore[0]" defaultValue={this.props.goal.initScore}></input>
                  <input type="text" name="oTargScore[0]" defaultValue={this.props.goal.targScore}></input>
                  <label>Comment:</label>
                  <input type="text" name="oComment[0]" defaultValue={this.props.goal.comment}></input>
                  <input type="hidden" name="childTo[0]" value={this.props.goal.id}></input>
                  <input type="hidden" name="name[0]" value={this.props.goal.name}></input>
                </div>
                <input className="form-btn make-offer-btn" type="submit" value="Submit the offers"></input>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}