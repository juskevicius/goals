import React from 'react';
import axios from 'axios';

export default class ChildrenGoals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      children: this.props.children
    }
  }

  handleChange = (event) => {
    const value = event.target.value;
    const childId = event.target.getAttribute('id');
    const index = this.state.children.findIndex(child => child._id === childId);
    this.setState(prevState => ({
      children: [...prevState.children.slice(0, index),
      Object.assign({}, prevState.children[index], { weight: value }),
      ...prevState.children.slice(index + 1)]
    }));
  }

  handleSubmit = (event) => {
    const childId = event.target.getAttribute('id');
    const child = this.state.children.find(child => child._id === childId);
    const { _id, weight } = child;
    axios
      .post('/editWeight', { id: _id, weight })
      .then(response => {
        if (response.status === 200) {
          this.props.updateGoalToDisplay();
        }
      })
      .catch(error => {
        const errorMessage = error.response.data.errors.message;
        if (errorMessage.constructor === Array) {
          for (let i = 0; i < errorMessage.length; i++) {
            alert("Something went wrong with the field '" + errorMessage[i].param + "'\nError message: " + errorMessage[i].msg);
          }
        } else {
          alert(errorMessage);
        }
      });
  }


  render() {

    return (
      <div>
      {this.state.children.length > 0 && 
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
          {this.state.children.map((child) => { return (
          <div className="col-data-row" key={child._id} style={child.status !== 'Approved' ? {color: 'rgb(187, 187, 187)'} : {color: 'rgb(88, 88, 88)'}}>
            <div className="col-data"><a href={'/details/' + child._id} style={child.status !== 'Approved' ? {color: 'rgb(187, 187, 187)'} : {color: 'rgb(88, 88, 88)'}}>{child.owner.name}</a></div>
            <div className="col-data">{child.initScore}</div>
            <div className="col-data">{child.history ? (child.history.data.reduce((prev, curr) => { return (prev.date > curr.date) ? prev : curr;})).value : ''}</div>
            <div className="col-data">{child.targScore}</div>
            <div className="col-data">
              <input type="number" name="weight" value={child.weight || ''} onChange={this.handleChange} onBlur={this.handleSubmit} style={child.status !== 'Approved' ? {color: 'rgb(187, 187, 187)'} : {color: 'rgb(88, 88, 88)'}} id={child._id} maxLength="11"></input>
            </div>
          </div>);})}
        </div>}
      </div>
    );
  }
}