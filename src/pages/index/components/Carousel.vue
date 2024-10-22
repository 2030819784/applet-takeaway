<template>
  <view class="carousel">
    <u-swiper :list="list1" height="200" radius="0" indicatorF></u-swiper>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
let list1: any = reactive([
  'https://cdn.uviewui.com/uview/swiper/swiper1.png',
  'https://cdn.uviewui.com/uview/swiper/swiper2.png',
  'https://cdn.uviewui.com/uview/swiper/swiper3.png',
])
</script>

<style lang="scss" scoped></style>
