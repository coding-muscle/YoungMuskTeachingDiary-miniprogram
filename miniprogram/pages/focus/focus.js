Page({
  data: {
    focusTime: null, // 用户输入的专注时间（分钟）
    countdown: '00:00:00', // 倒计时显示
    isCounting: false, // 是否正在倒计时
    timer: null, // 定时器
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

    const focusTimeInSeconds = this.data.focusTime * 60; // 将分钟转换为秒
    this.setData({
      isCounting: true,
    });

    let remainingTime = focusTimeInSeconds;
    this.updateCountdown(remainingTime);

    // 启动定时器
    this.data.timer = setInterval(() => {
      remainingTime--;
      if (remainingTime >= 0) {
        this.updateCountdown(remainingTime);
      } else {
        this.stopCountdown();
        wx.showToast({
          title: '专注时间结束！',
          icon: 'none',
        });
      }
    }, 1000);
  },

  // 更新倒计时显示
  updateCountdown(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const countdown = `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(secs)}`;
    this.setData({
      countdown,
    });
  },

  // 停止倒计时
  stopCountdown() {
    clearInterval(this.data.timer);
    this.setData({
      isCounting: false,
      countdown: '00:00:00',
    });
  },

  // 格式化时间（补零）
  formatTime(time) {
    return time < 10 ? `0${time}` : time;
  },
});
