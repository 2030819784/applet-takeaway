<template>
  <!-- 医检列表 -->
  <view class="page">
    <view v-if="list.length == 0">
      <u-empty mode="data"></u-empty>
    </view>
    <view class="content" v-for="item in list" :key="item.id" @click="changeToOtherPage(item.id)">
      <view class="item">
        <view class="testItem">检测报告：{{ item.reportName || '无' }}</view>
        <view class="line"></view>
        <view class="center">
          <view class="member">
            <view class="nickName">姓名：{{ item.name }}</view>
            <view class="idNo">性别：{{ item.gender }}</view>
          </view>
        </view>
        <view class="line"></view>
        <view class="bottom">
          <!-- <view class="result">
            <view class="title">检测结果：</view>
            <view class="text">{{ item.detectionResult }}</view>
          </view> -->
          <view class="time">采样时间：{{ item.samplingTime }}</view>
        </view>
      </view>
    </view>
    <!-- <view class="button" @click="changeToScanCode"> 我的二维码 </view> -->
  </view>
</template>

<script lang="ts" setup>
// import { getReportListAPI } from '@/services/home'
import { useMemberStore } from '@/stores'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
let list: any = ref()
let query = {
  detectionType: 0,
  userId: useMemberStore().profile.id,
}
const getMedicalReportList = async () => {
  // const res: any = await getReportListAPI(query)
  list.value = res.data
  for (let key = 0; key < list.value.length; key++) {
    if (list.value[key]?.gender == 0) {
      list.value[key].gender = '女'
    } else if (list.value[key]?.gender == 1) {
      list.value[key].gender = '男'
    }
  }
}
const changeToOtherPage = (id: any) => {
  uni.navigateTo({
    url:
      '/pages/medicalReport/medicalRecord/medicalRecord?id=' +
      encodeURIComponent(JSON.stringify(id)),
  })
}
const changeToScanCode = (item: any) => {
  uni.navigateTo({
    url: '/pages/QRcode/QRcode',
  })
}
onShow(() => {
  getMedicalReportList()
})
</script>

<style lang="scss" scoped>
.page {
  background: linear-gradient(10deg, rgba(27, 193, 101, 0) 0%, #1bc172 28%, #43d180 50%);
  background-color: #fff;
  height: 100vh;

  .content {
    margin: 0 24rpx;

    .item {
      width: 100%;
      height: 328rpx;
      background: linear-gradient(180deg, #ccffe2 0%, rgba(255, 255, 255, 0) 25%);
      background-color: #fff;
      margin-bottom: 24rpx;
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      opacity: 1;
      padding: 32rpx;

      .testItem {
        font-size: 28rpx;
        font-family: PingFang HK-Medium, PingFang HK;
        font-weight: 500;
        color: #000000;
        line-height: 33rpx;
      }

      .line {
        margin-top: 24rpx;
        border-top: 1px dashed #000;
      }

      .center {
        display: flex;
        justify-content: space-between;

        .member {
          width: 80%;
          font-size: 26rpx;
          font-family: PingFang HK-Regular, PingFang HK;
          font-weight: 400;
          color: #666666;
          line-height: 30rpx;

          .nickName {
            margin-top: 24rpx;
          }

          .idNo {
            margin-top: 24rpx;
          }
        }

        .image {
          width: 20%;
          margin-top: 24rpx;
        }
      }

      .bottom {
        font-size: 26rpx;
        font-family: PingFang HK-Regular, PingFang HK;
        font-weight: 400;
        color: #333333;
        line-height: 30rpx;
        display: flex;
        justify-content: space-between;
        margin-top: 24rpx;

        .result {
          display: flex;
          justify-content: space-between;

          .title {}

          .text {
            font-size: 32rpx;
            font-family: Alibaba PuHuiTi-Bold, Alibaba PuHuiTi;
            font-weight: bold;
            color: #00c17f;
            line-height: 38rpx;
          }
        }

        .time {}
      }
    }
  }

  .button {
    position: fixed;
    background: #00b964;
    bottom: 0;
    width: 90%;
    height: 88rpx;
    margin-bottom: 56rpx;
    margin-left: 5%;
    border-radius: 50rpx 50rpx 50rpx 50rpx;
    font-size: 28rpx;
    font-family: PingFang HK-Medium, PingFang HK;
    font-weight: 500;
    color: #ffffff;
    line-height: 88rpx;
    display: flex;
    justify-content: center;
  }
}
</style>
