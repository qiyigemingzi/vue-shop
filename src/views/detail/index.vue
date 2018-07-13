<template>
  <div class="app-init detail-page">

    <div class="app-init scroll-box footer-hack">
      <div class="banner">
        <swiper :list="info.banner"></swiper>
        <span class="back iconfont icon-backer" @click="$router.back()"></span>
      </div>

      <div class="content">
        <!-- <div class="hot">
          <img :src="info.hot" @click="$router.openPage(info.hotLink)" alt="">
        </div> -->
        <div class="title-box">
          <h3>{{ goods.title }}</h3>
          <p style="color:#ff4a00">{{ goods.goods_remark }}</p>
          <p style="color: #757575"> {{ info.smallContent }} </p>

          <div class="press">
            <span class="money" v-if="goods.shop_price">￥{{ goods.shop_price }}</span>
            <span class="no-money" v-if="goods.market_price">￥{{ goods.market_price }}</span>
            <span class="tips" v-if='( goods.market_price-goods.shop_price ) > 0 '>直降{{ goods.market_price-goods.shop_price }}￥</span>
          </div>
        </div>

        <div class="touch-item-box">
          <div class="touch-item" @click='showSku = true'>
            <span class="key">已选</span>
            {{ info.chouse }}
          </div>
          <div class="touch-item">
            <span class="key">送至</span>
            <span v-for="target in info.address">{{ target }}</span>
          </div>
        </div>

        <div class="touch-item-box">
          <div class="touch-item">
            <span class="key">配件</span>
          </div>
        </div>

        <div class="p-box">
          <img v-for="target in info.pBox" v-lazy="target" alt="">
        </div>

      </div>
    </div>

    <div class="detail-footer">
      <div class="left-box fl">
        <div class="item" @click="$router.openPage('/')">
          <p>
            <span class="iconfont icon-shouye"></span>
          </p>
          <p class="name">首页</p>
        </div>
        <div class="item cursom-shopcar" @click="$router.openPage('/shoppingcart')">
          <p>
            <span class="iconfont icon-gouwuche"></span>
          </p>
          <p class="name">购物车</p>

          <span class="num" v-show="getShopCarLength > 0" :class="{ 'full': parseInt(getShopCarLength) >= 99 }">{{ parseInt(getShopCarLength) >= 99 ? '99+' : getShopCarLength }}</span>
        </div>
      </div>
      <div class="right-box shop-car fl" @click="addShopCar">
        加入购物车
        <span class="bool bool-animate" ref="bool"></span>
      </div>
    </div>

    <div class="loading-box" :class="{ 'active' : loaded }" v-show="hide">
      <span class="load-ani iconfont icon-jiazai"></span>
    </div>

    <van-sku
       v-model="showSku"
      :sku="sku"
      :goods="goods"
      :goods-id="goodsId"
      :hide-stock="sku.hide_stock"
      :quota="quota"
      :quota-used="quotaUsed"
      :reset-stepper-on-hide="resetStepperOnHide"
      :reset-selected-sku-on-hide="resetSelectedSkuOnHide"
      :close-on-click-overlay="closeOnClickOverlay"
      :disable-stepper-input="disableStepperInput"
      :message-config="messageConfig"
      :initial-sku="initialSku"
      @buy-clicked="onBuyClicked"
      @add-cart="onAddCartClicked"
    />
  </div>
</template>

<script type="text/ecmascript-6">

import swiper from "../../components/swiper";
import axios from "axios";
import Parabola from "../../util/parabola/index";
import { mapGetters } from "vuex";
import ShopCarTool from "../../util/shop-car-tool";
import { api_goods_details } from "../../util/api/home.js";
import { Sku } from "vant";
import Vue from "vue";
Vue.use(Sku);

