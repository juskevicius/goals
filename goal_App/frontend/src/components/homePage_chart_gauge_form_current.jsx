import React from 'react';
import axios from 'axios';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import {formatDate, parseDate } from 'react-day-picker/moment';

export default class FormCurrent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      currScore: ''
    }
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleDayChange = (selectedDay) => {
    this.setState({
      date: selectedDay
    });
  }

  handleSubmit = () => {

    if (this.form.checkValidity() === false) {
      for (let i = 0; i < this.form.length; i++) {
        
        let el = this.form[i];
        let errorField = el.parentNode.querySelector('.invalid-feedback');

        if (errorField) {
          errorField.textContent = el.validationMessage;
        }
      }
    } else {
      const { date, currScore } = this.state;
      axios.post('/addCurrentScore', {id: this.props.goal.history._id, date, currScore})
        .then(response => { 
          if (response.status === 200) {
            axios.get('/details/' + this.props.goal._id)
              .then(response => {
                if (response.status === 200) {
                  this.props.updateGoalToDisplay(response);
                }
              })
            let event = new Event('fake');
            this.props.toggleDisplayForm('formCurrentScore', event);
          }
        }  
      );
    }
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
              <label>Current score:
                <input type="number" name="currScore" value={this.state.currScore} onChange={this.handleChange} required></input>
                <div className="invalid-feedback" />
              </label>
              <label>Date:
                <DayPickerInput
                  value={this.state.date}
                  onDayChange={this.handleDayChange}
                  formatDate={formatDate}
                  parseDate={parseDate}
                  format="YYYY-MM-DD"
                  inputProps={{ required: true, readOnly: true }}
                  dayPickerProps={{
                    selectedDays: this.state.date
                  }}
                />
              </label>
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
