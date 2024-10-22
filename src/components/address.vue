<template>
  <view class="address" @click="selectAddres">
    <image src="../../static/images/addresss.png"></image>
    <view v-if="item">
      <text class="addressMessage">{{ item.address }}</text>
      <text class="identity"><text>{{ item.name }}</text><text style="font-weight: 300; margin-left: 20rpx">{{
        item.phone }}</text></text>
    </view>
    <view v-else>
      <u-empty text="请选择收货地址"></u-empty>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

let item = ref()
onShow(() => {
  item.value = uni.getStorageSync('userAddress') || {}
})

const selectAddres = () => {
  uni.navigateTo({
    url: '/pages/address/index'
  })
}

</script>

<style lang="scss">
.address {
  margin: 0 auto;
  margin-top: 50rpx;
  width: 700rpx;
  height: 200rpx;
  background: white;
  border-radius: 20rpx;
  display: flex;

  image {
    width: 70rpx;
    height: 70rpx;
    margin: 65rpx 0 0 10rpx;
  }

  .addressMessage {
    margin-top: 20rpx;
    width: 500rpx;
    height: 100rpx;
    font-weight: 600;
    font-size: 1.2rem;
    display: block;
    margin-bottom: 20rpx;
    white-space: nowrap;
  }

  .identity {
    display: block;
    font-weight: 400;
  }
}
</style>
