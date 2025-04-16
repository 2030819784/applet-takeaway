<template>
  <view class="carousel">
    <u-swiper :list="list1" height="200" radius="0" indicatorF></u-swiper>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import swipper1 from '../../../static/images/swipper1.jpg'
import swipper2 from '../../../static/images/swipper2.jpg'
import swipper3 from '../../../static/images/swipper3.jpg'
import swipper4 from '../../../static/images/swipper4.jpg'
import swipper5 from '../../../static/images/swipper5.jpg'
let list1: any = reactive([
  swipper1,
  swipper2,
  swipper3,
  swipper4,
  swipper5
])
</script>

<style lang="scss" scoped></style>
