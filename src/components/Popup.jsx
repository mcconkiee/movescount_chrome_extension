import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../styles/index.scss';
import '../styles/theme.css';
import ApiHelper from '../js/ApiHelper';
import ChromeHelper from '../js/chrome-helpers';
import MoveRowItem from './MoveRowItem';

import reducers from '../redux/reducers';

const FILTER = {
  MOVES: 'MOVES',
  ROUTES: 'ROUTES',
  MAP: 'MAP',
};

// PAGINATION
// TODO - move to helper
const MAX_NUM = 100;
const paginate = function paginate(array, pageSize, pageNumber) {
  let pageNum = pageNumber;
  if (pageNumber < 1) {
    pageNum = 1;
  }
  --pageNum; // because pages logically start with 1, but technically with 0
  return array.slice(pageNum * pageSize, (pageNum + 1) * pageSize);
};

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookie: null,
      data: [],
      page: 1,
      chronological: true,
      loading: true,
    };
  }

  componentWillMount() {
    this.testAuth();
  }
  testAuth() {
    const self = this;
    ChromeHelper.cookie()
      .then((cookie) => {
        self.setState({ cookie, loading: false, filter: FILTER.MOVES });
        self.fetchMoves();
      })
      .catch((error) => {
        self.setState({ error, loading: false });
      });
  }

  movesUI() {
    // const isChronologicalNow = this.state.chronological;
    // const { data } = this.state;
    // const unsorted = [].concat(data);
    // let sorted = [];
    // if (!isChronologicalNow) {
    //   // order by start date
    //   sorted = unsorted.sort((a, b) => a.StartTime > b.StartTime);
    // } else {
    //   sorted = unsorted.sort((a, b) => a.StartTime < b.StartTime);
    // }

    // const sample = paginate(sorted, MAX_NUM, this.state.page);
    const sample = paginate(this.state.data, MAX_NUM, this.state.page);
    return (
      <div>
        <ul className="list-group">
          {sample.map(s => (
            <li key={s.MoveID} className="list-group-item">
              <MoveRowItem data={s} onError={e => this.setState({ error: e })} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  routesUI() {
    const sample = paginate(this.state.data, MAX_NUM, this.state.page);
    return (
      <div>
        <ul className="list-group">
          {sample.map(s => (
            <li key={s.RouteID} className="list-group-item">
              <MoveRowItem data={s} onError={e => this.setState({ error: e })} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  paginationUI() {
    return (
      <div className="btn-group paginationUI">
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            let { page } = this.state;
            page--;
            this.setState({ page });
          }}
        >
          prev
        </button>

        <button
          className="btn btn-outline-primary"
          onClick={() => {
            let { page } = this.state;
            page++;
            this.setState({ page });
          }}
        >
          next
        </button>
      </div>
    );
  }
  updateFilterState(filter) {
    this.setState({ filter, page: 1, data: [] });
    switch (filter) {
      case FILTER.MOVES:
        this.fetchMoves();
        break;
      case FILTER.ROUTES:
        this.fetchRoutes();
        break;
      case FILTER.MAP:
        this.fetchMapData();
        break;
      default:
        console.log('Unsupported filter action', filter);
    }
  }
  filterView() {
    const self = this;
    return (
      <div>
        <div className="btn-group">
          <button
            className={`btn btn-outline-secondary ${
              this.state.filter === FILTER.MOVES ? 'active' : null
            }`}
            onClick={() => {
              self.updateFilterState(FILTER.MOVES);
            }}
          >
            Moves
          </button>
          <button
            className={`btn btn-outline-secondary ${
              this.state.filter === FILTER.ROUTES ? 'active' : null
            }`}
            onClick={() => {
              self.updateFilterState(FILTER.ROUTES);
            }}
          >
            Routes
          </button>
        </div>
      </div>
    );
  }
  // TODO - add this :
  chronologicalFilter() {
    return (
      <div className="form-group">
        <label htmlFor="chronological">Show Newest First</label>
        <input
          className="form-control"
          type="checkbox"
          name="chronological"
          checked={`${this.state.chronological ? 'checked' : ''}`}
          onChange={() => {
            this.setState({ chronological: !this.state.chronological, page: 1 });
          }}
        />
      </div>
    );
  }

  viewForData() {
    return this.state.data.length > 0 ? (
      <div>{this.listMovesData()}</div>
    ) : (
      <div>
        <p>No data found</p>
      </div>
    );
  }
  listMovesData() {
    switch (this.state.filter) {
      case FILTER.MOVES:
        return this.movesUI();
      case FILTER.ROUTES:
        return this.routesUI();
      default:
        return <div>Unsupvported View</div>;
    }
  }
  fetchMoves() {
    const self = this;
    this.setState({ loading: true });
    ApiHelper.fetchMoves()
      .then((objects) => {
        self.setState({ data: objects, loading: false });
      })
      .catch((error) => {
        self.setState({ error, coookie: null, loading: false });
      });
  }
  fetchRoutes() {
    const self = this;
    this.setState({ loading: true });
    ApiHelper.fetchRoutes()
      .then((objects) => {
        self.setState({ data: objects, loading: false });
      })
      .catch((error) => {
        self.setState({ error, coookie: null, loading: false });
      });
  }
  fetchMapData() {
    this.setState({ data: [] });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Movescount Summary</h1>
        </header>
        {!this.state.cookie ? (
          <div>
            <h3>Please log into your Movescount account</h3>
          </div>
        ) : null}
        <div className="container">
          {this.state.loading ? (
            <div>
              <h3>loading...</h3>
            </div>
          ) : (
            <div>
              <div>{this.filterView()}</div>
              <div>{this.paginationUI()}</div>
              <div className="main-content">{this.viewForData()}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
Popup = connect(reducers)(Popup);
export default Popup;
