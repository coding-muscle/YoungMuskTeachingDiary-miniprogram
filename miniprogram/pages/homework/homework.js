Page({
  data: {
    homeworks: [
      {
        time: '2023-10-01 10:00',
        teacher: '张老师',
        content: '完成物理习题册第5页',
        status: '已完成',
      },
      {
        time: '2023-10-02 14:00',
        teacher: '李老师',
        content: '完成数学试卷',
        status: '未完成',
      },
      {
        time: '2023-10-03 09:00',
        teacher: '王老师',
        content: '完成化学实验报告',
        status: '未完成',
      },
      {
        time: '2023-10-04 11:00',
        teacher: '赵老师',
        content: '完成英语作文',
        status: '已完成',
      },
    ],
    currentFilter: 'uncompleted', // 当前筛选状态
    filteredHomeworks: [], // 筛选后的作业列表
  },

  onLoad() {
    this.getHomeworkInfo();
    // 初始化时显示未完成的作业
    this.filterUncompleted();
  },

  getHomeworkInfo() {

  },

  // 筛选未完成的作业
  filterUncompleted() {
    const filteredHomeworks = this.data.homeworks.filter(
      (item) => item.status === '未完成'
    );
    this.setData({
      currentFilter: 'uncompleted',
      filteredHomeworks,
    });
  },

  // 筛选已完成的作业
  filterCompleted() {
    const filteredHomeworks = this.data.homeworks.filter(
      (item) => item.status === '已完成'
    );
    this.setData({
      currentFilter: 'completed',
      filteredHomeworks,
    });
  },
});
