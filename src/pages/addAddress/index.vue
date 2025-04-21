<template>
    <view class="main">
        <view>
            <up-form labelPosition="left" labelWidth="100px">
                <up-form-item label="姓名:"><up-input v-model="address.name"
                        placeholder="请输入姓名"></up-input></up-form-item>
                <up-form-item label="联系电话:"><up-input v-model="address.phone"
                        placeholder="请输入手机号"></up-input></up-form-item>
                <up-form-item label="地址:"><up-input v-model="address.info"
                        placeholder="请输入地址"></up-input></up-form-item>
                <up-form-item label="楼层:">
                    <picker @change="selectFloor" mode='selector' :value="address.floor" :range="floorList">
                        {{ address.floor }}
                    </picker>
                </up-form-item>
                <up-form-item label="门牌号:"><up-input v-model="address.houseNumber"
                        placeholder="请输入门牌号"></up-input></up-form-item>
            </up-form>
        </view>
        <view class="footer">
            <view class="bottom">
                <up-button text="取消" color="red" shape="circle" @click="cancel"></up-button>
            </view>
            <view class="bottom">
                <up-button text="添加" color="orange" shape="circle" @click="sure"></up-button>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { saveAddressAPI } from '@/services/address'
import { reactive, ref } from 'vue'


const address: any = reactive({
    name: '',
    phone: '',
    info: '',
    houseNumber: '',
    floor: 1
})

const floorList = ref(Array.from(new Array(21), (item, index) => item = index))

const cancel = () => {
    uni.navigateBack()
}

const selectFloor = (item: any) => {
    address.floor = item.detail.value
}

const sure = () => {
    if (address.name === '') {
        uni.showToast({
            title: '请填写姓名',
            icon: 'error'
        })
        return
    }
    if (address.photo === '') {
        uni.showToast({
            title: '请填写手机号',
            icon: 'error'
        })
        return
    }
    if (!/^1[3-9]\d{9}$|^0\d{2,3}-\d{7,8}$/.test(address.phone)) {
        uni.showToast({
            icon: 'error',
            title: '手机号格式错误'
        })
        return
    }
    if (address.info === '') {
        uni.showToast({
            title: '请填写地址',
            icon: 'error'
        })
        return
    }
    if (!address.floor) {
        uni.showToast({
            title: '请填写楼层',
            icon: 'error'
        })
        return
    }
    if (address.houseNumber === '') {
        uni.showToast({
            title: '请填写门牌号',
            icon: 'error'
        })
        return
    }

    saveAddress()
}

const saveAddress = async () => {
    const result = await saveAddressAPI(address) as { code: number, msg: string }
    if (result?.code === 200) {
        uni.showToast({
            icon: 'success',
            title: '新增成功'
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
