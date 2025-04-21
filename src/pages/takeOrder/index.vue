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
                    <text v-if="status === 1">
                        须在{{ addHalfHour(order.takeOrderTime) }}前送达
                    </text>
                </view>
                <view style="margin-left: 40rpx;margin-top: 20rpx;display: flex;">
                    <text style="font-weight: 100">总量：<text style="font-weight: 400;">{{ order.totalNumber }}</text> ;
                        总价： <text style="font-weight: 400;">{{ order.totalPrice }}</text></text>
                    <button v-if="status === 0 || status === 1" class="button" @click="deal(order.id)">{{ status === 0 ?
                        '接单' : status
                        === 1 && '送达'
                    }}</button>
                </view>
            </view>
        </view>
        <uni-popup ref="certificationDialog" type="dialog" :maskClick='false'>
            <view
                style="width: 600rpx;background: white;border-radius: 40rpx;display: flex;flex-direction: column;align-items: center;">
                <text style=" font-size: 20px;padding: 20rpx;">
                    人脸比对
                </text>
                <up-form style="padding: 20rpx;" labelPosition="left" labelWidth="160rpx">
                    <up-form-item label="姓名:"><up-input v-model="certification.name" placeholder="请输入真实姓名">
                        </up-input>
                    </up-form-item>
                    <up-form-item label="身份证号:"><up-input v-model="certification.idCard" placeholder="请输入身份证号">
                        </up-input>
                    </up-form-item>
                    <up-form-item label="证件照:">
                        <view style="display: flex;">
                            <image v-if="photo" style="border-radius: 20rpx;width: 200rpx;height: 200rpx;margin: 20rpx;"
                                :src="photo"></image>
                            <u-icon width="52rpx" height="52rpx" name="../../../../static/home/upload.png"
                                @click="chooseImage">
                            </u-icon>
                        </view>
                    </up-form-item>
                </up-form>
                <view style="display: flex;justify-content: space-around;width: 100%;margin-top: 40rpx;">
                    <button
                        style="background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);flex: 1;border-radius: 0 0 40rpx 40rpx; color: white;"
                        @click="uploadImage">确认</button>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script setup lang="ts">

import { getOrderListAPI, getOrderAPI, setOrderAPI } from '@/services/rider'
import { onShow } from '@dcloudio/uni-app'
import { nextTick } from 'process'

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
    },
    {
        name: '超时订单',
        status: 3
    }
])
const status = ref(0)

const certification = ref({
    name: '',
    idCard: ''
})

const certificationDialog = ref()


onShow(() => {
    nextTick(() => {
        certificationDialog.value.open()
    })
})

const chooseImage = () => {

    uni.chooseImage(
        {
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success: (res) => {
                photo.value = res.tempFilePaths.toString()
            },
            fail: () => {
                uni.showToast({
                    icon: 'error',
                    title: '图片选择失败',
                })
            }
        },

    )
}


const uploadImage = () => {
    uni.uploadFile({
        url: 'http://localhost:8081/rider/certification',
        filePath: photo.value,
        name: 'photo',
        formData: certification.value,
        header: { "Content-Type": "multipart/form-data" },
        success: () => {
            uni.showToast({
                title: '实名认证成功',
                icon: 'success'
            })
            certificationDialog.value.close()
        },
        fail: (fail) => {
            uni.showToast({
                icon: 'error',
                title: '实名认证失败',
            })
        },
    })
}


const photo = ref('')

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
        getGoodsListItems(1)
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