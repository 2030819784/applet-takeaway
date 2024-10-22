<template>
  <view class="Info">
    <view class="Info_card">
      <view class="Info_top">
        <text>用户角色</text>
      </view>
      <view class="Info_bottom">
        <u-form labelPosition="left">
          <u-form-item
            v-for="role in useMemberStore().profile.roles"
            :key="role.id"
            label="角色名称"
            labelWidth="25%"
            prop="userInfo.name"
          >
            <view>{{ role.description }}</view>
          </u-form-item>
        </u-form>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useMemberStore } from '@/stores'
onLoad(() => {})
</script>

<style lang="scss" scoped>
.Info {
  .Info_card {
    margin: 3% 3%;
    width: 94%;
    background: #ffffff;

    .Info_top {
      margin-left: 32rpx;
      display: flex;
      justify-content: space-between;
      font-size: 32rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 600;
      color: #000000;

      .info_top_right {
        width: 252rpx;
        height: 56rpx;
        padding: 10rpx 20rpx;
        background: linear-gradient(180deg, #1bc172 0%, #43d180 100%);
        border-radius: 200rpx 200rpx 200rpx 200rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24rpx;
        font-family: PingFang HK-Regular, PingFang HK;
        font-weight: 400;
        color: #ffffff;

        .scan {
          margin: 0 2rpx 0 0;
        }
      }
    }

    .Info_bottom {
      margin-left: 32rpx;
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
    }
  }

  .text {
    margin: 0 4%;
  }

  .button {
    margin: 0 25%;
    height: 80rpx;
    background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
    border-radius: 200rpx 200rpx 200rpx 200rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28rpx;
    font-family: PingFang HK-Regular, PingFang HK;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>
