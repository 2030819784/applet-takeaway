<template>
  <view class="address">
    <image src="../../static/images/addresss.png"></image>
    <view v-if="item">
      <text class="addressMessage">{{ item.address }}</text>
      <text class="identity"
        ><text>{{ item.name }}</text
        ><text style="font-weight: 300; margin-left: 20rpx">{{ item.phone }}</text></text
      >
    </view>
    <view v-else>
      <text class="addressMessage">{{ address }}</text>
      <text class="identity"
        ><text>{{ memberStore.profile.nickname }}</text
        ><text style="font-weight: 300; margin-left: 20rpx">{{
          memberStore.profile.phone
        }}</text></text
      >
    </view>
    <image @click="chooseAddress" src="../static/user/arrow.png" alt="" />
  </view>
</template>

<script lang="ts" setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useMemberStore } from '@/stores'

const emit = defineEmits(['saveShops', 'getShops'])

const memberStore = useMemberStore()
//寄件方地址
const address = ref('')
const chooseAddress = () => {
  emit('saveShops')
  uni.navigateTo({
    url:
      '/pages/affiliatedPerson/affiliatedPerson?select=' + encodeURIComponent(JSON.stringify(true)),
  })
}
onShow(() => {
  if (uni.getStorageSync('userAddress')) {
    emit('getShops')
    item.value = uni.getStorageSync('userAddress')
    uni.removeStorageSync('userAddress')
  } else {
    address.value = uni.getStorageSync('address').address
  }
})

let item = ref()
// onLoad((option: any) => {
//   if (option.item) {
//     emit('getShops')
//     item.value = JSON.parse(decodeURIComponent(option.item))
//   }
// })

defineExpose({
  address,
})
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
    width: 500rpx;
    height: 100rpx;
    font-weight: 600;
    font-size: 1.2rem;
    display: block;
    margin-bottom: 20rpx;
  }

  .identity {
    display: block;
    font-weight: 400;
  }
}
</style>
