class ChromeHelper {
  cookie() {
    return new Promise((resolve) => {
      chrome.cookies.get({ name: 'MovesCountCookie', url: 'http://www.movescount.com' }, (cookie) => {
        const reqCookie = `${cookie.name}=${cookie.value}`;
        resolve({ cookie, forRequest: reqCookie });
      });
    });
  }
}
// module.exports = ChromeHelper;
export default new ChromeHelper();
