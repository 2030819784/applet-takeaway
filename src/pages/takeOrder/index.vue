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
        <view class="commodityDes" v-for="order in resultItems" :key="order.id">
            <view style="width: 1400rpx">
                <view class="order">
                    <view v-for="item in order.orderListDetailList" :key="item.id" style="margin:0 20rpx;">
                        {{ item.name }}: {{ item.number }}
                    </view>
                    <text>
                        须在{{ addHalfHour(order.takeOrderTime) }}前送达
                    </text>
                </view>
                <view style="margin-left: 40rpx;margin-top: 20rpx;display: flex;">
                    <text style="font-weight: 100">总量：<text style="font-weight: 400;">{{ order.totalNumber }}</text> ;
                        总价： <text style="font-weight: 400;">{{ order.totalPrice }}</text></text>
                    <button v-if="status !== 2" class="button" @click="deal(order.id)">{{ status === 0 ? '接单' : status
                        === 1 && '送达'
                        }}</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">

import { getOrderListAPI, getOrderAPI, setOrderAPI } from '@/services/rider'
import { onShow } from '@dcloudio/uni-app'

import { ref } from 'vue'
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
const status = ref(0)

//接收返回的单子列表
const resultItems = ref()


//获取接单列表
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
    status.value = item.status
    getGoodsListItems(item.status)
}


const addHalfHour = (isoTime: Date) => {
    const date = new Date(isoTime);
    date.setMinutes(date.getMinutes() + 30); // 直接增加30分钟
    return date.toLocaleTimeString(); // 返回新的ISO格式字符串
}

onShow(() => {
    getGoodsListItems(0)
})

const deal = (id: string) => {
    if (status.value === 0) getOrder(id)
    if (status.value === 1) setOrder(id)
}

const getOrder = async (id: string) => {
    const result: any = await getOrderAPI(id)
    if (result.code === 200) {
        uni.showToast({
            icon: 'success',
            title: '接单成功'
        })
        getGoodsListItems(0)
    } else {
        uni.showToast({
            title: '接单失败',
            icon: 'error'
        })
    }
}

const setOrder = async (id: string) => {
    const result: any = await setOrderAPI(id)
    if (result.code === 200) {
        uni.showToast({
            icon: 'success',
            title: '成功送达'
        })
    } else {
        uni.showToast({
            title: '送达失败',
            icon: 'error'
        })
    }
}

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
        padding-bottom: 30rpx;
        margin: 0 5% 30rpx 5%;
        background-color: white;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        // background: #d9d9d9;
        box-shadow: 0rpx 8rpx 8rpx 0rpx #b3b3b3;
        border-radius: 8rpx 8rpx 8rpx 8rpx;
        position: relative;

        .order {
            margin-left: 40rpx;
            margin-top: 20rpx;
            display: flex;
            flex-wrap: wrap;
        }

        .button {
            background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
            border-radius: 40rpx;
            width: 240rpx;
            height: 70rpx;
            text-align: center;
            line-height: 70rpx;
            color: white;
            font-size: 0.9rem;
        }
    }
}
</style>