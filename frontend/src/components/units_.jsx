import React from 'react';
import axios from 'axios';
import UnitsEdit from './units_edit';

export default class Units extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      units: '',
      users: '',
      parentTo: [],
      childTo: []
    }
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    axios.get('/units')
      .then(response => {
        this.setState({
          units: response.data.units,
          users: response.data.users
        });
      })
      .catch(error => {
        const errorMessage = error.response.data.errors.message;
        if (errorMessage.constructor === Array) {
          for (let i = 0; i < errorMessage.length; i++) {
            alert("Something went wrong with the field '" + errorMessage[i].param + "'\nError message: " + errorMessage[i].msg);
          }
        } else {
          alert(errorMessage);
        }
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
      this.setState(prevState => ({
        [name2]: [...prevState[name2], unitId]
      }));
    } else if (target.type === 'checkbox' && !target.checked) {
      const name2 = target.name.split('-')[0];
      const unitId = target.getAttribute("unit-id");
      this.setState(prevState => ({
        [name2]: prevState[name2].filter((unit) => { return unit !== unitId; })
      }));
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { name, owner, unitType, childTo, parentTo } = this.state;
    axios
      .post('/units', {name, owner, unitType, childTo, parentTo})
      .then(response => {
        if (response.status === 200) {
          alert("successfuly aded a unit");
          this.loadData();
        }
      })
      .catch(error => {
        const errorMessage = error.response.data.errors.message;
        if (errorMessage.constructor === Array) {
          for (let i = 0; i < errorMessage.length; i++) {
            alert("Something went wrong with the field '" + errorMessage[i].param + "'\nError message: " + errorMessage[i].msg);
          }
        } else {
          alert(errorMessage);
        }
      });
  }

  render() {     
    return(
      <div>
        <div className="form-units">
          <div className="form-header">Units</div>
          <div className="form-body">
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
              <label>Child to:<br />
                <br />Countries:<br />
                {this.state.units && this.state.units.filter((unit) => { return unit.unitType === 'Country'; }).map((unit) => { return <label className='parentTo' key={unit._id}>{unit.name}<input key={unit._id} type='checkbox' name={'childTo-' + unit.name} checked={this.state['childTo-' + unit.name] || false} onChange={this.handleChange} unit-id={unit._id}></input></label>;})}
                <br />Departments:<br />
                {this.state.units && this.state.units.filter((unit) => { return unit.unitType === 'Department'; }).map((unit) => { return <label className='parentTo' key={unit._id}>{unit.name}<input type='checkbox' name={'childTo-' + unit.name} checked={this.state['childTo-' + unit.name] || false} onChange={this.handleChange} unit-id={unit._id}></input></label>;})}
                <br />Groups:<br />
                {this.state.units && this.state.units.filter((unit) => { return unit.unitType === 'Group'; }).map((unit) => { return <label className='parentTo' key={unit._id}>{unit.name}<input type='checkbox' name={'childTo-' + unit.name} checked={this.state['childTo-' + unit.name] || false} onChange={this.handleChange} unit-id={unit._id}></input></label>;})}
                <br /><br />
              </label>
              <label>Parent to:<br />                
                <br />Countries:<br />
                {this.state.units && this.state.units.filter((unit) => { return unit.unitType === 'Country'; }).map((unit) => { return <label className='parentTo' key={unit._id}>{unit.name}<input type='checkbox' name={'parentTo-' + unit.name} checked={this.state['parentTo-' + unit.name] || false} onChange={this.handleChange} unit-id={unit._id}></input></label>;})}
                <br />Departments:<br />
                {this.state.units && this.state.units.filter((unit) => { return unit.unitType === 'Department'; }).map((unit) => { return <label className='parentTo' key={unit._id}>{unit.name}<input type='checkbox' name={'parentTo-' + unit.name} checked={this.state['parentTo-' + unit.name] || false} onChange={this.handleChange} unit-id={unit._id}></input></label>;})}
                <br />Groups:<br />
                {this.state.units && this.state.units.filter((unit) => { return unit.unitType === 'Group'; }).map((unit) => { return <label className='parentTo' key={unit._id}>{unit.name}<input type='checkbox' name={'parentTo-' + unit.name} checked={this.state['parentTo-' + unit.name] || false} onChange={this.handleChange} unit-id={unit._id}></input></label>;})}
                <br /><br />
              </label>
              <input type='submit' value='create a new unit' onClick={this.handleSubmit}></input>
            </form>
            <h1>Countries:</h1>
            {this.state.units && this.state.units.filter((unit) => { return unit.unitType === 'Country'; }).map((unit) => { return (
            <UnitsEdit key={unit._id} unit={unit} users={this.state.users} units={this.state.units} loadData={this.loadData}/>
            );})}

            <h1>Departments:</h1>
            {this.state.units && this.state.units.filter((unit) => { return unit.unitType === 'Department'; }).map((unit) => { return (
            <UnitsEdit key={unit._id} unit={unit} users={this.state.users} units={this.state.units} loadData={this.loadData}/>
            );})}

            <h1>Groups:</h1>
            {this.state.units && this.state.units.filter((unit) => { return unit.unitType === 'Group'; }).map((unit) => { return (
            <UnitsEdit key={unit._id} unit={unit} users={this.state.users} units={this.state.units} loadData={this.loadData}/>
            );})}
                
          </div>
        </div>  
      </div>
    );
  }
}