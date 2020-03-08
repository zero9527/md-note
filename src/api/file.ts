import axios from 'axios';

// 获取文件
const fileApi = {
  // 示例：
  // get只有params才会作为请求参数
  // 其他请求方式如：POST,PUT,PATCH，data作为请求参数
  testApi: (params: any = {}) => {
    // post
    // return axios.post('/api/file/getFile', params);

    // get
    return axios.get('/api/file/getFile', {
      params,
      data: { showLoading: true }
    });
  },
  getDemo1Md: (params: any = {}) => {
    return axios.get('./md/demo1.md', {
      data: { ...params }
    });
  },
  getReactHookMd: (params: any = {}) => {
    return axios.get('./md/React-Hook.md', {
      data: { ...params }
    });
  },
  getPromiseMd: (params: any = {}) => {
    return axios.get('./md/promise_This_is.md', {
      data: { ...params, showLoading: true }
    });
  },
  getCalendarMd: (params: any = {}) => {
    return axios.get('./md/uni-app_calendar.md', {
      data: { ...params }
    });
  },
  updateFile: (params: any = {}) => {
    axios.post('/api/file/updateFile', params);
  }
};

export default fileApi;
