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
      task: [{ nr: 0, description: '', weight: '' }],
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
    if (taskNr === (this.state.task.length - 1) && updKey === 'description') {
      this.setState(prevstate => ({
        task: [...prevstate.task, {nr: prevstate.task.length, description: '', weight: ''}]
      }));
    }
  }

  handleSubmit = () => {
    if (this.form.checkValidity() === false) {
      for (let i = 0; i < this.form.length; i++) {
        if (this.form[i].validationMessage) {
          this.form.querySelector('.invalid-feedback').textContent = this.form[i].validationMessage;
        }
      }
    } else {
      const { name, initScore, targScore, comment } = this.state;
      const task = this.state.task.filter((task) => {return task.description;});
      axios
        .post('/add', {
          name, initScore, targScore, comment, task
        })
        .then(response => {
            if (response.status === 200) {
              let event = new Event('fake');
              this.props.toggleDisplayForm('formAdd', event);
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
  }

  
  render() {

    function taskElm(taskNr, description, weight, funcAddtask) {
      return (
        <div className='task-row' key={taskNr}>
          <div className='descr-block'>
            <label className='task task-label-descr'>Task nr {taskNr + 1}
              <input className='task task-input-descr' onChange={funcAddtask} type='text' name={'task[' + taskNr + '][description]'} value={description || ''} maxLength='200'></input>
            </label>
          </div>
          <div className='weight-block'>
            <label className='task task-label-weight'>Weight
              <input className='task task-input-weight' onChange={funcAddtask} type='number' name={'task[' + taskNr + '][weight]'} value={weight || ''} maxLength='11'></input>
            </label>
          </div>
        </div>
      );
    }

    return (
      <div className='overlay' onClick={(event) => this.props.toggleDisplayForm('formAdd', event)}>
        <div className='form-add'>
          <div className='form-header'>Add a new goal</div>
          <div className='form-body'>
            <form ref={el => this.form = el}>
              <label>Goal:
                <input type='text' name='name' value={this.state.name} onChange={this.handleChange} required maxLength='100'></input>
                <div className='invalid-feedback' />
              </label>
              <label>Initial score:
                <input type='number' name='initScore' placeholder='50%' value={this.state.initScore || ''} onChange={this.handleChange} maxLength='11'></input>
              </label>
              <label>Target score:
                <input type='number' name='targScore' placeholder='99%' value={this.state.targScore || ''} onChange={this.handleChange} maxLength='11'></input>
              </label>
              <label>Comment:
                <input type='text' name='comment' value={this.state.comment} onChange={this.handleChange || ''} maxLength='400'></input>
              </label>
              {this.state.showtasks &&
              <div className='task-group'>
                {this.state.task.map((task) => {return taskElm(task.nr, task.description, task.weight, this.handleTaskChange);})}
                <div className='last-task-row'></div>
              </div>}
              <div className='buttons'>
                <div></div>
                <div>
                  {!this.state.showtasks && <input className='form-btn add-task' onClick={this.toggleShowtasks} type='button' value='Add task'></input>}
                  <input className='form-btn' onClick={this.handleSubmit} type='submit' value='Save'></input>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
