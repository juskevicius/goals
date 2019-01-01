import React from 'react';
import axios from 'axios';

export default class Units extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      units: '',
      users: ''
    }
  }

  componentDidMount() {
    axios.get('/units')
      .then(response => {
        /*console.log(response);*/
        this.setState({
          units: response.data.units,
          users: response.data.users
        });
      });
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { name, owner, unitType } = this.state;
    console.log(name);
    console.log(owner);
    console.log(unitType);
    console.log("state: ");
    console.log(this.state);
  }

  render() {
    return(
      <div>
        <form>
          <label>Unit name:
            <input type='text' name='name' value={this.state.name || ''} onChange={this.handleChange}></input>
          </label>
          <label>Owner:
            <select name='owner' value={this.state.owner} onChange={this.handleChange}>
              {this.state.users && this.state.users.map((user) => { return <option key={user._id} value={user._id}>{user.name}</option>;})}
            </select>
          </label>
          <label>Unit type:
            <select name='unitType' value={this.state.unitType} onChange={this.handleChange}>
              <option value="">Choose</option>
              <option value='Country'>Country</option>
              <option value='Department'>Department</option>
              <option value='Group'>Group</option>
            </select>
          </label>
          <label>Parent to:
            {this.state.units && this.state.units.map((unit, index) => { return <label key={unit._id}>{unit.name}<input type='checkbox' name='parentTo' key={unit._id} checked={this.state.parentTo} onChange={this.handleChange}></input></label>;})}
          </label>
          <label>Child to:
            {this.state.units && this.state.units.map((unit, index) => { return <label key={unit._id}>{unit.name}<input type='checkbox' name={'childTo' + index} key={unit._id} checked={this.state['childTo' + index]} onChange={this.handleChange}></input></label>;})}
          </label>
          <input type='submit' onClick={this.handleSubmit}></input>
        </form>
      </div>
    );
  }

  /*

  form(action="/units" method="post" href="")
  
  
  .form-group.save-btn
    input.btn.btn-default(type="submit" value="Save")

.fontainer-fluid
.row
.col-xs-1
.col-xs-4
P //////////////////////////////// COUNTRIES:
each unit in units
  if unit.unitType == "Country"
    form(action="/unitsUpdate", method="post", href="#", enctype='application/json')
      <br/>
      <br/>
      .form-group
        label(for="name") Name:
        <br/>
        input(type="text" name="name" value=unit.name)
      
      .form-group
        label(for="id") Id:
        <br/>
        input(type="text" name="id" value=unit.id readonly)
      
      .form-group
        label(for="owner") Owner:
          select.form-control(name="owner")
            each owner in owners
              if owner._id == unit.owner.id
                option(value=owner._id selected) #{owner.name}
              else
                option(value=owner._id) #{owner.name}
      
      .form-group
        label(for="childTo") Edit parents:
        <br/>
        each val in units
          if val.unitType == "Country"
            |  #{val.name}
            input(type="checkbox" name="childTo" value=val._id)
        <br/>
        each val in units
          if val.unitType == "Department"
            |  #{val.name}
            input(type="checkbox" name="childTo" value=val._id)
        <br/>
        each val in units
          if val.unitType == "Group"
            |  #{val.name}
            input(type="checkbox" name="childTo" value=val._id)
      if unit.childTo.length > 0
        p <strong>Current parents:</strong>
        each parent in unit.childTo
          p= parent.name
       
      .form-group
        label(for="parentTo") Edit Children:
        <br/>
        each val in units
          if val.unitType == "Country"
            |  #{val.name}
            input(type="checkbox" name="parentTo" value=val._id)
        <br/>
        each val in units
          if val.unitType == "Department"
            |  #{val.name}
            input(type="checkbox" name="parentTo" value=val._id)
        <br/>
        each val in units
          if val.unitType == "Group"
            |  #{val.name}
            input(type="checkbox" name="parentTo" value=val._id)
      if unit.parentTo.length > 0
        p <strong>Current children:</strong>
        each child in unit.parentTo
          p= child.name
      button.btn.btn-default(type="submit") update
      button.btn.btn-default(type="submit" formaction="/unitsDelete") delete
    p _________________________________________________
<br/>
<br/>
<br/>
P //////////////////////////////// DEPARTMENTS:
each unit in units
  if unit.unitType == "Department"
    form(action="/unitsUpdate", method="post", href="#", enctype='application/json')
      <br/>
      <br/>
      .form-group
        label(for="name") Name:
        <br/>
        input(type="text" name="name" value=unit.name)
      
      .form-group
        label(for="id") Id:
        <br/>
        input(type="text" name="id" value=unit.id readonly)
      
      .form-group
        label(for="owner") Owner:
          select.form-control(name="owner")
            each owner in owners
              if owner._id == unit.owner.id
                option(value=owner._id selected) #{owner.name}
              else
                option(value=owner._id) #{owner.name}
      
      .form-group
        label(for="childTo") Edit parents:
        <br/>
        each val in units
          if val.unitType == "Country"
            |  #{val.name}
            input(type="checkbox" name="childTo" value=val._id)
        <br/>
        each val in units
          if val.unitType == "Department"
            |  #{val.name}
            input(type="checkbox" name="childTo" value=val._id)
        <br/>
        each val in units
          if val.unitType == "Group"
            |  #{val.name}
            input(type="checkbox" name="childTo" value=val._id)
      if unit.childTo.length > 0
        p <strong>Current parents:</strong>
        each parent in unit.childTo
          p= parent.name
       
      .form-group
        label(for="parentTo") Edit Children:
        <br/>
        each val in units
          if val.unitType == "Country"
            |  #{val.name}
            input(type="checkbox" name="parentTo" value=val._id)
        <br/>
        each val in units
          if val.unitType == "Department"
            |  #{val.name}
            input(type="checkbox" name="parentTo" value=val._id)
        <br/>
        each val in units
          if val.unitType == "Group"
            |  #{val.name}
            input(type="checkbox" name="parentTo" value=val._id)
      if unit.parentTo.length > 0
        p <strong>Current children:</strong>
        each child in unit.parentTo
          p= child.name
      button.btn.btn-default(type="submit") update
      button.btn.btn-default(type="submit" formaction="/unitsDelete") delete
    p _________________________________________________
<br/>
<br/>
<br/>
P //////////////////////////////// GROUPS:
each unit in units
  if unit.unitType == "Group"
    form(action="/unitsUpdate", method="post", href="#", enctype='application/json')
      <br/>
      <br/>
      .form-group
        label(for="name") Name:
        <br/>
        input(type="text" name="name" value=unit.name)
      
      .form-group
        label(for="id") Id:
        <br/>
        input(type="text" name="id" value=unit.id readonly)
      
      .form-group
        label(for="owner") Owner:
          select.form-control(name="owner")
            each owner in owners
              if owner._id == unit.owner.id
                option(value=owner._id selected) #{owner.name}
              else
                option(value=owner._id) #{owner.name}
      
      .form-group
        label(for="childTo") Edit parents:
        <br/>
        each val in units
          if val.unitType == "Country"
            |  #{val.name}
            input(type="checkbox" name="childTo" value=val._id)
        <br/>
        each val in units
          if val.unitType == "Department"
            |  #{val.name}
            input(type="checkbox" name="childTo" value=val._id)
        <br/>
        each val in units
          if val.unitType == "Group"
            |  #{val.name}
            input(type="checkbox" name="childTo" value=val._id)
      if unit.childTo.length > 0
        p <strong>Current parents:</strong>
        each parent in unit.childTo
          p= parent.name
       
      .form-group
        label(for="parentTo") Edit Children:
        <br/>
        each val in units
          if val.unitType == "Country"
            |  #{val.name}
            input(type="checkbox" name="parentTo" value=val._id)
        <br/>
        each val in units
          if val.unitType == "Department"
            |  #{val.name}
            input(type="checkbox" name="parentTo" value=val._id)
        <br/>
        each val in units
          if val.unitType == "Group"
            |  #{val.name}
            input(type="checkbox" name="parentTo" value=val._id)
      if unit.parentTo.length > 0
        p <strong>Current children:</strong>
        each child in unit.parentTo
          p= child.name
      button.btn.btn-default(type="submit") update
      button.btn.btn-default(type="submit" formaction="/unitsDelete") delete
    p _________________________________________________
*/



}