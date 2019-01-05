import apiData from '../config/api.js';
import * as configObj from '../config/index.js';

class Http {
  request(api, params) {
    console.log(configObj)
    const url = configObj.baseURL + apiData[api].url;
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
            console.log('--------result-------', res.data)
          }
          resolve(res.data.data)
        },
        fail(err) {
          reject(err);
        }
      })
    }) 
  }
}

export default Http;