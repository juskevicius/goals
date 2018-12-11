import React from 'react';

export default class FormOfferTo extends React.Component {
  render() {

    const children = () => {
      let units = this.props.goal.owner.parentTo.map((unit) => { return <option key={unit.id} value={unit.id}>{unit.name}</option>;})
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
                  <select name="owner[0]">
                    <option value="">Choose</option>
                    {children()}
                  </select>
                  <label>Weight:</label>
                  <input type="text" name="weight[0]" placeholder="100%"></input>
                  <label>Initial score:</label>
                  <input type="text" name="oInitScore[0]" defaultValue={this.props.goal.initScore}></input>
                  <label>Target score:</label>
                  <input type="text" name="oTargScore[0]" defaultValue={this.props.goal.targScore}></input>
                  <label>Comment:</label>
                  <input type="text" name="oComment[0]" defaultValue={this.props.goal.comment}></input>
                  <input type="hidden" name="childTo[0]" value={this.props.goal.id}></input>
                  <input type="hidden" name="name[0]" value={this.props.goal.name}></input>
                </div>
                <input className="make-offer-btn" type="submit" value="Submit the offers"></input>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

/*
.col-xs-12.form-header 
        
                            select(name="owner[0]" onchange="selectUnit(0)")
                              option(value="") Choose
                              each child in children
                                option(value=child.id) #{child.name}
                        
    script.
      function selectUnit(nr) {
        if (nr == document.getElementsByClassName("offer-elm").length - 1) {                                  
          let offerToElm = document.getElementsByClassName("offer-elm")[0].cloneNode(true);
          offerToElm.getElementsByClassName("offer-list")[0].getElementsByTagName("select")[0].setAttribute("onchange", "selectUnit(" + (nr + 1) + ")");
          offerToElm.getElementsByClassName("offer-list")[0].getElementsByTagName("select")[0].setAttribute("name", "owner[" + (nr + 1) + "]");
          offerToElm.getElementsByClassName("weight")[0].getElementsByTagName("input")[0].setAttribute("name", "weight[" + (nr + 1) + "]");
          offerToElm.getElementsByClassName("offer-i-score")[0].getElementsByTagName("input")[0].setAttribute("name", "oInitScore[" + (nr + 1) + "]");
          offerToElm.getElementsByClassName("offer-t-score")[0].getElementsByTagName("input")[0].setAttribute("name", "oTargScore[" + (nr + 1) + "]");
          offerToElm.getElementsByClassName("offer-comment")[0].getElementsByTagName("input")[0].setAttribute("name", "oComment[" + (nr + 1) + "]");
          offerToElm.getElementsByClassName("offer-comment")[0].getElementsByTagName("input")[1].setAttribute("name", "childTo[" + (nr + 1) + "]");
          offerToElm.getElementsByClassName("offer-comment")[0].getElementsByTagName("input")[2].setAttribute("name", "name[" + (nr + 1) + "]");
          let makeOfferButton = document.getElementsByClassName("make-offer-btn")[0];
          document.getElementsByClassName("offer-group")[0].insertBefore(offerToElm, makeOfferButton);
        }
      }
*/