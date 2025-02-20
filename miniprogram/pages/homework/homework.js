const apiConfig = require('../../config/apiConfig');

Page({
  data: {
    homeworks: [],
    currentFilter: 'uncompleted', // 当前筛选状态
    filteredHomeworks: [], // 筛选后的作业列表
  },

  onLoad() {
    this.getHomeworkInfo();
  },

  getHomeworkInfo() {
    const userId = wx.getStorageSync('userId');

    wx.request({
      url: apiConfig.getHomeworkUrl,
      method: 'POST',
      data: {
        userId: userId,
      },
      success: (res) => {
        if (res.data) {
          // 处理日期格式和状态显示
          const formattedData = res.data.map(homework => ({
            ...homework,
            setTime: homework.setTime.split('T')[0],
            workStatus: homework.workStatus === '0' ? '未完成' : '已完成'  // 添加状态文字
          }));
          
          this.setData({
            homeworks: formattedData,
          });
          this.filterUncompleted();
        }
      },
      fail: (err) => {
        console.error('请求出错:', err);
        wx.showToast({
          title: '获取作业信息失败，请稍后重试',
          icon: 'none',
        });
      },
    });
  },

  // 筛选未完成的作业
  filterUncompleted() {
    const filteredHomeworks = this.data.homeworks.filter(
      (homework) => homework.workStatus === '未完成'
    );
    this.setData({
      currentFilter: 'uncompleted',
      filteredHomeworks,
    });
  },

  // 筛选已完成的作业
  filterCompleted() {
    const filteredHomeworks = this.data.homeworks.filter(
      (homework) => homework.workStatus === '已完成'
    );
    this.setData({
      currentFilter: 'completed',
      filteredHomeworks,
    });
  },
});
