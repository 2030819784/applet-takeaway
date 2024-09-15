<template>
  <view class="goods">
    <view class="goods_price">
      <view class="price">{{ name }}</view>
    </view>
    <view
      class="goods_select"
      v-for="item in goods"
      :key="item.id"
      @click="changeToGoodsDetail(item)"
    >
      <image :src="item.imgList[0].objName" mode=""></image>
      <text>{{ item.goodsName }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getShopsMessageAPI } from '@/services/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const goods: any = ref({})
let name = ''
onLoad((option: any) => {
  name = JSON.parse(option.name)
  detailedAddress = JSON.parse(decodeURIComponent(option!.detailedAddress))
  getDetail(parseInt(option.item))
})
const getDetail = async (data: number) => {
  const result: any = await getShopsMessageAPI(data)
  if (result.code == 200) {
    goods.value = result.data
  }
}

let detailedAddress = ''
const changeToGoodsDetail = (item: any) => {
  uni.navigateTo({
    url:
      '/pages/goods/goods?item=' +
      item.id +
      '&imgList=' +
      encodeURIComponent(JSON.stringify(item.imgList[0].objName)) +
      '&address=' +
      decodeURIComponent(JSON.stringify(detailedAddress)),
  })
}
</script>

<style lang="scss" scoped>
.goods {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: #f2f5f5;

  .goods_price {
    margin: 24rpx 24rpx;
    background-color: #ffffff;
    height: 164rpx;
    border-radius: 10rpx;
    padding: 15rpx 15rpx;

    .price {
      text-align: center;
      color: red;
      font-size: 54rpx;
      margin-top: 25rpx;
    }

    .title {
      margin-left: 22rpx;
      margin-right: 22rpx;
      margin-top: 10rpx;
      font-size: 32rpx;
      font-family: PingFang HK-Medium, PingFang HK;
      font-weight: 500;
      color: #000000;
      overflow: hidden;
    }
  }

  .goods_select {
    margin: 24rpx 24rpx;
    background-color: #ffffff;
    height: 600rpx;
    border-radius: 10rpx;
    padding: 15rpx 15rpx;

    image {
      display: flex;
      height: 90%;
      border-radius: 10rpx;
    }

    text {
      display: block;
      text-align: center;
      margin-top: 16rpx;
    }
  }
}
</style>
