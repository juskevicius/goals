import React from 'react';

export default class FormAdd extends React.Component {
  render() {
    return (
      <div className="r-overlay form-add-overlay">
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
              <input className="form-btn" type="submit" value="Save"></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
