import React from 'react';

export default class Nesting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  
  
  render() {

    const children = this.props.goal.parentTo.map((child) => { return  (
      <div className="col-data-row" key={child._id} style={child.status !== 'Approved' ? {color: 'rgb(187, 187, 187)'} : {color: 'rgb(88, 88, 88)'}}>
        <div className="col-data"><a href={'/details/' + child._id} style={child.status !== 'Approved' ? {color: 'rgb(187, 187, 187)'} : {color: 'rgb(88, 88, 88)'}}>{child.owner.name}</a></div>
        <div className="col-data">{child.initScore}</div>
        <div className="col-data">{child.history ? child.history.data[child.history.data.length - 1].value : ''}</div>
        <div className="col-data">{child.targScore}</div>
        <div className="col-data">
          <form action={"/editWeight"} method="post">
            <div>
              <input type="text" name="weight" defaultValue={child.weight} style={child.status !== 'Approved' ? {color: 'rgb(187, 187, 187)'} : {color: 'rgb(88, 88, 88)'}}></input>
              <input type="hidden" name="id" value={child._id} readOnly></input>
              <button type="submit"><i className="fas fa-save"/></button>
            </div>
          </form>
        </div>
      </div>
    );});

    const tasks = this.props.goal.task.map((task, index) => { return (
      <div className="col-data-row col-data-tasks" key={task._id}>
        <div className="col-data">{index + 1 + ". "}{task.description}</div>
        <div className="col-data">
          <form action={"/taskImplementation"} method="post">
            <div>
              <input type="text" name="implemented" defaultValue={task.implemented ? task.implemented : 0}></input>
              <input type="hidden" name="taskId" value={task._id} readOnly></input>
              <input type="hidden" name="description" value={task.description} readOnly></input>
              <input type="hidden" name="id" value={this.props.goal._id} readOnly></input>
              <button type="submit">%<i className="fas fa-save"/></button>
            </div>
          </form>
        </div>
        <div className="col-data">
          <form action={"/editTaskWeight"} method="post">
            <div>
              <input type="text" name="weight" defaultValue={task.weight} maxLength="11"></input>
              <input type="hidden" name="id" value={task._id} readOnly></input>
              <input type="hidden" name="description" value={task.description} readOnly></input>
              <button type="submit"><i className="fas fa-save"/></button>
            </div>
          </form>
        </div>
      </div>
    );}); 

    return (
      <div className="r-main2">
        {this.props.goal.parentTo.length > 0 && 
        <div className="children-goals">
          <div className="col-headers-row">
            <div className="col-header">
              <h4>Parent to</h4>
            </div>
            <div className="col-header">
              <h4>Initial score</h4>
            </div>
            <div className="col-header">
              <h4>Current score</h4>
            </div>
            <div className="col-header">
              <h4>Target score</h4>
            </div>
            <div className="col-header">
              <h4>Weight</h4>
            </div>
          </div>
          {children}
        </div>}
        {this.props.goal.task.length > 0 &&
        <div className="children-tasks">
          <div className="col-headers-row col-headers-tasks">
            <div className="col-header">
              <h4>Task</h4>
            </div>
            <div className="col-header">
              <h4>Done</h4>
            </div>
            <div className="col-header">
              <h4>Weight</h4>
            </div>
          </div>
          {tasks}
        </div>}
      </div>
    )
  }
}