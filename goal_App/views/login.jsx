import React from 'react';
import Head from './components/head.jsx';
 
class Content extends React.Component {  

  render() {
    return (
      <html>
        <head>
          <Head />
        </head>
        <body className="login-screen">
          <main>
            <img className="logo" src="/images/Norian_grow_logo2.png"></img>
            <form action="http://127.0.0.1:3000/login" method="post" href="#" encType='application/json'>
              <label>id:</label>
              <input type="text" name="empId"></input>
              <label>password:</label>
              <input type="password" name="password"></input>
              <button type="submit" value="submit">Submit</button>
            </form>
          </main>
        </body>
      </html>
    )
  }
}

export default Content;