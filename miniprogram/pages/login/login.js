const apiConfig = require('../../config/apiConfig.js');

Page({
  data: {
    phone: '', // 手机号
    password: '', // 密码
  },

  // 输入手机号
  inputPhone(e) {
    this.setData({
      phone: e.detail.value,
    });
  },

  // 输入密码
  inputPassword(e) {
    this.setData({
      password: e.detail.value,
    });
  },

  // 登录
  login() {
    const { phone, password } = this.data;

    if (!phone || !password) {
      wx.showToast({
        title: '手机号和密码不能为空',
        icon: 'none',
      });
      return;
    }

    // 调用登录接口
    wx.request({
      url: apiConfig.loginUrl, // 替换为你的登录接口地址
      method: 'POST',
      data: {
        phone,
        password,
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
          });
          // 从响应数据中获取 userId 并存储到本地
          const userId = res.data.user.userId;
          const username = res.data.user.username;
          wx.setStorageSync('userId', userId);
          wx.setStorageSync('username', username);

          // 检查用户是否已设置身份
          if (res.data.user.isSetProfile) {
            // 用户已设置身份，跳转到首页
            wx.switchTab({
              url: '/pages/course/course',
            });
          } else {
            // 用户未设置身份，跳转到设置身份页面
            wx.navigateTo({
              url: '/pages/setProfile/setProfile', // 替换为实际的设置身份页面路径
            });
          }
        } else {
          wx.showToast({
            title: res.data.message || '登录失败',
            icon: 'none',
          });
        }
      },
      fail: (err) => {
        console.error('登录失败:', err);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none',
        });
      },
    });
  },
});
