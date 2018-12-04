import React from 'react';
import Header from './b_head.jsx';

class Body extends React.Component {
  
  render() {
    const orgChart = this.props.chart.parentTo.map((unit) => {return <li><a href='#'>{unit.name}</a><ul>{unit.parentTo.map((subUnit) => {return <li><a href='#'>{subUnit.name}</a></li>;})}</ul></li>; });
    
    return (
      <body>
        <header></header>
        <main>
          <div className="navbar">
            <nav>
              <ul className="nav">
                <li>
                  <a href="#"><i className="fa fa-sitemap" style={{fontSize: 24 + "px"}}></i> Lithuania</a>
                  <ul>
                    {orgChart}
                  </ul>
                </li>
                <li>
                <a href="#"><i className="fa fa-bullseye" style={{fontSize: 24 + "px"}}></i> Goals</a>
                  <ul>
                    <li>
                      <a href="#">Add</a>
                    </li>
                    <li>
                      <a href="#">My goals</a>
                      <ul>
                        <li>
                          <a href="#">Unit1</a>
                        </li>
                        <li>
                          <a href="#">Unit2</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </main>        
      </body>
    )
  }
}

class Content extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Body chart={this.props.chart}/>
      </div>
    )
  }
}


export default Content;