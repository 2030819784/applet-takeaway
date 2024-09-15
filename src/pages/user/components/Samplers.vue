<template>
  <scroll-view enable-back-to-top class="viewport" scroll-y>
    <view class="profile">
      <view class="overview">
        <view>
          <navigator
            url="/pages/personalInfo/personalInfo"
            open-type="navigate"
            hover-class="navigator-hover"
          >
            <image class="avatar" mode="aspectFill"></image>
          </navigator>
        </view>
        <view class="meta">
          <view class="nickname">
            {{ memberStore.profile.nickname }}
          </view>
          <view v-if="memberStore.profile.roles.length > 2">
            <view class="userTypes">
              <view class="userType"> {{ memberStore.profile.roles[0].description }} </view>
              <view class="userType"> {{ memberStore.profile.roles[1].description }} </view>
            </view>
          </view>
          <view v-else>
            <view
              class="userTypes"
              v-for="userType in memberStore.profile.roles"
              :key="userType.id"
            >
              <view class="userType"> {{ userType.description }} </view>
            </view>
          </view>
          <view class="userType" @click="checkroles">查看我的所有角色</view>
        </view>
      </view>
    </view>
    <view class="others">
      <view>管理</view>
      <view v-for="item in others" :key="item.state" class="navigator">
        <view class="other" @click="changeToOtherPage(item)">
          <u-icon :name="item.icon" size="56rpx" class="others_icon"></u-icon>
          <text class="others_text">{{ item.text }}</text>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { useCertification, useMemberStore, useOtherTypes } from '@/stores'
import userUrl from '@/static/images/logo.png'
import { onLoad } from '@dcloudio/uni-app'
import { onBeforeMount, ref } from 'vue'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

//采样人员
const others = [
  { state: 1, text: '未采样订单', icon: '/static/user/pendingProcessing.png' },
  { state: 2, text: '已完成订单', icon: '/static/user/complete2.png' },
  { state: 3, text: '全部', icon: '/static/user/all.png' },
  // { state: 4, text: '添加订单', icon: '/static/user/manage.png' },
  { state: 5, text: '政府机关入口', icon: '/static/user/governmentEntrance.png' },
  { state: 6, text: '去发货', icon: '/static/user/pendingProcessing.png' },
]
// 获取个人信息
const memberStore = useMemberStore()
const isRoles = uni.getStorageSync('roles')

const checkroles = () => {
  uni.navigateTo({
    url: '/pages/roles/roles',
  })
}
//跳转到订单页面全部
const changeToOtherPage = (item: any) => {
  const Certification = uni.getStorageSync('Certification')
  if (Certification.exists) {
    if (item.state == 4) {
      uni.navigateTo({ url: '/pages/list/addOrder/addOrder' })
    } else if (item.state == 5) {
      if (isRoles.isGovernmentStaff) {
        uni.navigateTo({
          url: '/pages/governmentAgencies/index',
        })
      } else {
        uni.showToast({
          icon: 'error',
          title: '您没有这个权限！',
        })
      }
    } else if (item.state == 6) {
      uni.navigateTo({
        url: '/pages/logisticsList/logisticsList',
      })
    } else {
      useOtherTypes().setOtherType(item)
      uni.switchTab({
        url: `/pages/list/list`,
      })
    }
  } else {
    uni.showToast({
      icon: 'error',
      title: '请前往实名认证',
    })
    uni.navigateTo({
      url: '/pages/personalInfo/personalInfo',
    })
  }
}

onBeforeMount(() => {})
</script>
<style lang="scss" scoped>
page {
  height: 100vh;
  background-color: #f2f5f5;
}

.viewport {
  height: 100%;
  background-size: 100% auto;

  /* 用户信息 */
  .profile {
    //height: 380rpx;
    background-image: url('@/static/user/sBackground.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;

    .overview {
      display: flex;
      padding: 0 36rpx;
      color: #fff;
    }

    .avatar {
      margin-top: 146rpx;
      width: 133rpx;
      height: 133rpx;
      margin-left: 36rpx;
      border-radius: 50%;
      background-color: #eee;
    }

    .meta {
      margin-top: 146rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 16rpx 0;
      margin-left: 20rpx;
    }

    .nickname {
      margin-bottom: 16rpx;
      font-size: 36rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .userType {
      // width: 132rpx;
      padding: 10rpx;
      height: 40rpx;
      max-width: 266rpx;
      margin-top: 24rpx;
      margin-bottom: 16rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: #ffffff;
      border-radius: 20rpx 20rpx 20rpx 20rpx;
      opacity: 1;
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #00c17f;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .others {
    background: #ffffff;
    padding: 30rpx;
    margin: 0 24rpx;
    height: 404rpx;
    box-shadow: 0rpx 8rpx 32rpx 0rpx rgba(176, 176, 176, 0.25);
    border-radius: 4rpx 4rpx 4rpx 4rpx;

    .navigator {
      width: 25%;
      height: 50%;
      float: left;
      margin-top: 30rpx;

      .other {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .others_text {
          overflow: hidden;
          font-size: 26rpx;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }
}
</style>
