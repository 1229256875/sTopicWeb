import axios from 'axios';
import history from '@/pages/.umi/history';
import qs from 'qs';
import {message} from "antd";

/**
 * 自定义实例默认值
 */
const instance = axios.create({
  withCredentials: true,
  // baseURL: 'http://47.111.15.40:8888', // 公共接口url（如果有多个的公共接口的话，需要处理）
  // baseURL: 'http://127.0.0.1:8091', // 公共接口url（如果有多个的公共接口的话，需要处理）
  baseURL: 'http://127.0.0.1:9986', // 公共接口url（如果有多个的公共接口的话，需要处理）
  timeout: 10000, // 请求超时
});
// /api/getUserById


// 请求拦截器, 进行一个全局loading  加载，这种情况下所有的接口请求前 都会加载一个loading

/**
 * 添加请求拦截器 ，意思就是发起请求接口之前做什么事，一般都会发起加载一个loading
 * */

//  如果不想每个接口都加载loading ，就注释掉请求前拦截器,在http这个类中处理

instance.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么（... 这里写你的展示loading的逻辑代码 ）
    // isShowLoading(true);
    // 获取token，配置请求头
    // const TOKEN = localStorage.getItem('Token')
    // 演示的token（注意配置请求头，需要后端做cros跨域处理，我这里自己前端配的跨域）
    // const token = '1fd399bdd9774831baf555ae5979c66b';
    if (config.method === 'post') {
      config.data = qs.stringify(config.data);
    }

    const Token = localStorage.getItem('Token');
    // const token = localStorage.getItem('token');
    if (Token) {
      // 配置请求头 token
      config.headers['token'] = Token;
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      // config.headers['token'] = token;
      // config.headers['Authorization'] = TOKEN;
    }
    return config;
  },
  error => {
    // 对请求错误做些什么，处理这个错误

    // 可以直接处理或者展示出去,toast show()
    console.warn(error);
    return Promise.reject(error);
  },
);

/**
 * 添加响应拦截器，意思就是发起接口请求之后做什么事，此时只有两种情况，
 * 要么成功，要么失败，但是不管成功，还是失败，我们都需要关闭请求之前的
 * 发起的loading，那既然要处理loading，就把loading做成全局的了，
 * 这里自定义一个处理加载loding 和关闭loading的方法，而且这个loading
 * 要不要加载，会根据外部传入的布尔值来决定，默认是false:不展示
 * */

instance.interceptors.response.use(response => {
  // 对响应数据做点什么
  // isShowLoading(false);
  // 根据你们家的后端定义请求过期后返回的参数，处理token过期问题
  // 我这个接口木有token啊，这里演示下
  const { url } = response.config;
  console.log(response);
  if (url.includes('/api/login')) {
    localStorage.setItem("Token", response.data.token)
    return response;
  }
  checkStatus(response.data);
  return response.data;
}, error => {

  const { response } = error;
  const { url } = response.config;
  // console.log(response);
  if (url.includes('/api/login')) {
    return response;
  }
  return checkStatus(response);
});

// 如果与你配合的ui中，有loading组件的话，你直接用它的就可以了

// to do...
/**
 * 是否开启loading
 * @param {*} payload { type:Boolean }
 */

function isShowLoading(payload) {
// 获取dom节点
  const loading = document.getElementById('loading');
  payload ? loading.style.display = 'block' : loading.style.display = 'none';
}

function checkStatus(response) {
  const { status } = response;
  if (status >= 200 && status < 300) {
    return response;
  }
  if (status === 401) {
    if (!window.location.href.includes('/user/login')) {
      window.localStorage.clear();
      history.push('/user/login');
      /* eslint prefer-promise-reject-errors: 0 */
      return Promise.reject('验证失败，请重新登陆');
    } else {
      return response;
    }
  }
  if (status === 403 || status === 400) {
    if (!window.location.href.includes('/user/login')) {
      // dispatch(routerRedux.push('/exception/403'));
      // history.push('/user/login');
      return Promise.reject('访问被禁止');
    } else {
      return response;
    }
  }
  if (status <= 504 && status >= 500) {
    if (!window.location.href.includes('/user/login')) {
      message.error(response.data);
      // dispatch(routerRedux.push('/exception/500'));
      history.push('/user/login');
      return Promise.reject('服务器发生错误');
    } else {
      return response;
    }
  }
  if (status === 409) {
    return response;
  } else if (status >= 404 && status < 422) {
    // dispatch(routerRedux.push('/exception/404'));
    history.push('/user/login');
    return Promise.reject('资源未找到');
  }
}

/**
 * 使用es6中的类，进行简单封装
 */

class http {
  // 使用async ... await
  static async get(url, params) {
    return await instance.get(url, { params });
  }

  static async post(url, params) {
    return await instance.post(url, params);
  }
}


export default http;
