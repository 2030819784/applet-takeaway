<template>
  <view class="goods">
    <view class="goods_price">
      <view class="price">{{ shop.name }}</view>
    </view>
    <view class="goods_select" :style="{ backgroundImage: 'url(' + shop.photoshop + ')' }" v-for="item in goods"
      :key="item.id" @click="changeToGoodsDetail(item)">
      <text>{{ item.name }}: ￥ {{ item.price }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getGoodsListAPI } from '@/services/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref, toRaw } from 'vue'

const shop: any = ref({})
const goods: any = ref([])

onLoad((option: any) => {
  shop.value = JSON.parse(decodeURIComponent(option.data))
  getDetail(shop.value.id)
})
const getDetail = async (id: string) => {
  const result: any = await getGoodsListAPI(id)
  if (result.code == 200) {
    goods.value = result.data
  }
}
const changeToGoodsDetail = (item: any) => {
  const data = toRaw(item)
  data.photoshop = 'https://cdn.uviewui.com/uview/swiper/swiper3.png'
  data.shopName = shop.value.name
  uni.navigateTo({
    url: '/pages/goods/goods?good=' + encodeURIComponent(JSON.stringify(data)),
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
    height: 340rpx;
    border-radius: 10rpx;
    padding: 15rpx 15rpx;

    image {
      display: flex;
      height: 80%;
      border-radius: 10rpx;
    }

    text {
      display: inline-block;
      font-size: 32rpx;
      margin-top: 16rpx;

    }
  }
}
</style>
