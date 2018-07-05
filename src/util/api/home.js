/**
 * author：wangqian
 * createTime：2018/07/4
 * modifyTime:''
 */
import http from '../http/index.js';

//商品列表
export let api_goods = (params = {}) => {
    return http.get('/api/goods/lists', {params:params});
}

//商品广告轮播
export let api_advertise_swiper = (params = {}) => {
    return http.get('/api/goods/advertise', {params:params});
}