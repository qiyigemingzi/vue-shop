import axios from 'axios'
var qs = require('qs');
// import util from '../util/util.js'
const CancelToken = axios.CancelToken;
var cancel;
import {Toast } from 'vant';

// let token = util.str(util.getItem('token'));
/* 创建一个新的 AXIOS 对象，确保原有的对象不变 */
let instance = axios.create({
    baseURL: 'http://www.wujiaweb.com' /* 服务器的根路径 */
})
// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
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

// instance.post_ = (url,params)=>{
//     return new Promise((resolve, reject) => {
//         instance.post(url,  qs.stringify(params))
//           .then(response => {
//             resolve(response.data);
//           }, err => {
//             reject(err);
//           })
//           .catch((error) => {
//             reject(error)
//           })
//       })
// }



// export default instance
export default{
    //get请求
    get(url,param){
        return new Promise((resolve,reject)=>{
            instance({
                method:'get',
                url,
                params:param,
                cancelToken:new CancelToken(c=>{
                    cancel=c
                })
            }).then(res=>{  //axios返回的是一个promise对象
                resolve(res)  //resolve在promise执行器内部 
            }).catch(err=>{
                reject(err);
            })

        })
    },
    //post请求
    post(url,param){
        return new Promise((resolve,reject)=>{
            instance({
                method:'post',
                url,
                data:qs.stringify(param),
                cancelToken:new CancelToken(c=>{
                    cancel=c
                })
            }).then(res=>{
                resolve(res)
            }).catch(err=>{
                reject(err)
                // console.log(err,'异常')
            })
        })
    }
}