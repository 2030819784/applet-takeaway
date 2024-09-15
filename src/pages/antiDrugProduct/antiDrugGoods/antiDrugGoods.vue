<template>
  <view v-if="goodsList.length == 0">
    <u-empty mode="data"></u-empty>
  </view>
  <view v-if="goodsList">
    <view v-for="item in goodsList" :key="item.id">
      <view class="top">
        <view class="goods">
          <view class="goods_info">
            <view class="goods_image">
              <image :src="item.imgList[0]?.objName"></image>
            </view>
            <view class="goodsInfo">
              <view class="title">{{ item.goodName }}</view>
            </view>
          </view>
        </view>
        <view class="orderInfo">
          <view class="Info">
            <view class="label">
              <text>店铺名称：</text>
              <view class="Info">{{ item.shopName }}</view>
            </view>
            <view class="label">
              <text>店铺地址：</text>
              <view class="Info">{{ item.shopDetailedAddress }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getGoodsListAPI } from '@/services/home'
let goodsList = ref()
const getGoodsList = async (name: any) => {
  const res: any = await getGoodsListAPI({ page: 1, pageSize: 0, categoryName: name })
  if (res.code == 200) {
    goodsList.value = res.data.list
  }
}
onLoad((option: any) => {
  getGoodsList(option.name)
})
</script>

<style lang="scss">
.top {
  padding: 32rpx;
  margin: 0rpx 24rpx;
  background: linear-gradient(180deg, #ccffe2 0%, rgba(255, 255, 255, 0) 25%);
  background-color: #fff;
  border-radius: 16rpx 16rpx 16rpx 16rpx;

  .goods {
    .goods_info {
      margin: 16rpx 32rpx 10rpx 32rpx;
      display: flex;
      justify-content: space-between;

      .goods_image {
        width: 120rpx;
        height: 120rpx;
        background: linear-gradient(328deg, #1bc172 0%, #43d180 100%);
        border-radius: 12rpx 12rpx 12rpx 12rpx;
        margin-right: 28rpx;
      }

      .goodsInfo {
        width: 70%;

        .title {
          font-size: 28rpx;
          font-family: PingFang HK-Regular, PingFang HK;
          font-weight: 400;
          color: #000000;
          margin-bottom: 12rpx;
        }

        .describe {
          font-size: 24rpx;
          font-family: PingFang HK-Regular, PingFang HK;
          font-weight: 400;
          color: #999999;
          overflow: hidden;
        }
      }
    }

    .price {
      margin-right: 32rpx;
      float: right;
      font-size: 28rpx;
      font-family: PingFang HK-Medium, PingFang HK;
      font-weight: 500;
      color: #ff1535;
    }
  }

  .orderInfo {
    margin: 116rpx 32rpx 10rpx 32rpx;

    .Info {
      .label {
        margin-top: 26rpx;
        display: flex;
        justify-content: space-between;
        font-size: 26rpx;
        font-family: PingFang HK-Regular, PingFang HK;
        font-weight: 400;
        color: #999999;

        .Info {
          font-size: 26rpx;
          font-family: PingFang HK-Regular, PingFang HK;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }
}
</style>
