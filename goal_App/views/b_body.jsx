import React from 'react';
import Head from './components/head.jsx';
import Navbar from './components/navbar.jsx';
import FormAdd from './components/form_add.jsx';
import FormMyOwn from './components/form_myOwn_.jsx';
import FormOthers from './components/form_others_.jsx';
import FormCurrent from './components/form_current.jsx';
import GoalInfo from './components/goal_info.jsx';
import Nesting from './components/nesting.jsx';

class Content extends React.Component {  

  
  render() {
    if (this.props.goal) {
      let sortedHistory = this.props.goal.history.data.sort((a, b) => { return a.date - b.date; });
      var currentScore = sortedHistory[sortedHistory.length - 1].value;
      var sortedDates = sortedHistory.map((entry) => { return entry.date});
      var sortedValues = sortedHistory.map((entry) => { return entry.value});
    }
    
    return (
      <html>
        <head>
          <Head />
        </head>
        <body>
          <main>
            <div className="grid-container">
              <div className="l-margin">
                <Navbar chart={this.props.chart}/>
              </div>
              <div className="r-margin">
                <a href="/logout"><i className="fa fa-sign-out" style={{fontSize:54 + "px"}}></i></a>
              </div>
              <div className="header">
                <h1>
                  <a href={"/history/" + this.props.goal.id}>{this.props.goal ? this.props.goal.name : 'Welcome to Norian Grow!'}</a>
                </h1>
              </div>
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
            <FormAdd display={this.props.displayAddForm}/>
            <FormMyOwn display={this.props.displayMyOwnForm} currentGoal={this.props.goal} offeredToMe={this.props.offeredToMe} createdByMe={this.props.createdByMe} myApproved={this.props.myApproved}/>
            <FormOthers display={this.props.displayOthersForm} offeredByMe={this.props.offeredByMe} createdByOthers={this.props.createdByOthers}/>
            {this.props.goal && <FormCurrent goal={this.props.goal}/>}
          </main>
        </body>
        <script src="/scripts/form-control.js"></script>
      </html>
    )
  }
}

export default Content;