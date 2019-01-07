import regeneratorRuntime from '../../utils/runtime.js'
import util from '../../utils/util.js'
import zodiacData from '../../utils/zodiacData.js'
import constellationData from '../../utils/constellationData.js'

const app = getApp()
const choiceIndex = 5

Page({
  data: {
    zodiacIndex: [choiceIndex],
    zodiac: zodiacData,
    constellationIndex: [choiceIndex],
    constellation: constellationData,
    pickerZodiac: zodiacData[choiceIndex],
    pickerConstellation: constellationData[choiceIndex],
    userInfoAuthFlag: false,
  },

  async onLoad() {
    userInfoAuthFlag = false
    // 校验是否有授权
    let {
      userInfoAuthFlag
    } = this.data
    try {
      const { authSetting } = await util.getSettingWx()
      if (authSetting && authSetting['scope.userInfo']) {
        const { userInfo } = await util.getUserInfoWx()
        userInfoAuthFlag = true
        app.globalData.userInfo = userInfo
      }
    } catch (e) {
      console.warn(e)
    } finally {
      this.setData({
        userInfoAuthFlag
      })
    }
  },

  userInfoCallBack(e) {
    const {
      detail
    } = e
    if (detail.userInfo) {
      this.setData({
        userInfoAuthFlag: true
      })
      app.globalData.userInfo = detail.userInfo
      this.goMakeCard()
    } else {
      wx.showModal({
        title: '提示',
        content: '请允许授权，以便制作贺卡',
        showCancel: false
      })
    }
  },

  zodiacBindChange(e) {
    const {
      value
    } = e.detail
    const {
      zodiac
    } = this.data
    this.setData({
      pickerZodiac: zodiac[value[0]]
    })
  },

  constellationBindChange(e) {
    const {
      value
    } = e.detail
    const {
      constellation
    } = this.data
    this.setData({
      pickerConstellation: constellation[value[0]]
    })
  },

  goMakeCard() {
    const { pickerZodiac, pickerConstellation} = this.data
    wx.navigateTo({
      url: `/pages/makeCard/makeCard?zodiacname=${pickerZodiac.name}&zodiac=${pickerZodiac.value}&constellation=${pickerConstellation.value}`,
    })
  },

  goLandScape() {
    wx.navigateTo({
      url: `/pages/landScape/landScape`,
    })
  },

  goNews() {
    wx.navigateTo({
      url: `/pages/news/news`,
    })
  }
})