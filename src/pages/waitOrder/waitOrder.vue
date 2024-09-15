<template>
  <view class="total">
    <address ref="addresses"></address>
    <view class="goods">
      <view class="item" v-for="item in data?.dataList" :key="item.id">
        <view class="img-box">
          <image class="img" :src="item.imgUrl"></image>
        </view>
        <view class="item-right">
          <text class="right-top">{{ item.goodsName }}</text>
          <text class="right-center">{{ item.goodsName }}</text>
          <view class="right-bottom">
            <view style="color: red">
              <text style="font-size: 24rpx">￥</text>
              <text style="font-size: 40rpx">{{ item.price }}</text>
            </view>
            <view class="counter"> x {{ item.number }} </view>
          </view>
        </view>
      </view>
      <view class="sent">
        <text class="serve">商品总价</text>
        <view class="desc">
          <text
            ><text>商品总价</text><text style="font-size: 0.7rem">￥</text>{{ data.goodsPrice }}
          </text>
        </view>
      </view>
      <view class="sent">
        <text class="serve">运费</text>
        <view class="desc">
          <text
            ><text>运费（快递）</text><text style="font-size: 0.7rem">￥</text
            >{{ data.logisticsFee }}
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
      <view class="sent">
        <text class="serve">订单编号</text>
        <view class="desc">
          <text> {{ data.orderNo }}</text>
        </view>
      </view>
    </view>
    <view style="height: 100rpx"> </view>
    <view class="bottom">
      <button @click="cancelOrder">取消订单</button>
      <button @click="pay">付款</button>
    </view>
  </view>

  <uni-popup ref="alertDialog" type="dialog">
    <uni-popup-dialog
      cancelText="放弃"
      confirmText="继续付款"
      content="是否放弃本次付款？"
      @confirm="pay"
      @close="dialogClose"
    ></uni-popup-dialog>
  </uni-popup>
</template>

<script lang="ts" setup>
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { searchOrderAPI, cancelOrderAPI } from '@/services/order'
import { ref } from 'vue'
import address from '@/components/address'
const data = ref()
onLoad((options) => {
  data.value = JSON.parse(decodeURIComponent(options!.item))
})

//控制弹出框
const alertDialog = ref()

const pay = async () => {
  uni.showLoading({ mask: true })
  const result: any = await searchOrderAPI(data.value.orderNo)
  if (result.code == 200) {
    result.data.package = result.data.packageVal
    uni.requestPayment({
      ...result.data,
      success: (res: any) => {
        uni.hideLoading()
        uni.showToast({
          title: '购买成功',
          icon: 'success',
        })
        setTimeout(() => {
          if (data.value.payMethod == 1) {
            uni.navigateTo({
              url: '/pages/reservation/reservation?spuId=' + data.value.dataList[0].spuId,
            })
          } else {
            uni.switchTab({
              url: '/pages/list/list',
            })
          }
        }, 1000)
      },
      fail: () => {
        alertDialog.value.open()
        uni.hideLoading()
        // setTimeout(() => {
        // 	if (data.value.payMethod == 1) {
        // 		uni.navigateTo({
        // 			url: '/pages/reservation/reservation?spuId=' + data.value.dataList[0].spuId,
        // 		})
        // 	}
        // 	else {
        // 		uni.switchTab({
        // 			url: '/pages/list/list',
        // 		})
        // 	}
        // }, 1000)
      },
    })
  } else {
    uni.showToast({
      icon: 'error',
      title: result.data,
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
  const result: any = await cancelOrderAPI(data.value.orderNo)
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
      icon: 'fail',
      title: result.data,
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

    .item {
      margin-left: 20rpx;
      display: flex;

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
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .right-top {
          font-size: 28rpx;
          font-family: PingFang HK-Medium, PingFang HK;
          font-weight: 600;
          color: #000000;
          margin-top: 10rpx;
        }

        .right-center {
          font-size: 28rpx;
          font-weight: 200;
          color: #000000;
        }

        .right-bottom {
          width: 400rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
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
