<template>
  <view class="Info">
    <view class="Info_card">
      <view class="Info_top">
        <text>用户信息填写</text>
        <text>{{ Certification.exists ? '您已完成实名' : '请实名' }}</text>
      </view>
      <view class="Info_bottom" v-if="Certification.exists">
        <u-form labelPosition="left" :model="model1" :rules="rules" ref="form">
          <u-form-item label="姓名" labelWidth="25%" prop="userInfo.name">
            <view>{{ Certification.userCertification.name }}</view>
          </u-form-item>
          <u-form-item label="证件号码" labelWidth="25%">
            <view>{{ Certification.userCertification.idNumber }}</view>
          </u-form-item>
          <u-form-item label="民族" labelWidth="25%">
            <view>{{ Certification.userCertification.nation }}</view>
          </u-form-item>
          <u-form-item label="出生日期" labelWidth="25%" closeOnClickOverlay="true">
            <view>{{ Certification.userCertification.birthdate }}</view>
          </u-form-item>
          <u-form-item label="性别" labelWidth="25%">
            <view>{{ Certification.userCertification.gender }}</view>
          </u-form-item>
          <u-form-item label="地址" labelWidth="25%">
            <view>{{ Certification.userCertification.address }}</view>
          </u-form-item>
        </u-form>
      </view>
      <view class="Info_bottom" v-else>
        <u-form labelPosition="left" :model="model1" :rules="rules" ref="form">
          <u-form-item label="受检者姓名" labelWidth="25%" prop="userInfo.name">
            <u-input v-model="model1.userInfo.name" border="none" placeholder="必填"></u-input>
          </u-form-item>
          <u-form-item label="证件号码" labelWidth="25%">
            <u-input v-model="model1.userInfo.number" border="none" placeholder="必填"></u-input
          ></u-form-item>
          <u-form-item label="民族" labelWidth="25%">
            <u-input v-model="model1.userInfo.nation" border="none" placeholder="必填"></u-input
          ></u-form-item>
          <u-form-item
            label="出生日期"
            @click="show1 = true"
            labelWidth="25%"
            closeOnClickOverlay="true"
          >
            <u-datetime-picker
              v-model="defaultTime"
              :show="show1"
              mode="date"
              :minDate="-2300000000000"
              @confirm="handleConfirm2"
              @close="handleConfirm1"
            ></u-datetime-picker>
            <u-input
              v-model="model1.userInfo.birthdate"
              border="none"
              @click="show1 = true"
              placeholder="请选择出生日期"
            ></u-input>
          </u-form-item>
          <u-form-item label="性别" labelWidth="25%">
            <u-radio-group v-model="model1.userInfo.sex" placement="column">
              <u-radio
                :customStyle="{ marginBottom: '8px' }"
                v-for="(item, index) in sexTypes"
                :key="index"
                :label="item.name"
                :name="item.name"
              >
              </u-radio>
            </u-radio-group>
          </u-form-item>
          <u-form-item label="地址" labelWidth="25%">
            <u-input v-model="model1.userInfo.address" border="none" placeholder="必填"></u-input
          ></u-form-item>
          <u-form-item label="上传身份证" labelWidth="25%">
            <button @click="OpenCamera">选择图片</button>
          </u-form-item>
        </u-form>
        <view>
          <!-- <button @click="authentication()" style="background: #4fe84f; margin-top: 100rpx">
            认证
          </button> -->
          <view class="button" @click="authentication()"> 保存 </view>
        </view>
      </view>
    </view>
    <!-- <view class="text">
      <u-radio-group>
        <u-radio shape="square" label="我已阅读 用户服务协议 隐私政策"> </u-radio>
      </u-radio-group>
    </view> -->
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCertification, useMemberStore } from '@/stores'
import type { authenticationList } from '@/types/profile'
import { Authentication } from '@/services/profile'
import { addAffiliatedAPI } from '@/services/home'
import { onLoad } from '@dcloudio/uni-app'
import { isCertificationAPI, authenticationAPI } from '@/services/user'
import { getCloudPath } from '@/utils/getCloudPath'
const show = ref(false)
const show1 = ref(false)
const defaultTime = 631123200000
let Certification = uni.getStorageSync('Certification')
let model1 = {
  userInfo: {
    name: '',
    sex: '',
    number: '',
    address: '',
    birthdate: '',
    nation: '',
  },
}

const sexTypes = [
  {
    name: '男',
    disabled: false,
  },
  {
    name: '女',
    disabled: false,
  },
]
const columns = reactive([
  [
    '居民身份证',
    '港澳居民来往大陆通行证',
    '台湾居民来往大陆通行证',
    '华侨护照',
    '外籍护照',
    '其他',
  ],
])

