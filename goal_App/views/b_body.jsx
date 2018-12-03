import React from 'react';
import Header from './b_head.jsx';

class Body extends React.Component {
  render() {
    return (
      <body>
        <header></header>
        <main>
          <div className="navbar">
            <nav>
              <ul className="nav">
                <li>
                  <a href="#"><i className="fa fa-sitemap" style={{fontSize: 24 + "px"}}></i> Lithuania</a>
                  <ul>
                    <li>
                      <a href="#">Dep1</a>
                      <ul>
                        <li>
                          <a href="#">Unit0</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Dep2</a>
                      <ul>
                        <li>
                          <a href="#">Unit1</a>
                        </li>
                        <li>
                          <a href="#">Unit2</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Dep3</a>
                      <ul>
                        <li>
                          <a href="#">Unit3</a>
                        </li>
                        <li>
                          <a href="#">Unit4</a>
                        </li>
                        <li>
                          <a href="#">Unit5</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Dep4</a>
                      <ul>
                        <li>
                          <a href="#">Unit6</a>
                        </li>
                        <li>
                          <a href="#">Unit7</a>
                        </li>
                        <li>
                          <a href="#">Unit8</a>
                        </li>
                        <li>
                          <a href="#">Unit9</a>
                        </li>
                        <li>
                          <a href="#">Unit10</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                <a href="#"><i className="fa fa-bullseye" style={{fontSize: 24 + "px"}}></i> Goals</a>
                  <ul>
                    <li>
                      <a href="#">Dep1</a>
                      <ul>
                        <li>
                          <a href="#">Unit0</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Dep2</a>
                      <ul>
                        <li>
                          <a href="#">Unit1</a>
                        </li>
                        <li>
                          <a href="#">Unit2</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </main>
      </body>
    )
  }
}

class Content extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Body />
      </div>
    )
  }
}


export default Content;