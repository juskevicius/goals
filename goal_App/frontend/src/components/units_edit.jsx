import React from 'react';
import axios from 'axios';

export default class UnitsEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.unit._id,
      name: this.props.unit.name,
      owner: this.props.unit.owner._id,
      unitType: this.props.unit.unitType
    }
  }

  componentDidMount() {
    this.props.unit.parentTo.map((unit) => {
      return this.setState({
        ['parentTo-' + unit.name]: true
      });
    });
    this.props.unit.childTo.map((unit) => {
      return this.setState({
        ['childTo-' + unit.name]: true
      });
    });
    const children = this.props.unit.parentTo.map((unit) => { return unit._id; });
    const parents = this.props.unit.childTo.map((unit) => { return unit._id; });
    this.setState({
      parentTo: children,
      childTo: parents
    });
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
    if (target.type === 'checkbox' && target.checked) {
      const name2 = target.name.split('-')[0];
      const unitId = target.getAttribute("unit-id");
      this.setState(prevstate => ({
        [name2]: [...prevstate[name2], unitId]
      }));
    } else if (target.type === 'checkbox' && !target.checked) {
      const name2 = target.name.split('-')[0];
      const unitId = target.getAttribute("unit-id");
      this.setState(prevstate => ({
        [name2]: prevstate[name2].filter((unit) => { return unit !== unitId; })
      }));
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { id, name, owner, unitType, childTo, parentTo } = this.state;
    axios
      .post('/unitsUpdate', { id, name, owner, unitType, childTo, parentTo})
      .then(response => {
        if (response.status === 200) {
          if (response.data.constructor === Array) {
            for (let i = 0; i < response.data.length; i++) {
              alert("Something went wrong with the field '" + response.data[i].param + "'\nError message: " + response.data[i].msg);
            }
            return;
          }
          alert("successfuly updated a unit");
          this.props.loadData();
        }
      });
  }

  handleSubmit2 = (event) => {
    event.preventDefault();
    const { id } = this.state;
    axios
      .post('/unitsDelete', { id })
      .then(response => {
        if (response.status === 200) {
          if (response.data.constructor === Array) {
            for (let i = 0; i < response.data.length; i++) {
              alert("Something went wrong with the field '" + response.data[i].param + "'\nError message: " + response.data[i].msg);
            }
            return;
          }
          alert("successfuly deleted a unit");
          this.props.loadData();
        }
      });
  }


  render() {
    return (
      <div className='form-editUnits'>
        <form>
          <label><h2>Name:</h2>
            <input name='name' value={this.state.name} onChange={this.handleChange}></input>
          </label>
          <label><h2>Owner:</h2>
            <select name='owner' value={this.state.owner} onChange={this.handleChange}>
              {this.props.users && this.props.users.map((user) => { return <option key={user._id} value={user._id}>{user.name}</option>;})}
            </select>
          </label>
          <label><h3>Unit type:</h3>
            <select name='unitType' value={this.state.unitType} onChange={this.handleChange}>
              <option value="">Choose</option>
              <option value='Country'>Country</option>
              <option value='Department'>Department</option>
              <option value='Group'>Group</option>
            </select>
          </label>
          <label><h3>Child to:</h3>
            Countries:<br />
            {this.props.units && this.props.units.filter((unit) => { return unit.unitType === 'Country'; }).map((unit) => { return <label className='parentTo' key={unit._id}>{unit.name}<input type='checkbox' name={'childTo-' + unit.name} checked={this.state['childTo-' + unit.name] || false} onChange={this.handleChange} unit-id={unit._id}></input></label>;})}
            <br />Departments:<br />
            {this.props.units && this.props.units.filter((unit) => { return unit.unitType === 'Department'; }).map((unit) => { return <label className='parentTo' key={unit._id}>{unit.name}<input type='checkbox' name={'childTo-' + unit.name} checked={this.state['childTo-' + unit.name] || false} onChange={this.handleChange} unit-id={unit._id}></input></label>;})}
            <br />Groups:<br />
            {this.props.units && this.props.units.filter((unit) => { return unit.unitType === 'Group'; }).map((unit) => { return <label className='parentTo' key={unit._id}>{unit.name}<input type='checkbox' name={'childTo-' + unit.name} checked={this.state['childTo-' + unit.name] || false} onChange={this.handleChange} unit-id={unit._id}></input></label>;})}
            <br /><br />
          </label>
          <label><h3>Parent to:</h3>            
            Countries:<br />
            {this.props.units && this.props.units.filter((unit) => { return unit.unitType === 'Country'; }).map((unit) => { return <label className='parentTo' key={unit._id}>{unit.name}<input type='checkbox' name={'parentTo-' + unit.name} checked={this.state['parentTo-' + unit.name] || false} onChange={this.handleChange} unit-id={unit._id}></input></label>;})}
            <br />Departments:<br />
            {this.props.units && this.props.units.filter((unit) => { return unit.unitType === 'Department'; }).map((unit) => { return <label className='parentTo' key={unit._id}>{unit.name}<input type='checkbox' name={'parentTo-' + unit.name} checked={this.state['parentTo-' + unit.name] || false} onChange={this.handleChange} unit-id={unit._id}></input></label>;})}
            <br />Groups:<br />
            {this.props.units && this.props.units.filter((unit) => { return unit.unitType === 'Group'; }).map((unit) => { return <label className='parentTo' key={unit._id}>{unit.name}<input type='checkbox' name={'parentTo-' + unit.name} checked={this.state['parentTo-' + unit.name] || false} onChange={this.handleChange} unit-id={unit._id}></input></label>;})}
            <br /><br />
          </label>
          <input type='submit' value='update' onClick={this.handleSubmit}></input>
          <input type='submit' value='remove' onClick={this.handleSubmit2}></input>
        </form>
      </div>
    );
  }

}