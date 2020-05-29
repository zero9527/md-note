import axios from 'axios';

const prefix = './md';

// 获取文件
const fileApi = {
  // 示例：
  // get只有params才会作为请求参数
  // 其他请求方式如：POST,PUT,PATCH，data作为请求参数
  demo: {
    'demo1.md': (params: any = {}) => {
      return axios.get(`${prefix}/demo/demo1.md`, {
        data: { ...params },
      });
    },
    'promise_This_is.md': (params: any = {}) => {
      return axios.get(`${prefix}/demo/promise_This_is.md`, {
        data: { ...params, showLoading: true },
      });
    },
  },
  js: {
    'amd-cmd.md': (params: any = {}) => {
      return axios.get(`${prefix}/js/amd-cmd.md`, {
        data: { ...params, showLoading: true },
      });
    },
    'evt.md': (params: any = {}) => {
      return axios.get(`${prefix}/js/evt.md`, {
        data: { ...params, showLoading: true },
      });
    },
    'js-review.md': (params: any = {}) => {
      return axios.get(`${prefix}/js/js-review.md`, {
        data: { ...params, showLoading: true },
      });
    },
    'promise.md': (params: any = {}) => {
      return axios.get(`${prefix}/js/promise.md`, {
        data: { ...params, showLoading: true },
      });
    },
    'scroll-load.md': (params: any = {}) => {
      return axios.get(`${prefix}/js/scroll-load.md`, {
        data: { ...params, showLoading: true },
      });
    },
  },
  'mini-program': {
    'movie-db.md': (params: any = {}) => {
      return axios.get(`${prefix}/mini-program/movie-db.md`, {
        data: { ...params, showLoading: true },
      });
    },
  },
  'node.js': {
    'cmd-line.md': (params: any = {}) => {
      return axios.get(`${prefix}/node.js/cmd-line.md`, {
        data: { ...params, showLoading: true },
      });
    },
    'directory-2.md': (params: any = {}) => {
      return axios.get(`${prefix}/node.js/directory-2.md`, {
        data: { ...params, showLoading: true },
      });
    },
  },
  react: {
    'movie-db-web.md': (params: any = {}) => {
      return axios.get(`${prefix}/react/movie-db-web.md`, {
        data: { ...params, showLoading: true },
      });
    },
    'next-js.md': (params: any = {}) => {
      return axios.get(`${prefix}/react/next-js.md`, {
        data: { ...params, showLoading: true },
      });
    },
    'React-Hook.md': (params: any = {}) => {
      return axios.get(`${prefix}/react/React-Hook.md`, {
        data: { ...params, showLoading: true },
      });
    },
    'react-keep-alive.md': (params: any = {}) => {
      return axios.get(`${prefix}/react/react-keep-alive.md`, {
        data: { ...params, showLoading: true },
      });
    },
    'react-ts-template.md': (params: any = {}) => {
      return axios.get(`${prefix}/react/react-ts-template.md`, {
        data: { ...params, showLoading: true },
      });
    },
  },
  vue: {
    'uni-app.md': (params: any = {}) => {
      return axios.get(`${prefix}/vue/uni-app.md`, {
        data: { ...params, showLoading: true },
      });
    },
  },
  others: {
    'web-component.md': (params: any = {}) => {
      return axios.get(`${prefix}/others/web-component.md`, {
        data: { ...params, showLoading: true },
      });
    },
  },
};

export default fileApi;
