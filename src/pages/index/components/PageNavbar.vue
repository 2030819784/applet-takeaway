<template>
  <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <!-- logo文字 -->
    <view class="logo">
      <text class="logo-text">兜兜校园外卖</text>
    </view>
    <!-- 搜索条 -->
    <!-- <view class="search">
      <view class="search_input" @click="changeToSelect">
        <view class="address">
          <text class="address_text" ></text>
        </view>
        <view class="line"></view>
        <input type="text" v-model="search" class="input" />
      </view>
      <view class="search_scan">
        <u-icon width="52rpx" height="52rpx" name="../../../../static/home/scan.png" @click="scanCode"></u-icon>
      </view>
    </view> -->
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const address = ref('')

onShow(() => {
  address.value = uni.getStorageSync('address').name
})

let search: string = ''

const scanCode = () => {
  uni.navigateTo({
    url: '/pages/scanCode/scanCode',
  })
}
const changeToSelect = () => {
  uni.navigateTo({
    url: '/pages/sample/sample',
  })
}
</script>

<style lang="scss" scoped>
/* 自定义导航条 */
.navbar {
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  .logo {
    height: 64rpx;
    margin-left: 18rpx;


    .logo-text {
      flex: 1;
      line-height: 28rpx;
      color: #ffffff;
      margin: 2rpx 0 0 20rpx;
      padding-left: 20rpx;
      font-size: 40rpx;
      font-family: 'PingFang HK-Semibold';
      font-weight: 'Semibold';
    }
  }

  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx 0 26rpx;
    margin: 16rpx 8rpx;
    height: 64rpx;

    .search_input {
      width: 624rpx;
      height: 64rpx;
      background: #ffffff;
      border-radius: 200rpx 200rpx 200rpx 200rpx;
      opacity: 1;
      display: flex;
      align-items: center;

      .address {
        margin-left: 20rpx;
        display: flex;

        .address_text {
          height: 34rpx;
          font-size: 24rpx;
          font-family: PingFang TC-Medium, PingFang TC;
          font-weight: 500;
          color: #090909;
          margin: 0 2rpx;
          white-space: nowrap;
        }
      }

      .line {
        width: 0rpx;
        height: 21rpx;
        border-radius: 0rpx 0rpx 0rpx 0rpx;
        margin: 0 10rpx;
        opacity: 1;
        border: 1rpx solid #999999;
      }

      .input {
        width: 70%;
      }
    }
  }

  .icon-search {
    &::before {
      margin-right: 10rpx;
    }
  }

  .icon-scan {
    font-size: 30rpx;
    padding: 15rpx;
  }
}
</style>
