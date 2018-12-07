import React from 'react';

export default class Nesting extends React.Component {
  render() {
    const parents = this.props.goal.childTo.map((parent) => {return <li key={parent.owner.id}>{parent.owner.name}</li>;});
    const children = this.props.goal.parentTo.map((child) => {return <li key={child.owner.id}>{child.owner.name}</li>;});
    return (
      <div className="r-main2">
        <div className="main2-l-margin"></div>
        <div className="parent-child">
          {parents.length > 0 && <h4>Child to:</h4>}
          {parents.length > 0 && <ul>{parents}</ul>}
          {children.length > 0 && <h4>Parent to:</h4>}
          {children.length > 0 && <ul>{children}</ul>}
        </div>
      </div>
    )
  }
}