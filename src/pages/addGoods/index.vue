<template>
    <view class="main">
        <view>
            <up-form labelPosition="left">
                <up-form-item label="名称:"><up-input v-model="goods.name"></up-input></up-form-item>
                <up-form-item label="单价:"><up-input v-model="goods.price"></up-input></up-form-item>
                <up-form-item label="图片:">
                    <u-icon width="52rpx" height="52rpx" name="../../../../static/home/upload.png"
                        @click="chooseImage"></u-icon>
                </up-form-item>
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

const goods: any = {
    name: '',
    price: '',
    photo: [],
}

const chooseImage = () => {
    uni.chooseImage(
        {
            count: 1,
            success: (list) => {
                goods.photo = list
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
        url: 'http://localhost:8081/goods/save',
        files: goods.photo,
        name: goods.name,
        formData: goods,
        success: (result) => {
            console.log(result)
        },
        fail: (fail) => {
            uni.showToast({
                icon: 'error',
                title: '图片上传失败',
            })
        },
    })
}

const cancel = () => {
    uni.navigateBack()
}
const sure = () => {
    uploadImage()
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