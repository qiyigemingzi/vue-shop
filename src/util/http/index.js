import axios from 'axios'
// import util from '../util/util.js'
import {Toast } from 'vant';

// let token = util.str(util.getItem('token'));
/* 创建一个新的 AXIOS 对象，确保原有的对象不变 */
let instance = axios.create({
    baseURL: 'http://www.wujiaweb.com' /* 服务器的根路径 */
})
// instance.defaults.headers.common['token'] = token;
/* 过滤请求 */
instance.interceptors.request.use((config) => {
        return config
    })
    /* 过滤响应 */
instance.interceptors.response.use((res) => {
    /* 假设当status为200时代表响应成功 */
    if (res.data.code != 200) {
       Toast.fail(res.data.msg);
        if (res.data.status == 401) {
            window.location.hash = "/";
            return Promise.reject(res);
        }
        return Promise.reject(res);
    } else {
        return Promise.resolve(res.data);
    }
}, res => {
    Toast.fail('服务访问失败!');
    return Promise.reject(res)
})

export default instance