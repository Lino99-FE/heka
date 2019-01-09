import util from '../../utils/util.js'
import regeneratorRuntime from '../../utils/runtime.js'
import apiCollection from '../../utils/apiCollection.js'

const app = getApp()
const pageSize = 15

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryData: [],
    informationData: [],
    checkIndex: 0, // 选中数据index
    pageIndex: 0,
    currentData: [],
    allPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let { checkIndex} = this.data
    const res = await apiCollection.getCategories();
    const {baseData} = res
    this.setData({
      categoryData: res.baseData,
    }, () => {
      this.getData(checkIndex)
    })
  },

  async check(e) {
    const { index } = e.currentTarget.dataset
    const { checkIndex } = this.data
    if (index !== checkIndex) {
      this.getData(index)
    }
  },

  async getData(index) {
    try {
      wx.showLoading({
        title: '加载中...',
      })
      const { categoryData } = this.data
      const infoData = await app.apiRequst('information', {}, `cid=${categoryData[index].id}`)
      this.setData({
        checkIndex: index,
        informationData: infoData.data,
        pageIndex: 0,
        allPage: Math.ceil(infoData.data.length / pageSize),
        currentData: []
      }, () => {
        this.pageData();
      })
    } finally {
      wx.hideLoading()
    }
  },

  onReachBottom() {
    this.pageData();
  },

  pageData() {
    let { pageIndex, currentData, informationData, allPage} = this.data
    if (pageIndex > allPage ) {
      return
    } else {
      pageIndex++
      const tmp = informationData.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
      currentData.push(...tmp);
      this.setData({
        pageIndex,
        currentData
      })
    }

  },

  goDetail(e) {
    const { currentData} = this.data
    const { index } = e.currentTarget.dataset
    const { link } = currentData[index]
    wx.navigateTo({
      url: `/pages/newsDetail/newsDetail?link=${link}`,
    })
  }

})