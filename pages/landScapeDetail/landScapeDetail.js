

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://fuwu.saasphp.cn/1.jpg',
      'https://fuwu.saasphp.cn/2.jpg',
      'https://fuwu.saasphp.cn/3.jpg',
      'https://fuwu.saasphp.cn/4.jpg',
      'https://fuwu.saasphp.cn/5.jpg',
      'https://fuwu.saasphp.cn/6.jpg',
      'https://fuwu.saasphp.cn/7.jpg',
      'https://fuwu.saasphp.cn/8.JPG',
      'https://fuwu.saasphp.cn/9.jpg',
    ],
    swiperIndex: 0,
    showSwiperIndex: 0,
    readMoreFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  readMoreFn() {
    this.setData({
      readMoreFlag: true
    })
  },

  
  bindchange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },

  swiperClick() {
    const { swiperIndex, imgUrls} = this.data
    wx.previewImage({
      urls: imgUrls,
      current: imgUrls[swiperIndex]
    })
  },

  swiperLeft() {
    const { swiperIndex, imgUrls } = this.data
    let showSwiperIndex = swiperIndex - 1
    if (swiperIndex === 0) {
      showSwiperIndex = imgUrls.length - 1
    }
    this.setData({
      showSwiperIndex
    })
  },

  swiperRight() {
    const { swiperIndex, imgUrls } = this.data
    let showSwiperIndex = swiperIndex + 1
    if (swiperIndex === imgUrls.length - 1) {
      showSwiperIndex = 0
    }
    this.setData({
      showSwiperIndex
    })
  },

  goMain() {
    wx.navigateBack({
      delta: 1
    })
  }
  
})