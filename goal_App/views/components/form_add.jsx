import React from 'react';

export default class FormAdd extends React.Component {
  render() {
    return (
      <div className="r-overlay form-add-overlay" style={this.props.display ? {display: 'initial'} : {display: 'none'}}>
        <div className="form-add">
          <div className="form-header">Add a new goal</div>
          <div className="form-body">
            <form action="/add" method="post" href="">
              <label>Goal:</label>
              <input type="text" name="name"></input>
              <label>Initial score:</label>
              <input type="text" name="initScore" placeholder="50%"></input>
              <label>Target score:</label>
              <input type="text" name="targScore" placeholder="99%"></input>
              <label>Comment:</label>
              <input type="text" name="comment"></input>
              <label className="task task-label">Task nr 1 description:</label>
              <input className="task task-descr" type="text" name="task[0][description]"></input>
              <label className="task task-label">Task nr 1 weight:</label>
              <input className="task task-weight" type="text" name="task[0][weight]"></input>
              <div className="buttons">
                <div></div>
                <div>
                  <input className="form-btn add-tasks" id="triggerAddTasks" type='button' value='Add tasks'></input>
                  <input className="form-btn" type="submit" value="Save"></input>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
