import { getGoodsDetailMessageAPI } from "@/services/home" import { getGoodsDetailMessageAPI } from
"@/services/home" import { getGoodsDetailMessageAPI } from "@/services/home"

<template>
  <!-- 产品详情 -->
  <view class="page">
    <view class="content">
      <view class="center">
        <view class="item">
          <view class="left">采样地点</view>
          <view class="right">{{ form.nickName }}</view>
        </view>
        <view class="item">
          <view class="left">采样人</view>
          <view class="right">{{ form.nickName }}</view>
        </view>
        <view class="item">
          <view class="left">采样人姓名</view>
          <view class="right">{{ form.nickName }}</view>
        </view>
        <view class="item">
          <view class="left">设备照片</view>
          <view class="right">
            <image class="image" src="../../static/govermentAgencies/Group 189.png" alt="" />
          </view>
        </view>
        <view class="item">
          <view class="left">采样时间</view>
          <view class="right">{{ form.idNo }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getGoodsDetailMessageAPI } from '@/services/home'
import { onLoad } from '@dcloudio/uni-app'
import { reactive } from 'vue'
let form = reactive({})
const getGoodsDetail = async (id: any) => {
  const res: any = await getGoodsDetailMessageAPI(id)

  if (res.code == 200) {
    form = res.data
  }
}

onLoad((option: any) => {
  getGoodsDetail(option.id)
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
    .center {
      height: 682rpx;
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
  }
}
</style>
