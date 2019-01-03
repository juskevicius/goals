import React from 'react';
import axios from 'axios';

export default class FormAcceptOffer extends React.Component {
  
  handleSubmit = () => {
    axios.post('/acceptOffer', { id: this.props.goal._id })
    .then( response => {
      if (response.status === 200) {
        this.props.updateOwnerGoals();
        let event = new Event('fake');
        this.props.toggleDisplayForm("formAcceptOffer", null, event);
      }
    })
    .catch(error => {
      if (error.response) {
        alert(error.response.data);
      }
    });
  }
  
  render() {

    const tasks = () => {
      return this.props.goal.approversOffer.task.map((task, index) => { return (
        <div className="task-row" key={task._id}>
          <div className="descr-block">
            <label className="task task-label-descr">Task nr {index + 1}:
              <input className="task task-input-descr" type="text" name={"task[" + index + "][description]"} value={task.description} readOnly></input>
            </label>
          </div>
          <div className="weight-block">
            <label className="task task-label-weight">Weight
              <input className="task task-input-weight" type="number" name={"task[" + index + "][weight]"} value={task.weight || ''} readOnly></input>
            </label> 
          </div>
        </div>
      );});
    }

    return (
      <div className="overlay" onClick={(event) => this.props.toggleDisplayForm("formAcceptOffer", null, event)}>
        <div className="form-acceptOffer">
          <div className="form-header">Accept an offer</div>
          <div className="form-body">
            <form>
              <label>Goal:
                <input type="text" value={this.props.goal.approversOffer.name} readOnly></input>
              </label>
              <label>Initial score:
                <input type="number" value={this.props.goal.approversOffer.initScore || ''} readOnly></input>
              </label>
              <label>Target score:
                <input type="number" value={this.props.goal.approversOffer.targScore || ''} readOnly></input>
              </label>
              <label>Comment:
                <input type="text" value={this.props.goal.approversOffer.comment || ''} readOnly></input>
              </label>
              {this.props.goal.approversOffer.task.length > 0 && 
              <div className="task-group">
                {tasks()}
                <div className="last-task-row"></div>
              </div>}
              <input className="form-btn" type="submit" value="Accept" onClick={this.handleSubmit}></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}