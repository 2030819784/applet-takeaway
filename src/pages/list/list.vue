<template>
  <view v-if="isRoles">
    <!-- 订单管理-->
    <PageNavbar></PageNavbar>
    <view class="bg-top"></view>
    <view class="content">
      <view class="orderForm_tabs">
        <u-sticky>
          <u-tabs
            :list="tabsList"
            lineWidth="24"
            lineHight="6"
            lineColor="#fff"
            :activeStyle="{
              color: '#ffffff',
              fontWeight: '500',
              fontFamily: 'PingFang HK-Medium, PingFang HK',
              fontSize: '32rpx',
            }"
            :itemStyle="{
              paddingLeft: '15px',
              paddingRight: '15px',
              height: '64px',
              fontSize: '44rpx',
            }"
            :inactiveStyle="{ color: '#ffffff', fontWeight: '400', fontSize: '28rpx' }"
            :current="tabsCurrent"
            @change="changeCurrent"
          ></u-tabs>
        </u-sticky>
      </view>
      <view>
        <view v-if="loading">
          <view class="loading-overlay">
            <view class="loading">
              <u-loading-icon
                text="加载中"
                vertical="true"
                textSize="18"
                color="rgb(197, 240, 220)"
              ></u-loading-icon>
            </view>
          </view>
        </view>
        <view v-if="item?.length == 0">
          <u-empty mode="order"></u-empty>
        </view>
        <view>
          <!-- 采样检测 -->
          <view
            v-if="
              isRoles.isSamplingStaff &
              (isRoles.isHairStaff ||
                isRoles.isMedicalStaff ||
                isRoles.isQuickInspectionStaff ||
                isRoles.isSewageStaff)
            "
          >
            <view class="orderForm_box" v-for="i in item" :key="i.id" @click="changeToOrderInfo(i)">
              <view class="box_top">
                <view class="top_left"
                  ><text>订单号：{{ i.orderNo }}</text></view
                >
              </view>
              <view class="box_center">
                <image class="center_img" :src="i.list?.skuList[0]?.imgList[0]?.objName"></image>
              </view>
              <view class="center_bottom">
                <view class="orderTime">
                  <text>下单时间：</text>
                  <view class="orderTime_item">{{ i.orderTime }}</view>
                </view>
                <view class="orderPlacer">
                  <text>下单人信息：</text>
                  <view class="orderPlacer_item">{{ i.phone }} </view>
                </view>
                <view class="line"></view>
                <view class="delivery" v-if="i.state == 20">
                  <view class="deliveryType">去采样</view>
                </view>
                <view class="delivery" v-else-if="i.state == 30">
                  <view class="deliveryType">未发货</view>
                </view>
                <view class="delivery" v-else-if="i.state == 50">
                  <view class="deliveryType">确认收样</view>
                </view>
                <view class="delivery" v-else>
                  <view class="deliveryType">已完成</view>
                </view>
              </view>
            </view>
          </view>
          <!-- 检测人员任务列表 -->
          <view
            v-else-if="
              isRoles.isHairStaff ||
              isRoles.isMedicalStaff ||
              isRoles.isQuickInspectionStaff ||
              isRoles.isSewageStaff
            "
          >
            <view
              v-for="i in item"
              :key="i.id"
              @click="changeToOrderInfo(i)"
              class="orderForm_box2"
            >
              <view class="bellIcon">
                <u-icon
                  width="40rpx"
                  height="40rpx"
                  name="../../../../static/orderLIst/bell.png"
                ></u-icon>
              </view>
              <view class="text" v-if="i.state == 50">
                <view class="title">您有新的订单待处理</view>
                <view class="content">您有任务待处理,请您及时处理</view>
              </view>
              <view class="text" v-if="i.state == 60">
                <view class="title">订单已完成</view>
                <view class="content">查看结果</view>
              </view>
            </view>
          </view>

          <!-- 采样人员订单管理 -->
          <view v-else-if="isRoles.isSamplingStaff">
            <view class="orderForm_box" v-for="i in item" :key="i.id" @click="changeToOrderInfo(i)">
              <view class="box_top">
                <view class="top_left"
                  ><text>订单号：{{ i.orderNo }}</text></view
                >
              </view>
              <view class="box_center">
                <image class="center_img" :src="i.list?.skuList[0]?.imgList[0]?.objName"></image>
              </view>
              <view class="center_bottom">
                <view class="orderTime">
                  <text>下单时间：</text>
                  <view class="orderTime_item">{{ i.orderTime }}</view>
                </view>
                <view class="orderPlacer">
                  <text>下单人信息：</text>
                  <view class="orderPlacer_item">{{ i.phone }} </view>
                </view>
                <view class="line"></view>
                <view class="delivery" v-if="i.state == 20">
                  <view class="deliveryType">去采样</view>
                </view>
                <view class="delivery" v-else-if="i.state == 30">
                  <view class="deliveryType">未发货</view>
                </view>
                <view class="delivery" v-else>
                  <view class="deliveryType">已完成</view>
                </view>
              </view>
            </view>
          </view>

          <!-- 普通用户订单管理 -->
          <view v-else>
            <view class="orderForm_box" v-for="i in item" :key="i.id" @click="changeToOrderInfo(i)">
              <view class="box_top">
                <view class="top_left"
                  ><text>订单号：{{ i.orderNo }}</text></view
                >
                <view class="top_right">
                  <view class="top_state">{{ i.status }}</view>
                </view>
              </view>
              <view class="box_center">
                <image class="center_img" :src="i.list?.skuList[0]?.imgList[0]?.objName"></image>
              </view>
              <view class="center_bottom">
                <view class="orderTime">
                  <text>下单时间：</text>
                  <view class="orderTime_item">{{ i.orderTime }}</view>
                </view>
                <view class="orderPlacer">
                  <text>下单人信息：</text>
                  <view class="orderPlacer_item">{{ i.phone }} </view>
                </view>
                <button
                  class="orderButton"
                  v-if="i.status == '已付款' && i.allowSelfSample == 0"
                  @click.prevent="reservation(i)"
                >
                  预约采样
                </button>
                <view class="line"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import PageNavbar from './PageNavbar.vue'
