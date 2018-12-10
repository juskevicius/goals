import React from 'react';
import Head from './components/head.jsx';
import Navbar from './components/navbar.jsx';
import FormAdd from './components/form_add.jsx';
import FormMyOwn from './components/form_myOwn.jsx';
import FormCurrent from './components/form_current.jsx';
import GoalInfo from './components/goal_info.jsx';
import Nesting from './components/nesting.jsx';

class Content extends React.Component {  

  
  render() {
    let sortedHistory = this.props.goal.history.data.sort((a, b) => { return a.date - b.date; });
    let currentScore = sortedHistory[sortedHistory.length - 1].value;

    let sortedDates = sortedHistory.map((entry) => { return entry.date});
    let sortedValues = sortedHistory.map((entry) => { return entry.value});
    

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
                  {this.props.goal.name}
                </h1>
              </div>  
              <div className="l-main1">
                <div className="gauge-chart" targscore={this.props.goal.targScore} current={currentScore}></div>
                <script src="/scripts/gauge-chart.js"></script>
              </div>
              <div className="r-main1">
                <div className="line-chart" targscore={this.props.goal.targScore} dates={sortedDates} values={sortedValues}></div>
                <script src="/scripts/line-chart.js"></script>
              </div>
              <GoalInfo goal={this.props.goal}/>
              <Nesting goal={this.props.goal}/>
            </div>
            <FormAdd />
            <FormMyOwn offeredToMe={this.props.offeredToMe} createdByMe={this.props.createdByMe} myApproved={this.props.myApproved}/>
            <FormCurrent goal={this.props.goal}/>
            <script src="/scripts/form-control.js"></script>
          </main>
        </body>
      </html>
    )
  }
}

export default Content;