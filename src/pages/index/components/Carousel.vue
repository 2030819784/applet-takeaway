<template>
  <view class="carousel">
    <u-swiper :list="list1" height="200" radius="0" @click="changeToGoodsDetail"></u-swiper>
  </view>
</template>

<script setup lang="ts">
import { getCarouselListAPI } from '@/services/home'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
let result: any = ref()
let list1: any = ref([])
const getCarouselList = async () => {
  const res: any = await getCarouselListAPI()
  if (res.code == 200) {
    result.value = res.data
    let list: any = ref([])
    for (let key in result.value) {
      if (result.value[key].imgList[0]?.objName) {
        list.value.push(result.value[key].imgList[0]?.objName)
        list1.value = list.value
      }
    }
  }
}
//跳转到商品详情页面
const changeToGoodsDetail = (event: any) => {
  const index = event
  const item = result.value[index]
  uni.navigateTo({
    url:
      '/pages/goods/goods?item=' +
      item?.skuId +
      '&imgList=' +
      encodeURIComponent(JSON.stringify(item?.imgList[0]?.objName)) +
      '&address=' +
      decodeURIComponent(JSON.stringify(item?.shopDetailedAddress)),
  })
}
onShow(() => {
  getCarouselList()
})
onLoad(() => {})
</script>

<style lang="scss" scoped></style>
