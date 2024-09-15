<script setup lang="ts">
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<template>
  <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <text class="title">购物车</text>
  </view>
</template>

<style lang="scss" scoped>
/* 自定义导航条 */
.navbar {
  background-color: #01b575;
  position: relative;
  display: flex;
  flex-direction: column;

  .title {
    text-align: center;
    color: #ffffff;
    font-family: PingFang SC-Medium, PingFang SC;
    font-size: 32rpx;
  }
}
</style>
