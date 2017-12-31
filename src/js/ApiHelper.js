import axios from 'axios';

class ApiHelper {
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
    return this.fetch('http://www.movescount.com/api/routes/private');
  }
  fetchMoves() {
    return this.fetch('http://www.movescount.com/Move/MoveList');
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
        const ids = moves.Data.map(m => m[0]);
        axios
          .post('http://localhost:8080/routes', {
            cookie,
            type: 'move',
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
}
export default new ApiHelper();
