import util from '../../utils/util.js'
import regeneratorRuntime from '../../utils/runtime.js'
import apiCollection from '../../utils/apiCollection.js'

const app = getApp()

Page({

  data: {
    swiperIndex: 0, //这里不写第一次启动展示的时候会有问题
    viewsBaseData: [], // 风景数据
    landScapeName: '', // 风景名称
    currentIndex: 0,
    swiperError: 0, 
    preIndex: 0
  },

  async onLoad(options) {
    // 下载字体
    app.loadArtFont();
    // 拿风景
    let viewsObj = await apiCollection.getViews()

    const viewsBaseData = viewsObj.baseData || []

    this.setData({
      viewsBaseData,
      landScapeName: viewsBaseData[0].name || ''
    })

  },

  bindchange(e) {
    const { viewsBaseData} = this.data
    const swiperIndex = e.detail.current
    this.setData({
      swiperIndex,
      landScapeName: viewsBaseData[swiperIndex].name
    })
  },

  goDetail() {
    const { swiperIndex, viewsBaseData} = this.data
    const { id } = viewsBaseData[swiperIndex]
    wx.navigateTo({
      url: `/pages/landScapeDetail/landScapeDetail?id=${id}`,
    })
  },

  changeSwip(detail) {
    if (detail.detail.source == "touch") {
      let { swiperError, preIndex } = this.data
      //当页面卡死的时候，current的值会变成0 
      if (detail.detail.current == 0) {
        //有时候这算是正常情况，所以暂定连续出现3次就是卡了
        let swiperError = swiperError
        swiperError += 1
        this.setData({ swiperError: swiperError })
        if (swiperError >= 3) { //在开关被触发3次以上
          console.error(swiperError)
          this.setData({ currentIndex: preIndex });//，重置current为正确索引
          this.setData({ swiperError: 0 })
        }
      } else {//正常轮播时，记录正确页码索引
        this.setData({ preIndex: detail.detail.current });
        //将开关重置为0
        this.setData({ swiperError: 0 })
      }
    }
  }
})