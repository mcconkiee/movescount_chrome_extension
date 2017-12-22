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
    <div className="move-row-item">
      <button
        onClick={() => {
          console.log(s, url);
          chrome.downloads.download({
            url,
            filename: `${s.MoveID}.gpx`, // Optional
          });
        }}
      >
        <div className="row-title">
          <i className={`icon-${s.ActivityID} row-item-icon`} />
          <span className={`icon-${s.ActivityID} icon-text`}>
            {moment(s.StartTime).format('MMM DD, YYYY')} / {distance}
            {suffix}
          </span>
        </div>
      </button>
    </div>
  );
};

export default MoveRowItem;
