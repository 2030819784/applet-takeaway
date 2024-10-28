<template>
    <view class="goods">
        <view style="width: 100%;">
            <button style="
              margin-top: 10rpx;
              border-radius: 10rpx;
              background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
            " @click="addShop()">添加商铺</button>
        </view>
        <view v-if="shops.length !== 0">
            <view class="goods_select" v-for="item in shops" :key="item.id" @click="changeToShopDetail(item)">
                <image style="border-radius: 20rpx;width: 1000rpx;" :src="item.shopPhoto"></image>
                <view
                    style="width: 1400rpx; margin-left: 20rpx;display: flex;justify-content: center;align-items: center;">
                    <text style="font-size: 40rpx">{{ item.name }}</text>
                </view>
            </view>
        </view>
        <view v-else>
            <u-empty text="商铺为空"></u-empty>
        </view>
    </view>
</template>

<script setup lang="ts">
import { selfShopListAPI } from '@/services/shop'
import { onShow } from '@dcloudio/uni-app'
import { ref, toRaw } from 'vue'

const shops: any = ref([])



const addShop = () => {
    uni.navigateTo({
        url: '/pages/addShop/index',
    })
}
const changeToShopDetail = (item: any) => {
    const data = toRaw(item)
    uni.navigateTo({
        url: '/pages/shopDetail/index?data=' + encodeURIComponent(JSON.stringify(data)),
    })
}


const getSelfShopList = async () => {
    const result = await selfShopListAPI()
    if (result.code == 200) {
        shops.value = result.data
    }
    else
        uni.showToast({
            title: '网络错误',
            icon: 'error'
        })
}

onShow(() => {
    getSelfShopList()
})


</script>

<style lang="scss" scoped>
.goods {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    // background-color: #f2f5f5;
    padding: 0 32rpx;

    .goods_price {
        margin: 24rpx 24rpx;
        background-color: #ffffff;
        height: 164rpx;
        border-radius: 10rpx;
        padding: 15rpx 15rpx;

        .price {
            text-align: center;
            color: red;
            font-size: 54rpx;
            margin-top: 25rpx;
        }

        .title {
            margin-left: 22rpx;
            margin-right: 22rpx;
            margin-top: 10rpx;
            font-size: 32rpx;
            font-family: PingFang HK-Medium, PingFang HK;
            font-weight: 500;
            color: #000000;
            overflow: hidden;
        }
    }

    .goods_select {
        margin: 5% 5% 30rpx 5%;
        height: 228rpx;
        background-color: white;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        box-shadow: 0rpx 8rpx 8rpx 0rpx #b3b3b3;
        border-radius: 8rpx 8rpx 8rpx 8rpx;
        position: relative;

        // image {
        //   display: flex;
        //   height: 80%;
        //   border-radius: 10rpx;
        // }

        text {
            display: inline-block;
            font-size: 32rpx;
            margin-top: 16rpx;

        }
    }
}
</style>