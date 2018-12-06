import React from 'react';

export default class Nesting extends React.Component {
  render() {
    return (
      <div>
        {this.props.info.childTo.length > 0 && <p>Child to:</p>}
        <p>{this.props.info.childTo.length}</p>
        {this.props.info.parentTo.length > 0 && <p>Parent to:</p>}
        <p>{this.props.info.parentTo.length}</p>
      </div>
    )
  }
}