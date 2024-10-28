<template>
    <view class="goods">
        <view class="goods_price">
            <view class="price">{{ shop.name }}</view>
        </view>
        <view v-if="goods.length !== 0">
            <view class="goods_select" v-for="item in goods" :key="item.id" @click="editGoods(item)">
                <image style="border-radius: 20rpx" :src="item.goodsPhoto"></image>
                <view style="width: 1400rpx; margin-left: 20rpx">
                    <text style="font-size: 40rpx; margin-top: 40rpx">{{ item.name }}</text>
                    <view style="margin-left: 40rpx">
                        <text>￥ {{ item.price }}</text>
                    </view>
                </view>
            </view>
        </view>
        <view v-else>
            <u-empty text="商品为空"></u-empty>
        </view>
        <view style="width: 100%;position: fixed;bottom: 20rpx;display: flex;">
            <button style="
              margin-top: 10rpx;
              border-radius: 10rpx;
              width: 40%;
              background:orangered;
            " @click="editShop()">修改商铺</button>
            <button style="
              margin-top: 10rpx;
              border-radius: 10rpx;
              width: 40%;
              background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
            " @click="addGoods()">添加商品</button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { getGoodsListAPI } from '@/services/home'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

const shop: any = ref({})
const goods: any = ref([])
let shopData = {}

onLoad((option: any) => {
    shopData = option.data
    shop.value = JSON.parse(decodeURIComponent(option.data))
})

onShow(() => {
    getDetail(shop.value.id)
})

const getDetail = async (id: string) => {
    const result: any = await getGoodsListAPI(id)
    if (result.code == 200) {
        goods.value = result.data
    }
}

const editGoods = (item: any) => {
    uni.navigateTo({
        url: `/pages/editGoods/index?shopId=${shop.value.id}&data=` + encodeURIComponent(JSON.stringify(item))
    })
}

const addGoods = () => {
    uni.navigateTo({
        url: '/pages/addGoods/index?shopId=' + shop.value.id
    })
}

const editShop = () => {
    uni.navigateTo({
        url: `/pages/editShop/index?shopId=${shop.value.id}`
    })
}

</script>

<style lang="scss" scoped>
.goods {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    // background-color: #f2f5f5;

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
        margin: 0 5% 30rpx 5%;
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