import { getuserOrderListAPI } from '@/services/order'
import type { orderListParams, items, userOrderListParams } from '@/types/order'
import { onLoad, onPullDownRefresh, onShow, onTabItemTap } from '@dcloudio/uni-app'
import { ref, onBeforeMount } from 'vue'
import { useMemberStore, useOrderType, useOtherTypes } from '@/stores'
import Decimal from 'decimal.js'
import { log } from 'console'

let loading = ref(true)
//用户类型
const memberStore = useMemberStore()
let isRoles: any = ref()
isRoles.value = uni.getStorageSync('roles')
//获取页面参数
const query = defineProps<{ type: number }>()

const tabsList = ref()
//普通用户
const tabsList1 = [
  {
    name: '全部',
  },
  {
    state: 0,
    name: '未付款',
  },
  {
    state: 10,
    name: '已付款',
  },
  {
    state: 20,
    name: '未采样',
  },
  {
    state: 30,
    name: '未发货',
  },
  {
    state: 40,
    name: '运输中',
  },
  {
    state: 50,
    name: '未检测',
  },
  {
    state: 60,
    name: '已完成',
  },
  {
    state: 70,
    name: '取消交易',
  },
]
//采样人
const tabsList2 = [
  {
    name: '全部',
  },
  {
    state: 20,
    name: '未采样',
  },
  {
    state: 30,
    name: '未发货',
  },
  {
    state: 60,
    name: '已完成',
  },
]
//检测人
const tabsList3 = [
  {
    name: '全部',
  },
  {
    state: 50,
    name: '未检测',
  },
  {
    state: 60,
    name: '已完成',
  },
]
//采样检测
const tabsList4 = [
  {
    name: '全部',
  },
  {
    state: 20,
    name: '未采样',
  },
  {
    state: 30,
    name: '未发货',
  },
  {
    state: 50,
    name: '未检测',
  },
  {
    state: 60,
    name: '已完成',
  },
]
//高亮下标
let tabsCurrent = ref(0)

