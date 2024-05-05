import axios from 'axios';

const service = axios.create({
  //baseURL: 'http://localhost:5173/api',
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'X-localization': 'en',
  },
});

export default service;

declare module 'axios' {
  export interface AxiosRequestConfig {
    withoutResponseInterceptor?: boolean;
  }
}
