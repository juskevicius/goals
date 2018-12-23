import React from 'react';

export default class FormOfferTo extends React.Component {
  render() {

    const children = () => {
      return this.props.children.map((unit) => { return <option key={unit.id} value={unit.id}>{unit.name}</option>;})
    }

    const tasks = () => {
      return this.props.goal.task.map((task, index) => { return (
        <div className="task-row">
          <div className="descr-block">
            <label className="task task-label-descr">Task nr {index + 1}:</label>
            <input className="task task-input-descr" type="text" name={"task[" + index + "][description]"} value={task.description} readOnly></input>
          </div>
          <div className="weight-block">
            <label className="task task-label-weight">Weight</label> 
            <input className="task task-input-weight" type="text" name={"task[" + index + "][weight]"} value={task.weight} readOnly></input>
          </div>
        </div>
      );});
    }

    const oTasks = () => {
      return this.props.goal.task.map((task, index) => { return (
        <div className="task-row">
          <div className="descr-block">
            <label className="task task-label-descr">Task nr {index + 1}:</label>
            <input className="task task-input-descr" type="text" name={"task[0][" + index + "][description]"} defaultValue={task.description}></input>
          </div>
          <div className="weight-block">
            <label className="task task-label-weight">Weight</label> 
            <input className="task task-input-weight" type="text" name={"task[0][" + index + "][weight]"} defaultValue={task.weight}></input>
          </div>
        </div>
      );});
    }

    return (
      <div className="overlay2 form-offerTo-overlay">
        <div className="form-offerTo">
          <div className="form-header">Offer the goal</div>
          <div className="form-body">
            <label>Goal:</label>
            <input type="text" value={this.props.goal.name} readOnly></input>
            <label>Initial score:</label>
            <input type="text" value={this.props.goal.initScore} readOnly></input>
            <label>Target score:</label>
            <input type="text" value={this.props.goal.targScore} readOnly></input>
            <label>Comment:</label>
            <input type="text" value={this.props.goal.comment} readOnly></input>
            {this.props.goal.task.length > 0 && <div className="task-group">
              {tasks()}
              <div className="last-task-row"></div>
            </div>}
            <form action="/offerTo" method="post" href="">
              <div className="offer-group">
                <div className="offer-elm">
                  <label>Offer to:</label>
                  <label>Weight:</label>
                  <select className="offer-unit" name="owner[0]">
                    <option value="">Choose</option>
                    {children()}
                  </select>
                  <input type="text" name="weight[0]" placeholder="100%"></input>
                  <label>Initial score:</label>
                  <label>Target score:</label>
                  <input type="text" name="oInitScore[0]" defaultValue={this.props.goal.initScore}></input>
                  <input type="text" name="oTargScore[0]" defaultValue={this.props.goal.targScore}></input>
                  <label>Comment:</label>
                  <input type="text" name="oComment[0]" defaultValue={this.props.goal.comment}></input>
                  <input type="hidden" name="childTo[0]" value={this.props.goal.id}></input>
                  <input type="hidden" name="name[0]" value={this.props.goal.name}></input>
                  {this.props.goal.task.length > 0 && 
                    <div className="task-group[0]">
                      {oTasks()}
                      <div className="last-task-row"></div>
                    </div>
                  }
                  {this.props.goal.task.length == 0 && 
                    <div className="task-group[0]">
                      <div className="task-row">
                        <div className="descr-block">
                          <label className="task task-label-descr">Task nr 1:</label>
                          <input className="task task-input-descr" type="text" name="task[0][0][description]" defaultValue=""></input>
                        </div>
                        <div className="weight-block">
                          <label className="task task-label-weight">Weight</label> 
                          <input className="task task-input-weight" type="text" name="task[0][0][weight]" defaultValue=""></input>
                        </div>
                      </div>
                      <div className="last-task-row"></div>
                    </div>
                  }
                </div>
                <input className="form-btn make-offer-btn" type="submit" value="Submit the offers"></input>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}