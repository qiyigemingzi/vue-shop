<template>
    <div class="app-init order-page scroll-box">
        <header-back title="我的订单"></header-back>

        <div class="padding-box">
            <van-tabs v-model="active" :swipe-threshold='5' :swipeable='true'>
                <van-tab v-for="(item,index) in tabList" :title="item.title" :key='index'>
                    <van-card
                    :title="item.title"
                    desc="描述"  
                    num="2"
                    price="2.00"
                    :thumb="imageURL"
                    >
                    <div slot="footer">
                        <van-button size="mini">按钮</van-button>
                        <van-button size="mini">按钮</van-button>
                    </div>
                    </van-card>
                </van-tab>
            </van-tabs>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
import headerBack from "../../components/header-back";
import { Tab, Tabs } from "vant";
import { Card } from 'vant';
import Vue from "vue";

Vue.use(Tab).use(Tabs);
Vue.use(Card);

export default {
  name: "order",
  components: {
    headerBack
  },
  data() {
    return {
      active: 0,
      tabList: [
        {
          id: 0,
          title: "全部",
          goods:{}
        },
        {
          id: 1,
          title: "待付款",
           goods:{}
        },
        {
          id: 2,
          title: "待发货",
           goods:{}
        },
        {
          id: 3,
          title: "待收货",
           goods:{}
        },
        {
          id: 4,
          title: "待评价",
           goods:{}
        }
      ]
    };
  },
  created(){
      this.active = this.$route.query.id == undefined ? 0 : this.$route.query.id;
  },
};
</script>

<style type="text/sass" lang="sass">
 
</style>
