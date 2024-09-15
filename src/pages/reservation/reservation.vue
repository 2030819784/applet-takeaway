<template>
  <view class="main">
    <view class="address">
      <image src="../../static/images/address3.png"></image>
      <view>
        <text class="addressMessage">龙兴镇采样点1</text>
        <text class="identity">上海市徐汇区桂林路1298弄桂林公园230号</text>
        <text class="distance">10.00km</text>
      </view>
    </view>
    <view class="title">
      <view class="detail">
        <text class="detail-title">预约时间</text>
        <!-- :start="startDate" :end="endDate"  -->
        <picker class="detail-message" mode="date" :value="dateTime" @change="bindDateChange">
          <view>{{ dateTime }}</view>
        </picker>
      </view>
      <view class="detail">
        <text class="detail-title">已预约人数</text>
        <text class="detail-message">{{ reservationNumber }}人</text>
      </view>
    </view>
    <view class="bottom">
      <button @click="makeSure">确认</button>
      <!-- <button>二维码</button> -->
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getReservationCountAPI, confirmReservationAPI } from '@/services/reservation'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

let spuId = 0
onLoad((options) => {
  spuId = options!.spuId
})

const dateTime = ref('')

const getDate = () => {
  const date = new Date()
  let year = date.getFullYear()
  let month: number | string = date.getMonth() + 1
  let day: number | string = date.getDate()
  month = month > 9 ? month : '0' + month
  day = day > 9 ? day : '0' + day
  dateTime.value = year + '-' + month + '-' + day
}

onLoad(() => {
  getDate()
})
const reservationNumber = ref(0)

const bindDateChange = async (e: any) => {
  dateTime.value = e.detail.value
  const result: any = await getReservationCountAPI(spuId, dateTime.value)
  if (result.code == 200) {
    reservationNumber.value = result.data
  } else {
    uni.showToast({
      icon: 'fail',
      title: result.data,
    })
  }
}

const makeSure = async () => {
  const result: any = await confirmReservationAPI(spuId, dateTime.value)
  if (result.code == 200) {
    uni.showToast({
      icon: 'success',
      title: result.msg,
    })
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/list/list',
      })
    }, 1000)
  } else {
    uni.showToast({
      icon: 'error',
      title: result.msg,
    })
  }
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  background: linear-gradient(#43d180 0%, #ffffff 100%);
  position: absolute;
  height: 100%;

  .address {
    margin: 0 auto;
    width: 700rpx;
    height: 250rpx;
    background: linear-gradient(#ceffe3, #ffffff);
    border-radius: 14rpx;
    display: flex;

    image {
      width: 70rpx;
      height: 70rpx;
      margin: 20rpx 0 0 10rpx;
    }

    .addressMessage {
      width: 500rpx;
      height: 100rpx;
      color: #000000;
      font-family: PingFang HK-Medium;
      font-weight: Medium;
      font-size: 16pt;
      display: block;
      margin: 20rpx 0 0 10rpx;
    }

    .identity {
      width: 150pt;
      margin: -30rpx 0 0 0rpx;
      display: block;
      font-weight: 400;
      font-family: PingFang HK-Regular;
      font-weight: Regular;
      color: #666666;
      font-size: 14pt;
    }

    .distance {
      position: absolute;
      top: 100rpx;
      right: 40rpx;
      color: #666666;
      font-weight: Regular;
      font-size: 14pt;
      font-family: PingFang HK-Regular;
    }
  }

  .title {
    width: 700rpx;
    height: 200rpx;
    margin: 0 auto;
    border-radius: 8pt;
    background: #ffffff;
    margin-top: 30rpx;

    .detail {
      width: 700rpx;
      height: 100rpx;
      line-height: 100rpx;
      margin: 0 20rpx 0 20rpx;
      display: flex;
      justify-content: space-between;

      .detail-title {
        display: block;
        margin-left: 30rpx;
      }

      .detail-message {
        margin-right: 200rpx;
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
      background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
      border-radius: 40rpx;
      width: 240rpx;
      height: 70rpx;
      text-align: center;
      line-height: 70rpx;
      color: white;
      font-size: 0.9rem;
      margin-left: 400rpx;
    }
  }
}
</style>
