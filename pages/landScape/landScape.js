Page({

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
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    swiperIndex: 0 //这里不写第一次启动展示的时候会有问题
  },
  bindchange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },

  goDetail() {
    wx.navigateTo({
      url: `/pages/landScapeDetail/landScapeDetail`,
    })
  }

})