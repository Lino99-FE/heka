import apiData from '../config/api.js';
import * as configObj from '../config/index.js';

class Http {
  request(api, params = {}, queryString = '') {
    let url = configObj.baseURL + apiData[api].url;
    if (queryString !== '') {
      url = url.replace('{queryString}', queryString)
    }
    const header = Object.assign({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }, params.header);
    const data = params.data || {};
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        method: apiData[api].type || 'get',
        data,
        header,
        success(res) {
          let data = res.data
          data = data.data
          if (configObj.env == 'dev') {
            // console.log('--------result-------', res.data)
          }
          resolve(res)
        },
        fail(err) {
          reject(err);
        }
      })
    }) 
  }
}

export default Http;