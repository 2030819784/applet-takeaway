<template>
  <view class="page">
    <view class="conten">
      <view class="item">
        <view class="select">
          <view class="left">商品选择</view>
          <view class="right">
            <uni-data-select
              v-model="form.goodsName"
              :localdata="goodsList"
              placeholder="请选择"
              :clear="true"
            ></uni-data-select>
          </view>
        </view>
      </view>
      <view class="item">
        <view class="left">姓名输入</view>
        <view class="right">
          <input type="text" placeholder="必填" />
        </view>
      </view>
      <view class="item">
        <view class="left">电话</view>
        <view class="right">
          <input type="text" placeholder="必填" />
        </view>
      </view>
      <view class="item">
        <view class="select">
          <view class="left">采样点</view>
          <view class="right">
            <uni-data-select
              v-model="form.sampleAddress"
              :localdata="sampleAddressList"
              placeholder="请选择"
              :clear="true"
            ></uni-data-select>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const form = reactive({
  //商品名称
  goodsName: '',
  //姓名
  name: '',
  //电话
  phone: '',
  //采样点
  sampleAddress: '',
})
const goodsList: any = []
const sampleAddressList: any = []
</script>

<style lang="scss" scoped>
.page {
  background: #f2f5f5;
  border-radius: 0rpx 0rpx 0rpx 0rpx;
  opacity: 1;
  height: 100vh;
  .conten {
    margin: 24rpx;
    padding: 0 32rpx;
    background: #ffffff;
    border-radius: 16rpx 16rpx 16rpx 16rpx;
    opacity: 1;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    .item {
      padding: 24rpx 0;
      line-height: 33rpx;
      border-bottom: 1rpx solid #eff0f2;
      .select {
        display: flex;
        justify-content: space-between;
      }
      .left {
        float: left;
        width: 35%;
      }
      .right {
        width: 65%;
      }
    }
  }
}
</style>
