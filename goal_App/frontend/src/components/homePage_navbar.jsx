import React from 'react';
import FormMyOwn from './form_myOwn_';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      someUnit: ''
    }
  }


  toggleDisplayForm = (form, event) => {
    event.preventDefault();
    if (this.state[form]) { 
      if (event.target === event.currentTarget) {
        this.setState({ /* if the form is currently visible, then hide it */
          [form]: false
        });
      }
    } else {
      this.setState({
        [form]: true
      });
    }
  }
  
  viewOthersGoals = (event) => {
    event.preventDefault();
    const unitID = event.target.getAttribute('href');
    this.setState({
      someUnit: unitID
    }, 
      this.toggleDisplayForm('formMyOwn', event)
    );
  }
  
  
  render() {

    const orgChart = this.props.chart && this.props.chart.parentTo.map((unit) => {return (
      <li key={unit._id}>
        <a href={unit._id} onClick={this.viewOthersGoals}>{unit.name}</a>
        <ul>{unit.parentTo.map((subUnit) => {return (
          <li key={subUnit._id}>
            <a href={subUnit._id} onClick={this.viewOthersGoals}>{subUnit.name}</a>
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
              <a href={this.props.chart && this.props.chart._id} onClick={this.viewOthersGoals}><i className="fa fa-sitemap" style={{fontSize: 24 + "px"}}></i> Enterprise</a>
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
              </ul>
            </li>
            {this.props.userRole === 'admin' && (
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
            </li>)} 
          </ul>
        </nav>
        {this.state.formMyOwn && <FormMyOwn unitID={this.state.someUnit} toggleDisplayForm={this.toggleDisplayForm} updateGoalToDisplay={this.props.updateGoalToDisplay}/>}
      </div>  
    )
  }
}
