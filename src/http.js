import axios from 'axios'
import store from './store/store'
import * as types from './store/types'
import router from './router'

// axios 配置
axios.defaults.timeout = 5000;
// axios.defaults.baseURL = 'http://test.lz.thextrader.cn/api/V1';
axios.defaults.baseURL = 'http://192.168.3.39:8084/api/V1';


// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (store.state.token) {
            config.headers.Access_Token = `Bearer ${store.state.token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 401 清除token信息并跳转到登录页面
                    store.commit(types.LOGOUT);
                    router.replace({
<<<<<<< HEAD
                        
=======

>>>>>>> 93f5791764f38feda4e52ad0a3827aab6a8bea64
                        path: 'login',
                        query: {redirect: router.currentRoute.fullPath}
                    })
            }
        }
        // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        return Promise.reject(error.response.data)
    });
export default axios;
