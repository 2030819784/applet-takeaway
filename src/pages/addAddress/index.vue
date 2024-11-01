<template>
    <view class="main">
        <view>
            <up-form labelPosition="left" labelWidth="100px">
                <up-form-item label="姓名:"><up-input v-model="shop.name"></up-input></up-form-item>
                <up-form-item label="联系电话:"><up-input v-model="shop.phone"></up-input></up-form-item>
                <up-form-item label="地址:"><up-input v-model="shop.info"></up-input></up-form-item>
                <up-form-item label="门牌号:"><up-input v-model="shop.houseNumber"></up-input></up-form-item>
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
import { reactive, ref } from 'vue'


const shop: any = reactive({
    name: '',
    phone: '',
    info: '',
    houseNumber: '',
})

let tempFilePaths: string[] | string = [];

const type: any = ref([])
const index = ref(0)

const cancel = () => {
    uni.navigateBack()
}
const sure = () => {

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
