import React from 'react';
import axios from 'axios';

export default class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      children: this.props.children,
      task: this.props.task,
      id: this.props.id
    }
  }

  componentDidMount() {
    for (let i = 0; i < this.state.task.length; i++) {
      let currTask = this.state.task[i].description;
      for (let j = 0; j < this.state.children.length; j++) {
        for (let k = 0; k < this.state.children[j].task.length; k++) {
          if (currTask === this.state.children[j].task[k].description) {
            this.setState(prevState => ({
              task: [...prevState.task.slice(0, i),
              Object.assign({}, prevState.task[i], { readOnly: true }), /* if a task is assigned to a child, then the child is responsible for it's weight */
              ...prevState.task.slice(i + 1)]
            }));
          }
        }
      }
    }
  }

  handleChange = (event) => {
    const name = event.target.name;
    let value = event.target.value;
    if (name === 'implemented') {
      if (value > 100) {
        value = 100;
      } else if ( value < 0) {
        value = 0;
      }
    }
    const taskId = event.target.getAttribute('id');
    const index = this.state.task.findIndex(task => task._id === taskId);
    this.setState(prevState => ({
      task: [...prevState.task.slice(0, index),
      Object.assign({}, prevState.task[index], { [name]: value }),
      ...prevState.task.slice(index + 1)]
    }));
  }

  handleSubmit = (event) => {
    const taskId = event.target.getAttribute('id');
    const task = this.state.task.find(task => task._id === taskId);
    const { _id, implemented, weight, description } = task;
    axios
      .post('/taskImplementation', { 
        id: this.state.id, 
        taskId: _id, 
        implemented, 
        weight, 
        description
      })
      .then(response => {
        if (response.status === 200) {
          axios.get('/details/' + this.state.id)
          .then(response => {
            if (response.status === 200) {
              this.props.updateGoalToDisplay(response);
            }
          })
          .catch(error => {
            const errorMessage = error.response.data.errors.message;
            if (errorMessage.constructor === Array) {
              for (let i = 0; i < errorMessage.length; i++) {
                alert("Something went wrong with the field '" + errorMessage[i].param + "'\nError message: " + errorMessage[i].msg);
              }
            } else {
              alert(errorMessage);
            }
          });
        }
      })
      .catch(error => {
        const errorMessage = error.response.data.errors.message;
        if (errorMessage.constructor === Array) {
          for (let i = 0; i < errorMessage.length; i++) {
            alert("Something went wrong with the field '" + errorMessage[i].param + "'\nError message: " + errorMessage[i].msg);
          }
        } else {
          alert(errorMessage);
        }
      });
  }


  render() {

    return (
      <div>
        {this.state.task.length > 0 &&
        <div className="children-tasks">
          <div className="col-headers-row col-headers-tasks">
            <div className="col-header">
              <h4>Task</h4>
            </div>
            <div className="col-header">
              <h4>Done, %</h4>
            </div>
            <div className="col-header">
              <h4>Weight</h4>
            </div>
          </div>
          {this.state.task.map((task, index) => { return (
          <div className="col-data-row col-data-tasks" key={task._id}>
            <div className="col-data">{index + 1 + ". "}{task.description}</div>
            <div className="col-data">
              <input type="number" name="implemented" value={task.implemented || 0} onChange={this.handleChange} onBlur={this.handleSubmit} id={task._id} min={0} max={100}></input>
            </div>
            <div className="col-data">
              <input type="number" name='weight' value={task.readOnly ? '' : (task.weight || '')} onChange={task.readOnly ? null : this.handleChange} onBlur={task.readOnly ? null : this.handleSubmit} id={task._id} maxLength="11" readOnly={task.readOnly}></input>
            </div>
          </div>);})}
        </div>}
      </div>
    );
  }
}