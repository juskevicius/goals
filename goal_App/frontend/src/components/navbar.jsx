import React from 'react';

export default class Navbar extends React.Component {
  render() {

    const orgChart = this.props.chart.parentTo.map((unit) => {return (
      <li key={unit.id}>
        <a href={'/myOwn/' + unit.owner.id}>{unit.name}</a>
        <ul>{unit.parentTo.map((subUnit) => {return (
          <li key={subUnit.id}>
            <a href={'/myOwn/' + subUnit.owner.id}>{subUnit.name}</a>
          </li>
          );})}
        </ul>
      </li>
      ); });

    return (
      <div className="navbar">
        <nav>
          <ul className="nav">
            <li>
              <a href={'/myOwn/' + this.props.chart.owner.id}><i className="fa fa-sitemap" style={{fontSize: 24 + "px"}}></i> Lithuania</a>
              <ul>
                {orgChart}
              </ul>
            </li>
            <li>
            <a href="#"><i className="fa fa-bullseye" style={{fontSize: 24 + "px"}}></i> Goals</a>
              <ul>
                <li>
                  <a href="/add" id="showAddForm">Add</a>
                </li>
                <li>
                  <a href="/myOwn" id="showMyOwnForm">My goals</a>
                </li>
                <li>
                  <a href="/others" id="showOthersForm">Others'</a>
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
