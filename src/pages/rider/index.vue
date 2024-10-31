<template>
    <view class="main">
        <view>
            <up-form labelPosition="left" labelWidth="100px">
                <up-form-item label="姓名:"><up-input v-model="shop.name"></up-input></up-form-item>
                <up-form-item label="性别:">
                    <picker @change="getType" mode='selector' :value="index" :range="type">
                        {{ type[index] }}
                    </picker>
                </up-form-item>
                <up-form-item label="年龄:"><up-input v-model="shop.deliveryCost"></up-input></up-form-item>
                <up-form-item label="联系电话:"><up-input v-model="shop.phone"></up-input></up-form-item>
                <up-form-item label="地址:"><up-input v-model="shop.openTime"></up-input></up-form-item>
            </up-form>
        </view>
        <view class="footer">
            <view class="bottom">
                <up-button text="取消" color="red" shape="circle" @click="cancel"></up-button>
            </view>
            <view class="bottom">
                <up-button text="确认" color="orange" shape="circle" @click="save"></up-button>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { addRiderAPI } from '@/services/rider'
import { getUserInfoAPI } from '@/services/user'
import { useMemberStore } from '@/stores'
import { ref } from 'vue'


const shop: any = {
    name: '',
    phone: '',
    deliveryCost: '',
    openTime: '',
    restTime: '',
    description: '',
    photo: [],
    typeId: '',
}

const type: any = ref(['男', '女'])
const index = ref(0)

const getType = (item: any) => {
    index.value = item.detail.value
    shop.typeId = type.value[index.value].id
}

const save = async () => {
    if (shop.name === '') {
        uni.showToast({
            title: '请填写姓名',
            icon: 'error'
        })
    }
    const result = await addRiderAPI(shop.name)
    if (result.code === 200) {
        judgeRole()
    }
    else {
        uni.showToast({
            title: result.msg,
            icon: 'error'
        })
    }
}

const cancel = () => {
    uni.navigateBack()
}


const judgeRole = async () => {
    const user = uni.getStorageSync('user')
    const result = user.roles.some((item) => item.name === 'rider')
    if (!result) {
        const res = await getUserInfoAPI()
        if (res.code === 200) {
            user.roles = res.data.roles
            const memberStore = useMemberStore()
            memberStore.setProfile(user)
        }
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