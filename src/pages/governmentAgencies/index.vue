<!-- 政府机关页面 -->
<template>
  <view class="page">
    <view class="classify">相关分类</view>
    <view class="content">
      <view class="row">
        <view class="imageItem" @click="changeToHair()">
          <image
            src="../../static/govermentAgencies/Group 181.png"
            mode="scaleToFill"
            class="image"
          >
          </image>
          <view class="text">
            <view>疑似吸毒人员</view>
            <view>毛发、尿液监测</view>
          </view>
        </view>
        <view class="imageItem" @click="changeToSewageDetection()">
          <image
            src="../../static/govermentAgencies/Group 182.png"
            mode="scaleToFill"
            class="image"
          >
          </image>
          <view class="text">辖区污水监测</view>
        </view>
      </view>
      <view class="row" @click="showMes">
        <view class="imageItem">
          <image
            src="../../static/govermentAgencies/Group 185.png"
            mode="scaleToFill"
            class="image"
          >
          </image>
          <view class="text">现场查获毒品监测</view>
        </view>

        <view class="imageItem" @click="showMes">
          <image
            src="../../static/govermentAgencies/Group 186.png"
            mode="scaleToFill"
            class="image"
          >
          </image>
          <view class="text">辖区场所气体毒物检测</view>
        </view>
      </view>
      <view class="row">
        <view class="imageItem" @click="changeTostatistics()">
          <image
            src="../../static/govermentAgencies/Group 187.png"
            mode="scaleToFill"
            class="image"
          >
          </image>
          <view class="text">辖区毒情统计</view>
        </view>

        <view class="imageItem" @click="showMes">
          <image
            src="../../static/govermentAgencies/Group 188.png"
            mode="scaleToFill"
            class="image"
          >
          </image>
          <view class="text">在册吸毒人员目录</view>
        </view>
      </view>
      <view class="row">
        <view class="imageItem" @click="chanToAntiDrugProduct">
          <image
            src="../../static/govermentAgencies/Group 189.png"
            mode="scaleToFill"
            class="image"
          >
          </image>
          <view class="text">缉毒产品</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const isRoles = uni.getStorageSync('roles')

const changeToHair = () => {
  if (isRoles.isSamplingStaff) {
    uni.navigateTo({
      url: '/pages/list/hairDetection/hairDetection',
    })
  } else {
    uni.showToast({
      icon: 'error',
      title: '您没有这个权限！',
    })
  }
}
const showMes = () => {
  uni.showToast({
    icon: 'error',
    title: '开发中',
  })
}
const changeToSewageDetection = () => {
  if (isRoles.isSamplingStaff) {
    uni.navigateTo({
      url: '/pages/list/sewageDetection/sewageDetection',
    })
  } else {
    uni.showToast({
      icon: 'error',
      title: '您没有这个权限！',
    })
  }
}

const changeTostatistics = () => {
  uni.navigateTo({
    url: '/pages/statistics/statistics',
  })
}

const chanToAntiDrugProduct = () => {
  uni.navigateTo({
    url: '/pages/antiDrugProduct/antiDrugProduct',
  })
}
</script>

<style lang="scss" scoped>
.page {
  margin: 32rpx;
  background-color: #ffffff;

  .classify {
    font-size: 38rpx;
    font-family: PingFang HK-Medium, PingFang HK;
    font-weight: 600;
    color: #000000;
    line-height: 38rpx;
    margin-bottom: 32rpx;
  }

  .content {
    font-size: 28rpx;
    font-family: PingFang HK-Medium, PingFang HK;
    font-weight: 600;
    color: #000000;

    .row {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .imageItem {
        width: 49%;
        height: 160rpx;
        margin-top: 14rpx;
        position: relative;

        .image {
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          opacity: 1;
        }

        .text {
          position: absolute;
          top: 28rpx;
          bottom: 0;
          left: 24rpx;
          right: 0;
          margin: auto;
        }
      }
    }
  }
}
</style>
