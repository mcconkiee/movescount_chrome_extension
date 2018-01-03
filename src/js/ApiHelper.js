import axios from 'axios';
import Constants from './Constants';
import ConvertUnits from 'convert-units';
import moment from 'moment';

class ApiHelper {
  constructor() {
    this.exportFormats = ['gpx', 'tcx', 'kml', 'fit'];
  }
  fetch(endpoint) {
    return new Promise((resolve, reject) => {
      axios
        .get(endpoint)
        .then((response) => {
          const json = response.data;
          resolve(json);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  fetchRoutes() {
    return this.fetch('http://www.movescount.com/api/routes/private').then((response) => {
      const json = response;
      const useMetric = localStorage.getItem(Constants.storageKeys.USE_METRIC) || false;
      const suffix = useMetric ? 'kms' : 'miles';
      json.forEach((pojo) => {
        pojo.dataType = 'ROUTE';
        let distance = ConvertUnits(pojo.Distance)
          .from('m')
          .to('mi');
        distance = distance.toFixed(2);
        pojo.exportUrlFor = function (format) {
          return `http://www.movescount.com/Move/ExportRoute/${pojo.RouteID}?format=${format}`;
        };
        pojo.DisplayTitle = pojo.Name;
        pojo.DisplaySubtitle = `${distance} ${suffix}`;
      });
      return json;
    });
  }
  fetchMoves() {
    return this.fetch('http://www.movescount.com/Move/MoveList').then((response) => {
      const json = response;
      const keys = Object.keys(json.Schema);
      const data = json.Data.reverse(); // array of arrays , each 52 big
      const objects = [];
      const useMetric = localStorage.getItem(Constants.storageKeys.USE_METRIC) || false;
      const suffix = useMetric ? 'kms' : 'miles';
      data.forEach((dataObject) => {
        const pojo = {};
        dataObject.forEach((dataValue, idx) => {
          pojo[keys[idx]] = dataValue;
        });
        pojo.dataType = 'MOVE';
        pojo.exportUrlFor = function (format) {
          return `http://www.movescount.com/move/export?id=${pojo.MoveID}&format=${format}`;
        };
        let distance = ConvertUnits(pojo.Distance)
          .from('m')
          .to('mi');
        distance = distance.toFixed(2);
        pojo.DisplayTitle = `${moment(pojo.StartTime).format('MMM DD, YYYY')} / ${distance} ${suffix}`;
        pojo.DisplaySubtitle = `${distance} ${suffix}`;
        objects.push(pojo);
      });
      return objects;
    });
  }
  downloadRoutes(cookie, options) {
    return this.fetchRoutes().then(routes =>
      new Promise((resolve, reject) => {
        const ids = routes.map(r => r.RouteID);
        axios
          .post('http://localhost:8080/routes', {
            cookie,
            type: 'route',
            format: options.format,
            sendTo: options.sendTo,
            data: ids,
          })
          .then((response) => {
            console.log(response, 'donwload complete');

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }));
  }
  downloadMoves(cookie, options) {
    return this.fetchMoves().then(moves =>
      new Promise((resolve, reject) => {
        // TODO - FILTER DATES BY RANGE IN OPTIONS
        let needle = moves;
        if (options.dates) {
          const start = options.dates.startDate;
          const end = options.dates.endDate;
          needle = needle.filter(m => moment(m.StartTime).isBetween(start, end));
        }
        // ids to download
        const ids = needle.map(m => m.MoveID);

        axios
          .post('http://localhost:8080/routes', {
            cookie,
            type: 'move',
            data: ids,
            options,
          })
          .then((response) => {
            console.log(response, 'donwload complete');

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }));
  }
}
export default new ApiHelper();
