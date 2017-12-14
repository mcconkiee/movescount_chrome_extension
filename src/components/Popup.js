import axios from 'axios';
import MoveRowItem from './MoveRowItem';
import React, { Component } from 'react';
import icon from '../assets/icon128.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/index.css';
import '../styles/theme.css';
const MAX_NUM = 100;

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = { cookie: null, moves: null, page: 1, pageContent: [] };
  }
  componentWillMount() {
    const self = this;
    chrome.cookies.get(
      { name: 'MovesCountCookie', url: 'http://www.movescount.com' },
      cookie => {
        console.log(cookie, 'coookie');
        self.setState({ cookie: cookie });
        self.fetchData();
      }
    );
  }
  test() {
    console.log(this, 'test');
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {this.state.moves ? this.listData() : null}
      </div>
    );
  }
  paginate(array, page_size, page_number) {
    --page_number; // because pages logically start with 1, but technically with 0
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
  }
  listData() {
    const sample = this.paginate(this.state.moves, MAX_NUM, this.state.page);
    return (
      <div className="container">
        <ul>{sample.map(s => <MoveRowItem key={s.MoveID} move={s} />)}</ul>
        {this.state.page > 1 ? (
          <a
            className="btn btn-default"
            href="#"
            onClick={e => {
              let page = this.state.page;
              page--;
              this.setState({ page: page });
            }}
          >
            prev
          </a>
        ) : null}
        <a
          className="btn btn-default"
          href="#"
          onClick={e => {
            let page = this.state.page;
            page++;
            console.log(page, 'next');
            this.setState({ page: page });
          }}
        >
          next
        </a>
      </div>
    );
  }
  fetchData() {
    const self = this;
    axios
      .get('http://www.movescount.com/Move/MoveList')
      .then(response => {
        console.log(response);
        const json = response.data;
        const keys = Object.keys(json.Schema);
        const data = json.Data; //array of arrays , each 52 big
        let objects = [];
        data.forEach(dataObject => {
          let pojo = {};
          dataObject.forEach((dataValue, idx) => {
            pojo[keys[idx]] = dataValue;
          });
          objects.push(pojo);
        });
        console.log(objects);
        self.setState({ moves: objects });
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default Popup;
