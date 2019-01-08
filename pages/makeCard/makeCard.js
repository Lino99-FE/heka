import canvasTools from '../../utils/canvasTools.js'
import util from '../../utils/util.js'
import regeneratorRuntime from '../../utils/runtime.js'
import apiCollection from '../../utils/apiCollection.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    keyBGImgUrl: '/images/card-key-bg.png',
    landScapeUrl: '',
    codeImgUrl: '/images/gh_62cd02b064eb_258.jpg',
    nick: '',
    cardAd: '微信赠与你一张风景新年贺卡',
    cardKey: '',
    cardKeyTip: '',
    cardBless: '',
    landScapeName: '',
    landScapeDesc: '',
    codeTip: '长按识别，制作贺卡',
    cardWidth: 520,
    cardHeight: 786,
    shareImg: '',
    photoAuthFlag: true,
    saveImgFlag: false, // 保存图片成功标识
    showBlessFlag: false,
    currentViewIndex: 0,
    viewsBaseData: [], // 风景数据
    wishesBaseData: [], // 祝福语数据
    currentBlessIndex: 0,
    newBless: '', // 手动选择的祝福语
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {    
    const { zodiacname, zodiac, constellation} = options
    const { avatarUrl, nickName } = app.globalData.userInfo
    const imgRes = await util.getImageInfoWx(avatarUrl)

    // 拿关键字
    let cardKeys = await apiCollection.getKeyWords()

    // 拿风景
    let viewsObj = await apiCollection.getViews()

    // 祝福语
    let wishesObj = await apiCollection.getWishes()

    const viewsBaseData = viewsObj.baseData || []
    const wishesBaseData = wishesObj.baseData || []

    const landScapeName = viewsBaseData[0].name || ''
    const landScapeDesc = viewsBaseData[0].card_intro || ''
    const landScapeUrl = 'http://' + viewsBaseData[0].api_card_img
    const cardKey = cardKeys[`${zodiac}${constellation}`]
    const cardKeyTip = zodiacname.substring(1, 2) + '年关键字'
    const cardBless = wishesBaseData[0].blessing

    this.setData({
      avatarUrl: imgRes.path,
      nick: nickName,
      cardKey,
      landScapeName,
      landScapeDesc,
      landScapeUrl,
      cardBless,
      cardKeyTip,
      viewsBaseData,
      wishesBaseData,
    })
    
  },

  async onShow() {
    let {
      photoAuthFlag,
      shareImg
    } = this.data
    // ios版微信的bug，需要执行两次才能拿到正确的回调
    await util.getSettingWx()
    const res = await util.getSettingWx()
    if (!res.authSetting['scope.writePhotosAlbum'] && shareImg) {
      photoAuthFlag = false
    } else {
      photoAuthFlag = true
    }
    this.setData({
      photoAuthFlag
    })
  },

  onShareAppMessage() {
    const {
      shareImg,
      nick,
      landScapeUrl
    } = this.data
    const obj = {
      title: `${nick}赠与你一张新年贺卡`,
      path: `/pages/makeCard/makeCard`,
      imageUrl: landScapeUrl
    }
    return obj
  },

  changeView() {
    let { currentViewIndex, viewsBaseData} = this.data
    if (currentViewIndex < viewsBaseData.length - 1) {
      currentViewIndex++
    } else {
      currentViewIndex = 0
    }
    const landScapeName = viewsBaseData[currentViewIndex].name || ''
    const landScapeDesc = viewsBaseData[currentViewIndex].card_intro || ''
    const landScapeUrl = 'http://' + viewsBaseData[currentViewIndex].api_card_img
    this.setData({
      currentViewIndex,
      landScapeName,
      landScapeDesc,
      landScapeUrl
    })
  },

  changeBless() {
    const { cardBless, wishesBaseData , currentBlessIndex} = this.data
    this.setData({
      showBlessFlag: true,
      newBless: wishesBaseData[currentBlessIndex].blessing
    })
  },

  closeBless() {
    this.setData({
      showBlessFlag: false
    })
  },

  checkBless(e) {
    const { index } = e.currentTarget.dataset
    const { wishesBaseData} = this.data
    this.setData({
      newBless: wishesBaseData[index].blessing,
      currentBlessIndex: index
    })
  },

  saveBless() {
    const { newBless} = this.data
    this.setData({
      showBlessFlag: false,
      cardBless: newBless,
      newBless: ''
    })
  },

  // 制作海报
  async makePoster() {
    let {
      avatarUrl,
      keyBGImgUrl,
      landScapeUrl,
      codeImgUrl,
      nick,
      cardAd,
      cardKey,
      cardKeyTip,
      cardBless,
      landScapeName,
      landScapeDesc,
      codeTip,
      cardWidth,
      cardHeight,
      shareImg
    } = this.data
    if (shareImg && shareImg !== '') {
      // 如果分享海报图已经生成，则不再执行生成海报
      this.saveImg(shareImg)
    } else {
      wx.showLoading({
        title: '生成中...'
      })
      
      const localImgRes = await util.getImageInfoWx(landScapeUrl.replace('http','https'))
      if (localImgRes && localImgRes.path) {
        const localLandScapeImgUrl = localImgRes.path
        const ctx = wx.createCanvasContext('myCanvas');
        if (nick.length > 8) {
          nick = nick.slice(0, 7) + '...'
        }
        // 设置背景色
        ctx.setFillStyle('#9c3231')
        ctx.fillRect(0, 0, cardWidth, cardHeight)
        // 用户圆角头像
        canvasTools.circleImg(ctx, avatarUrl, 55, 21, 31)
        // 用户昵称
        ctx.setFontSize(17)
        ctx.setFillStyle('#ffffff')
        ctx.fillText(nick, 136, 64)
        // 昵称旁边说明语
        ctx.fillText(cardAd, 260, 64)
        // 关键字底图
        ctx.drawImage(keyBGImgUrl, 176, 99, 156, 143)
        // 关键字
        ctx.setFontSize(55)
        ctx.setFillStyle('#FAD988')
        ctx.fillText(cardKey, 231, 178)
        // 关键字下文字
        ctx.setFontSize(12)
        ctx.fillText(cardKeyTip, 230, 205)
        // 祝福语
        ctx.setFontSize(17)
        canvasTools.wordsWrap(ctx, cardBless, 490, 11, 280, 27, 17, true, cardWidth)
        // 风景图片
        ctx.drawImage(localLandScapeImgUrl, 14, 320, 491, 276)
        
        // 风景名称
        ctx.setFontSize(22)
        ctx.fillText(landScapeName, 11, 654)
        // 风景描述
        ctx.setFontSize(14)
        canvasTools.wordsWrap(ctx, landScapeDesc, 328, 11, 680, 24, 14)
        
        //二维码图片
        ctx.drawImage(codeImgUrl, 414, 634, 71, 71)
        // 二维码文字
        ctx.setFontSize(12)
        ctx.fillText(codeTip, 397, 741)
        
        // 需要等待canvas生成后,在callback里再执行canvasToTempFilePath导出图片
        ctx.draw(false, () => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: ctx.canvasId,
            success: res => {
              let shareImg = res.tempFilePath
              this.setData({
                shareImg
              }, () => {
                wx.hideLoading()
                this.saveImg(shareImg)
              })
            },
            fail(err) {
              wx.hideLoading()
              wx.showToast({
                title: '海报生成失败，请稍后再试',
                icon: 'none'
              })
            }
          })
        });
      } else {
        wx.showToast({
          title: '图片下载失败，请稍后再试',
          icon: 'none'
        })
      }
    }
  },

  // 长按保存事件
  async saveImg(imgTmpPath) {
    await util.saveImage(imgTmpPath, this)
  }

})