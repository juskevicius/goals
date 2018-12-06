import React from 'react';
import Head from './components/head.jsx';
import Navbar from './components/navbar.jsx';
import FormAdd from './components/form_add.jsx';
import FormCurrent from './components/form_current.jsx';
import GoalInfo from './components/goal_info.jsx';
import Nesting from './components/nesting.jsx';

class Content extends React.Component {
  render() {
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
              <div className="r-margin"></div>
              <div className="header">
                {this.props.goal.name}
              </div>  
              <div className="l-main1">
                <div className="gauge-chart" targscore={this.props.goal.targScore} current={this.props.goal.history.data[this.props.goal.history.data.length - 1].value}></div>
                <script src="/scripts/gauge-chart.js"></script>
              </div>
              <div className="r-main1">r-main1</div>
              <div className="l-main2">
                <GoalInfo goal={this.props.goal}/>
              </div>
              <div className="r-main2">
                <Nesting goal={this.props.goal}/>
              </div>
            </div>
            <FormAdd />
            <FormCurrent goal={this.props.goal}/>
            <script src="/scripts/form-control.js"></script>
          </main>
        </body>
      </html>
    )
  }
}

export default Content;