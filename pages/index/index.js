import regeneratorRuntime from '../../utils/runtime.js'
import util from '../../utils/util.js'
import zodiacData from '../../utils/zodiacData.js'
import constellationData from '../../utils/constellationData.js'
import apiCollection from '../../utils/apiCollection.js'

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
    makeFlag: false,
    cardKeyStr: '',
    marqueePace: 1,//滚动速度
    marqueeDistance: 490,//初始滚动距离
    interval: 20, // 时间间隔
    windowWidth: 500, // 滚动宽度
    size: 26, // 文字字号
    strLength: 0, // 文字长度
  },

  async onLoad() {
    // 下载字体
    app.loadArtFont();
  },

  onShow() {
    
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

  async goMakeCard() {
    const { pickerZodiac, pickerConstellation, size} = this.data
    wx.showLoading({
      title: '加载中...',
    })
    let cardKeys = await apiCollection.getKeyWords()
    let cardKeyStr = ''
    for (let item in cardKeys) {
      cardKeyStr += cardKeys[item]
    }
    wx.hideLoading()
    this.setData({
      makeFlag: true,
      cardKeyStr
    })
    const strLength = cardKeyStr.length * size;//文字长度
    this.setData({
      strLength
    })
    this.run1()
    // setTimeout(() => {
    //   this.setData({
    //     makeFlag: false
    //   })
    //   wx.navigateTo({
    //     url: `/pages/makeCard/makeCard?zodiacname=${pickerZodiac.name}&zodiac=${pickerZodiac.value}&constellation=${pickerConstellation.value}`,
    //   })
    // }, 3000)
    
  },

  run1() {
    let { marqueeDistance, marqueePace, interval, strLength, windowWidth} = this.data
    const inter = setInterval(() => {
      if (-marqueeDistance < strLength) {
        marqueeDistance = marqueeDistance - marqueePace
        this.setData({
          marqueeDistance,
        });
      } else {
        clearInterval(inter)
        this.setData({
          marqueeDistance: windowWidth
        });
        this.run1()
      }
    }, interval)
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