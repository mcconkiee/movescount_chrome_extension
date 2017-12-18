import ApiHelper from '../js/ApiHelper';
import axios from 'axios';
import ChromeHelper from '../js/chrome-helpers';
import ff from 'ff';
import MoveRowItem from './MoveRowItem';
import React, { Component } from 'react';
import icon from '../assets/icon128.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/index.css';
import '../styles/theme.css';

const MAX_NUM = 100;
const paginate = function paginate(array, page_size, page_number) {
  --page_number; // because pages logically start with 1, but technically with 0
  return array.slice(page_number * page_size, (page_number + 1) * page_size);
};

const FILTER = {
  MOVES: 'MOVES',
  ROUTES: 'ROUTES',
  MAP: 'MAP'
};

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookie: null,
      moves: [],
      page: 1,
      pageContent: [],
      loading: true
    };
  }
  componentWillMount() {
    this.testAuth();
  }
  testAuth() {
    const self = this;
    ChromeHelper.cookie()
      .then(cookie => {
        console.log(cookie, 'coookie');
        self.setState({ cookie: cookie, loading: false, filter: FILTER.MOVES });
        self.fetchMoves();
      })
      .catch(error => {
        self.setState({ error: error, loading: false });
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            <i className="icon-4" />
            Movescount Summary
          </h1>
        </header>
        {!this.state.cookie ? (
          <div>
            <h3>Please log into your Movescount account</h3>
          </div>
        ) : null}
        {this.state.loading ? (
          <div>
            <h3>loading...</h3>
          </div>
        ) : (
          <div className="container">
            <div>{this.filterView()}</div>
            <div>{this.paginationUI()}</div>
            <div>{this.viewForData()}</div>
          </div>
        )}
      </div>
    );
  }
  filterView() {
    const self = this;
    return (
      <div className="btn-group">
        <a
          href="#"
          className={`btn btn-outline-secondary ${this.state.filter ===
          FILTER.MOVES
            ? 'active'
            : null}`}
          onClick={e => {
            self.setState({ filter: FILTER.MOVES });
            self.fetchMoves();
          }}
        >
          Moves
        </a>
        <a
          href="#"
          className={`btn btn-outline-secondary ${this.state.filter ===
          FILTER.ROUTES
            ? 'active'
            : null}`}
          onClick={e => {
            self.setState({ filter: FILTER.ROUTES });
            self.fetchRoutes();
          }}
        >
          Routes
        </a>
        <a
          href="#"
          className={`btn btn-outline-secondary ${this.state.filter ===
          FILTER.MAP
            ? 'active'
            : null}`}
          onClick={e => {
            self.setState({ filter: FILTER.MAP });
          }}
        >
          Map
        </a>
      </div>
    );
  }
  paginationUI() {
    return (
      <div className="btn-group paginationUI">
        <a
          className="btn btn-outline-primary"
          href="#"
          onClick={e => {
            let page = this.state.page;
            page--;
            this.setState({ page: page });
          }}
        >
          prev
        </a>

        <a
          className="btn btn-outline-primary"
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
  viewForData() {
    return (this.state.moves.length > 0 ? (
      this.listData()
    ) : (
      <div>
        <p>No moves found</p>
      </div>
    ): null);
  }
  listData() {
    const sample = paginate(this.state.moves, MAX_NUM, this.state.page);
    console.log(sample, 'page', this.state.page);
    return (
      <div>
        <ul className="list-group">
          {sample.map(s => (
            <li key={s.MoveID} className="list-group-item">
              <MoveRowItem move={s} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  fetchMoves() {
    const self = this;
    console.log('fetchMoves');
    ApiHelper.fetch('http://www.movescount.com/Move/MoveList')
      .then(response => {
        const json = response;
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
        self.setState({ moves: objects, loading: false });
      })
      .catch(error => {
        self.setState({ error: error, coookie: null });
      });
  }
  fetchRoutes() {
    const self = this;
    ApiHelper.fetch('http://www.movescount.com/api/routes/private')
      .then(response => {
        const json = response;
        console.log(json);
        // const keys = Object.keys(json.Schema);
        // const data = json.Data; //array of arrays , each 52 big
        // let objects = [];
        // data.forEach(dataObject => {
        //   let pojo = {};
        //   dataObject.forEach((dataValue, idx) => {
        //     pojo[keys[idx]] = dataValue;
        //   });
        //   objects.push(pojo);
        // });
        // console.log(objects);
        // self.setState({ moves: objects, loading: false });
      })
      .catch(error => {
        self.setState({ error: error, coookie: null });
      });
  }
}

export default Popup;
