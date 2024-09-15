<script setup lang="ts">
import type { CategoryItem } from '@/types/home'
// 定义 props 接收数据
const { list } = defineProps<{ list: CategoryItem[] }>()

const changePages = (item: any) => {
  const isRoles = uni.getStorageSync('roles')
  if (!isRoles) {
    uni.navigateTo({
      url: '/pages/login/login',
    })
  } else {
    uni.navigateTo({ url: item.url })
  }
}
</script>

<template>
  <view class="category">
    <view class="category-item" @click="changePages(item)" v-for="item in list" :key="item.id">
      <image class="icon" :src="item.icon"></image>
      <text class="text">{{ item.name }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.category {
  margin: 20rpx 0 0;
  padding: 10rpx 20rpx;
  flex-wrap: wrap;
  width: 100%;
  height: 150rpx;
  overflow-x: auto;
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
  background: '#FFFFFF';
  box-shadow: 0rpx 8rpx 32rpx 0rpx rgba(197, 197, 197, 0.25);
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  opacity: 1;

  .category-item {
    width: 150rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    .icon {
      width: 90rpx;
      height: 90rpx;
      margin-bottom: 15rpx;
    }

    .text {
      font-size: 28rpx;
      font-family: PingFang HK-Medium, PingFang HK;
      font-weight: 500;
      color: #000000;
    }
  }
}
</style>
