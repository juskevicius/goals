import React from 'react';

export default class Nesting extends React.Component {
  render() {
    const parents = this.props.goal.childTo.map((parent) => {return <p>{parent.owner.name}</p>;});
    const children = this.props.goal.parentTo.map((child) => {return <p>{child.owner.name}</p>;});
    return (
      <div>
        {parents.length > 0 && <p>Child to:</p>}
        {parents}
        {children.length > 0 && <p>Parent to:</p>}
        {children}
      </div>
    )
  }
}