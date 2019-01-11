import canvasTools from '../../utils/canvasTools.js'
import util from '../../utils/util.js'
import regeneratorRuntime from '../../utils/runtime.js'
import apiCollection from '../../utils/apiCollection.js'
import zodiacData from '../../utils/zodiacData.js'
import constellationData from '../../utils/constellationData.js'

const app = getApp()
const choiceIndex = 2

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    avatarUrlBase: '',
    keyBGImgUrl: '/images/card-key-bg.png',
    landScapeUrl: '',
    codeImgUrl: '/images/qr-code.png',
    nick: '',
    cardAd: '微信赠予你一张风景新年贺卡',
    cardKey: '',
    cardKeyTip: '猪年关键字',
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
    userInfoAuthFlag: false, // 用户是否授权标记
    makeImgFlag: false, // 是否生成海报
    pickerZodiac: zodiacData[choiceIndex], // 默认选择的生肖
    pickerConstellation: constellationData[choiceIndex], // 默认选择的星座
    zodiacname: '',
    zodiacValue: '',
    constellationValue: '',
    preViewFlag: false, // 落地页模式，不可修改
    toastType: 'moments', // 保存图片成功提示，moments:朋友圈; weibo：微博;
    toastShowFlag: false, // 是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 下载字体
    app.loadArtFont();
    wx.showLoading({
      title: '加载中...',
    })
    try {
      // 校验是否有授权
      userInfoAuthFlag = false
      let {
        userInfoAuthFlag,
        preViewFlag
      } = this.data
      try {
        const { authSetting } = await util.getSettingWx()
        if (authSetting && authSetting['scope.userInfo']) {
          const { userInfo } = await util.getUserInfoWx()
          userInfoAuthFlag = true
          app.globalData.userInfo = userInfo
          const imgRes = await util.getImageInfoWx(userInfo.avatarUrl)
          this.setData({
            avatarUrl: imgRes.path,
            avatarUrlBase: userInfo.avatarUrl,
            nick: userInfo.nickName,
          })
        }
      } catch (e) {
        console.warn(e)
      } finally {
        this.setData({
          userInfoAuthFlag
        })
      }
      
      let { zodiacname, zodiac, constellation, viewId, blessId, newCard, shareFlag, avatarUrlBase, nick } = options
      
      // 拿关键字
      let cardKeys = await apiCollection.getKeyWords()

      // 拿风景
      let viewsObj = await apiCollection.getViews()

      // 祝福语
      let wishesObj = await apiCollection.getWishes()

      const viewsBaseData = viewsObj.baseData || []
      const wishesBaseData = wishesObj.baseData || []
      // 给默认新贺卡赋初始值
      let viewDataId = Object.keys(viewsObj.data)[0]
      let wisheDataId = Object.keys(wishesObj.data)[0]
      if (viewId) {
        viewDataId = viewId
        if (newCard) {
          // 代表从风景详情点击进入，需要带入风景数据
          const { pickerZodiac, pickerConstellation } = this.data
          zodiacname = pickerZodiac.name
          zodiac = pickerZodiac.value
          constellation = pickerConstellation.value
        }
        if (shareFlag) {
          wx.setNavigationBarTitle({
            title: '查看贺卡'
          })
          wisheDataId = blessId
          preViewFlag = true
          this.setData({
            avatarUrlBase,
            nick
          })
        }
        
      }
      const landScapeName = viewsObj.data[viewDataId].name || ''
      const landScapeDesc = viewsObj.data[viewDataId].card_intro || ''
      const landScapeUrl = viewsObj.data[viewDataId].api_card_img
      const cardKey = cardKeys[`${zodiac}${constellation}`]
      const cardBless = wishesObj.data[wisheDataId].blessing

      this.setData({
        cardKey,
        landScapeName,
        landScapeDesc,
        landScapeUrl,
        cardBless,
        viewsBaseData,
        wishesBaseData,
        zodiacname,
        zodiacValue: zodiac,
        constellationValue: constellation,
        preViewFlag
      })
    } finally {
      wx.hideLoading()
    }
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
      landScapeUrl,
      currentViewIndex, 
      viewsBaseData,
      currentBlessIndex,
      wishesBaseData,
      zodiacname,
      zodiacValue,
      constellationValue,
      avatarUrl,
      avatarUrlBase,
      nick
    } = this.data
    const viewId = viewsBaseData[currentViewIndex].id
    const blessId = wishesBaseData[currentBlessIndex].id

    const obj = {
      title: `送你一张新年风景贺卡，祝您猪年大吉！`,
      path: `/pages/makeCard/makeCard?shareFlag=true&viewId=${viewId}&blessId=${blessId}&zodiacname=${zodiacname}&zodiac=${zodiacValue}&constellation=${constellationValue}&avatarUrlBase=${avatarUrlBase}&nick=${nick}`,
      imageUrl: landScapeUrl
    }
    console.log(obj)
    return obj
  },

  // 授权回调
  async userInfoCallBack(e) {
    const {
      userInfo
    } = e.detail
    if (userInfo) {
      const imgRes = await util.getImageInfoWx(userInfo.avatarUrl)
      this.setData({
        userInfoAuthFlag: true,
        avatarUrl: imgRes.path,
        avatarUrlBase: userInfo.avatarUrl,
        nick: userInfo.nickName
      })
      app.globalData.userInfo = userInfo
      this.makePoster()
    } else {
      wx.showModal({
        title: '提示',
        content: '请允许授权，以便制作贺卡',
        showCancel: false
      })
    }
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
    const landScapeUrl = viewsBaseData[currentViewIndex].api_card_img
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
      let localImgRes = {}
      try {
        localImgRes = await util.getImageInfoWx(landScapeUrl.replace('http', 'https'))
      } catch (e) {
        wx.hideLoading()
      }
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
        // 昵称+旁边说明语
        ctx.fillText(nick + cardAd, 136, 64)
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
        ctx.drawImage(codeImgUrl, 400, 625, 96, 96)
        // 二维码文字
        ctx.setFontSize(12)
        ctx.fillText(codeTip, 395, 741)
        
        // 需要等待canvas生成后,在callback里再执行canvasToTempFilePath导出图片
        //多次测试后发现，wx.canvasToTempFilePath()这个方法不只需要在ctx.draw回调中执行，还需要setTimeout一定时间才能保证保存的图片是自己程序预期的样子。因此可使用async、await 写法：
        await new Promise((resolve, reject) => ctx.draw(false, () => setTimeout(() => resolve(), 100)));
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          fileType: 'jpg',
          quality: 1,
          canvasId: ctx.canvasId,
          success: res => {
            let shareImg = res.tempFilePath
            const makeImgFlag = true
            this.setData({
              shareImg,
              makeImgFlag
            }, () => {
              wx.setNavigationBarTitle({
                title: '分享贺卡'
              })
              wx.hideLoading()
              wx.showToast({
                title: '制作成功',
              })
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
      } else {
        wx.showToast({
          title: '图片下载失败，请稍后再试',
          icon: 'none'
        })
      }
    }
  },

  // 长按保存事件
  async saveImg(e) {
    const { type } = e.currentTarget.dataset
    this.setData({
      toastType: type
    }, async () => {
      await util.saveImage(this.data.shareImg, this)
    })
  },

  goIndex() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }

})