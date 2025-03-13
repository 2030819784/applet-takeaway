<template>
    <view class="main">
        <scroll-view v-if="addressList.length > 0">
            <view class="address" v-for="(item, index) in addressList" :key="index">
                <view class="item">
                    <view class="left" @click="selected(item)">
                        <view class="addressTop">
                            <text class="">{{ item.info }} - {{ item.houseNumber }}</text>
                        </view>
                        <view class="addressBottom">
                            <view style="width: 200rpx;">
                                <text>{{ item.name }} </text>
                            </view>
                            <text>{{ item.phone }} </text>
                        </view>
                    </view>
                    <view class="right" @click="editMessage(item)">
                        <image src="../../static/images/edit.png"></image>
                    </view>
                </view>

            </view>
        </scroll-view>
        <view v-else class="empty">
            <u-empty text="地址为空"></u-empty>
        </view>
        <view class="bottom">
            <up-button text="添加地址" color="green" shape="circle" @click="addAddress"></up-button>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { addressListAPI } from '@/services/address'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

const addressList = ref([])

onShow(() => {
    getAddressList()
})

const getAddressList = async () => {
    const result: any = await addressListAPI()
    if (result.code === 200) {
        addressList.value = result.data
    }
    else {
        uni.showToast({
            title: result.msg,
            icon: 'error'
        })
    }
}

const addAddress = () => {
    uni.navigateTo({
        url: '/pages/addAddress/index'
    })
}

const selected = (item: any) => {
    uni.setStorageSync('address', item)
    uni.navigateBack()
}

const editMessage = (item: any) => {
    uni.navigateTo({
        url: '/pages/editAddress/index?message=' + encodeURIComponent(JSON.stringify(item))
    })
}

</script>

<style lang="scss">
.main {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.empty {
    position: relative;
    top: 300rpx;
}

.address {
    margin: 0 auto;
    margin-top: 50rpx;
    width: 700rpx;
    height: 130rpx;
    border-bottom: 1px solid black;

    .item {
        display: flex;
        align-items: center;

        .left {
            flex: 1;

            .addressTop {
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 10rpx;
            }

            .addressBottom {
                padding-left: 10rpx;
                display: flex;
            }
        }

        .right {
            width: 50rpx;
            height: 50rpx;
            margin-right: 30rpx;
        }
    }
}

.bottom {
    width: 40%;
    height: 80rpx;
    margin: 15rpx;
    position: fixed;
    bottom: 0;

}
</style>