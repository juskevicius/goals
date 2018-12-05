import React from 'react';
import Head from './components/head.jsx';
import Navbar from './components/navbar.jsx';
import FormAdd from './components/form_add.jsx';

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
              <div className="header">{this.props.goal.name}</div>  
              <div className="l-main1">
                <div className="gauge-chart"></div>
              </div>
              <div className="r-main1">r-main1</div>
              <div className="l-main2">l-main2</div>
              <div className="r-main2">r-main2</div>
            </div>
            <FormAdd />
          </main>
        </body>
        <script src="/scripts/script.js"></script>
        <script src="/scripts/gauge-chart.js"></script>
      </html>
    )
  }
}

export default Content;