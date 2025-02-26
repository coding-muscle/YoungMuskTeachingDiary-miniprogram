const apiConfig = require('../../config/apiConfig.js');

Page({
  data: {
    userInfo: {
      username: '',
      userId: '',
      avatarUrl: ''
    }, // 用户信息
  },

  onLoad() {
    // 获取用户信息
    this.getUserProfile();
  },

  // 获取用户信息
  getUserProfile() {
    const userId = wx.getStorageSync('userId');
    wx.request({
      url: `${apiConfig.getProfileUrl}?userId=${userId}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          const user = res.data.user;
          this.setData({
            userInfo: {
              username: user.username,
              userId: user.userId,
              avatarUrl:user.avatarUrl,
            },
          });
        } else {
          wx.showToast({
            title: '获取用户信息失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '获取用户信息失败，请稍后重试',
          icon: 'none',
        });
      },
    });
  },

  // 跳转到账号设置页面
  navigateToSetting() {
    wx.navigateTo({
      url: '/pages/setting/setting',
    });
  },

  // 跳转到关于我们页面
  navigateToAbout() {
    wx.navigateTo({
      url: '/pages/about/about',
    });
  },

  // 退出登录
  logout() {
    // 显示确认对话框
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
          // 调用后端退出登录接口
          wx.request({
            url: apiConfig.logoutUrl, 
            method: 'POST',
            header: {
              // 'content-type': 'application/json',
              // // 如果需要携带 token 等信息，可在此处添加
              // 'Authorization': 'Bearer ' + wx.getStorageSync('token'), 
            },
            data: {
              userId: wx.getStorageSync('userId'),
            },
            success: (response) => {
              if (response.statusCode === 200) {
                // 清除用户信息
                this.setData({
                  userInfo: {},
                });
                // 清除本地存储中的用户信息，如 token
                wx.removeStorageSync('userId');
                wx.removeStorageSync('username');

                // 隐藏加载提示
                wx.hideLoading();

                // 显示退出成功提示
                wx.showToast({
                  title: '已退出登录',
                  icon: 'none',
                });

                // 跳转到登录页面
                wx.navigateTo({
                  url: '/pages/login/login',
                });

              } else {
                // 接口调用失败处理
                wx.hideLoading();
                wx.showToast({
                  title: '退出登录失败，请稍后重试',
                  icon: 'none',
                });
              }
            },
            fail: () => {
              // 请求失败处理
              wx.hideLoading();
              wx.showToast({
                title: '网络错误，请检查网络连接',
                icon: 'none',
              });
            },
          });
        
      },
    });
  },
});
