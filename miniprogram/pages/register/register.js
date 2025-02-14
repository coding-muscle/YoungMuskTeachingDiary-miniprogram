const apiConfig = require('../../config/apiConfig.js');

Page({
  data: {
    phone: '', // 手机号
    password: '', // 密码
    confirmPassword: '', // 重复密码
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

  // 输入重复密码
  inputConfirmPassword(e) {
    this.setData({
      confirmPassword: e.detail.value,
    });
  },

  // 注册
  register() {
    const { phone, password, confirmPassword } = this.data;

    if (!phone || !password || !confirmPassword) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
      });
      return;
    }

    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none',
      });
      return;
    }

    // 调用注册接口
    wx.request({
      url: apiConfig.registerUrl, // 替换为你的注册接口地址
      method: 'POST',
      data: {
        phone,
        password,
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          wx.showToast({
            title: '注册成功',
            icon: 'success',
          });
          // 跳转到登录页面
          wx.navigateTo({
            url: '/pages/login/login',
          });
        } else {
          wx.showToast({
            title: res.data.message || '注册失败',
            icon: 'none',
          });
        }
      },
      fail: (err) => {
        console.error('注册失败:', err);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none',
        });
      },
    });
  },
});
