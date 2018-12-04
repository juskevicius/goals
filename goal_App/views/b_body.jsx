import React from 'react';
import Css from './b_head.jsx';
import Navbar from './b_navbar.jsx';

class Content extends React.Component {
  render() {
    return (
      <html>
        <head>
          <Css />
        </head>
        <body>
          <main>
            <div className="grid-container">
              <div className="l-margin">
                <Navbar chart={this.props.chart}/>
              </div>
              <div className="r-margin"></div>
              <div className="header">Header</div>  
              <div className="l-main1">l-main1<br/><br/><br/><br/></div>
              <div className="r-main1">r-main1</div>
              <div className="l-main2">l-main2</div>
              <div className="r-main2">r-main2</div>
            </div> 
          </main>
        </body>
      </html>
    )
  }
}


export default Content;