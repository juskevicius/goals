import React from 'react';
import axios from 'axios';
import Navbar from './homePage_navbar';
import GaugeChart from './homePage_chart_gauge';
import LineChart from './homePage_chart_line';
import GoalInfo from './homePage_goal_info';
import Nesting from './homePage_nesting_';
import FormAdd from './form_add.jsx';
import FormMyOwn from './form_myOwn_';
import FormOthers from './form_others_';
import FormCurrent from './homePage_chart_gauge_form_current';
import Units from './units_';
import Users from './users_';

export default class HomePage extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      newDate: new Date(),
      newScore: '',
    }
   }

  componentDidMount() {
    axios
      .get('/homepage')
      .then(response => {
        if (response.status === 200) {
          this.setState({
            goalToDisplay: response.data.goalToDisplay,
            history: response.data.goalToDisplay.history.data,
            orgChart: response.data.orgChart,
            ownerUnit: response.data.ownerUnit,
            userRole: response.data.userRole
          }, () => {
            const approvedChildrenGoals = this.state.goalToDisplay.parentTo.filter((childGoal) => { return childGoal.status === 'Approved'; });
            if (approvedChildrenGoals.length === 0) { /* if the goal is not delegated to children, then allow to edit current score. Otherwise it will be calculated automatically  */
              this.setState({
                currScoreEditable: true
              });
            }
          });
        }
      })
      .catch(error => {
        console.log(error.response);
        /*
        const errorMessage = error.response.data.errors.message;
        if (errorMessage.constructor === Array) {
          for (let i = 0; i < errorMessage.length; i++) {
            alert("Something went wrong with the field '" + errorMessage[i].param + "'\nError message: " + errorMessage[i].msg);
          }
        } else {
          alert(errorMessage);
        }*/
      });
   }

  updateGoalToDisplay = (goalId) => {
    axios.get('/details/' + goalId || this.state.goalToDisplay._id)
      .then(response => {
        if (response.status === 200) {
          this.setState({
            goalToDisplay: response.data.goalToDisplay,
            history: response.data.goalToDisplay.history.data,
            newDate: new Date(),
            newScore: ''
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

  toggleDisplayForm = (form, event) => {
    event.preventDefault();
    if (this.state[form]) { 
      if (event.target === event.currentTarget) {
        this.setState({ /* if the form is currently visible, then hide it */
          [form]: false
        });
      }
    } else {
      this.setState({
        [form]: true
      });
    }

    if (form === 'users') {
      this.setState({
        units: false
      })
    } else if (form === 'units') {
      this.setState({
        users: false
      })
    }
  }

  handleScoreChange = (event, x, DayPickerInput) => {
    const name = event.target ? event.target.name : DayPickerInput.props.inputProps.name;
    const value = event.target ? event.target.value : event;
    const currId = event.target ? event.target.getAttribute('id') : DayPickerInput.props.inputProps.id;
    const index = this.state.history.findIndex(entry => { return entry._id === currId;});
    if (currId === 'new') {
      this.setState({
        [name]: value
      });
    } else {
      this.setState(prevState => ({
        history: [...prevState.history.slice(0, index),
            Object.assign({}, prevState.history[index], { [name]: value }),
            ...prevState.history.slice(index + 1)]
        }));
    }  
  }

  handleGoalDetails = (event) => {
    const name = event.target.name;
    const value = event.target.value;
      this.setState(prevState => ({
        goalToDisplay: Object.assign({}, prevState.goalToDisplay, { [name]: value })
      }), () => console.log(this.state));
  }

  handleScoreSubmit = (event) => {
    const currId = event.target.getAttribute('id');
    const entryInHistory = this.state.history.find(entry => entry._id === currId );
    const entryId = entryInHistory ? entryInHistory._id : null;
    const date = entryInHistory ? entryInHistory.date : this.state.newDate;
    const value = entryInHistory ? entryInHistory.value : this.state.newScore;
    if (value) {
      axios
      .post('/score', {
        id: this.state.goalToDisplay.history._id,
        entryId,
        date, 
        value
      })
      .then(response => { 
        if (response.status === 200) {
          this.updateGoalToDisplay(this.state.goalToDisplay._id)
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
  }

  submitGoalDetails = (event) => {
    const name = event.target.name === 'name' ? '' : event.target.name;
    const value = event.target.name === 'name' ? '' : event.target.value;
    if (!(name === 'name' && value === '')) {
      axios
      .post('/edit', {
        id: this.state.goalToDisplay._id,
        [name]: value,
        name: this.state.goalToDisplay.name
      })
      .then(response => {
        if (response.status === 200) {
          console.log(response);
          this.updateGoalToDisplay(this.state.goalToDisplay._id);
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
    
  }

  handleScoreDelete = (event) => {
    const entryId = event.target.getAttribute('id');
    
    axios
      .post('/scoreDelete', {
        id: this.state.goalToDisplay.history._id,
        entryId
      })
      .then(response => { 
        if (response.status === 200) {
          this.updateGoalToDisplay(this.state.goalToDisplay._id);
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
    
    const children = this.state.ownerUnit && this.state.ownerUnit.parentTo.length > 0 ? this.state.ownerUnit.parentTo.map((child) => { return child; }) : '';

    return (
      <div>
        <div className="grid-container">
          <div className="l-margin">
            <Navbar toggleDisplayForm={this.toggleDisplayForm} chart={this.state.orgChart} userRole={this.state.userRole} updateGoalToDisplay={this.updateGoalToDisplay}/>
          </div>
          <div className="r-margin">
            <a href="/logout" onClick={(event) => this.props.logout(event)}><i className="fa fa-sign-out" style={{fontSize:54 + "px"}}></i></a>
          </div>
          <div className="header">
            <h1>
              {this.state.goalToDisplay ? this.state.goalToDisplay.name : 'Welcome to Norian Grow!'}
            </h1>
          </div>
          <div className="l-main1">
            {this.state.goalToDisplay && <GaugeChart targScore={this.state.goalToDisplay.targScore} history={this.state.history} toggleDisplayForm={this.toggleDisplayForm}/>}
          </div>
          <div className="r-main1">
            {this.state.goalToDisplay && <LineChart targScore={this.state.goalToDisplay.targScore} history={this.state.history} toggleDisplayForm={this.toggleDisplayForm}/>}
          </div>
          <div className="l-main2">
            {this.state.goalToDisplay && <GoalInfo goal={this.state.goalToDisplay} handleGoalDetails={this.handleGoalDetails} submitGoalDetails={this.submitGoalDetails}/>}
          </div>
          <div className="r-main2">
            {this.state.goalToDisplay && <Nesting key={this.state.goalToDisplay._id} children={this.state.goalToDisplay.parentTo} task={this.state.goalToDisplay.task} id={this.state.goalToDisplay._id} updateGoalToDisplay={this.updateGoalToDisplay}/>}
          </div>
        </div>
        {this.state.formAdd && <FormAdd toggleDisplayForm={this.toggleDisplayForm}/>}
        {this.state.formMyOwn && <FormMyOwn toggleDisplayForm={this.toggleDisplayForm} children={children} updateGoalToDisplay={this.updateGoalToDisplay}/>}
        {this.state.formOthers && <FormOthers toggleDisplayForm={this.toggleDisplayForm} children={children}/>}
        {(this.state.formCurrentScore && this.state.currScoreEditable) && <FormCurrent toggleDisplayForm={this.toggleDisplayForm} goal={this.state.goalToDisplay} history={this.state.history} newScore={this.state.newScore} newDate={this.state.newDate} updateGoalToDisplay={this.updateGoalToDisplay} handleScoreChange={this.handleScoreChange} handleScoreSubmit={this.handleScoreSubmit} handleScoreDelete={this.handleScoreDelete}/>}
        {this.state.units && <Units toggleDisplayForm={this.toggleDisplayForm} />}
        {this.state.users && <Users toggleDisplayForm={this.toggleDisplayForm} />}
      </div>
    )
  }
}
