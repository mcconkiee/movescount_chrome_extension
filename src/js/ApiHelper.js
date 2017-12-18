import axios from 'axios';
class ApiHelper {
  constructor() {}
  fetch(endpoint) {
    return new Promise((resolve, reject) => {
      const self = this;
      axios
        .get(endpoint)
        .then(response => {
          console.log(response);
          const json = response.data;
          resolve(json);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
export default new ApiHelper();
