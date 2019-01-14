import React from 'react';
import axios from 'axios';

export default class FormCopy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    axios.get('/myOwn')
      .then( response => {
        if (response.status === 200) {
          const ownerGoals = response.data.ownerGoals.filter((goal) => { return goal.status === 'Approved'; })
          this.setState({
            ownerGoals: ownerGoals
          });
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

  handleChange = (event) => {
    const value = event.target.value;
    this.setState({
      parent: value
    }, () => { console.log(this.state); })
  }


  handleSubmit = () => {
    const childTo = this.state.parent;
    const id = this.props.goal._id;
    axios.post('/copy', { childTo, id })
      .then( response => {
        if (response.status === 200) {
          this.props.updateOthersGoals();
          /*
          if (this.props.goalInTheBackground === this.props.goal.childTo[0]) {
            this.props.updateGoalToDisplay();
          }*/
          let event = new Event('fake');
          this.props.toggleDisplayForm("formCopy", null, event);
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
      <div className="overlay" onClick={(event) => this.props.toggleDisplayForm("formCopy", null, event)}>
        <div className="form-copy">
          <div className="form-header">Copy or link the goal to my goals</div>
          <div className="form-body">
            <form>
              <label>Goal:
                <input type="text" name="name" value={this.props.goal.name} readOnly></input>
              </label>
              <label>Owner
                <input type="text" name="owner" value={this.props.goal.owner.name} readOnly></input>
              </label>
              <label>Select to copy the goal or link it to an existing goal:
                <select className="offer-unit" name="childTo" value={this.state.parent} onChange={this.handleChange}>
                  <option value="">Make a copy</option>
                  {this.state.ownerGoals && this.state.ownerGoals.map((goal) => { return <option key={goal._id} value={goal._id}>{goal.name}</option>;})}
                </select>
              </label>
              <input className="form-btn" type="submit" value="Submit" onClick={this.handleSubmit}></input>
            </form>
          </div>
        </div>
      </div>
    )
  }
}