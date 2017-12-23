import ConvertUnits from 'convert-units';
import moment from 'moment';
import React from 'react';
import '../styles/moverowitem.scss';

// eslint-disable-next-line prefer-stateless-function
const MoveRowItem = (props) => {
  const s = props.move;
  const url = `http://www.movescount.com/move/export?id=${s.MoveID}&format=gpx`;
  let distance = ConvertUnits(s.Distance)
    .from('m')
    .to('mi');
  distance = distance.toFixed(2);
  const suffix = ' miles';
  return (
    <div className="card mb-3 move-row-item">
      <h3 className="card-header row-title">
        <i className={`icon-${s.ActivityID} row-item-icon`} />
        <span className={`icon-${s.ActivityID} icon-text`}>
          {moment(s.StartTime).format('MMM DD, YYYY')} / {distance} {suffix}
        </span>
      </h3>
      <div className="card-body">
        <h5 className="card-title">
          {distance}
          {suffix}
        </h5>
        <h6 className="card-subtitle text-muted">Support card subtitle</h6>
      </div>
      <div className="card-body">
        <button
          onClick={() => {
            console.log(s, url);
            chrome.downloads.download({
              url,
              filename: `${s.MoveID}.gpx`, // Optional
            });
          }}
          className="card-link btn btn-secondary"
        >
          gpx
        </button>
        <button
          onClick={() => {
            // self.fetchRouteDetails().then((r) => {
            //   const dta = self.geoJsonForData(r);
            //   this.props.dispatch(setGPX(dta));
            // });
          }}
          className="card-link btn btn-secondary"
        >
          map
        </button>
      </div>
    </div>
  );
};

export default MoveRowItem;
