/**
 * author：wangqian
 * createTime：2018/07/4
 * modifyTime:''
 */
import http from '../http/index.js';

//商品广告轮播
export let api_advertise_swiper = (params = {}) => {
    return http.get('/api/goods/advertise', {params:params});
}

//商品列表
export let api_goods = (params = {}) => {
    return http.get('/api/goods/lists', {params:params});
}

//商品详情
export let api_goods_details = (params = {}) => {
    return http.get('/api/goods/info', {params:params});
}