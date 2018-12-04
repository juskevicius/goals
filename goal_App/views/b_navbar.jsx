import React from 'react';

export default class Navbar extends React.Component {
  render() {
    const orgChart = this.props.chart.parentTo.map((unit) => {return <li><a href='#'>{unit.name}</a><ul>{unit.parentTo.map((subUnit) => {return <li><a href='#'>{subUnit.name}</a></li>;})}</ul></li>; });
    return (
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
                </li>
                <li>
                  <a href="#">Others'</a>
                </li>
                <li>
                  <a href="#">Rejected</a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>  
    )
  }
}
