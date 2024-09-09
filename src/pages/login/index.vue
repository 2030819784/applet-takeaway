<script setup lang="ts">
import { postLoginWxMinAPI } from '@/services/login'
import { useMemberStore } from '@/store'
import userUrl from '@/static/login/logo.png'

let phoneCode: string = ''
// const memberStore = useMemberStore()


const getId = () => {
    getCode().then((code) => login(code).then((result) => loginSuccess(result)))
}
const getCode = () => {
    return new Promise<string>((resolve) => {
        uni.login({
            success: ({ code }) => {
                resolve(code)
            },
        })
    })
}
const login = (code: string) => {
    return new Promise((resolve) => {
        const result = postLoginWxMinAPI(code)
        resolve(result)
    })
}


const loginSuccess = (profile: any) => {
    if (profile.code === 200) {
        // 保存用户信息
        const memberStore = useMemberStore()
        memberStore.setProfile(profile.data)
        // 成功提示
        uni.showToast({ icon: 'success', title: '登录成功' })
        setTimeout(() => {
            uni.switchTab({
                url: '/pages/index/index',
            })
        }, 500)
    }
    else {
        uni.showToast({
            icon: 'error',
            title: '登录失败,请重试',
        })
    }
}
</script>

<template>
    <view class="viewport">
        <view class="logo">
            <image :src="userUrl"></image>
        </view>
        <view class="login">
            <!-- 小程序端授权登录 -->
            <!-- #ifdef MP-WEIXIN -->
            <button class="button phone" @click="getId">
                <text class="icon icon-phone"></text>
                微信登录
            </button>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.viewport {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20rpx 40rpx;
}

.logo {
    flex: 1;
    text-align: center;

    image {
        width: 220rpx;
        height: 220rpx;
        margin-top: 15vh;
    }
}

.login {
    display: flex;
    flex-direction: column;
    height: 60vh;
    padding: 40rpx 20rpx 20rpx;

    .input {
        width: 100%;
        height: 80rpx;
        font-size: 28rpx;
        border-radius: 72rpx;
        border: 1px solid #ddd;
        padding-left: 30rpx;
        margin-bottom: 20rpx;
    }

    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 80rpx;
        font-size: 28rpx;
        border-radius: 72rpx;
        color: #fff;

        .icon {
            font-size: 40rpx;
            margin-right: 6rpx;
        }
    }

    .phone {
        background-color: #28bb9c;
    }

    .title {
        width: 700rpx;
        margin: 0 auto;
        margin: 40rpx;
        text-indent: 2em;

        .textStyle {
            color: blue;
            text-decoration: underline;
        }
    }

    .buttons {
        display: flex;
    }
}

.tips {
    position: absolute;
    bottom: 80rpx;
    left: 20rpx;
    right: 20rpx;
    font-size: 22rpx;
    color: #999;
    text-align: center;
}
</style>
