<template>
  <SelectCity @select="getSelectOption"></SelectCity>
  <view class="sampleList">
    <view class="sampleItem" v-for="item in sampleList" :key="item.id" @click="changePage(item)">
      <image src="../../static/images/address3.png"></image>
      <text class="title">{{ item.name }}</text>
      <view class="buttom">
        <image src="../../static/images/address3.png"></image>
        <text class="constant" v-if="parseInt(item.distance) >= 1">{{ item.distance }}km</text>
        <text class="constant" v-else>{{ Decimal.mul(item.distance, 1000) }}m</text>
        <text>|</text>
        <text class="address">{{ item.detailedAddress }}</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { getGoodsListAPI } from '@/services/home'
import type { sampleListType } from '@/types/map'
import { ref } from 'vue'
import SelectCity from '@/components/selectCity'
import Decimal from 'decimal.js'

const address = uni.getStorageSync('address')
const getSelectOption = (list: []) => {
  //后续请求
  console.log(list)
}

const sampleList = ref<sampleListType[]>([])

onLoad(async () => {
  let result: any = await getGoodsListAPI({
    userLatitude: address.latitude,
    userLongitude: address.longitude,
  })
  if (result.code == 200) {
    sampleList.value = result.data
    uni.showToast({
      icon: 'success',
      title: result.msg,
    })
  } else {
    uni.showToast({
      icon: 'error',
      title: result.msg,
    })
  }
})

const changePage = (item: any) => {
  uni.navigateTo({
    url: `/pages/map/map?id=${item.id}&addressList=${encodeURIComponent(
      JSON.stringify(sampleList.value),
    )}`,
  })
}
</script>

<style lang="scss" scoped>
.sampleList {
  width: 700rpx;
  margin: auto;

  .sampleItem {
    width: 700rpx;
    height: 140rpx;

    image {
      width: 82rpx;
      height: 82rpx;
      position: relative;
      left: 26rpx;
      top: 28rpx;
    }

    .title {
      width: 180rpx;
      height: 40rpx;
      white-space: nowrap;
      font-family: PingFang HK-Medium;
      font-size: 28rpx;
      font-weight: Medium;
      position: relative;
      top: 9rpx;
      left: 50rpx;
      text-align: left;
      color: #000000;
    }

    .buttom {
      width: 100%;
      display: flex;
      position: relative;
      left: 130rpx;
      font-family: PingFang HK-Medium;
      font-size: 28rpx;
      font-weight: Medium;
      text-align: left;
      color: #666666;

      image {
        position: relative;
        top: 4rpx;
        left: -3rpx;
        width: 28rpx;
        height: 28rpx;
      }

      .constant {
        width: 150rpx;
        height: 34rpx;
        margin-right: 25rpx;
      }

      .address {
        width: 380rpx;
        height: 34rpx;
        margin-left: 12rpx;
        white-space: nowrap;
      }
    }
  }
}
</style>
