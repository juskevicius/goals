import React from 'react';

export default class Nesting extends React.Component {
  render() {

    const children = () => {
      const childrenArr = this.props.goal.parentTo.map((child) => { return  (
        <div className="col-data-row" key={child.id} style={child.status !== 'Approved' ? {color: 'rgb(187, 187, 187)'} : {color: 'rgb(88, 88, 88)'}}>
          <div className="col-data"><a href={'/details/' + child.id} style={child.status !== 'Approved' ? {color: 'rgb(187, 187, 187)'} : {color: 'rgb(88, 88, 88)'}}>{child.owner.name}</a></div>
          <div className="col-data">{child.initScore}</div>
          <div className="col-data">{child.history.data[child.history.data.length - 1].value}</div>
          <div className="col-data">{child.targScore}</div>
          <div className="col-data">
            <form action={"/editWeight"} method="post">
              <div>
                <input type="text" name="weight" defaultValue={child.weight} style={child.status !== 'Approved' ? {color: 'rgb(187, 187, 187)'} : {color: 'rgb(88, 88, 88)'}}></input>
                <input type="hidden" name="id" value={child.id} readOnly></input>
                <button type="submit"><i className="fas fa-save"/></button>
              </div>
            </form>
          </div>
        </div>
      );});
      return childrenArr;
    }

    return (
      <div className="r-main2">
        {this.props.goal.parentTo.length > 0 &&
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
        </div>}
          {children()}
      </div>
    )
  }
}