import regeneratorRuntime from './runtime.js'

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 调用微信获取权限Api
const getSettingWx = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        resolve(res)
      }
    })
  })
}

// 调用微信保存图片Api
const saveImageWx = (imgTmpPath, that) => {
  return new Promise((resolve, reject) => {
    if (that) {
      wx.saveImageToPhotosAlbum({
        filePath: imgTmpPath,
        success: res => {
          that.setData({
            saveImgFlag: true,
            toastShowFlag: true
          }, () => {
            setTimeout(() => {
              that.setData({
                toastShowFlag: false
              })
            }, 3500)
          })
          resolve(res)
        },
        fail: err => {
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          })
          reject(err)
        }
      })
    } else {
      reject()
    }
  })
}

/**
 * 保存海报，同时校验相册授权，未授权则设置photoAuthFlag为false
 * @param {string} imgTmpPath 需要保存至相册的本地缓存地址
 * @param {page实例} that 当前页面的this
 */
const saveImage = async (imgTmpPath, that) => {
  if (that) {
    // 获取用户是否开启用户授权相册
    const res = await getSettingWx();
    // 如果没有则获取授权
    if (!res.authSetting['scope.writePhotosAlbum']) {
      wx.authorize({
        scope: 'scope.writePhotosAlbum',
        success: async () => {
          // 有权限则直接保存
          await saveImageWx(imgTmpPath, that)
        },
        fail: err => {
          // 如果用户拒绝过或没有授权，则再次打开授权窗口
          //（ps：微信api又改了现在只能通过button才能打开授权设置，以前通过openSet就可打开，下面有打开授权的button弹窗代码）
          wx.showToast({
            title: '请允许授权，以便将海报保存到手机上',
            icon: 'none',
            duration: 3000
          })
          that.setData({
            photoAuthFlag: false
          })
        }
      })
    } else {
      // 有权限则直接保存
      await saveImageWx(imgTmpPath, that)
    }
  } else {
    wx.showToast({
      title: '保存异常',
      icon: 'none'
    })
  }
}

// 获取用户信息，昵称、头像
const getUserInfoWx = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: res => {
        resolve(res)
        // const userInfo = res.userInfo
        // const nickName = userInfo.nickName
        // const avatarUrl = userInfo.avatarUrl
        // const gender = userInfo.gender // 性别 0：未知、1：男、2：女
        // const province = userInfo.province
        // const city = userInfo.city
        // const country = userInfo.country
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

// 获取图片信息
const getImageInfoWx = (imgTmpPath) => {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: imgTmpPath,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export default {
  formatTime,
  getSettingWx,
  saveImageWx,
  getUserInfoWx,
  getImageInfoWx,
  saveImage
}