<template>
  <view class="address" @click="selectAddress">
    <image src="../../static/images/addresss.png"></image>
    <view v-if="address">
      <text class="addressMessage">{{ address?.info }}</text>
      <text class="identity"><text>{{ address?.name }}</text>
        <text style="font-weight: 300; margin-left: 20rpx">{{
          address?.phone }}</text></text>
    </view>
    <view v-else style="flex:1;display: flex;justify-content: center;align-items: center;">
      <text>请选择收货地址</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { addressListAPI } from '@/services/address'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

const address = ref()

onShow(() => {
  const result = uni.getStorageSync('address')
  if (result) address.value = result
  else getAddressList()
})

const getAddressList = async () => {
  const result: any = await addressListAPI()
  if (result.code === 200) {
    address.value = result.data[0]
  }
  else {
    uni.showToast({
      title: result.msg,
      icon: 'error'
    })
  }
}

const selectAddress = () => {
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
  flex-direction: row;

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
