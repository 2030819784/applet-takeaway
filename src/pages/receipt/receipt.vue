<template>
  <view class="orderForm_box" v-for="order in orderList" :key="order.id" @click="toDetail(order)">
    <view class="box_top">
      <view class="top_left"
        ><text>订单号：{{ order.orderNo }}</text></view
      >
    </view>
    <view class="box_center">
      <image class="center_img" :src="order?.list?.skuList[0]?.imgList[0]?.objName"></image>
    </view>
    <view class="center_bottom">
      <view class="orderTime">
        <text>商品名称：</text>
        <view class="orderTime_item">{{ order.list?.goodName }}</view>
      </view>
      <view class="orderTime">
        <text>下单时间：</text>
        <view class="orderTime_item">{{ order.orderTime }}</view>
      </view>
      <view class="orderPlacer">
        <text>下单人信息：</text>
        <view class="orderPlacer_item">{{ order.phone }} </view>
      </view>
      <view class="line"></view>
      <view class="delivery">
        <view class="deliveryType">查看发票</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getOrderInvoiceAPI } from '@/services/receipt'
import { useMemberStore } from '@/stores'
import { getuserOrderListAPI } from '@/services/order'
var invoiceInfo: any = ref([])

const memberStore = useMemberStore()
const data: any = {
  state: 60,
  userId: memberStore.profile.id,
  page: 1,
  pageSize: 0,
}
let orderList = ref()
const getOrderList = async () => {
  const res = await getuserOrderListAPI(data)
  if (res.code == 200) {
    orderList.value = res.data.list
  }
}
onLoad(() => {
  getOrderList()
})

const toDetail = (item: any) => {
  uni.navigateTo({
    url: '/pages/receiptDetail/receiptDetail?orderId=' + item.id,
  })
}
</script>

<style lang="scss">
page {
  background-color: whitesmoke;
}
</style>
<style lang="scss" scoped>
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
</style>
