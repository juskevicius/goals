import React from 'react';
import axios from 'axios';

export default class FormApprove extends React.Component {
  
  handleSubmit = () => {
    axios.post('/approve', { id: this.props.goal._id })
      .then( response => {
        if (response.status === 200) {
          this.props.updateOthersGoals();
          let event = new Event('fake');
          this.props.toggleDisplayForm("formApprove", null, event);
        }
      });
  }
  
  render() {

    const tasks = () => {
      return this.props.goal.task.map((task, index) => { return (
        <div className="task-row" key={task._id}>
          <div className="descr-block">
            <label className="task task-label-descr">Task nr {index + 1}:</label>
            <input className="task task-input-descr" type="text" name={"task[" + index + "][description]"} value={task.description} readOnly></input>
          </div>
          <div className="weight-block">
            <label className="task task-label-weight">Weight</label> 
            <input className="task task-input-weight" type="text" name={"task[" + index + "][weight]"} value={task.weight || ''} readOnly></input>
          </div>
        </div>
      );});
    }

    return (
      <div className="overlay" onClick={(event) => this.props.toggleDisplayForm("formApprove", null, event)}>
        <div className="form-approve">
          <div className="form-header">Approve a goal</div>
          <div className="form-body">
            <form>
              <label>Owner:</label>
              <input type="text" value={this.props.goal.owner.name} readOnly></input>
              <label>Goal:</label>
              <input type="text" value={this.props.goal.name} readOnly></input>
              <label>Initial score:</label>
              <input type="text" value={this.props.goal.initScore} readOnly></input>
              <label>Target score:</label>
              <input type="text" value={this.props.goal.targScore} readOnly></input>
              <label>Comment:</label>
              <input type="text" value={this.props.goal.comment} readOnly></input>
              {this.props.goal.task.length > 0 && 
              <div className="task-group">
                {tasks()}
                <div className="last-task-row"></div>
              </div>}
              <input className="form-btn" type="submit" value="Approve" onClick={this.handleSubmit}></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}