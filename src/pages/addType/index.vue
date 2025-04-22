<template>
    <view class="main">
        <view>
            <up-form labelPosition="left" labelWidth="100px">
                <up-form-item label="标签名:"><up-input v-model="label.label"
                        placeholder="请输入标签名"></up-input></up-form-item>
            </up-form>
            <up-form labelPosition="left" labelWidth="100px">
                <up-form-item label="备注:"><up-input v-model="label.remark"
                        placeholder="请输入备注"></up-input></up-form-item>
            </up-form>
        </view>
        <view class="footer">
            <view class="bottom">
                <up-button text="取消" color="red" shape="circle" @click="cancel"></up-button>
            </view>
            <view class="bottom">
                <up-button text="确认" color="orange" shape="circle" @click="sure"></up-button>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { addGoodsCategoryAPI } from '@/services/home'
import { reactive } from 'vue'


const label: any = reactive({
    label: '',
    parentId: 'shop_type',
    remark: '',
    type: 'shop_type'
})



const cancel = () => {
    uni.navigateBack()
}
const sure = () => {
    if (!label.label) {
        uni.showToast({
            icon: 'error',
            title: '请输入标签名'
        })
        return
    }
    addLabel(label)
}

const addLabel = async (data: any) => {
    const res: any = await addGoodsCategoryAPI(data)
    if (res.code === 200) {
        uni.showToast({
            icon: 'success',
            title: '新增成功'
        })
        setTimeout(() => {
            uni.navigateBack()
        }, 300)
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
