<template>
    <div class="app-init address-page scroll-box">
        <header-back title="我的地址"></header-back>

        <div class="padding-box" v-if='showAddressList'  transition="slide-go">
            <van-address-list v-model="chosenAddressId" :list="list" @add="onAdd" @edit="onEdit" />
        </div>
        <div class="padding-box" v-else>
            <van-address-edit :address-info="addressInfo" :area-list="areaList" show-postal show-delete show-set-default show-search-result :search-result="searchResult" @save="onSave" @delete="onDelete" @change-detail="onChangeDetail" />
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import headerBack from "../../components/header-back";
import { Toast } from "vant";
import { AddressList } from "vant";
import { AddressEdit } from "vant";
import Vue from "vue";

Vue.use(AddressList);
Vue.use(AddressEdit);
export default {
  name: "address",
  components: {
    headerBack
  },
  data() {
    return {
      showAddressList: true, //是否显示地址列表
      chosenAddressId: "1", //当前选中地址的 id
      addressInfo: {
        id: "", //每条地址的唯一标识	String | Number
        name: "", //收货人姓名	String
        tel: "", //	收货人手机号	String
        province: "", //省份	String
        city: "", //	城市	String
        county: "", //	区县	String
        address_detail: "", //	详细地址	String
        area_code: "", //	地区编码，通过省市区选择获取	String
        postal_code: "", //	邮政编码	String
        is_default: "" //	是否为默认地址	Boolean
      }, //被编辑的收货人信息
      list: [
        //地址列表
        {
          id: "1",
          name: "张三",
          tel: "13000000000",
          address: "浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室"
        },
        {
          id: "2",
          name: "李四",
          tel: "1310000000",
          address: "浙江省杭州市拱墅区莫干山路 50 号"
        }
      ],
      areaList: [], //地区列表
      searchResult: [] //详细地址搜索结果
    };
  },
  methods: {
    onAdd() {
      Toast("新增收货地址");
    },
    onEdit(item, index) {
      this.showAddressList = false;
      this.addressInfo = item;
    },
    onSave() {
      Toast("save");
    },
    onDelete() {
      Toast("delete");
    },
    onChangeDetail(val) {
      if (val) {
        this.searchResult = [
          {
            name: "黄龙万科中心",
            address: "杭州市西湖区"
          }
        ];
      } else {
        this.searchResult = [];
      }
    }
  }
};
</script>

<style type="text/sass" lang="sass">
  .address-page
    background-color: #fff
</style>
