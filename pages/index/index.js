import regeneratorRuntime from '../../utils/runtime.js'

const app = getApp()

Page({
  data: {
    zodiacIndex: [5],
    zodiac: ['子鼠', '丑牛', '寅虎', '卯兔', '辰龙', '巳蛇', '午马', '未羊', '申猴', '酉鸡', '戌狗', '亥猪'],
    constellationIndex: [5],
    constellation: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
    pickerZodiac: '请选择',
    pickerConstellation: '请选择',
  },
  async onLoad() {
    // const res = await app.apiRequst('login', {});
    // console.log(res)
  },
  zodiacBindChange(e) {
    const { value } = e.detail
    const { zodiac} = this.data
    this.setData({
      pickerZodiac: zodiac[value[0]]
    })
  },
  constellationBindChange(e) {
    const { value } = e.detail
    const { constellation } = this.data
    this.setData({
      pickerConstellation: constellation[value[0]]
    })
  },
  goMakeCard() {
    wx.navigateTo({
      url: '/pages/makeCard/makeCard',
    })
  }
})
