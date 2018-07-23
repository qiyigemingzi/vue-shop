/**
 * author：wangqian
 * createTime：2018/07/4
 * modifyTime:''
 */
import http from '../http/index.js';

//加入购物车
export let api_add_cart = (params = {}) => {
    return http.post('/api/cart/add', params);
}

//购物车列表
export let api_cart_list = (params = {}) => {
    return http.get('/api/cart', params);
}

//删除购物车商品
export let api_delete_cart = (params = {}) => {
    return http.post('/api/cart/delete', params);
}

//购物车商品数量修改
export let api_modifiy_cart = (params = {}) => {
    return http.get('/api/cart/changeNum',  params);
}

//购物车商品选择
export let api_select_cart = (params = {}) => {
    return http.get('/api/cart/selected',  params);
}
