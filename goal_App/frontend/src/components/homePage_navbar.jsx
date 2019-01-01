import React from 'react';

export default class Navbar extends React.Component {
  render() {

    const orgChart = this.props.chart.parentTo.map((unit) => {return (
      <li key={unit._id}>
        <a href={'/myOwn/' + unit._id}>{unit.name}</a>
        <ul>{unit.parentTo.map((subUnit) => {return (
          <li key={subUnit._id}>
            <a href={'/myOwn/' + subUnit._id}>{subUnit.name}</a>
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
              <a href="/goals"><i className="fa fa-bullseye" style={{fontSize: 24 + "px"}}></i> Goals</a>
              <ul>
                <li>
                  <a href="/add" onClick={(event) => this.props.toggleDisplayForm('formAdd', event)}>Add</a>
                </li>
                <li>
                  <a href="/myOwn" onClick={(event) => this.props.toggleDisplayForm('formMyOwn', event)}>My goals</a>
                </li>
                <li>
                  <a href="/others" onClick={(event) => this.props.toggleDisplayForm('formOthers', event)}>Others'</a>
                </li>
                <li>
                  <a href="/rejected">Rejected</a>
                </li>
              </ul>
            </li>
            {this.props.userRole === 'admin' && 
            <li>
              <a href="/admin">Admin center</a>
              <ul>
                <li>
                  <a href="/units" onClick={(event) => this.props.toggleDisplayForm('units', event)}>Units</a>
                </li>
                <li>
                  <a href="/users" onClick={(event) => this.props.toggleDisplayForm('users', event)}>Users</a>
                </li>
              </ul>
            </li>}
          </ul>
        </nav>
      </div>  
    )
  }
}
