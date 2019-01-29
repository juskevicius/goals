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

  populateTasks = () => {
    for (let i = 0; i < this.props.task.length; i++) {
      let currTask = this.props.task[i].description;
      for (let j = 0; j < this.props.children.length; j++) {
        for (let k = 0; k < this.props.children[j].task.length; k++) {
          if (currTask === this.props.children[j].task[k].description) {
            this.setState(prevState => ({
              task: [...prevState.task.slice(0, i),
              Object.assign({}, prevState.task[i], { 
                readOnly: true, /* if a task is assigned to a child, then the child is responsible for it's implementation and weight. MAke the field readOnly */
                showChildren: false,
                childrenTasks: [...(prevState.task[i].childrenTasks || []), { 
                  id: this.state.children[j]._id,
                  owner: this.state.children[j].owner.name,
                  implemented: this.state.children[j].task[k].implemented,
                  goalStatus: this.state.children[j].status }]
                 }), 
              ...prevState.task.slice(i + 1)]
            }));
          }
        }
      }
    }
  }

  componentDidMount() {
    this.populateTasks();
  }

  componentDidUpdate(prevProps) {
    let willHaveToUpdate = false;
    if (prevProps.task.length !== this.props.task.length) {
      willHaveToUpdate = true;
    } else {
      for (let i = 0; i < prevProps.task.length; i++) {
        for (let prop in prevProps.task[i]) {
          if (prevProps.task[i][prop] !== this.props.task[i][prop]) {
            willHaveToUpdate = true;
            i = prevProps.task.length;
            break;
          }
        }
      }
    }
    if (willHaveToUpdate) {
      this.setState({
        task: this.props.task
      })
    }
    if (prevProps.children.length !== this.props.children.length) {
      this.setState({
        task: this.props.task,
        children: this.props.children
      }, () => { this.populateTasks(); })
    }
  }

  handleChange = (event) => {
    const name = event.target.name;
    let value = event.target.value;
    if (name === 'implemented') {
      if (value > 100) {
        value = 100;
      } else if (value < 0) {
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

  toggleShowChildrenTasks = (event) => {
    const taskId = event.target.getAttribute('id');
    const index = this.state.task.findIndex(task => task._id === taskId);
    this.setState(prevState => ({
      task: [...prevState.task.slice(0, index),
      Object.assign({}, prevState.task[index], { showChildren: !prevState.task[index].showChildren }),
      ...prevState.task.slice(index + 1)]
    }));
  }

  handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const goalId = event.target.getAttribute('href');
    this.props.updateGoalToDisplay(goalId);
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
          this.props.updateGoalToDisplay();
        }
      })
      .catch(error => {
        const errorMessage = error.response.data.errors.message;
        if (errorMessage.constructor === Array) {
          for (let i = 0; i < errorMessage.length; i++) {
            alert('Something went wrong with the field ' + errorMessage[i].param + '\nError message: ' + errorMessage[i].msg);
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
        <div className='children-tasks'>
          <div className='col-headers-row col-headers-tasks'>
            <div className='col-header'>
              <h4>Task</h4>
            </div>
            <div className='col-header'>
              <h4>Done, %</h4>
            </div>
            <div className='col-header'>
              <h4>Weight</h4>
            </div>
          </div>
          {this.state.task.map((task, index) => { return (
          <div className='col-data-row col-data-tasks' key={task._id}>
            <div className='col-data'>{index + 1 + '. '}{task.description}</div>
            <i className={'far fa-caret-square-down ' + (task.childrenTasks ? 'fa-caret-level1' : '')} id={task._id} onClick={this.toggleShowChildrenTasks}></i>
            <div className='col-data'>
              <input type='number' name='implemented' value={task.implemented || 0} onChange={this.handleChange} onBlur={this.handleSubmit} id={task._id} readOnly={task.readOnly} min={0} max={100}></input>
            </div>
            <div className='col-data'>
              <input type='number' name='weight' value={task.readOnly ? '' : (task.weight || '')} onChange={task.readOnly ? null : this.handleChange} onBlur={task.readOnly ? null : this.handleSubmit} id={task._id} maxLength='11' readOnly={task.readOnly}></input>
            </div>
            
              {(task.childrenTasks && task.showChildren) && task.childrenTasks.map((childTask, index) => { return (
              <div className='col-data-tasks-level2' key={index}>
                <div className='col-data'>
                  <a href={childTask.id} onClick={this.handleClick} style={childTask.goalStatus !== 'Approved' ? {color: 'rgb(187, 187, 187)'} : {color: 'rgb(80, 80, 80)'}}>{childTask.owner}</a>
                </div>
                <i className='far fa-caret-square-down fa-caret-level2'></i>
                <div className='col-data'>
                  <input type='number' value={childTask.implemented || 0} style={childTask.goalStatus !== 'Approved' ? {color: 'rgb(187, 187, 187)'} : {color: 'rgb(80, 80, 80)'}} readOnly></input>
                </div>
                <div className='col-data'>
                </div>
              </div>);})}
          
          </div>);})}
        </div>}
      </div>
    );
  }
}