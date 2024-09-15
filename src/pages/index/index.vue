<script setup lang="ts">
</script>

<template>
  <view >
    <text >
      1232
    </text>
  </view>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top {
  height: 438rpx;
  background: linear-gradient(180deg, #4fc185 0%, #49b97f 100%);
}

.categoryPanel {
  position: relative;
  top: -40rpx;
  background: white;
  border-radius: 10rpx 10rpx 0 0;
  overflow-x: auto;
}

.carousel {
  margin: 0 24rpx;
  width: 702rpx;
  height: 282rpx;
  border-radius: 10rpx;
  overflow: hidden;
}

.scroll-view {
  flex: 1;
}
</style>
