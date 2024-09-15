<template>
  <view class="page">
    <view class="content">
      <view class="top">
        <!-- <view class="item">
          <view class="left">被检测人姓名</view>
          <view class="right">{{ form.name }}</view>
        </view>
        <view class="item">
          <view class="left">被检测人身份证</view>
          <view class="right">{{ form.idNumber }}</view>
        </view> -->
        <view class="item">
          <view class="left">检测结果</view>
          <view class="right">{{ form.detectionResult }}</view>
        </view>
      </view>
      <view class="center">
        <view class="item">
          <view class="left">采样地点</view>
          <view class="right">{{ form.samplingAddress }}</view>
        </view>
        <!-- <view class="item">
          <view class="left">采样人</view>
          <view class="right">{{ form.nickName }}</view>
        </view> -->
        <view class="item">
          <view class="left">采样人姓名</view>
          <view class="right">{{ form.samplingStaffName }}</view>
        </view>
        <view class="item">
          <view class="left">采样时间</view>
          <view class="right">{{ form.samplingTime }}</view>
        </view>
      </view>
      <view class="bottom">
        <view class="item">
          <view class="left">检测单位</view>
          <view class="right">{{ form.detectionDepartment }}</view>
        </view>
        <!-- <view class="item">
          <view class="left">检测项目</view>
          <view class="right">{{ form.detectionDepartment }}</view>
        </view> -->
        <!-- <view class="item">
          <view class="left">检测方法</view>
          <view class="right">{{ form.idNo }}</view>
        </view> -->
        <view class="item">
          <view class="left">检测人</view>
          <view class="right">{{ form.detectionStaffName }}</view>
        </view>
        <!-- <view class="item">
          <view class="left">检测身份证</view>
          <view class="right">{{ form.idNo }}</view>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
// import { getNarcoticsReportDetailAPI } from '@/services/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

let form: any = ref()
const getNarcoticsReportDetail = async (id: any) => {
  // const res: any = await getNarcoticsReportDetailAPI(id)
  // if (res.code == 200) {
  //   form.value = res.data
  // }
}
onLoad((option: any) => {
  const id = JSON.parse(decodeURIComponent(option.id))
  getNarcoticsReportDetail(id)
})
</script>

<style lang="scss" scoped>
.page {
  background: linear-gradient(10deg, rgba(27, 193, 101, 0) 0%, #1bc172 28%, #43d180 50%);
  background-color: #fff;
  height: 100vh;

  .content {
    margin: auto 24rpx;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 33rpx;

    .top {
      background: #ffffff;
      border-radius: 16rpx 16rpx 16rpx 16rpx;

      .item {
        padding: 28rpx 32rpx;
        border-bottom: 1rpx solid #eff0f2;

        .left {
          float: left;
          width: 35%;
        }

        .right {
          font-size: 28rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 550;
          color: #333333;
          line-height: 33rpx;

          .image {
            height: 170rpx;
            width: 65%;
          }
        }
      }
    }

    .center {
      background: #ffffff;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      margin-top: 24rpx;

      .item {
        padding: 28rpx 32rpx;
        border-bottom: 1rpx solid #eff0f2;

        .left {
          float: left;
          width: 35%;
        }

        .right {
          font-size: 28rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 550;
          color: #333333;
          line-height: 33rpx;

          .image {
            height: 170rpx;
            width: 65%;
          }
        }
      }
    }

    .bottom {
      background: #ffffff;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      margin-top: 24rpx;
      margin-bottom: 24rpx;

      .item {
        padding: 28rpx 32rpx;
        border-bottom: 1rpx solid #eff0f2;

        .left {
          float: left;
          width: 35%;
        }

        .right {
          font-size: 28rpx;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 550;
          color: #333333;
          line-height: 33rpx;

          .image {
            height: 170rpx;
            width: 65%;
          }
        }
      }
    }
  }
}
</style>
