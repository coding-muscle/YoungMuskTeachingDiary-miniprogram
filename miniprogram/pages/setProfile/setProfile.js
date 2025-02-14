const apiConfig = require('../../config/apiConfig.js');

Page({
  data: {
    username: '', // 姓名
    roles: ['学生', '家长'], // 身份选项
    selectedRole: '学生', // 当前选择的身份
    avatarUrl: '', // 头像 URL
  },

  roleMapping: {
    学生: 'student',
    家长: 'parent',
  },

  // 监听姓名输入
  onNameInput(e) {
    this.setData({
      username: e.detail.value,
    });
  },

  // 监听身份选择
  onRoleChange(e) {
    this.setData({
      selectedRole: this.data.roles[e.detail.value],
    });
  },

  // 上传头像
  // uploadAvatar() {
  //   wx.chooseImage({
  //     count: 1,
  //     success: (res) => {
  //       this.setData({
  //         avatarUrl: res.tempFilePaths[0]
  //       });
  //     }
  //   });
  // },

  // 保存身份信息
  saveProfile() {
    const { username, selectedRole } = this.data;
    const EnglishRole = this.roleMapping[selectedRole];

    // 输入验证
    if (!username || !selectedRole) {
      wx.showToast({
        title: '用户名和身份类型不能为空',
        icon: 'none',
      });
      return;
    }

    if (!['student', 'parent'].includes(EnglishRole)) {
      wx.showToast({
        title: '无效的身份类型',
        icon: 'none',
      });
      return;
    }

    // if (!avatarUrl) {
    //   wx.showToast({
    //     title: '请上传头像',
    //     icon: 'none'
    //   });
    //   return;
    // }

    // 保存身份信息到服务器
    wx.request({
      url: apiConfig.setProfileUrl,
      method: 'POST',
      header: {
        Authorization: 'Bearer ' + wx.getStorageSync('token'),
      },
      data: {
        userId: wx.getStorageSync('userId'),
        username: username,
        selectedRole: EnglishRole,
      },
      success: (res) => {
        // 假设服务器返回的状态码 200 表示成功
        if (res.statusCode === 200) {
          wx.switchTab({
            url: '/pages/course/course',
          });
        } else {
          wx.showToast({
            title: res.data.message || '设置失败',
            icon: 'none',
          });
        }
      },
      fail: (err) => {
        console.error('设置失败:', err);
      },
    });
  },
});
