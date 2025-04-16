<template>
    <view class="main">
        <view>
            <up-form labelPosition="left" labelWidth="100px">
                <up-form-item label="姓名:"><up-input v-model="message.name"></up-input></up-form-item>
                <up-form-item label="身份证号:"><up-input v-model="message.idCard"></up-input></up-form-item>
                <up-form-item label="人脸图片:">
                    <view style="display: flex;">
                        <image v-if="photo" style="border-radius: 20rpx;width: 200rpx;height: 200rpx;margin: 20rpx;"
                            :src="photo">
                        </image>
                        <u-icon width="52rpx" height="52rpx" :name="image" @click="chooseImage">
                        </u-icon>
                    </view>
                </up-form-item>
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
// import { addRiderAPI } from '@/services/rider'
import { getUserInfoAPI } from '@/services/user'
import { useMemberStore } from '@/stores'
import { onMounted, ref } from 'vue'
import image from '../../static/home/upload.png'


const message: any = {
    name: '',
    userId: '',
    idCard: ''
}

const photo = ref('')

const chooseImage = () => {
    uni.chooseImage(
        {
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
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
        url: 'http://localhost:8081/rider/register',
        filePath: photo.value,
        name: 'goodsPhoto',
        formData: message,
        header: { "Content-Type": "multipart/form-data" },
        success: (result) => {
            uni.showToast({
                title: '骑手注册成功',
                icon: 'success'
            })
            judgeRole()
            setTimeout(() => {
                uni.navigateBack()
            }, 500)
        },
        fail: (fail) => {
            uni.showToast({
                icon: 'error',
                title: '图片上传失败',
            })
        },
    })
}


const save = async () => {
    if (message.name === '') {
        uni.showToast({
            title: '请填写姓名',
            icon: 'error'
        })
        return
    }

    if (message.idCard === '') {
        uni.showToast({
            title: '请填写身份证号',
            icon: 'error'
        })
        return
    }
    uploadImage()
}

const cancel = () => {
    uni.navigateBack()
}


const judgeRole = async () => {
    const user = uni.getStorageSync('user')
    const result = user.roles.some((item: any) => item.name === 'rider')
    if (!result) {
        const res: any = await getUserInfoAPI()
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