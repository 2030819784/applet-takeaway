<template>
    <view class="commodityClassify">
        <view class="classifyTabs">
            <u-sticky>
                <u-tabs :list="list1" lineWidth="36" lineHight="6" lineColor="#00C17F" :activeStyle="{
                    color: '#000000',
                    fontWeight: '800',
                    transform: 'scale(1.05)',
                    fontSize: '28rpx',
                }" :itemStyle="{
                    paddingLeft: '15px',
                    paddingRight: '15px',
                    height: '50px',
                    fontSize: '28rpx',
                }" :inactiveStyle="{ color: '#000000', fontSize: '28rpx' }" @click="changeCurrent"></u-tabs>
            </u-sticky>
        </view>
        <view v-if="resultItems?.list?.length == 0">
            <u-empty mode="data"></u-empty>
        </view>
        <view @click="changeToGoodsDetail(item)" class="commodityDes" v-for="item in resultItems" :key="item.id">
            <image style="border-radius: 20rpx;" :src="item.shopPhoto"></image>
            <view style="width: 1400rpx">
                <text style="font-size: 40rpx;margin: 40rpx;padding: 40rpx,0;white-space: nowrap;">{{ item.name
                }}</text>
                <text v-if="item.closeTime"
                    style="font-size: 30rpx;margin: 40rpx;padding: 40rpx,0;white-space: nowrap;position: absolute;right: 0;top:-30rpx">
                    {{ item.closeTime }}打烊</text>
                <view style="margin-left: 40rpx;margin-top: 20rpx;">
                    <text>
                        <text style="color: orange;font-size: 20px;">4.8分</text>
                        <text style="font-weight: 100"> 月售200+ 人均20</text>
                    </text>
                </view>
                <view style="margin-left: 40rpx;margin-top: 20rpx;">
                    <text style="font-weight: 100">起送 ￥15 配送 约￥0.5</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">

import { getOrderListAPI } from '@/services/rider'
import { onShow } from '@dcloudio/uni-app'

import { ref, toRaw } from 'vue'
//首页商品分类
const list1 = ref([
    {
        name: '未接单',
        status: 0
    },
    {
        name: '已接单',
        status: 1
    },
    {
        name: '已完成',
        status: 2
    }
])

//接收返回的商铺列表
const resultItems = ref()


//获取商铺列表
const getGoodsListItems = async (id: number) => {
    const result: any = await getOrderListAPI(id)
    if (result.code === 200) {
        resultItems.value = result.data
    } else {
        uni.showToast({
            title: result.msg,
            icon: 'error'
        })
    }
}
// 查询对应分类商铺
const changeCurrent = (item: any) => {
    getGoodsListItems(item.status)
}
//跳转到商品详情页面
const changeToGoodsDetail = (item: any) => {
    const data = toRaw(item)
    uni.navigateTo({
        url: '/pages/shops/shops?data=' + encodeURIComponent(JSON.stringify(data)),
    })
}

onShow(() => {
    getGoodsListItems(0)
})


</script>

<style lang="scss" scoped>
.commodityClassify {
    .classifyTabs {
        width: 100%;
        height: 140rpx;
        background: linear-gradient(180deg, #e5fdf5 0%, rgba(255, 255, 255, 0) 99%);
        border-radius: 16rpx 16rpx 16rpx 16rpx;
        opacity: 1;
    }

    // background-color: #27ba9b;
    .commodityDes {
        margin: 0 5% 30rpx 5%;
        height: 228rpx;
        background-color: white;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        // background: #d9d9d9;
        box-shadow: 0rpx 8rpx 8rpx 0rpx #b3b3b3;
        border-radius: 8rpx 8rpx 8rpx 8rpx;
        position: relative;
    }
}
</style>