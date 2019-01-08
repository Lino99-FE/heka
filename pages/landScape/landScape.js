import util from '../../utils/util.js'
import regeneratorRuntime from '../../utils/runtime.js'
import apiCollection from '../../utils/apiCollection.js'

const app = getApp()

Page({

  data: {
    swiperIndex: 0, //这里不写第一次启动展示的时候会有问题
    viewsBaseData: [], // 风景数据
    landScapeName: '', // 风景名称
  },

  async onLoad(options) {
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
  }

})