let queryParams: any = {
  page: 1,
  pageSize: 0,
}
//选择需要展示的页面效果
const select = () => {
  if (
    isRoles.value.isSamplingStaff &
    (isRoles.value.isHairStaff ||
      isRoles.value.isMedicalStaff ||
      isRoles.value.isQuickInspectionStaff ||
      isRoles.value.isSewageStaff)
  ) {
    tabsList.value = tabsList4
  } else if (
    isRoles.value.isHairStaff ||
    isRoles.value.isMedicalStaff ||
    isRoles.value.isQuickInspectionStaff ||
    isRoles.value.isSewageStaff
  ) {
    tabsList.value = tabsList3
  } else if (isRoles.value.isSamplingStaff) {
    tabsList.value = tabsList2
  } else {
    tabsList.value = tabsList1
  }
}
//切换状态查看商品
const changeCurrent = (index: any) => {
  loading.value = true
  tabsCurrent.value = index.id
  if (
    isRoles.value.isSamplingStaff &
    (isRoles.value.isHairStaff ||
      isRoles.value.isMedicalStaff ||
      isRoles.value.isQuickInspectionStaff ||
      isRoles.value.isSewageStaff)
  ) {
    if (index.state == null) {
      //采样检测，全部订单为20，30，40，50，60合并，固定传2查询
      queryParams.state = 2
    } else {
      queryParams.state = index.state
    }
  } else if (isRoles.value.isSamplingStaff) {
    if (index.state == 60) {
      //采样人员，已完成订单为40，50，60合并，固定传1查询
      queryParams.state = 1
    } else if (index.state == null) {
      //采样人员，全部订单为20，30，40，50，60合并，固定传2查询
      queryParams.state = 2
    } else {
      queryParams.state = index.state
    }
  } else if (
    isRoles.value.isHairStaff ||
    isRoles.value.isMedicalStaff ||
    isRoles.value.isQuickInspectionStaff ||
    isRoles.value.isSewageStaff
  ) {
    if (index.state == null) {
      //检测人员，全部订单为50，60合并，固定传3查询
      queryParams.state = 3
    } else {
      queryParams.state = index.state
    }
  } else {
    queryParams.state = index.state
  }
  getuserOrderList()
}
let item = ref()
//订单列表
const getuserOrderList = async () => {
  if (
    isRoles.value.isSamplingStaff &
    (isRoles.value.isHairStaff ||
      isRoles.value.isMedicalStaff ||
      isRoles.value.isQuickInspectionStaff ||
      isRoles.value.isSewageStaff)
  ) {
    if (tabsCurrent.value == 0) {
      //采样检测，全部订单为20，30，40，50，60合并，固定传2查询
      queryParams.state = 2
    }
  } else if (isRoles.value.isSamplingStaff) {
    if (tabsCurrent.value == 0) {
      //采样人员，全部订单为20，30，40，50，60合并，固定传2查询
      queryParams.state = 2
    }
  } else if (
    isRoles.value.isHairStaff ||
    isRoles.value.isMedicalStaff ||
    isRoles.value.isQuickInspectionStaff ||
    isRoles.value.isSewageStaff
  ) {
    if (tabsCurrent.value == 0) {
      //检测人员，全部订单为50，60合并，固定传3查询
      queryParams.state = 3
    }
  }

  if (
    isRoles.value.isSamplingStaff ||
    isRoles.value.isHairStaff ||
    isRoles.value.isMedicalStaff ||
    isRoles.value.isQuickInspectionStaff ||
    isRoles.value.isSewageStaff
  ) {
    if (memberStore.profile.shopInfoId) {
      queryParams.shopInfoId = memberStore.profile.shopInfoId
    } else {
      loading.value = true
      uni.showToast({
        icon: 'error',
        title: '您没有商铺',
      })
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/index/index',
        })
      }, 500)
    }
  } else {
    queryParams.userId = memberStore.profile.id
  }

  const result: any = await getuserOrderListAPI(queryParams)
  if (result.code === 200) {
    item.value = result.data.list
    loading.value = false
  }
  for (let i = 0; i < item.value?.length; i++) {
    if (item.value[i].state == 0) {
      item.value[i].status = '未付款'
    } else if (item.value[i].state == 10) {
      item.value[i].status = '已付款'
    } else if (item.value[i].state == 20) {
      item.value[i].status = '未采样'
    } else if (item.value[i].state == 30) {
      item.value[i].status = '未发货'
    } else if (item.value[i].state == 40) {
      item.value[i].status = '运输中'
    } else if (item.value[i].state == 50) {
      item.value[i].status = '未检测'
    } else if (item.value[i].state == 60) {
      item.value[i].status = '已完成'
    } else if (item.value[i].state == 70) {
      item.value[i].status = '已取消'
    }
  }
}
const changeToOrderInfo = (item: any) => {
  if (item.state == 0) {
    const data = {
      dataList: [
        {
          goodsName: item.goodsName, //商品名称
          number: item.number, //商品数量
          price: item.price, //商品总价
          skuId: item.skuId, //skuId
          spuId: item.id, //spuId
          imgUrl: item.list.skuList[0]?.imgList[0]?.objName, //商品图片
          address: item.detailedAddress, //商铺地址
        },
      ],
      orderNo: item.orderNo,
      goodsPrice: item.price,
      logisticsFee: item.logisticsFee,
      totalPrice: Decimal.add(item.price, item.logisticsFee),
    }
    uni.navigateTo({
      url: '/pages/waitOrder/waitOrder?item=' + encodeURIComponent(JSON.stringify(data)),
    })
  } else {
    uni.navigateTo({
      url: '/pages/list/orderInfo?item=' + encodeURIComponent(JSON.stringify(item)),
    })
  }
}
onPullDownRefresh(async () => {
  loading.value = true
  await getuserOrderList()
  uni.stopPullDownRefresh()
})
onBeforeMount(() => {})
onShow(() => {
  isRoles.value = uni.getStorageSync('roles')
  if (!isRoles.value) {
    uni.navigateTo({
      url: '/pages/login/login',
    })
  }
  select()
  uni.removeStorageSync('comfirm')
  const orderType = useOrderType().orderTypes
  const otherType = useOtherTypes().otherType
  if (orderType) {
    if (orderType.state == 0) {
      tabsCurrent.value = 1
      queryParams.state = 0
    } else if (orderType.state == 1) {
      tabsCurrent.value = 3
      queryParams.state = 20
    } else if (orderType.state == 2) {
      tabsCurrent.value = 7
      queryParams.state = 60
    }
  }
  if (otherType) {
    if (
      isRoles.value.isSamplingStaff &&
      (isRoles.value.isHairStaff ||
        isRoles.value.isMedicalStaff ||
        isRoles.value.isQuickInspectionStaff ||
        isRoles.value.isSewageStaff)
    ) {
      if (otherType.state == 3) {
        tabsCurrent.value = 4
        queryParams.state = 60
      } else if (otherType.state == 4) {
        tabsCurrent.value = 0
        queryParams.state = 2
      }
    } else if (isRoles.value.isSamplingStaff) {
      if (otherType.state == 1) {
        tabsCurrent.value = 1
        queryParams.state = 20
      } else if (otherType.state == 2) {
        tabsCurrent.value = 3
        queryParams.state = 1
      } else if (otherType.state == 3) {
        tabsCurrent.value = 0
        queryParams.state = 2
      }
    } else if (
      isRoles.value.isHairStaff ||
      isRoles.value.isMedicalStaff ||
      isRoles.value.isQuickInspectionStaff ||
      isRoles.value.isSewageStaff
    ) {
      if (otherType.state == 1) {
        tabsCurrent.value = 1
        queryParams.state = 50
      } else if (otherType.state == 3) {
        tabsCurrent.value = 2
        queryParams.state = 60
      } else if (otherType.state == 4) {
        tabsCurrent.value = 0
        queryParams.state = null
      }
    } else {
      if (otherType.state == 1) {
        tabsCurrent.value = 5
        queryParams.state = 40
      } else if (otherType.state == 2) {
        tabsCurrent.value = 6
        queryParams.state = 50
      } else if (otherType.state == 3) {
        tabsCurrent.value = 7
        queryParams.state = 60
      } else if (otherType.state == 4) {
        tabsCurrent.value = 0
        queryParams.state = null
      }
    }
  }
  getuserOrderList()
})

