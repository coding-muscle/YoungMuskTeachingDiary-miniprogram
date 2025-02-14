Page({
  data: {
    semesters: ['2025年上', '2025年下', '2026年上', '2026年下'],
    subjects: ['物理', '数学', '化学', '英语'],
    selectedSemester: '2025年上',
    selectedSubject: '物理',
    scores: [85, 90, 88, 92, 95], // 示例成绩数据
    chartContext: null,
  },

  onLoad() {
    this.setData({
      chartContext: wx.createCanvasContext('scoreChart'),
    });
    this.drawChart();
  },

  // 选择学期
  onSemesterChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedSemester: this.data.semesters[index],
    });
    this.updateChart();
  },

  // 选择科目
  onSubjectChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedSubject: this.data.subjects[index],
    });
    this.updateChart();
  },

  // 更新图表
  updateChart() {
    // 根据学期和科目更新成绩数据
    const newScores = this.getScores(
      this.data.selectedSemester,
      this.data.selectedSubject
    );
    this.setData({
      scores: newScores,
    });
    this.drawChart();
  },

  // 获取成绩数据（示例）
  getScores(semester, subject) {
    // 模拟数据
    const data = {
      '2025年上': {
        物理: [85, 90, 88, 92, 95],
        数学: [80, 85, 82, 88, 90],
        化学: [78, 82, 85, 88, 90],
        英语: [90, 92, 88, 85, 90],
      },
      '2025年下': {
        物理: [88, 92, 90, 94, 96],
        数学: [85, 88, 90, 92, 95],
        化学: [80, 85, 88, 90, 92],
        英语: [92, 94, 90, 88, 92],
      },
    };
    return data[semester]?.[subject] || [];
  },

  // 绘制折线图
  drawChart() {
    const ctx = this.data.chartContext;
    const scores = this.data.scores;
    const width = 300; // 画布宽度
    const height = 200; // 画布高度
    const padding = 20; // 内边距
    const maxScore = Math.max(...scores, 100); // 最大分数
    const xAxisLength = width - 2 * padding; // X轴长度
    const yAxisLength = height - 2 * padding; // Y轴长度
    const xStep = xAxisLength / (scores.length - 1); // X轴步长
    const yStep = yAxisLength / maxScore; // Y轴步长

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 绘制坐标轴
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // 绘制折线
    ctx.beginPath();
    scores.forEach((score, index) => {
      const x = padding + index * xStep;
      const y = height - padding - score * yStep;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      // 绘制数据点
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillText(score, x - 5, y - 10);
    });
    ctx.stroke();

    // 绘制X轴标签
    scores.forEach((_, index) => {
      const x = padding + index * xStep;
      ctx.fillText(`第${index + 1}次`, x - 10, height - padding + 15);
    });

    // 绘制Y轴标签
    ctx.fillText('分数', padding - 15, padding + 10);

    // 渲染画布
    ctx.draw();
  },
});
