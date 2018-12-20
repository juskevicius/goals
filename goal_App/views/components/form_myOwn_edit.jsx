import React from 'react';

export default class FormEdit extends React.Component {
  render() {

    const tasks = () => {
      return this.props.goal.task.map((task, index) => { return (
        <div className="task-row">
          <div className="descr-block">
            <label className="task task-label-descr">Task nr {index + 1}:</label>
            <input className="task task-input-descr" type="text" name={"task[" + index + "][description]"} defaultValue={task.description}></input>
          </div>
          <div className="weight-block">
            <label className="task task-label-weight">Weight</label> 
            <input className="task task-input-weight" type="text" name={"task[" + index + "][weight]"} defaultValue={task.weight}></input>
          </div>
        </div>
      );});
    }

    return (
      <div className="overlay2 form-edit-overlay">
        <div className="form-edit">
          <div className="form-header">Edit a goal</div>
          <div className="form-body">
            <form action="/edit" method="post" href="">
              <label>Goal:</label>
              <input type="text" name="name" defaultValue={this.props.goal.name}></input>
              <label>Initial score:</label>
              <input type="text" name="initScore" defaultValue={this.props.goal.initScore}></input>
              <label>Target score:</label>
              <input type="text" name="targScore" defaultValue={this.props.goal.targScore}></input>
              <label>Comment:</label>
              <input type="text" name="comment" defaultValue={this.props.goal.comment}></input>
              {this.props.goal.task.length > 0 && 
              <div className="task-group">
                {tasks()}
                <div className="last-task-row"></div>
              </div>}
              <input type="hidden" name="id" value={this.props.goal.id} readOnly></input>
              <input className="form-btn" type="submit" value="Save"></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}