const reservation = (item: any) => {
  uni.setStorageSync('orderId', item.id)
  uni.navigateTo({
    url: '/pages/sample/sample',
  })
}
</script>
<style lang="scss" scoped>
page {
}

.bg-top {
  position: absolute;
  z-index: -1;
  width: 750rpx;
  height: 120rpx;
  border-bottom-right-radius: 25rpx;
  border-bottom-left-radius: 25rpx;
  background-color: #01b575;
}

.content {
  margin-top: 40rpx;
  margin: 0rpx 25rpx;

  .orderForm_tabs {
    font-size: 32rpx;
    font-family: PingFang HK-Medium, PingFang HK;
    font-weight: 500;
    color: #ffffff;
    line-height: 38rpx;
  }

  .orderForm_box {
    margin: 24rpx;
    height: 488rpx;
    background: linear-gradient(180deg, #e5fdf5 0%, rgba(255, 255, 255, 0) 25%);
    border-radius: 32rpx 32rpx 32rpx 32rpx;
    font-size: 28rpx;
    font-family: PingFang HK-Medium, PingFang HK;
    font-weight: 500;
    color: #000000;
    line-height: 33rpx;

    .box_top {
      display: flex;
      justify-content: space-between;
      font-size: 28rpx;
      font-family: PingFang HK-Medium, PingFang HK;
      font-weight: 500;
      color: #000000;

      .top_left {
        margin: 30rpx 0 0 36rpx;
      }

      .top_right {
        display: flex;
        margin: 30rpx 36rpx 0 36rpx;

        .top_state {
          margin-right: 20rpx;
          font-size: 28rpx;
          font-family: PingFang HK-Medium, PingFang HK;
          font-weight: 500;
          color: #00c17f;
        }
      }
    }

    .box_center {
      .center_img {
        margin: 40rpx 40rpx;
        display: flex;
        width: 111rpx;
        height: 111rpx;
        border-radius: 12rpx 12rpx 12rpx 12rpx;
        background-color: #01b575;
      }
    }

    .center_bottom {
      margin: 0 32rpx;
      font-size: 26rpx;
      font-family: PingFang HK-Regular, PingFang HK;
      font-weight: 400;
      color: #999999;

      .orderTime {
        display: flex;
        justify-content: space-between;
        margin-bottom: 32rpx;

        .orderTime_item {
          color: #333333;
        }
      }

      .orderPlacer {
        display: flex;
        justify-content: space-between;

        .orderPlacer_item {
          color: #333333;
        }
      }

      .orderButton {
        width: 260rpx;
        font-size: 31rpx;
        border-radius: 30rpx;
        position: relative;
        background: #00c17f;
        top: 20rpx;
        left: 150rpx;
      }

      .line {
      }

      .delivery {
        margin: 30rpx 0;
        float: right;
        width: 160rpx;
        height: 52rpx;
        border-radius: 200rpx 200rpx 200rpx 200rpx;
        opacity: 1;
        border: 2rpx solid #00c17f;

        .deliveryType {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 28rpx;
          font-family: PingFang HK-Medium, PingFang HK;
          font-weight: 500;
          color: #00c17f;
          line-height: 52rpx;
        }
      }
    }
  }

  .orderForm_box2 {
    margin: 24rpx;
    height: 144rpx;
    background: #f7f7f7;
    border-radius: 16rpx;
    font-size: 28rpx;
    font-family: PingFang HK-Medium, PingFang HK;
    font-weight: 500;
    color: #000000;
    line-height: 33rpx;
    display: flex;

    .bellIcon {
      margin-top: 30rpx;
      margin-left: 24rpx;
    }

    .text {
      margin-top: 30rpx;
      margin-left: 24rpx;

      .title {
        font-size: 28rpx;
        font-family: PingFang HK-Medium, PingFang HK;
        font-weight: 500;
        color: #000000;
        line-height: 33rpx;
      }

      .content {
        margin-top: 30rpx;
        font-size: 24rpx;
        font-family: PingFang HK-Regular, PingFang HK;
        font-weight: 400;
        color: #666666;
        line-height: 28rpx;
      }
    }
  }

  .loading-overlay {
    position: absolute;
    top: 80rpx;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(252, 249, 249, 0.869);
    z-index: 999;

    .loading {
      margin-top: 30%;
    }
  }

  .loading-text {
    display: flex;
    justify-content: center;
    margin-top: 30%;
    align-items: center;
    font-size: 28rpx;
    font-family: PingFang HK-Medium, PingFang HK;
    font-weight: 500;
    color: #595757;
    line-height: 33rpx;
  }
}
</style>