export default {
  name: "detail",
  data() {
    return {
      showSku:false, //是否显示sku 组件
       initialSku: { 
        s1: '42',
        s2: '47',
        s3: '51'
      },
      sku: {
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: [],
        // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
        list: [],
        price: '', // 默认价格（单位元）
        stock_num: 0, // 商品总库存
       collection_id: 81,  // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
        none_sku: false, // 是否无规格商品
        messages: [
          {
            // 商品留言
            datetime: '0', // 留言类型为 time 时，是否含日期。'1' 表示包含
            multiple: '1', // 留言类型为 text 时，是否多行文本。'1' 表示多行
            name: '留言', // 留言名称
            type: 'text', // 留言类型，可选: id_no（身份证）, text, tel, date, time, email
            required: '0' // 是否必填 '1' 表示必填
          }
        ],
        hide_stock: false // 是否隐藏剩余库存
      },
     goods: {
      // 商品标题
      title: '测试商品',
      // 默认商品 sku 缩略图
      picture: 'https://img.yzcdn.cn/1.jpg',
      goods_remark:'',
      market_price:'',
      shop_price:''
    },
      goodsId:'',
      quota:0, //限购数0表示不限购 
      quotaUsed:0,//已经购买过的数量
      resetStepperOnHide:false,//窗口隐藏时重置选择的商品数量
      resetSelectedSkuOnHide:false, //窗口隐藏时重置已选择的sku
      closeOnClickOverlay:true,//点击popup的overlay后是否关闭弹窗
      disableStepperInput:false,//是否禁用sku中stepper的input框
      messageConfig:{},//留言相关配置
      info: {
        banner:[], //轮播图
      },
      info1:{},
      detailObj:{},
      loaded: false,
      hide: true
    };
  },
  watch: {
    $route() {
      console.log('goods详情监听路由变化')
      this.getData();
    }
  },
  components: {
    swiper
  },
  computed: {
    ...mapGetters(["getShopCarLength"])
   
  },
  methods: {
    getData() {
      this.loaded = false;
      this.hide = true;

      var id = 1001;
      axios
        .get("./static/server/" + id + ".json")
        .then(response => {
          this.info = response.data;
          this.loaded = true;
          setTimeout(() => {
            this.hide = false;
          }, 1500);
        })
        .catch(error => {
          // this.$router.replace('/error/404')
        });

        api_goods_details({id:this.goodsId}).then((res)=>{
          console.log('商品详情的数据=',res)
          this.detailObj = res.data;
          this.setSku();
          res.data.goods_images_list.forEach((v,i) => {
            this.info.banner.push({
              src:v.image_url,
              link:'',
              alt:''
            })
          });
          
          this.goods.title = res.data.goods.goods_name;
           this.goods.picture = res.data.goods.original_img;
           this.goods.goods_remark = res.data.goods.goods_remark;
           this.goods.market_price = res.data.goods.market_price;
           this.goods.shop_price = res.data.goods.shop_price;

        }).catch((err)=>{

        })
    },
    //设置sku
    setSku(){
      this.sku.price =  this.detailObj.goods.shop_price;
      this.sku.stock_num =  this.detailObj.goods.store_count;
       this.detailObj.filter_spec.forEach((v,i)=>{
         this.sku.tree.push({
            k: v.name, // skuKeyName：规格类目名称
            v: [],
            k_s: 's'+(i+1) // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
          })
          v.data.forEach((val,index) => {
            this.sku.tree[i].v.push({
              id: val.item_id.toString(), // skuValueId：规格值 id
              name: val.item, // skuValueName：规格值名称
              imgUrl: val.src // 规格类目图片，只有第一个规格类目可以定义图片
            })
          });
       })
      let obj = this.detailObj.spec_goods_price;
       for(let key in obj){
         let sArr = key.split('_');
          this.sku.list.push({
            id: obj[key].item_id, // skuId，下单时后端需要
            price: obj[key].price*100, // 价格（单位分）
            s1: sArr.length>0 ? sArr[0] : '0', // 规格类目 k_s 为 s1 的对应规格值 id
            s2: sArr.length>1 ? sArr[1] : '0', // 规格类目 k_s 为 s2 的对应规格值 id
            s3: sArr.length>2 ? sArr[2] : '0', // 最多包含3个规格值，为0表示不存在该规格
            stock_num: obj[key].store_count // 当前 sku 组合对应的库存
          })
       }
       console.log('sku=', this.sku);
    },
    //点击购买的回调
    onBuyClicked(skuData){
      console.log('点击购买的回调')
    },
    //点击添加购物车回调
    onAddCartClicked(skuData){
      console.log('点击购买的回调',skuData)
    },
    addShopCar() {
      var root = this;
      var width =
      document.documentElement.clientWidth || document.body.clientWidth;
      root.$refs.bool.style.display = "block";

      var parabola = new Parabola({
        startPos: {
          left: root.$refs.bool.offsetLeft,
          top: root.$refs.bool.offsetTop
        },
        endPos: {
          left: root.$refs.bool.offsetLeft - 4.1 * width / 10,
          top: root.$refs.bool.offsetTop
        },
        duration: 300,
        onStep(pos) {
          var position =
            "translate3d(" +
            (pos.left - root.$refs.bool.offsetLeft) +
            "px," +
            (pos.top - root.$refs.bool.offsetTop) +
            "px, 0px)";

          root.$refs.bool.style.webKitTransform = position;
          root.$refs.bool.style.transform = position;
        },
        onFinish(pos) {
          root.$refs.bool.style.display = "none";
          root.shopCar.add(root.info);
        }
      });

      parabola.start();
    }
  },
  mounted() {
    this.shopCar = new ShopCarTool(this.$store);
    this.goodsId = this.$route.query.id == undefined ? '' : this.$route.query.id;
    this.getData();
  }
};
</script>

