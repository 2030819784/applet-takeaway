<!-- 缉毒产品 -->
<template>
  <view class="content">
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
      <view v-if="item.length == 0">
        <u-empty mode="data"></u-empty>
      </view>
      <view>
        <view v-if="item">
          <view
            v-for="i in item"
            :key="i.id"
            @click="changeToGoodsList(i.categoryName)"
            class="orderForm_box2"
          >
            <view class="bellIcon">
              <u-icon
                width="40rpx"
                height="40rpx"
                name="../../../../static/orderLIst/bell.png"
              ></u-icon>
            </view>
            <view class="text">
              <view class="title">商品类别</view>
              <view class="content">{{ i.categoryName }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getuserOrderListAPI } from '@/services/order'
import type { orderListParams, items, userOrderListParams } from '@/types/order'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref, onBeforeMount } from 'vue'
import { useMemberStore, useOrderType, useOtherTypes } from '@/stores'
import { getGoodsCategoryListAPI } from '@/services/home'

let loading = ref(true)
let queryParams: any = {
  page: 1,
  pageSize: 0,
}

let item = ref()
const getCategoryList = async () => {
  const result: any = await getGoodsCategoryListAPI(queryParams)
  if (result.code === 200) {
    item.value = result.data.list
  }
  loading.value = false
}
const changeToGoodsList = async (categoryName: any) => {
  uni.navigateTo({
    url: '/pages/antiDrugProduct/antiDrugGoods/antiDrugGoods?name=' + categoryName,
  })
}
onBeforeMount(() => {
  getCategoryList()
})
onShow(() => {
  getCategoryList()
})
onLoad(() => {})

//跳转到订单详情页面
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
    top: 0;
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
