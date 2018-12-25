import React from 'react';
import axios from 'axios';

export default class FormEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.goal.name,
      initScore: this.props.goal.initScore,
      targScore: this.props.goal.targScore,
      comment: this.props.goal.comment,
      task: this.props.goal.task
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

  handleSubmit = () => {
    const { name, initScore, targScore, comment, task} = this.state;
    axios.post('/edit', {
      id: this.props.goal._id, name, initScore, targScore, comment, task
    }).then(
      response => {
        if (response.status === 200) {
          this.props.updateOwnerGoals();
          let event = new Event('fake');
          this.props.toggleDisplayForm("formEdit", null, event);
        }
      }
    );
  }

  toggleShowtasks = () => {
    this.setState({
      task: [{nr: 0, description: '', weight: ''}]
    });
  }
  
  render() {

    const tasks = () => {
      return this.state.task.map((task, index) => { return (
        <div className="task-row" key={task._id || task.nr}>
          <div className="descr-block">
            <label className="task task-label-descr">Task nr {index + 1}:</label>
            <input className="task task-input-descr" type="text" onChange={this.handleTaskChange} name={"task[" + index + "][description]"} value={task.description}></input>
          </div>
          <div className="weight-block">
            <label className="task task-label-weight">Weight</label> 
            <input className="task task-input-weight" type="text" onChange={this.handleTaskChange} name={"task[" + index + "][weight]"} value={task.weight || ''}></input>
          </div>
        </div>
      );});
    }

    return (
      <div className="overlay" onClick={(event) => this.props.toggleDisplayForm("formEdit", null, event)}>
        <div className="form-edit">
          <div className="form-header">Edit a goal</div>
          <div className="form-body">
            <form>
              <label>Goal:</label>
              <input type="text" name="name" onChange={this.handleChange} value={this.state.name}></input>
              <label>Initial score:</label>
              <input type="text" name="initScore" onChange={this.handleChange} value={this.state.initScore || ''}></input>
              <label>Target score:</label>
              <input type="text" name="targScore" onChange={this.handleChange} value={this.state.targScore || ''}></input>
              <label>Comment:</label>
              <input type="text" name="comment" onChange={this.handleChange} value={this.state.comment || ''}></input>
              {this.state.task.length > 0 && 
              <div className="task-group">
                {tasks()}
                <div className="last-task-row"></div>
              </div>}
              <div className="buttons">
                <div></div>
                <div>
                  {this.state.task.length === 0 && <input className="form-btn add-task" onClick={this.toggleShowtasks} type='button' value='Add task'></input>}
                  <input className="form-btn" onClick={this.handleSubmit} type="submit" value="Save"></input>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}