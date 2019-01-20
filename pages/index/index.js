import regeneratorRuntime from '../../utils/runtime.js'
import util from '../../utils/util.js'
import zodiacData from '../../utils/zodiacData.js'
import constellationData from '../../utils/constellationData.js'
import apiCollection from '../../utils/apiCollection.js'

const app = getApp()
const choiceIndex = 2
let cardKeyArr = []
let cardKeyIndex = 0

Page({
  data: {
    zodiacIndex: [choiceIndex],
    zodiac: zodiacData,
    constellationIndex: [choiceIndex],
    constellation: constellationData,
    pickerZodiac: zodiacData[choiceIndex],
    pickerConstellation: constellationData[choiceIndex],
    makeFlag: false,
    stopCardKeyFlag: false,
    makeFinishFlag: false,
    cardKeyStr: '',
    interval: 100, // 时间间隔
  },

  async onLoad() {
    // 下载字体
    app.loadArtFont();
  },

  onShow() {
    cardKeyArr = []
    cardKeyIndex = 0
    this.setData({
      makeFlag: false,
      stopCardKeyFlag: false,
      makeFinishFlag: false,
      cardKeyStr: '',
    })
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
    const {
      pickerZodiac,
      pickerConstellation,
      size
    } = this.data
    wx.showLoading({
      title: '加载中...',
    })
    let cardKeys = await apiCollection.getKeyWords()

    wx.hideLoading()
    for (let item in cardKeys) {
      cardKeyArr.push(cardKeys[item])
    }
    // 开启关键字背景
    this.setData({
      makeFlag: true
    })
    setTimeout(() => {
      // 半秒后开始滚动关键字
      this.changeCardKey()
      setTimeout(() => {
        // 3秒之后停止关键字滚动
        this.setData({
          stopCardKeyFlag: true,
          cardKeyStr: ''
        })
        setTimeout(() => {
          // 0.7秒之后停止背景转动，显示真正关键字
          this.setData({
            makeFinishFlag: true,
            cardKeyStr: cardKeys[`${pickerZodiac.value}${pickerConstellation.value}`]
          })
          // 1.5秒后跳转至贺卡制作页面，清空标记Flag
          setTimeout(() => {
            wx.navigateTo({
              url: `/pages/makeCard/makeCard?zodiacname=${pickerZodiac.name}&zodiac=${pickerZodiac.value}&constellation=${pickerConstellation.value}`,
            })
            cardKeyArr = []
            cardKeyIndex = 0
            this.setData({
              makeFlag: false,
              stopCardKeyFlag: false,
              makeFinishFlag: false,
              cardKeyStr: '',
            })
          }, 1500)
        }, 700)
      }, 3000)
    }, 500)



  },

  changeCardKey() {
    const {
      interval
    } = this.data
    const len = cardKeyArr.length || 0
    let cardKeyStr = ''
    const inter = setInterval(() => {
      if (this.data.stopCardKeyFlag) {
        clearInterval(inter)
      } else {
        if (cardKeyIndex < len) {
          cardKeyStr = cardKeyArr[cardKeyIndex]
          this.setData({
            cardKeyStr,
          });
          cardKeyIndex++
        } else {
          clearInterval(inter)
          cardKeyIndex = 0
          this.changeCardKey()
        }
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