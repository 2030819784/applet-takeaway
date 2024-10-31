<template>
  <view class="total">
    <address ref="addresses"></address>
    <view class="goods">
      <view class="item" v-for="(item, index) in data?.orderListDetailList" :key="index">
        <!-- <view class="img-box">
          <image class="img" :src="item.imgUrl"></image>
        </view> -->
        <view class="item-right">
          <text class="right-top">{{ item.name }}</text>
        </view>
        <view class="sent">
          <text class="serve">商品单价</text>
          <view class="desc">
            <text style="color: red"><text style="font-size: 0.7rem">￥</text>{{ item.price }}
            </text>
          </view>
        </view>
        <view class="sent">
          <text class="serve">商品数量</text>
          <view class="desc">
            <text>x {{ item.number }}
            </text>
          </view>
        </view>
      </view>
      <view class="sent">
        <text class="serve">商品总价</text>
        <view class="desc">
          <text><text style="font-size: 0.7rem">￥</text>{{ data.totalPrice }}
          </text>
        </view>
      </view>
      <view class="sent">
        <text class="serve">需付款</text>
        <view class="desc">
          <text style="color: red">
            <text style="font-size: 0.7rem">￥</text> {{ data.totalPrice }}
          </text>
        </view>
      </view>
    </view>
    <view style="height: 100rpx"> </view>
    <view class="bottom">
      <button @click="cancelOrder">取消订单</button>
      <button @click="alertDialog.open()">付款</button>
    </view>
  </view>

  <uni-popup ref="alertDialog" type="dialog">
    <uni-popup-dialog cancelText="放弃" confirmText="确认" content="是否确认本次付款？" @confirm="pay"
      @close="dialogClose"></uni-popup-dialog>
  </uni-popup>
</template>

<script lang="ts" setup>
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { paymentAPI, cancelOrderAPI } from '@/services/order'
import { ref } from 'vue'
const data = ref()
onLoad((options) => {
  data.value = JSON.parse(decodeURIComponent(options!.item))
})

//控制弹出框
const alertDialog = ref()

const pay = async () => {
  const result: any = await paymentAPI(data.value.id)
  if (result.code === 200) {
    uni.showToast({
      icon: 'success',
      title: '付款成功',
    })
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/list/list',
      })
    }, 1000)
  } else {
    uni.showToast({
      title: result.msg,
      icon: 'error'
    })
  }
}

const dialogClose = () => {
  uni.navigateTo({
    url: '/pages/waitOrder/waitOrder?item=' + encodeURIComponent(JSON.stringify(data.value)),
  })
}

//取消订单
const cancelOrder = async () => {
  const result: any = await cancelOrderAPI(data.value.id)
  if (result.code === 200) {
    uni.showToast({
      icon: 'success',
      title: '订单取消成功',
    })

    const page: any = getCurrentPages()
    setTimeout(() => {
      uni.navigateBack({
        delta: page - 1,
      })
    }, 1000)
  } else {
    uni.showToast({
      icon: 'error',
      title: result.msg,
    })
  }
}

onUnload(() => {
  const page: any = getCurrentPages()
  uni.navigateBack({
    delta: page - 1,
  })
})
</script>

<style lang="scss">
.total {
  background: #f5f5f5;
  width: 100%;
  height: 100%;
  position: absolute;

  .goods {
    background: white;
    border-radius: 20rpx;
    margin: 0 auto;
    margin-top: 20rpx;
    width: 700rpx;
    padding-top: 20rpx;

    .item {
      margin: 0 20rpx;
      border-radius: 24rpx;
      background: #d3f5e0;
      padding-bottom: 20rpx;

      .img-box {
        width: 160rpx;
        height: 160rpx;
        border-radius: 16rpx;
        display: flex;
        justify-content: center;
        align-items: center;

        .img {
          width: 148rpx;
          height: 148rpx;
        }
      }

      .item-right {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 24rpx;

        .right-top {
          font-size: 32rpx;
          font-family: PingFang HK-Medium, PingFang HK;
          font-weight: 600;
          color: #000000;
          margin-top: 10rpx;
          white-space: nowrap;
        }
      }
    }

    .sent {
      display: flex;
      width: 680rpx;
      height: 60rpx;
      margin: 20rpx 0 20rpx 40rpx;
      font-size: 0.9rem;
      line-height: 60rpx;

      .serve {
        width: 200rpx;
        display: block;
        font-weight: 400;
        font-size: 1.1rem;
      }

      .desc {
        width: 400rpx;
        text-align: end;
        margin-right: auto;
      }
    }
  }

  .bottom {
    background-color: white;
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    height: 100rpx;
    border-radius: 20rpx 20rpx 0 0;
    justify-content: center;
    align-items: center;

    button {
      border-radius: 40rpx;
      width: 240rpx;
      height: 70rpx;
      text-align: center;
      line-height: 70rpx;
      color: white;
      font-size: 0.9rem;
    }
  }
}

button:first-child {
  background: orangered;
  border: 1px solid red;
  margin-left: 200rpx;
}

button:nth-child(2) {
  background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
}
</style>
