<script setup lang="ts">
import PageNavbar from './components/PageNavbar.vue'
import Carousel from './components/Carousel.vue'
import CommodityClassify from './components/CommodityClassify.vue'
</script>

<template>
  <!-- 滚动容器 -->
  <scroll-view enable-back-to-top refresher-enabled class="scroll-view" scroll-y>
    <view class="top">
      <!-- 自定义导航栏 -->
      <PageNavbar />
      <!-- 轮播图-->
      <view class="carousel">
        <Carousel></Carousel>
      </view>
    </view>
    <view class="categoryPanel">
      <!-- 商品分类 -->
      <CommodityClassify></CommodityClassify>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top {
  height: 600rpx;
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
