import React from 'react';
import axios from 'axios';

export default class FormNegotiateOwn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.goal.name,
      initScore: this.props.goal.initScore,
      targScore: this.props.goal.targScore,
      comment: this.props.goal.comment,
      task: this.props.goal.task,
    }
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }
  
  handleTaskChange = (event) => {
    let taskNr = Number(event.target.getAttribute('name').match(/\d+/g)[0]);
    let updKey = event.target.getAttribute('name').match(/\[[A-z]+/g)[0]; /* [description] or [weight] */
    updKey = updKey.substr(1, updKey.length - 2); /* description or weight */
    let updValue = event.target.value;
    this.setState(prevstate => ({
      task: [
         ...prevstate.task.slice(0, taskNr),
         Object.assign({}, prevstate.task[taskNr], { [updKey]: updValue }),
         ...prevstate.task.slice(taskNr + 1)
      ]
    }));
    if (taskNr === (this.state.task.length - 1) && updKey === "description") {
      this.setState(prevstate => ({
        task: [...prevstate.task, {nr: prevstate.task.length, description: '', weight: ''}]
      }));
    }
  }

  handleSubmit1 = () => {
    axios.post('/acceptOffer', {id: this.props.goal._id})
      .then(response => {
        if (response.status === 200) {
          this.props.updateOwnerGoals();
          let event = new Event('fake');
          this.props.toggleDisplayForm("formNegotiateOwn", null, event);
        }
      });
  }

  handleSubmit2 = () => {
    const { name, initScore, targScore, comment, task } = this.state;
    axios.post('/negotiate', {
      id: this.props.goal._id, 
      name, 
      initScore, 
      targScore, 
      comment, 
      task 
    })
      .then(response => {
        if (response.status === 200) {
          this.props.updateOwnerGoals();
          let event = new Event('fake');
          this.props.toggleDisplayForm("formNegotiateOwn", null, event);
        }
      });
  }
  
  render() {

    const tasks = (tasksToList, readOnly) => {
      return tasksToList.map((task, index) => { return (
        <div className="task-row" key={task._id || task.nr}>
          <div className="descr-block">
            <label className="task task-label-descr">Task nr {index + 1}:</label>
            <input className="task task-input-descr" type="text" onChange={this.handleTaskChange} name={"task[" + index + "][description]"} value={task.description} readOnly={readOnly}></input>
          </div>
          <div className="weight-block">
            <label className="task task-label-weight">Weight</label> 
            <input className="task task-input-weight" type="text" onChange={this.handleTaskChange} name={"task[" + index + "][weight]"} value={task.weight || ''} readOnly={readOnly}></input>
          </div>
        </div>
      );});
    }

    return (
      <div className="overlay" onClick={(event) => this.props.toggleDisplayForm("formNegotiateOwn", null, event)}>
        <div className="form-negotiateOwn">
          <div className="form-header">Negotiate my submitted goal</div>
          <div className="form-body">
            <form>
              <h4>An offer from {this.props.goal.offer.owner.name}{this.props.goal.offer.updated_formatted ? ', ' + this.props.goal.offer.updated_formatted : ''}:</h4>
              <label>Goal:</label>
              <input type="text" value={this.props.goal.offer.name} readOnly></input>
              <label>Initial score:</label>
              <input type="text" value={this.props.goal.offer.initScore} readOnly></input>
              <label>Target score:</label>
              <input type="text" value={this.props.goal.offer.targScore} readOnly></input>
              <label>Comment:</label>
              <input type="text" value={this.props.goal.offer.comment} readOnly></input>
              {this.props.goal.task.length > 0 && 
              <div className="task-group">
                {tasks(this.props.goal.offer.task, true)}
                <div className="last-task-row"></div>
              </div>}
              <input className="form-btn" type="submit" value="Accept the offer" onClick={this.handleSubmit1}></input>
            </form>
            <form>
              <h4>My goal{this.props.goal.updated_formatted ? ', ' + this.props.goal.updated_formatted : ''}:</h4>
              <label>Goal:</label>
              <input type="text" name="name" value={this.state.name} onChange={this.handleChange}></input>
              <label>Initial score:</label>
              <input type="text" name="initScore" value={this.state.initScore} onChange={this.handleChange}></input>
              <label>Target score:</label>
              <input type="text" name="targScore" value={this.state.targScore} onChange={this.handleChange}></input>
              <label>Comment:</label>
              <input type="text" name="comment" value={this.state.comment} onChange={this.handleChange}></input>
              {this.props.goal.task.length > 0 && 
              <div className="task-group">
                {tasks(this.state.task, false)}
                <div className="last-task-row"></div>
              </div>}
              <input className="form-btn" type="submit" value="Submit a new response" onClick={this.handleSubmit2}></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}