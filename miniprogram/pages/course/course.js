const apiConfig = require('../../config/apiConfig');

Page({
  data: {
    courses: [],
    calendarConfig: {
      show: false, // 控制日历显示
      minDate: new Date(2025, 0, 1).getTime(),
      maxDate: new Date(2025, 11, 31).getTime(),
    },
    date: ''
  },

  onLoad() {
    this.setData({
      date: this.formatDate(new Date())
    });
    this.getCourseInfo(this.data.date);
  },

  onTabItemTap() {
    this.showCalendar();
  },

  // 显示日历的方法
  showCalendar() {
    this.setData({
      'calendarConfig.show': true
    });
  },

  // 日历关闭事件
  onCalendarClose() {
    this.setData({
      'calendarConfig.show': false
    });
  },

  // 日历确认事件
  onCalendarConfirm(event) {
    const selectedDate = event.detail; // 用户选择的日期
    // 关闭日历
    this.setData({ 'calendarConfig.show': false });
    // 更新日期
    this.setData({ date: this.formatDate(selectedDate) });
    this.getCourseInfo(this.data.date);
  },

  onConfirm(event) {
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    });
  },

  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },

  // 时间格式化函数
  formatTimeRange(startTime, endTime) {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // 提取日期部分
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    const day = String(startDate.getDate()).padStart(2, '0');

    // 提取时间部分
    const startHours = String(startDate.getHours()).padStart(2, '0');
    const startMinutes = String(startDate.getMinutes()).padStart(2, '0');
    const endHours = String(endDate.getHours()).padStart(2, '0');
    const endMinutes = String(endDate.getMinutes()).padStart(2, '0');

    // 返回格式化后的时间范围
    return `${year}-${month}-${day} ${startHours}:${startMinutes}-${endHours}:${endMinutes}`;
  },

  // 计算剩余时间
  calculateLeftTime(startTime, courseDuration) {
    const now = new Date(); // 当前时间
    const startDate = new Date(startTime); // 课程开始时间
    const timeDiff = startDate.getTime() - now.getTime(); // 时间差（毫秒）
    const negativeDuration = -1 * courseDuration * 60 * 1000;
    
    if (timeDiff <= negativeDuration) {
      return '已结束'; 
    } else if (timeDiff <= 0) {
        return '已开始';
    }

    // 将时间差转换为天、小时、分钟
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    // 返回格式化后的剩余时间
    if (days > 0) {
      return ` ${days} 天 ${hours} 小时 ${minutes} 分钟`;
    } else if (hours > 0) {
      return ` ${hours} 小时 ${minutes} 分钟`;
    } else {
      return ` ${minutes} 分钟`;
    }
  },

  // 获取课程信息
  getCourseInfo(date) {
    const userId = wx.getStorageSync('userId');

    wx.request({
      url: apiConfig.getCourseUrl,
      method: 'POST',
      data: {
        userId: userId,
        date: date
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const courses = res.data;
          const formattedCourses = courses.map((course) => {
            return {
              ...course,
              formattedTime: this.formatTimeRange(course.startTime, course.endTime),
              leftTime: this.calculateLeftTime(course.startTime, course.courseDuration),
            };
          });
          this.setData({
            courses: formattedCourses,
          });
        } else {
          wx.showToast({
            title: '获取课程信息失败',
            icon: 'none',
          });
        }
      },
      fail: (err) => {
        console.error('请求出错:', err);
        wx.showToast({
          title: '获取课程信息失败，请稍后重试',
          icon: 'none',
        });
      },
    });
  },
});