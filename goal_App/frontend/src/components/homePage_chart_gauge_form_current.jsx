import React from 'react';
import axios from 'axios';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import {formatDate, parseDate } from 'react-day-picker/moment';

export default class FormCurrent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currDate: new Date(),
      currScore: '',
      goal: this.props.goal,
      history: this.props.goal.history.data
    }
  }


  handleChange1 = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleChange2 = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    
    const currId = event.target.getAttribute('id');
    const index = this.state.history.findIndex(entry => { return entry._id === currId;})
    console.log(name);
    console.log(value);
    console.log(currId);
    console.log(index);

    this.setState(prevState => ({
      history: [...prevState.history.slice(0, index),
      Object.assign({}, prevState.history[index], { [name]: value }),
      ...prevState.history.slice(index + 1)]
    }));
    
  }

  handleSubmit2 = (event) => {
    const currId = event.target.getAttribute('id');
    const entryExists = this.state.history.find(entry => entry._id === currId );
    const entryId = entryExists ? entryExists._id : null;
    const date = entryExists ? entryExists.date : this.state.currDate;
    const value = entryExists ? entryExists.value : this.state.currScore;
    
    
    console.log(entryId);
    console.log(date);
    console.log(value);

    /*
    if (value) {
      axios
      .post('/score', {
        id: this.props.goal.history._id,
        entryId,
        date, 
        value
      })
      .then(response => { 
        if (response.status === 200) {
          axios.get('/details/' + this.props.goal._id)
            .then(response => {
              if (response.status === 200) {
                this.props.updateGoalToDisplay(response);
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
          let event = new Event('fake');
          this.props.toggleDisplayForm('formCurrentScore', event);
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
    }*/
  }
  
  render() {
    return (
      <div className="overlay" onClick={event => this.props.toggleDisplayForm("formCurrentScore", event)}>
        <div className="form-current">
          <div className="form-header">Add current score</div>
          <div className="form-body">
            <form ref={el => this.form = el}>
              <label>Goal:
                <input type="text" name="name" value={this.props.goal.name} readOnly></input>
              </label>
              <div className="date">
                <label>Date
                  <DayPickerInput
                    value={this.state.currDate}
                    formatDate={formatDate}
                    parseDate={parseDate}
                    format="YYYY-MM-DD"
                    inputProps={{ required: true, readOnly: true, id:'new', name:'currDate', onChange:this.handleChange1 }}
                    dayPickerProps={{
                      selectedDays: this.state.currDate
                    }}
                  />
                </label>
              </div>
              <div className="score">
                <label>Current score
                  <input type="number" name="currScore" id='new' value={this.state.currScore} onChange={this.handleChange1} required maxLength="11"></input>
                </label>
              </div>
              {this.state.history.map((entry) => { return (
                <div key={entry._id}>
                  <div className="date">
                    <DayPickerInput
                      value={new Date(entry.date)}
                      formatDate={formatDate}
                      parseDate={parseDate}
                      format="YYYY-MM-DD"
                      inputProps={{ required: true, readOnly: true, id:entry._id, name:'date', onChange:this.handleChange2, onBlur:this.handleSubmit2 }}
                      dayPickerProps={{
                        selectedDays: new Date(entry.date)
                      }}
                    />
                  </div>
                  <div className="score">
                    <input type="number" name="value" value={entry.value} onChange={this.handleChange2} onBlur={this.handleSubmit2} id={entry._id} required maxLength="11"></input>
                  </div>
                </div>
              );})}
              <label>
                <input className="form-btn" type="submit" value="Add" onClick={this.handleSubmit}></input>
              </label>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
