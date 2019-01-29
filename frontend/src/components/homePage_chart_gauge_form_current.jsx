import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import {formatDate, parseDate } from 'react-day-picker/moment';

export default class FormCurrent extends React.Component {
  
  render() {
    return (
      <div className='overlay' onClick={event => this.props.toggleDisplayForm('formCurrentScore', event)}>
        <div className='form-current'>
          <div className='form-header'>Add current score</div>
          <div className='form-body'>
            <form>
              <label>Goal:
                <input type='text' name='name' value={this.props.goal.name} readOnly></input>
              </label>
              <div className='date'>
                <label>Date
                  <DayPickerInput
                    onDayChange={this.props.handleDayChange}
                    value={this.props.newDate}
                    formatDate={formatDate}
                    parseDate={parseDate}
                    format='YYYY-MM-DD'
                    inputProps={{ required: true, readOnly: true, id:'new', name:'newDate' }}
                    dayPickerProps={{
                      selectedDays: this.props.newDate
                    }}
                  />
                </label>
              </div>
              <div className='delete'>
                <i className='far fa-trash-alt'></i>
              </div>
              <div className='score'>
                <label>Current score
                  <input type='number' name='newScore' id='new' value={this.props.newScore} onChange={event => this.props.handleScoreChange(event)} onBlur={this.props.handleScoreSubmit} required maxLength='11'></input>
                </label>
              </div>
              {this.props.history.map((entry) => { return (
                <div className='score-group' key={entry._id}>
                  <div className='date'>
                    <DayPickerInput
                      onDayChange={this.props.handleDayChange}
                      value={new Date(entry.date)}
                      formatDate={formatDate}
                      parseDate={parseDate}
                      format='YYYY-MM-DD'
                      inputProps={{ required: true, readOnly: true, id:entry._id, name:'date' }}
                      dayPickerProps={{
                        selectedDays: new Date(entry.date)
                      }}
                    />
                  </div>
                  <div className='delete'>
                    <i className='far fa-trash-alt' id={entry._id} onClick={this.props.handleScoreDelete}></i>
                  </div>
                  <div className='score'>
                    <input type='number' name='value' value={entry.value} onChange={event => this.props.handleScoreChange(event)} onBlur={this.props.handleScoreSubmit} id={entry._id} required maxLength='11'></input>
                  </div>
                </div>
              );})}
            </form>
          </div>
        </div>
      </div>
    )
  }
}
