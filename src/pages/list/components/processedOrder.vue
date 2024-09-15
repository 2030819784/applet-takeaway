<template>
  <!-- 普通用户 -->
  <view v-if="item">
    <view class="top">
      <view class="address">
        <u-icon
          name="../../../../static/orderList/address.png"
          width="44rpx"
          height="44rpx"
        ></u-icon>
        <view class="text">{{ item.district }}</view>
      </view>
      <view class="address_text">
        <view class="text">{{ item.detailedAddress }}</view>
      </view>
      <view class="dashed_line"></view>
      <view class="orderInfo">
        <view class="orderPlacer">
          <text class="text">下单人姓名:</text>
          <view class="item">{{ item.name }}</view>
        </view>
        <view class="orderPhone">
          <text class="text">电话</text>
          <view class="item">{{ item.phone }}</view>
        </view>
      </view>
    </view>

    <view class="center">
      <view class="goods">
        <view class="goods_info">
          <view class="goods_image">
            <image :src="item.list?.skuList[0]?.imgList[0]?.objName"></image>
          </view>
          <view class="goodsInfo">
            <view class="title">{{ item.list?.goodName }}</view>
            <view class="describe">{{ item.details }}</view>
          </view>
        </view>
        <view class="price">
          <view>￥</view>
          <view>{{ item.actualPay || 0 }}</view>
        </view>
      </view>

      <view class="orderInfo">
        <view class="Info">
          <view class="label">
            <text>下单编号：</text>
            <view class="Info">{{ item.orderNo }}</view>
          </view>
          <view class="label">
            <text>下单时间：</text>
            <view class="Info">{{ item.orderTime }}</view>
          </view>
          <view class="label">
            <text>支付时间：</text>
            <view class="Info">{{ item.payTime }}</view>
          </view>
        </view>
        <!-- <view class="barCode"> 条形码 </view> -->
      </view>
    </view>
    <!-- <view class="bottom">
      <view class="delete" @click="deleteOrderitem()"><text>删除</text></view>
      <view class="button">
        <view class="button1" v-if="item.state === 40"
          ><up-button shape="circle">查看物流</up-button></view
        >
        <view class="button1" v-else-if="item.state === 60"
          ><up-button shape="circle" @click="changeToNarcoticsReport">查看结果</up-button></view
        >
      </view>
    </view> -->
  </view>
</template>

<script lang="ts" setup>
import { deleteOrderListAPI } from '@/services/order'
import { getUserInfoByUserIdAPI } from '@/services/user'
import { onLoad } from '@dcloudio/uni-app'
import { reactive } from 'vue'
import { toRefs, defineProps, toRef } from 'vue'
import { useMemberStore } from '@/stores'
const memberStore = useMemberStore()
const ids: number = 2
//接收父组件传的数据
const props = defineProps({
  item: Object,
})
//删除订单信息
// const deleteOrderitem = async () => {
//   const result: any = await deleteOrderListAPI(props.item?.id)
//   if (result.code === 200) {
//   }
// }
const changeToNarcoticsReport = () => {
  uni.navigateTo({
    url: '/pages/narcoticsReport/narcoticsRecord',
  })
}
onLoad(() => {})
</script>

<style lang="scss" scoped>
.top {
  padding: 32rpx;
  margin: 0 24rpx;
  background: linear-gradient(180deg, #ccffe2 0%, rgba(255, 255, 255, 0) 25%);
  background-color: #fff;
  border-radius: 14rpx 14rpx 14rpx 14rpx;
  height: 322rpx;
  .dashed_line {
    border-top: 1px dashed #000;
  }
  .address {
    display: flex;
    margin: 16rpx 0;
    font-size: 32rpx;
    font-family: PingFang HK-Medium, PingFang HK;
    font-weight: 500;
    color: #000000;
  }

  .address_text {
    font-size: 28rpx;
    font-family: PingFang HK-Regular, PingFang HK;
    font-weight: 400;
    color: #666666;
  }

  .orderInfo {
    margin: 16rpx 0;
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    font-family: PingFang HK-Regular, PingFang HK;
    font-weight: 400;
    color: #666666;

    .orderPlacer {
      .item {
        font-size: 28rpx;
        font-family: PingFang HK-Medium, PingFang HK;
        font-weight: 500;
        color: #000000;
      }

      width: 35%;
    }

    .orderPhone {
      width: 65%;

      .item {
        font-size: 28rpx;
        font-family: PingFang HK-Medium, PingFang HK;
        font-weight: 500;
        color: #000000;
      }
    }
  }
}

.center {
  padding: 32rpx;
  margin: 24rpx 24rpx;
  background: linear-gradient(180deg, #ccffe2 0%, rgba(255, 255, 255, 0) 25%);
  background-color: #fff;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  height: 710rpx;

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
      display: flex;
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

    .barCode {
      margin-top: 116rpx;
      margin: 116rpx 114rpx 0 114rpx;
      height: 166rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.bottom {
  background-color: #ffffff;
  height: 200rpx;
  padding-top: 20rpx;
  margin-top: auto;
  margin-left: 24rpx;
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  width: 100%;
  // box-shadow: 0rpx 0rpx 0rpx 0rpx #f0f0f0;

  .delete {
    margin-top: 10rpx;
    margin-left: 38rpx;
    width: 50%;
  }

  .button {
    float: right;
    margin-right: 38rpx;
    .button1 {
      height: 66rpx;
      border-radius: 200rpx 200rpx 200rpx 200rpx;
      border: 1rpx solid #000;
    }
  }
}
</style>
