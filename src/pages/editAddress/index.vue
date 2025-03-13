<template>
    <view class="main">
        <view>
            <up-form labelPosition="left" labelWidth="100px">
                <up-form-item label="姓名:"><up-input v-model="address.name"></up-input></up-form-item>
                <up-form-item label="联系电话:"><up-input v-model="address.phone"></up-input></up-form-item>
                <up-form-item label="地址:"><up-input v-model="address.info"></up-input></up-form-item>
                <up-form-item label="门牌号:"><up-input v-model="address.houseNumber"></up-input></up-form-item>
            </up-form>
        </view>
        <view class="footer">
            <view class="bottom">
                <up-button text="取消" color="red" shape="circle" @click="cancel"></up-button>
            </view>
            <view class="bottom">
                <up-button text="修改" color="orange" shape="circle" @click="sure"></up-button>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { saveAddressAPI } from '@/services/address'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

onLoad((option: any) => {
    const message = JSON.parse(decodeURIComponent(option.message))
    address.value = message
})

const address: any = ref()
const cancel = () => {
    uni.navigateBack()
}
const sure = () => {
    saveAddress()
}

const saveAddress = async () => {
    console.log(address.value)
    const result = await saveAddressAPI(address.value) as { code: number, msg: string }
    if (result?.code === 200) {
        uni.showToast({
            icon: 'success',
            title: '修改成功'
        })
        uni.navigateBack()
    }
    else {
        uni.showToast({
            icon: 'error',
            title: result.msg
        })
    }
}


</script>
<style lang="scss" scoped>
.main {
    display: flex;
    flex-direction: column;
    padding: 40rpx;
    background: linear-gradient(180deg, #e5fdf5 50%, rgba(255, 255, 255, 0) 99%);

    text {
        margin: 20rpx;
    }

    .footer {
        margin-top: 6rpx;
        height: 100rpx;
        margin-top: auto;
        display: flex;
        justify-content: center;
        flex-direction: row;
        position: fixed;
        bottom: 0;
        width: 710rpx;


        .bottom {
            width: 40%;
            height: 80rpx;
            margin: 0 15rpx;
        }
    }
}
</style>
