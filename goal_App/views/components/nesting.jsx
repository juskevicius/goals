import React from 'react';

export default class Nesting extends React.Component {
  render() {

    const childName = this.props.goal.parentTo.map((child) => {return <li key={child.owner.id}>{child.owner.name}</li>;});
    const childInit = this.props.goal.parentTo.map((child) => {return <li key={child.owner.id}>{child.initScore}</li>;});
    //const childCurr = this.props.goal.parentTo.map((child) => {return <li key={child.owner.id}>{child.currScore}</li>;});
    const childTarg = this.props.goal.parentTo.map((child) => {return <li key={child.owner.id}>{child.targScore}</li>;});
    const childWeight = this.props.goal.parentTo.map((child) => {return <li key={child.owner.id}>{child.weight}</li>;});
  

    const parents = this.props.goal.childTo.map((parent) => {return <li key={parent.owner.id}>{parent.owner.name}</li>;});
    
    return (
      <div className="r-main2">
        <div className="main2-l-margin"></div>
        <div className="r-main2-header1">
          {childName.length > 0 && <h4>Parent to</h4>}
        </div>
        <div className="r-main2-header2">
          {childInit.length > 0 && <h4>Initial score</h4>}
        </div>
        <div className="r-main2-header3">
          <h4>Current score</h4>
        </div>
        <div className="r-main2-header4">
          {childTarg.length > 0 && <h4>Target score</h4>}
        </div>
        <div className="r-main2-header5">
          {childWeight.length > 0 && <h4>Weight</h4>}
        </div>
        <div className="main2-r-margin"></div>
        <div className="main2-l-margin"></div>
        <div className="parent-to">
          {childName.length > 0 && <ul>{childName}</ul>}
        </div>
        <div className="init-score">
          {childInit.length > 0 && <ul>{childInit}</ul>}
        </div>
        <div className="curr-score">
        </div>
        <div className="targ-score">
          {childTarg.length > 0 && <ul>{childTarg}</ul>}
        </div>
        <div className="score-weight">
          {childWeight.length > 0 && <ul>{childWeight}</ul>}
        </div>
        <div className="main2-r-margin"></div>
        

        <div>
          {parents.length > 0 && <h4>Child to</h4>}
          {parents.length > 0 && <ul>{parents}</ul>}
        </div>
      </div>
    )
  }
}