import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { loading } from '@/utils';

const { loadingStart, loadingEnd } = loading();
let startFlag = false; // loadingStart的标志

// 拦截器
export default function AxiosConfig() {
  // 请求拦截
  axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      if (config.data && config.data.showLoading) {
        // 需要显示loading的请求
        startFlag = true;
        loadingStart();
      }

      return {
        ...config,
        _t: Date.now(),
      };
    },
    (err: AxiosError) => {
      if (startFlag) {
        startFlag = false;
        loadingEnd();
      }
      return Promise.reject(err);
    }
  );

  // 响应拦截
  axios.interceptors.response.use(
    (res: AxiosResponse) => {
      if (startFlag) {
        startFlag = false;
        loadingEnd();
      }
      return res.data;
    },
    (err: AxiosError) => {
      if (startFlag) {
        startFlag = false;
        loadingEnd();
      }
      return Promise.reject(err);
    }
  );
}
