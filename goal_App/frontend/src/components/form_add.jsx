import React from 'react';
import axios from 'axios';

export default class FormAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      initScore: '',
      targScore: '',
      comment: '',
      showtasks: false,
      task: [{nr: 0, description: "", weight: ""}]
    }
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  toggleShowtasks = () => {
    this.setState(prevstate => ({
      showtasks: !prevstate.showtasks
    }));
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

  handleSubmit = (event) => {
    event.preventDefault();
    const { name, initScore, targScore, comment, task } = this.state;
    axios.post('/add', {
      name, initScore, targScore, comment, task
    }).then(
      response => { 
        if (response.status === 200) {
          this.props.updateOwnerGoals();
          let event = new Event('fake');
          this.props.toggleDisplayAddForm(event);
        }
      }  
    );
  }

  
  render() {

    function taskElm(taskNr, description, weight, funcAddtask) {
      return (
        <div className="task-row" key={taskNr}>
          <div className="descr-block">
            <label className="task task-label-descr">Task nr {taskNr + 1}</label>
            <input className="task task-input-descr" onChange={funcAddtask} type="text" name={"task[" + taskNr + "][description]"} value={description || ''}></input>
          </div>
          <div className="weight-block">
            <label className="task task-label-weight">Weight</label> 
            <input className="task task-input-weight" onChange={funcAddtask} type="text" name={"task[" + taskNr + "][weight]"} value={weight || ''}></input>
          </div>
        </div>
      );
    }

    return (
      <div className="overlay form-add-overlay" onClick={this.props.toggleDisplayAddForm}>
        <div className="form-add">
          <div className="form-header">Add a new goal</div>
          <div className="form-body">
            <form>
              <label>Goal:</label>
              <input type="text" name="name" value={this.state.name} onChange={this.handleChange}></input>
              <label>Initial score:</label>
              <input type="text" name="initScore" placeholder="50%" value={this.state.initScore || ''} onChange={this.handleChange}></input>
              <label>Target score:</label>
              <input type="text" name="targScore" placeholder="99%" value={this.state.targScore || ''} onChange={this.handleChange}></input>
              <label>Comment:</label>
              <input type="text" name="comment" value={this.state.comment} onChange={this.handleChange || ''}></input>
              {this.state.showtasks &&
              <div className="task-group">
                {this.state.task.map((task) => {return taskElm(task.nr, task.description, task.weight, this.handleTaskChange);})}
                <div className="last-task-row"></div>
              </div>}
              <div className="buttons">
                <div></div>
                <div>
                  {!this.state.showtasks && <input className="form-btn add-task" onClick={this.toggleShowtasks} type='button' value='Add task'></input>}
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
