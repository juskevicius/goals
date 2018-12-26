import React from 'react';
import Navbar from './navbar.jsx';
import FormAdd from './form_add.jsx';
import FormMyOwn from './form_myOwn_.jsx';
import FormOthers from './form_others_.jsx';
/*import FormCurrent from '.form_current.jsx';
import GoalInfo from './goal_info.jsx';
import Nesting from './nesting.jsx';*/

export default class HomePage extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
    }
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
  }

  /*
      
    <div>
      
        
        {this.props.goal ?
        <div className="l-main1">
          <div className="gauge-chart" targscore={this.props.goal ? this.props.goal.targScore : ''} current={currentScore}></div>
          <script src="/scripts/gauge-chart.js"></script> 
        </div> : ''}

        {this.props.goal ?
        <div className="r-main1">
          <div className="line-chart" targscore={this.props.goal ? this.props.goal.targScore : ''} dates={sortedDates} values={sortedValues}></div>
          <script src="/scripts/line-chart.js"></script>
        </div> : ''}

        {this.props.goal && <GoalInfo goal={this.props.goal}/>}
        {this.props.goal && <Nesting goal={this.props.goal}/>}
      </div>
      
      
      <FormOthers display={this.props.displayOthersForm} offeredByMe={this.props.offeredByMe} createdByOthers={this.props.createdByOthers}/>
      {this.props.goal && <FormCurrent goal={this.props.goal}/>}
      <script src="/scripts/form-control.js"></script>

  
  }*/
  
  render() {
    /*
    if (this.props.goal) {
      let sortedHistory = this.props.goal.history.data.sort((a, b) => { return a.date - b.date; });
      var currentScore = sortedHistory[sortedHistory.length - 1].value;
      var sortedDates = sortedHistory.map((entry) => { return entry.date});
      var sortedValues = sortedHistory.map((entry) => { return entry.value});

      
    }*/

    const children = this.props.ownerUnit.parentTo.length > 0 ? this.props.ownerUnit.parentTo.map((child) => { return child; }) : '';

    return (
      <div>
        <div className="grid-container">
          <div className="l-margin">
            <Navbar toggleDisplayForm={this.toggleDisplayForm} chart={this.props.orgChart}/>
          </div>
          <div className="r-margin">
            <a href="/logout"><i className="fa fa-sign-out" style={{fontSize:54 + "px"}}></i></a>
          </div>
          <div className="header">
            <h1>
              {this.props.goalToDisplay ? this.props.goalToDisplay.name : 'Welcome to Norian Grow!'}
            </h1>
          </div>
        </div>
        {this.state.formAdd && <FormAdd toggleDisplayForm={this.toggleDisplayForm}/>}
        {this.state.formMyOwn && <FormMyOwn toggleDisplayForm={this.toggleDisplayForm} children={children}/>}
        {this.state.formOthers && <FormOthers toggleDisplayForm={this.toggleDisplayForm} children={children}/>}
      </div>
    )
  }
}
