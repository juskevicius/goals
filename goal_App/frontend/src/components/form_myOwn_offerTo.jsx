import React from 'react';
import axios from 'axios';

export default class FormOfferTo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: [{
        owner: '',
        initScore: this.props.goal.initScore,
        targScore: this.props.goal.targScore,
        comment: this.props.goal.comment,
        weight: '',
        task: this.props.goal.task
      }] 
    }
  }

  handleChange = (event) => {
    let offerNr = Number(event.target.getAttribute('name').match(/\d+/g)[0]);
    let updKey = event.target.getAttribute('name').match(/[A-z]+\[/g)[0];
    updKey = updKey.substr(0, updKey.length - 1);
    let updValue = event.target.value;
    this.setState(prevstate => ({
      offers: [
         ...prevstate.offers.slice(0, offerNr),
         Object.assign({}, prevstate.offers[offerNr], { [updKey]: updValue }),
         ...prevstate.offers.slice(offerNr + 1)
      ]
    }));
    if (offerNr === (this.state.offers.length - 1) && updKey === "owner") {
      this.setState(prevstate => ({
        offers: [...prevstate.offers, {
          owner: '',
          initScore: this.props.goal.initScore,
          targScore: this.props.goal.targScore,
          comment: this.props.goal.comment,
          weight: '',
          task: this.props.goal.task
        }]
      }));
    }
  }

  handleTaskChange = (event) => {
    let offerNr = Number(event.target.getAttribute('name').match(/\d+/g)[0]);
    let taskNr = Number(event.target.getAttribute('name').match(/\d+/g)[1]);
    let updKey = event.target.getAttribute('name').match(/\[[A-z]+/g)[0]; /* [description] or [weight] */
    updKey = updKey.substr(1, updKey.length - 2); /* description or weight */
    let updValue = event.target.value;
    this.setState(prevstate => ({
      offers: [
         ...prevstate.offers.slice(0, offerNr),
         Object.assign({}, prevstate.offers[offerNr], { task: [
            ...prevstate.offers[offerNr].task.slice(0, taskNr),
            Object.assign({}, prevstate.offers[offerNr].task[taskNr], { [updKey]: updValue }),
            ...prevstate.offers[offerNr].task.slice(taskNr + 1)
          ] }),
         ...prevstate.offers.slice(offerNr + 1)
      ]
    }));
    if (taskNr === (this.state.offers[offerNr].task.length - 1) && updKey === "description") {
      this.setState(prevstate => ({
        offers: [
           ...prevstate.offers.slice(0, offerNr),
           Object.assign({}, prevstate.offers[offerNr], { task: [
              ...prevstate.offers[offerNr].task,
              {nr: prevstate.offers[offerNr].task.length, description: "", weight: ""}
            ] }),
           ...prevstate.offers.slice(offerNr + 1)
        ]
      }));
    }
  }

  handleSubmit = () => {
    const { offers } = this.state;
    axios.post('/offerTo', {
      childTo: this.props.goal._id, name: this.props.goal.name, offers
    }).then(
      response => {
        if (response.status === 200) {
          /*this.props.updateOwnerGoals();    to update others goals? */ 
          let event = new Event('fake');
          this.props.toggleDisplayForm("formOfferTo", null, event);
        }
      }
    );
  }
  
  render() {

    const offers = () => {
      return this.state.offers.map((offer, index) => { return (
        <div className="offer-elm" key={offer.owner}>
          <label>Offer to:</label>
          <label>Weight:</label>
          <select className="offer-unit" name={"owner[" + index + "]"} value={offer.owner} onChange={this.handleChange}>
            <option value="">Choose</option>
            {this.props.children.map((unit) => { return <option key={unit._id} value={unit._id}>{unit.name}</option>;})}
          </select>
          <input type="text" name={"weight[" + index + "]"} placeholder="100%" value={offer.weight || ''} onChange={this.handleChange}></input>
          <label>Initial score:</label>
          <label>Target score:</label>
          <input type="text" name={"initScore[" + index + "]"} value={offer.initScore || ''} onChange={this.handleChange}></input>
          <input type="text" name={"targScore[" + index + "]"} value={offer.targScore || ''} onChange={this.handleChange}></input>
          <label>Comment:</label>
          <input type="text" name={"comment[" + index + "]"} value={offer.comment || ''} onChange={this.handleChange}></input>
          <div className="task-group">
            {tasks(offer.task, index, false)}
            <div className="last-task-row"></div>
          </div>
        </div>
      );});
    }

    const tasks = (tasksToList, ownerNr, readOnly) => {
      return tasksToList.map((task, index) => { return (
        <div className="task-row" key={task._id || task.nr}>
          <div className="descr-block">
            <label className="task task-label-descr">Task nr {index + 1}:</label>
            <input className="task task-input-descr" type="text" name={"task[" + ownerNr + "][" + index + "][description]"} value={task.description} onChange={this.handleTaskChange} readOnly={readOnly}></input>
          </div>
          <div className="weight-block">
            <label className="task task-label-weight">Weight</label> 
            <input className="task task-input-weight" type="text" name={"task[" + ownerNr + "][" + index + "][weight]"} value={task.weight || ''} onChange={this.handleTaskChange} readOnly={readOnly}></input>
          </div>
        </div>
      );});
    }

    return (
      <div className="overlay" onClick={(event) => this.props.toggleDisplayForm("formOfferTo", null, event)}>
        <div className="form-offerTo">
          <div className="form-header">Offer the goal</div>
          <div className="form-body">
            <label>Goal:</label>
            <input type="text" value={this.props.goal.name} readOnly></input>
            <label>Initial score:</label>
            <input type="text" value={this.props.goal.initScore || ''} readOnly></input>
            <label>Target score:</label>
            <input type="text" value={this.props.goal.targScore || ''} readOnly></input>
            <label>Comment:</label>
            <input type="text" value={this.props.goal.comment || ''} readOnly></input>
            {this.props.goal.task.length > 0 && <div className="task-group">
              {tasks(this.props.goal.task, null, true)}
              <div className="last-task-row"></div>
            </div>}
            <form>
              <div className="offer-group">
                {offers()}
                <input className="form-btn make-offer-btn" type="submit" value="Submit the offers" onClick={this.handleSubmit}></input>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}