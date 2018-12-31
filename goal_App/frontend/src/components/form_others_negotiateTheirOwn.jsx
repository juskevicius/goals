import React from 'react';
import axios from 'axios';

export default class FormNegotiateTheirOwn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.goal.approversOffer ? this.props.goal.approversOffer.name : '',
      initScore: this.props.goal.approversOffer ? this.props.goal.approversOffer.initScore : '',
      targScore: this.props.goal.approversOffer ? this.props.goal.approversOffer.targScore : '',
      comment: this.props.goal.approversOffer ? this.props.goal.approversOffer.comment : '',
      task: this.props.goal.approversOffer ? this.props.goal.approversOffer.task : '',
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

  copyFieldValues = () => {
    this.setState({
      name: this.props.goal.ownersOffer.name || '',
      initScore: this.props.goal.ownersOffer.initScore || '',
      targScore: this.props.goal.ownersOffer.targScore || '',
      comment: this.props.goal.ownersOffer.comment || '',
      task: this.props.goal.ownersOffer.task || '',
    });
  }

  handleSubmit1 = () => {
    axios.post('/approve', {id: this.props.goal._id})
      .then(response => {
        if (response.status === 200) {
          this.props.updateOthersGoals();
          let event = new Event('fake');
          this.props.toggleDisplayForm("formNegotiateTheirOwn", null, event);
        }
      });
  }

  handleSubmit2 = () => {
    if (this.form.checkValidity() === false) {
      for (let i = 0; i < this.form.length; i++) {
        if (this.form[i].validationMessage) {
          this.form.querySelector('.invalid-feedback').textContent = this.form[i].validationMessage;
        }
      }
    } else {
      const { name, initScore, targScore, comment } = this.state;
      const task = this.state.task.filter((task) => {return task.description;});
      axios.post('/approversOffer', {
        id: this.props.goal._id, 
        name, 
        initScore, 
        targScore, 
        comment, 
        task 
      })
        .then(response => {
          if (response.status === 200) {
            this.props.updateOthersGoals();
            let event = new Event('fake');
            this.props.toggleDisplayForm("formNegotiateTheirOwn", null, event);
          }
        });
    }
  }
  
  render() {

    const tasks = (tasksToList, readOnly) => {
      return tasksToList.map((task, index) => { return (
        <div className="task-row" key={task._id || task.nr}>
          <div className="descr-block">
            <label className="task task-label-descr">Task nr {index + 1}:
              <input className="task task-input-descr" type="text" onChange={this.handleTaskChange} name={"task[" + index + "][description]"} value={task.description} readOnly={readOnly}></input>
            </label>
          </div>
          <div className="weight-block">
            <label className="task task-label-weight">Weight 
              <input className="task task-input-weight" type="number" onChange={this.handleTaskChange} name={"task[" + index + "][weight]"} value={task.weight || ''} readOnly={readOnly}></input>
            </label>
          </div>
        </div>
      );});
    }

    const ownersOffer = this.props.goal.ownersOffer;
    const approversOffer = this.props.goal.approversOffer;

    return (
      <div className="overlay" onClick={(event) => this.props.toggleDisplayForm("formNegotiateTheirOwn", null, event)}>
        <div className="form-negotiateTheirOwn">
          <div className="form-header">Negotiate a goal</div>
          <div className="form-body">
            <form>
              <h4>A goal set by {ownersOffer.owner.name} {ownersOffer.updated_formatted ? ownersOffer.updated_formatted : ownersOffer.created_formatted}:</h4>
              <label>Goal:
                <input type="text" value={ownersOffer.name || ''} readOnly></input>
              </label>
              <label>Initial score:
                <input type="number" value={ownersOffer.initScore || ''} readOnly></input>
              </label>
              <label>Target score:
                <input type="number" value={ownersOffer.targScore || ''} readOnly></input>
              </label>
              <label>Comment:
                <input type="text" value={ownersOffer.comment || ''} readOnly></input>
              </label>
              {ownersOffer.task.length > 0 && 
              <div className="task-group">
                {tasks(ownersOffer.task, true)}
                <div className="last-task-row"></div>
              </div>}
              {ownersOffer && <input className="form-btn" type="submit" value="Approve" onClick={this.handleSubmit1}></input>}
            </form>
            <form ref={el => this.form = el}>
              <h4>My offer{approversOffer ? ', ' + (approversOffer.updated_formatted ? approversOffer.updated_formatted : approversOffer.created_formatted) : ''}:</h4>
              <label>Goal:
                <input type="text" name="name" value={this.state.name} onChange={this.handleChange} required></input>
                <div className="invalid-feedback" />
              </label>
              <label>Initial score:
                <input type="number" name="initScore" value={this.state.initScore || ''} onChange={this.handleChange}></input>
              </label>
              <label>Target score:
                <input type="number" name="targScore" value={this.state.targScore || ''} onChange={this.handleChange}></input>
              </label>
              <label>Comment:
                <input type="text" name="comment" value={this.state.comment || ''} onChange={this.handleChange}></input>
              </label>
              {this.state.task && 
              <div className="task-group">
                {tasks(this.state.task, false)}
                <div className="last-task-row"></div>
              </div>}
              <input className="form-btn" type="submit" value="Submit a new offer" onClick={this.handleSubmit2}></input>   
            </form>
            <div className="form-btn-center">
              <input className="form-btn" onClick={this.copyFieldValues} type='button' value='&#8658; copy field values &#8658;'></input>
            </div>
          </div>
        </div>
      </div>
    )
  }
}