<template>
  <div class="app-init home-index">
    <header class="public-header">
      <form class="search-box clear">
        <div class="fl logo">
          <span class="iconfont icon-xiaomi"></span>
        </div>
        <div class="input-box" @click="$router.openPage('/search')">
          <span class="iconfont icon-sousuo-copy absolute"></span>
          <input type="text" class="input-controller" placeholder="搜索商品名称" readonly>
        </div>
        <div class="myself-center fr" @click="$router.openPage('/mine')">
          <span class="iconfont icon-smile"></span>
        </div>
      </form>

      <!-- <nav class="menu-box scroll-box-x noscroll">
        <ul class="wrap-box clear">
          <li class="item" :class="{ 'active' : index == navListActiveIndex }" v-for="(value, index) in navList" @click="navChange(index)" :key='index'>
            <span>{{value.name}}</span>
          </li>
        </ul>
      </nav> -->
    </header>

    <div ref="view01" class="app-init scroll-box tab-box mi-tj footer-hack">
      <swiper :list="bannerList"></swiper>
      <!-- <div class="nav-mi-tj clear">
        <a href="javascript:;" class="fl">
          <img @click="$router.openPage('/pay')" src="http://oz3tayfme.bkt.clouddn.com/show.liluo.cc/2018011022292984819.png" alt="">
        </a>
        <a href="javascript:;" class="fl">
          <img @click="$router.openPage('/pay')" src="http://oz3tayfme.bkt.clouddn.com/show.liluo.cc/2018011022292372054.png" alt="">
        </a>
        <a href="javascript:;" class="fl">
          <img @click="$router.openPage('/pay')" src="http://oz3tayfme.bkt.clouddn.com/show.liluo.cc/2018011022291629252.png" alt="">
        </a>
        <a href="javascript:;" class="fl">
          <img @click="$router.openPage('/pay')" src="http://oz3tayfme.bkt.clouddn.com/show.liluo.cc/2018011022290460400.png" alt="">
        </a>
      </div> -->

      <!-- <div class="shop-item clear">
        <img @click="$router.openPage('/detail/1001')" src="http://oz3tayfme.bkt.clouddn.com/show.liluo.cc/2018011114551289342.png" class="fl href" alt="">
        <img @click="$router.openPage('/detail/1004')" src="//cdn.cnbj0.fds.api.mi-img.com/b2c-mimall-media/e2ad0dbf777fda097e55cea9ce716e33.jpg?thumb=1&w=358&h=252" class="fr href" style="margin-bottom: 0.05rem" alt="">
        <img @click="$router.openPage('/detail/1005')" src="http://oz3tayfme.bkt.clouddn.com/show.liluo.cc/2018011114550596671.png" class="fr href" alt="">
      </div>

      <div class="shop-item clear">
        <img @click="$router.openPage('/detail/1003')" v-lazy="'http://oz3tayfme.bkt.clouddn.com/show.liluo.cc/a589d24e74c4d96191dd46635054e804.jpg'" alt="">
      </div>

      <div class="shop-item clear">
        <img @click="$router.openPage('/detail/1006')" v-lazy="'http://oz3tayfme.bkt.clouddn.com/show.liluo.cc/2018011115034174111.png'" alt="">
      </div>

      <div class="shop-item clear">
        <img @click="$router.openPage('/detail/1007')" v-lazy="'http://oz3tayfme.bkt.clouddn.com/show.liluo.cc/2018011115033089933.png'" alt="">
      </div> -->

      <div class="shop-item">
        <div class="shop-box clear">
          <van-list v-model="loading" :finished="finished" @load="onLoad" >
            <div class="shop-box-item" v-for="(target,index) in shoplist" @click="$router.openPage('/detail',{id:target.goods_id})" :key='index'>
              <img v-lazy="target.original_img" alt="">
              <p class="title">{{ target.goods_name }}</p>
              <p class="con">{{ target.goods_remark }}</p>
              <p class="money">
                <span class="small">￥</span> {{ target.market_price }}
              </p>
            </div>
          </van-list>

        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import swiper from "../../components/swiper";
import VueDB from "../../util/vue-db/vue-db";
import { api_goods, api_advertise_swiper } from "../../util/api/home.js";
import { List } from "vant";
import Vue from "vue";
Vue.use(List);
let DB = new VueDB();

export default {
  data() {
    return {
      loading: false,
      finished: false,
      page: 1,
      bannerList: [],
      navList: [
        {
          name: "推荐"
        },
        {
          name: "手机"
        },
        {
          name: "智能"
        },
        {
          name: "电视"
        },
        {
          name: "电脑"
        },
        {
          name: "全面屏"
        },
        {
          name: "生活周边"
        },
        {
          name: "盒子"
        },
        {
          name: "艺术"
        }
      ],
      navListActiveIndex: 0,
      shoplist: [],
    };
  },
  components: {
    swiper
  },
  mounted() {
    //默认加载几条商品数据
    this.onLoad();
    this.getAdvSwiper();   
  },
  methods: {
    // 导航栏切换
    // navChange(index) {
    //   this.navListActiveIndex = index;
    // },
    //获取广告轮播图列表
    getAdvSwiper() {
      api_advertise_swiper()
        .then(res => {
          console.log("首页轮播图列表=", res);
          res.data.forEach((v,i) => {
            this.bannerList.push({
              link:v.ad_link,
              src:v.ad_code,
              alt:v.ad_name
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //上拉加载更多商品列表
    onLoad() {
      api_goods({
        page: this.page,
        page_size: 10,
        sort: "",
        sort_asc: "",
        start_price: "",
        end_price: ""
      })
        .then(res => {
          console.log("首页商品列表=", res);
          this.loading = false;
          this.shoplist = this.shoplist.concat(res.data.goods_list);
          if (this.shoplist.length >= res.data.total_count) {
            this.finished = true;
          }
          this.page++;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  beforeRouteLeave(to, from, next) {
    // DB.setItem("home-index-view01", this.$refs.view01.scrollTop);
    // DB.setItem("home-index-view02", this.$refs.view02.scrollTop);
    // DB.setItem("home-index-view03", this.$refs.view03.scrollTop);
    // DB.setItem("home-index-view04", this.$refs.view04.scrollTop);
    // DB.setItem("home-index-view05", this.$refs.view05.scrollTop);
    // DB.setItem("home-index-view06", this.$refs.view06.scrollTop);
    // DB.setItem("home-index-view07", this.$refs.view07.scrollTop);
    // DB.setItem("home-index-nowIndex", this.navListActiveIndex);
    next();
  }
};
</script>

<style type="text/sass" lang="sass">
  .home-index .tab-box.mi-tj .nav-mi-tj a
      display: block
      width:  25%
  .home-index .shop-box
    background-color: #fff

</style>
