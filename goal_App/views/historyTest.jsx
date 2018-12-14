import React from 'react';

 
class Content extends React.Component {  

  /*{child.history.data.map((entry) => { return (<div>Date: {entry.date}; Value: {entry.value}</div>)})}*/
  /* <div>{this.props.goal.parentTo.map((child) => { return child.history.data.map((entry) => { return entry.date;}); })}</div>; */

  render() {

    const hOfChildren = () => {
      let h = this.props.goal.parentTo.map((child) => { return (
        <div><br />{child.owner.name}:{child.history.data.map((entry) => {
          return (
            <div>
              <div>Date: {JSON.stringify(entry.date)}</div>
              <div>Value: {entry.value}</div>
            </div>
          );
        })}Weight: {child.weight}<br /></div>
      ) }); 


      return h;
    }

    return (
      <html>
        <head>
        </head>
        <body>
          <main>
            <div>Goal:</div>
            <br />
            <div>{this.props.goal.name}</div>
            <br />
            <div>History:</div>
            <br />
            <div>{this.props.goal.history.data[0].value}</div>
            <br />
            <div>History of children:</div>
            {hOfChildren()}
            <br />
            <br />
            {JSON.stringify(this.props.goal.history)}
            <br />
            <br />
            <div>Experiment</div>
            {JSON.stringify(this.props.goal.recalcHistory)}
          </main>
        </body>
      </html>
    )
  }
}

export default Content;