<style type="text/sass" lang="sass">
  @import '../../assets/sass/util'
  .detail-page
    @keyframes ani01
      0%
        transform: rotate(0deg)
      100%
        transform: rotate(360deg)
    @-webkit-keyframes ani01
      0%
        -webkit-transform: rotate(0deg)
      100%
        -webkit-transform: rotate(360deg)

    .banner
      position: relative
      .back
        position: absolute
        z-index: 1000
        width: 0.826rem
        height: 0.826rem
        border-radius: 50%
        color: #fff
        line-height: 0.826rem
        text-align: center
        display: block
        background-color: rgba(34, 35, 43, .6)
        top: 0.32rem
        left: 0.32rem
    .title-box
      background-color: #fff
      margin-bottom: 0.2rem
      padding: 0.2rem 0.4rem
      @include f12px
      h3
        font-size: .5rem
        line-height: 1.5em
        font-weight: normal
        color: #333
      p
        padding-top: 0.1rem
      .press
        padding-top: 0.2rem
        .money
          color: #ff6700
          font-size: .56rem
          font-weight: 700
        .no-money
          margin-left: .16rem
          color: rgba(0,0,0,.54)
          text-decoration: line-through
        .tips
          display: inline-block
          line-height: 1em
          padding: .2em
          color: #fff
          font-size: 0.3rem
          background: #ff6700
          margin-left: 0.2rem
          border-radius: 2px
          position: relative
          top: -0.05rem
    .detail-footer
      bottom: 0px
      height: $footerHeight
      background-color: #FFFFFF
      position: absolute
      width: 100%
      -webkit-box-shadow: 0 3px 14px 2px rgba(0,0,0,.12)
      box-shadow: 0 3px 14px 2px rgba(0,0,0,.12)
    .detail-footer .left-box
      width: 40%
      height: $footerHeight
      text-align: center
      .item
        @include box-sizing
        width: 50%
        float: left
        border-right: 1px solid #F5F5F5
        height: $footerHeight - 0.2rem
        margin-top: 0.1rem
        color: rgba(0,0,0,.54)
        font-size: 0.32rem
      .item .iconfont
        font-size: 0.56rem
        display: inline-block
        padding-top: 0.08rem
        padding-bottom: 0.05rem
      .cursom-shopcar
        position: relative

        .num
          position: absolute
          width: 0.5rem
          height: 0.5rem
          border-radius: 50%
          line-height: 0.5rem
          text-align: center
          background-color: #f95c52
          color: #fff
          right: 0.1rem
          top: 0px
        .full
          font-size: 0.3rem

    .detail-footer .right-box
      height: $footerHeight
      line-height: $footerHeight
      text-align: center
      color: #fff
      background-color: #FF6700
      width: 60%

    .loading-box
      position: absolute
      left: 0px
      top: 0px
      right: 0px
      bottom: 0px
      background-color: #000
      opacity: 0.6
      z-index: 999
      transition: all .4s ease
      .load-ani
        display: block
        position: absolute
        width: 4rem
        height: 4rem
        line-height: 4rem
        text-align: center
        color: #fff9f8
        font-size: 2rem
        top: 50%
        margin-left: -2rem
        margin-top: -2rem
        border-radius: 50%
        left: 50%
        -webkit-transform: scale(0)
        transform: scale(0)
        -webkit-animation: ani01 1s ease infinite
        animation: ani01 1s ease infinite

    .loading-box.active
      opacity: 0

    .shop-car
      position: relative
      .bool
        position: absolute
        display: block
        width: 0.4rem
        height: 0.4rem
        background-color: #F2F2F2
        left: 50%
        top: 50%
        margin-left: -0.2rem
        margin-top: -0.2rem
        border-radius: 50%
        display: none
</style>
