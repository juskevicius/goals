import React from 'react';

export default class Navbar extends React.Component {
  render() {
    const orgChart = this.props.chart.parentTo.map((unit) => {return <li key={unit.id}><a href='#'>{unit.name}</a><ul>{unit.parentTo.map((subUnit) => {return <li key={subUnit.id}><a href='#'>{subUnit.name}</a></li>;})}</ul></li>; });
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
                  <a href="#" id="showAddForm">Add</a>
                </li>
                <li>
                  <a href="#" id="showMyOwnForm">My goals</a>
                </li>
                <li>
                  <a href="#" id="showOthersForm">Others'</a>
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
