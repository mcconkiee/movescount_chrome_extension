class ChromeHelper {
  cookie() {
    return new Promise((resolve) => {
      chrome.cookies.get({ name: 'MovesCountCookie', url: 'http://www.movescount.com' }, (cookie) => {
        resolve(cookie);
      });
    });
  }
}
// module.exports = ChromeHelper;
export default new ChromeHelper();
