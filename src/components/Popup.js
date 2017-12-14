import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import icon from '../assets/icon128.png';
import '../styles/index.css';

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
      <div>
        <ul>
          {sample.map(s => (
            <div key={s.MoveID}>
              <a
                onClick={e => {
                  console.log(s);
                }}
                href={`http://www.movescount.com/move/export?id=${s.MoveID}?format=gpx`}
              >
                {moment(s.StartTime).format('MMM DD, YYYY')}
              </a>
            </div>
          ))}
        </ul>
        {this.state.page > 1 ? (
          <a
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
      .get('http://www.movescount.com/Move/MoveList', {
        headers: { cookie: this.state.cookie }
      })
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
