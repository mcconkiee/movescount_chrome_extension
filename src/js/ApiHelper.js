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
    return this.fetch('http://www.movescount.com/api/routes/private')
  }
}
export default new ApiHelper();
