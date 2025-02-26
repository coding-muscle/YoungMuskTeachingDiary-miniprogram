import * as echarts from "../../ec-canvas/echarts";
const apiConfig = require('../../config/apiConfig');

Page({
  data: {
    userId: '',
    semesters: ['2024年下', '2025年上'],
    subjects: ['数学', '英语', '物理', '化学'],
    selectedSemester: '2025年上',
    selectedSubject: '数学',
    examNames: [],
    examScores: [],
    analysisResult: {
      average: 0, // 平均数
      standardDeviation: 0, // 方差
      max: 0, // 最高分
      min: 0 // 最低分
    },
    ec: {
      onInit: null
    }
  },

  chartInstance: null, // 使用页面属性存储图表实例

  // 初始化图表（确保只执行一次）
  initChart(canvas, width, height, dpr) {
    if (this.chartInstance) return this.chartInstance;

    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr
    });
    canvas.setChart(chart);
    this.chartInstance = chart;

    // 初始化默认配置
    const option = {
      xAxis: {},
      yAxis: {},
      series: [],
      grid: {}
    };
    chart.setOption(option);

    return chart;
  },


  // 更新图表数据
  updateChart(examNames, examScores) {
    if (!this.chartInstance) {
      console.error('图表实例未初始化，请检查 ec-canvas 组件');
      return;
    }

    // 确保数据有效
    if (!Array.isArray(examScores) || examScores.length === 0) {
      console.warn('无效的图表数据:', examScores);
      return;
    }

    const option = {
      xAxis: {
        type: 'category',
        data: examNames
      },
      yAxis: {
        type: 'value',
        min: 'dataMin', // 自动计算最小值
        max: 'dataMax',  // 自动计算最大值
        name: '成绩'
      },
      series: [
        {
          data: examScores,
          type: 'line',
          label: {
            show: true,
            position: 'top',
            textStyle: {
              fontSize: 12,
              fontFamily: 'Arial Narrow Bold',
              fontWeight: 'bold'
            }
          },
          symbol: 'circle', // 数据点样式
          symbolSize: 8,
          itemStyle: {
            color: '#1890ff' // 线条颜色
          }
        }
      ],
      grid: {
        left: 30,
        right: 20,
        top: 30,
        bottom: 30
      }
    };
    
    this.chartInstance.setOption(option);
  },

  // 选择学期
  onSemesterChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedSemester: this.data.semesters[index],
    });
    if (this.data.selectedSubject !== '') {
      this.getExamInfo();
    }
  },

  // 选择科目
  onSubjectChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedSubject: this.data.subjects[index],
    });
    if (this.data.selectedSemester !== '') {
      this.getExamInfo();
    }
  },

  // 计算分析结果
  calculateAnalysis(scores) {
    if (scores.length === 0) return { average: 0, variance: 0, max: 0, min: 0 };

    const sum = scores.reduce((acc, score) => acc + score, 0);
    const average = (sum / scores.length).toFixed(2);

    const variance = (scores.reduce((acc, score) => acc + Math.pow(score - average, 2), 0) / scores.length).toFixed(2);
    const standardDeviation = Math.sqrt(variance).toFixed(2);

    const max = Math.max(...scores);
    const min = Math.min(...scores);

    return { average, standardDeviation, max, min };
  },

  // 获取考试信息
  getExamInfo() {
    const userId = wx.getStorageSync('userId');

    wx.request({
      url: apiConfig.getExamUrl,
      method: 'POST',
      data: {
        userId: userId,
        semester: this.data.selectedSemester,
        subject: this.data.selectedSubject
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const examData = res.data;
          const extractedScores = examData.map(item => item.examScore);
          const analysisResult = this.calculateAnalysis(extractedScores);
          const examNames = extractedScores.map((_, index) => `${index + 1}`);

          // 更新数据
          this.setData({
            userId: userId,
            examScores: extractedScores,
            examNames: examNames,
            analysisResult: analysisResult,
          });
          
          setTimeout(() => {
            this.updateChart(this.data.examNames, this.data.examScores);
          }, 500);

        } else {
          console.error('请求失败，状态码:', res.statusCode);
          wx.showToast({
            title: '请求失败，请稍后重试',
            icon: 'none',
          });
        }
      },
      fail: (err) => {
        console.error('请求出错:', err);
        wx.showToast({
          title: '请求数据失败，请稍后重试',
          icon: 'none',
        });
      },
    });
  },

  onLoad() {
    this.setData({
      ec: {
        onInit: (canvas, width, height, dpr) => this.initChart(canvas, width, height, dpr)
      }
    });
    this.getExamInfo(); // 页面加载时获取考试信息
  },

  onShow() {
    setTimeout(() => {
      this.updateChart(this.data.examNames, this.data.examScores);
    }, 100);
  }
});