const rules = {
  'userInfo.name': {
    type: 'string',
    required: true,
    message: '请填写姓名',
    trigger: ['blur', 'change'],
  },
  'userInfo.sex': {
    type: 'string',
    max: 1,
    required: true,
    message: '请选择男或女',
    trigger: ['blur', 'change'],
  },
  'userInfo.idType': {
    type: 'string',
    required: true,
    message: '请填写证件号',
    trigger: ['blur', 'change'],
  },
  'userInfo.phone': {
    type: 'string',
    required: true,
    message: '请填写手机号',
    trigger: ['blur', 'change'],
  },
  'userInfo.age': {
    type: 'number',
    required: true,
    message: '请填写年龄',
    trigger: ['blur', 'change'],
  },
  'userInfo.career': {
    type: 'string',
    required: true,
    message: '请填写工作单位',
    trigger: ['blur', 'change'],
  },
  'userInfo.address': {
    type: 'string',
    trigger: ['blur', 'change'],
  },
}

const handleConfirm2 = (e: any) => {
  let date = new Date(e.value)
  let YY = date.getFullYear()
  let MM = date.getMonth() + 1 < 10 ? date.getMonth() + 1 : date.getMonth() + 1
  let DD = date.getDate() < 10 ? date.getDate() : date.getDate()
  model1.userInfo.birthdate = YY + '-' + MM + '-' + DD
  show1.value = false
}
const handleConfirm1 = () => {
  show1.value = false
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

let uploadFileParam = {
  objName: '',
  size: 0,
}

const OpenCamera = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['camera'],
    success: (res: any) => {
      const size = res.tempFiles[0].size
      const objName = getCloudPath(res.tempFilePaths[0])
      wx.cloud.uploadFile({
        filePath: res.tempFilePaths[0],
        cloudPath: objName,
        success: (res: any) => {
          uni.showToast({
            icon: 'success',
            title: '上传成功',
          })
          //图片上传云端成功
          uploadFileParam.size = size
          uploadFileParam.objName = objName
        },
        fail: () => {
          uni.showToast({
            icon: 'error',
            title: '网络错误!',
          })
        },
      })
    },
  })
}

//实名认证
const authentication = async () => {
  if (!model1.userInfo.name) {
    uni.showToast({
      title: '请填写姓名',
      icon: 'error',
    })
  } else if (!model1.userInfo.number) {
    uni.showToast({
      title: '请填写证件',
      icon: 'error',
    })
  } else if (!model1.userInfo.nation) {
    uni.showToast({
      title: '请填写民族',
      icon: 'error',
    })
  } else if (!model1.userInfo.birthdate) {
    uni.showToast({
      title: '请选择生日',
      icon: 'error',
    })
  } else if (!model1.userInfo.sex) {
    uni.showToast({
      title: '请选择性别',
      icon: 'error',
    })
  } else if (!model1.userInfo.address) {
    uni.showToast({
      title: '请填写地址',
      icon: 'error',
    })
  } else if (!uploadFileParam.objName) {
    uni.showToast({
      title: '请上传证件',
      icon: 'error',
    })
  } else {
    const data = {
      uploadFileParam,
      authenticationParam: model1.userInfo,
    }
    const result = await authenticationAPI(data)
    if (result.code == 200) {
      uni.showToast({
        icon: 'success',
        title: '认证成功',
      })
      isCertification()
      uni.navigateBack({
        delta: 1,
      })
    } else {
      uni.showToast({
        icon: 'error',
        title: result.msg,
      })
    }
  }
}

onLoad(() => {})
</script>

<style lang="scss" scoped>
.Info {
  .Info_card {
    margin: 3% 3%;
    width: 94%;
    background: #ffffff;

    .Info_top {
      margin-left: 32rpx;
      display: flex;
      justify-content: space-between;
      font-size: 32rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 600;
      color: #000000;

      .info_top_right {
        width: 252rpx;
        height: 56rpx;
        padding: 10rpx 20rpx;
        background: linear-gradient(180deg, #1bc172 0%, #43d180 100%);
        border-radius: 200rpx 200rpx 200rpx 200rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24rpx;
        font-family: PingFang HK-Regular, PingFang HK;
        font-weight: 400;
        color: #ffffff;

        .scan {
          margin: 0 2rpx 0 0;
        }
      }
    }

    .Info_bottom {
      margin-left: 32rpx;
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
    }
  }

  .text {
    margin: 0 4%;
  }

  .button {
    margin: 0 25%;
    height: 80rpx;
    background: linear-gradient(229deg, #1bc172 0%, #43d180 100%);
    border-radius: 200rpx 200rpx 200rpx 200rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28rpx;
    font-family: PingFang HK-Regular, PingFang HK;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>
