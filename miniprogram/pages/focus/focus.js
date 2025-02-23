const apiConfig = require('../../config/apiConfig');

Page({
  data: {
    focusTime: null, // 用户输入的专注时间（分钟）
    isCounting: false, // 是否正在倒计时
    startTime: null, // 专注开始时间
    time: 0, // 剩余时间（秒）
  },

  // 监听用户输入
  onInputChange(e) {
    this.setData({
      focusTime: e.detail.value,
    });
  },

  // 开始倒计时
  startCountdown() {
    if (!this.data.focusTime || this.data.isCounting) return;

    const startTime = new Date();
    const focusTimeInMilliseconds = this.data.focusTime * 60 * 1000; // 将分钟转换为毫秒
    
    this.setData({
      isCounting: true,
      startTime: startTime,
      time: focusTimeInMilliseconds,
    });
  },

  // 停止倒计时
  finishCountdown() {
    const userId = wx.getStorageSync('userId');

    wx.request({
      url: apiConfig.creatFocusUrl,
      method: 'POST',
      data: {
        userId: userId,
        startTime: this.data.startTime,
        focusDuration: this.data.focusTime
      },
      success: (res) => {
        return res.data;
      },
      fail: (err) => {
        console.error('请求出错:', err);
        wx.showToast({
          title: '倒计时失败，请稍后重试',
          icon: 'none',
        });
      },
    });

    this.setData({
      focusTime: null,
      isCounting: false,
    });
  },
});
