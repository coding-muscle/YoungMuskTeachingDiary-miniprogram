// apiConfig.js
// 定义基础 URL
const baseUrl = 'http://192.168.88.1:3000';

// 导出注册和登录的完整 URL
module.exports = {
  registerUrl: `${baseUrl}/api/auth/register`,
  loginUrl: `${baseUrl}/api/auth/login`,
  logoutUrl: `${baseUrl}/api/auth/logout`,
  setProfileUrl: `${baseUrl}/api/profile/set-profile`,
  getProfileUrl: `${baseUrl}/api/profile/get-profile`,
  getCourseUrl: `${baseUrl}/api/course/get-course`,
  getHomeworkUrl: `${baseUrl}/api/homework/get-homework`,
  creatFocusUrl: `${baseUrl}/api/focus/create-focus`,
  getExamUrl: `${baseUrl}/api/exam/get-exam`,
};
