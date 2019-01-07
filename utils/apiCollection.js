import regeneratorRuntime from './runtime.js'

const app = getApp()

// 拿关键字
const getKeyWords = async () => {
  const time = new Date().getTime()
  let cardKeys = {}
  const keyWordsObj = wx.getStorageSync('keyWordsObj')
  if (keyWordsObj && keyWordsObj.data && (keyWordsObj.time + 86400000 * 7) >= time) {
    cardKeys = keyWordsObj.data
  } else {
    const keyRes = await app.apiRequst('keyWords')
    wx.setStorageSync('keyWordsObj', { data: keyRes.data, time })
    cardKeys = keyRes.data
  }
  return cardKeys
}

const getViews = async () => {
  const time = new Date().getTime()
  let obj = {}
  const viewsObj = wx.getStorageSync('viewsObj')
  if (viewsObj && viewsObj.data && (viewsObj.time + app.globalData.storageTime) >= time) {
    obj = viewsObj
  } else {
    const views = {}
    const viewRes = await app.apiRequst('views')
    for (const item of viewRes.data) {
      views[item.id] = item
    }
    obj = {
      data: views,
      time,
      baseData: viewRes.data
    }
    wx.setStorageSync('viewsObj', obj)
  }
  return obj
}

const getWishes = async () => {
  const time = new Date().getTime()
  let obj = {}
  const wishesObj = wx.getStorageSync('wishesObj')
  if (wishesObj && wishesObj.data && (wishesObj.time + app.globalData.storageTime) >= time) {
    obj = wishesObj
  } else {
    const wishes = {}
    const wishesRes = await app.apiRequst('wishes')
    for (const item of wishesRes.data) {
      wishes[item.id] = item
    }
    obj = {
      data: wishes,
      time,
      baseData: wishesRes.data
    }
    wx.setStorageSync('wishesObj', obj)
  }
  return obj
}

export default {
  getKeyWords,
  getViews,
  getWishes
}