<script setup lang="ts">
import { postLoginWxMinAPI, postLoginSimpleAPI } from '@/services/login'
import { useCertification, useMemberStore, useRolesStore } from '@/stores'
import userUrl from '@/static/images/logo.png'
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { isCertificationAPI } from '@/services/user'
import { log } from 'console'

let phoneCode: string = ''
const memberStore = useMemberStore()
let isRoles = reactive({
  //拥有所有权限
  isPlatformManager: false,
  //普通用户
  isUser: false,
  //政府工作人员
  isGovernmentStaff: false,
  //采样工作人员
  isSamplingStaff: false,
  //快检检测员
  isQuickInspectionStaff: false,
  //污水检测员
  isSewageStaff: false,
  //医检检测员
  isMedicalStaff: false,
  //毛发检测员
  isHairStaff: false,
})
// 获取用户手机号码
const getphonenumber: UniHelper.ButtonOnGetphonenumber = async (e) => {
  if (e.detail.errMsg!.includes('ok')) {
    phoneCode = e.detail.code!
    getId()
  }
}
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
    const data = {
      code,
      phoneCode,
    }
    const result = postLoginWxMinAPI(data)
    resolve(result)
  })
}
const checkRoles = () => {
  const roles = memberStore.profile.roles
  for (let key in roles) {
    if (roles[key].name == 'platform-manager') {
      isRoles.isPlatformManager = true
    } else if (roles[key].name == 'user') {
      isRoles.isUser = true
    } else if (roles[key].name == 'government-staff') {
      isRoles.isGovernmentStaff = true
    } else if (roles[key].name == 'sampling-staff') {
      isRoles.isSamplingStaff = true
    } else if (roles[key].name == 'quickInspection-staff') {
      isRoles.isQuickInspectionStaff = true
    } else if (roles[key].name == 'sewage-staff') {
      isRoles.isSewageStaff = true
    } else if (roles[key].name == 'medical-staff') {
      isRoles.isMedicalStaff = true
    } else if (roles[key].name == 'hair-staff') {
      isRoles.isHairStaff = true
    }
  }
  const rolesStore = useRolesStore()
  rolesStore.setRoles(isRoles)
}
const isCertification = async () => {
  let res: any = await isCertificationAPI()
  if (res.code == 200) {
    if (res.data.exists) {
      if (res.data.userCertification.gender == 0) {
        res.data.userCertification.gender = '女'
      } else if (res.data.userCertification.gender == 1) {
        res.data.userCertification.gender = '男'
      }
      let date = new Date(res.data.userCertification.birthdate)
      let YY = date.getFullYear()
      let MM = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      res.data.userCertification.birthdate = YY + '-' + MM + '-' + DD
      useCertification().setCertification(res.data)
    }
  }
}
const loginSuccess = (profile: any) => {
  uni.removeStorageSync('Certification')
  if (profile.code === 200) {
    // 保存用户信息
    const memberStore = useMemberStore()
    memberStore.setProfile(profile.data)
    checkRoles()
    // 成功提示
    uni.showToast({ icon: 'success', title: '登录成功' })
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/index/index',
      })
    }, 500)
    //判断用户是否实名认证
    isCertification()
  } else {
    uni.showToast({
      icon: 'error',
      title: '登录失败,请重试',
    })
  }
}

//弹窗控制
const show = ref(false)

const reject = () => {
  getPrivacySetting()
}

const handleOpenPrivacyContract = () => {
  wx.openPrivacyContract({
    success: (res) => {
      console.log(res)
    }, // 打开成功
    fail: (fail) => {
      console.log(fail)
    }, // 打开失败
  })
}

const handleAgreePrivacyAuthorization = () => {
  show.value = false
}

onLoad(() => {
  getPrivacySetting()
})

const getPrivacySetting = () => {
  wx.getPrivacySetting({
    success: (res) => {
      console.log(res) // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
      if (res.needAuthorization) {
        // 需要弹出隐私协议
        show.value = true
      } else {
        // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
        show.value = false
      }
    },
    fail: () => { },
    complete: () => { },
  })
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
      <button class="button phone" open-type="getPhoneNumber" @getphonenumber="getphonenumber">
        <text class="icon icon-phone"></text>
        手机号快捷登录
      </button>
      <!-- #endif -->

      <u-popup :show="show" mode="bottom" :round="10">
        <view class="title">
          在您使用本小程序时，我们会根据服务内容获取必要的个人信息，请仔细阅读<text class="textStyle"
            @click="handleOpenPrivacyContract">《国禁小程序隐私保护协议》</text>，如您同意此协议，请点击同意
        </view>
        <view class="buttons">
          <view style="width: 200rpx; margin: 100rpx">
            <up-button type="error" text="拒绝" @click="reject"></up-button>
          </view>
          <view style="width: 200rpx; margin: 100rpx">
            <button id="agree-btn" open-type="agreePrivacyAuthorization" style="background: #07c160"
              @bindagreeprivacyauthorization="handleAgreePrivacyAuthorization">
              同意
            </button>
          </view>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<style lang="scss" scoped>
page {
  height: 100%;
}

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
