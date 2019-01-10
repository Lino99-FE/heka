import regeneratorRuntime from '../../utils/runtime.js'
import util from '../../utils/util.js'
import zodiacData from '../../utils/zodiacData.js'
import constellationData from '../../utils/constellationData.js'

const app = getApp()
const choiceIndex = 2

Page({
  data: {
    zodiacIndex: [choiceIndex],
    zodiac: zodiacData,
    constellationIndex: [choiceIndex],
    constellation: constellationData,
    pickerZodiac: zodiacData[choiceIndex],
    pickerConstellation: constellationData[choiceIndex],
  },

  async onLoad() {
    // 下载字体
    app.loadArtFont();
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