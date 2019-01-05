import Http from './utils/http.js'
import regeneratorRuntime from './utils/runtime.js'

const http = new Http();

App({
  async onLaunch () {

  },
  globalData: {
    userInfo: null
  },
  async apiRequst(api, params = {}) {
    return await http.request(api, params);
  }
})