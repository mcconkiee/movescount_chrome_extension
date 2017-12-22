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
}
export default new ApiHelper();
