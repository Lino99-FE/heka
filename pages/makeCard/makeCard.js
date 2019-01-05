import canvasTools from '../../utils/canvasTools.js'
import util from '../../utils/util.js'
import regeneratorRuntime from '../../utils/runtime.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '/images/avatar.jpg',
    keyImgUrl: '/images/card-key-bg.png',
    landScapeUrl: '/images/gps.jpg',
    codeImgUrl: '/images/fdashgjkhg.jpg',
    nick: '中国有嘻哈Skr',
    cardAd: '微信赠与你一张风景新年贺卡',
    cardKey: '乐',
    cardKeyTip: '猪年关键词',
    cardBless: '祝您在新的一年里身体健康，万事如意！',
    landScapeName: '黄姚古镇',
    landScapeDesc: '黄姚古镇方圆3.6公里，属喀斯特地貌。发祥于宋朝年间，有着近1000年历史。自然景观有八大景二十四小景；保存有寺观庙祠20多座，亭台楼阁10多处，多为明清建筑。著名的景点有广西省工委旧址，',
    codeTip: '长按识别，制作贺卡',
    cardWidth: 520,
    cardHeight: 786,
    shareImg: '',
    photoAuthFlag: true,
    saveImgFlag: false, // 保存图片成功标识
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    
  },

  async onShow() {
    let {
      photoAuthFlag,
      shareImg
    } = this.data;
    // ios版微信的bug，需要执行两次才能拿到正确的回调
    await util.getSettingWx();
    const res = await util.getSettingWx();
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
      nick
    } = this.data;
    const obj = {
      title: `${nick}赠与你一张新年贺卡`,
      path: `/pages/makeCard/makeCard`,
      imageUrl: shareImg
    }
    return obj;
  },

  // 制作海报
  makePoster() {
    let {
      avatarUrl,
      keyImgUrl,
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
    } = this.data;
    if (shareImg && shareImg !== '') {
      // 如果分享海报图已经生成，则不再执行生成海报
      this.saveImg(shareImg);
    } else {
      wx.showLoading({
        title: '生成中...'
      })
      const ctx = wx.createCanvasContext('myCanvas');
      if (nick.length > 8) {
        nick = nick.slice(0, 7) + '...';
      }
      // 绘制贺卡圆角beijing
      // this.roundRect(ctx, 0, 0, cardWidth, cardHeight, 20);
      // 设置背景色
      ctx.setFillStyle('#9c3231');
      ctx.fillRect(0, 0, cardWidth, cardHeight);
      // 用户圆角头像
      canvasTools.circleImg(ctx, avatarUrl, 55, 21, 31);
      // 用户昵称
      ctx.setFontSize(17);
      ctx.setFillStyle('#ffffff')
      ctx.fillText(nick, 136, 64);
      // 昵称旁边说明语
      ctx.fillText(cardAd, 260, 64);
      // 关键字底图
      ctx.drawImage(keyImgUrl, 178, 99, 150, 137);
      // 关键字
      ctx.setFontSize(55);
      ctx.setFillStyle('#FAD988')
      ctx.fillText(cardKey, 231, 178);
      // 关键字下文字
      ctx.setFontSize(12);
      ctx.fillText(cardKeyTip, 228, 205);
      // 祝福语
      ctx.setFontSize(17);
      ctx.fillText(cardBless, 105, 294);
      // 风景图片
      ctx.drawImage(landScapeUrl, 14, 320, 491, 276);
      // 风景名称
      ctx.setFontSize(22);
      ctx.fillText(landScapeName, 11, 654);
      // 风景描述
      ctx.setFontSize(14);
      canvasTools.wordsWrap(ctx, landScapeDesc, 328, 11, 680, 24, 14);
      //二维码图片
      ctx.drawImage(codeImgUrl, 414, 634, 71, 71);
      // 二维码文字
      ctx.setFontSize(12);
      ctx.fillText(codeTip, 397, 741);

      // 需要等待canvas生成后,在callback里再执行canvasToTempFilePath导出图片
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          canvasId: ctx.canvasId,
          success: res => {
            let shareImg = res.tempFilePath;
            this.setData({
              shareImg
            }, () => {
              wx.hideLoading();
              this.saveImg(shareImg)
            })
          },
          fail(err) {
            wx.hideLoading();
            wx.showToast({
              title: '海报生成失败，请稍后再试',
              icon: 'none'
            })
          }
        })
      });
    }
  },

  // 长按保存事件
  async saveImg(imgTmpPath) {
    await util.saveImage(imgTmpPath, this);
  }

})