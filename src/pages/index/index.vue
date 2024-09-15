<script setup lang="ts">
import type { CategoryItem } from '@/types/home'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import PageNavbar from './components/PageNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import Carousel from './components/Carousel.vue'
import CommodityClassify from './components/CommodityClassify.vue'

onShow(() => {
  wx.enableAlertBeforeUnload({
    message: '不再逛逛了吗',
    success: () => {},
    fail: () => {},
  })
})
// 获取分类数据
const categoryList = ref<CategoryItem[]>([])
const getHomeCategoryData = async () => {
  categoryList.value = [
    {
      icon: '../../../static/home/reservation.png',
      id: '0',
      name: '预约取样',
      url: '/pages/sample/sample',
    },
    {
      icon: '../../../static/home/medicalReport.png',
      id: '1',
      name: '毒检报告',
      url: '/pages/narcoticsReport/narcoticsReport',
    },
    {
      icon: '../../../static/home/physcalReport.png',
      id: '2',
      name: '医检报告',
      url: '/pages/medicalReport/medicalReport',
    },
    {
      icon: '../../../static/home/QRcode.png',
      id: '3',
      name: '我的二维码',
      url: '/pages/QRcode/QRcode',
    },
    {
      icon: '../../../static/home/Affiliate.png',
      id: '4',
      name: '联系人',
      url: '/pages/affiliatedPerson/affiliatedPerson',
    },
  ]
}

// 是否加载中标记
const isLoading = ref(false)

// 页面加载
onLoad(async () => {
  isLoading.value = true
  await Promise.all([getHomeCategoryData()])
  isLoading.value = false
})

// 当前下拉刷新状态
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  // 加载数据
  await getHomeCategoryData()
  // 关闭动画
  isTriggered.value = false
}
</script>

<template>
  <!-- 滚动容器 -->
  <scroll-view
    enable-back-to-top
    refresher-enabled
    @refresherrefresh="onRefresherrefresh"
    :refresher-triggered="isTriggered"
    class="scroll-view"
    scroll-y
  >
    <view class="top">
      <!-- 自定义导航栏 -->
      <PageNavbar />
      <!-- 轮播图-->
      <view class="carousel">
        <Carousel></Carousel>
      </view>
    </view>
    <view class="categoryPanel">
      <!-- 分类面板 -->
      <CategoryPanel :list="categoryList" />
      <!-- 商品分类 -->
      <CommodityClassify></CommodityClassify>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top {
  height: 528rpx;
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
