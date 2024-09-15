<template>
  <view class="Info">
    <view class="Info_card">
      <view class="Info_top">
        <text>用户信息填写</text>
      </view>
      <view class="Info_bottom">
        <u-form labelPosition="left" :model="model1" ref="form">
          <u-form-item label="受检者姓名" labelWidth="25%" prop="userInfo.name">
            <u-input v-model="model1.userInfo.name" border="none" placeholder="必填"></u-input>
          </u-form-item>
          <u-form-item label="证件号码" labelWidth="25%">
            <u-input v-model="model1.userInfo.idNumber" border="none" placeholder="选填"></u-input
          ></u-form-item>
          <!-- <u-form-item label="民族" labelWidth="25%">
            <u-input v-model="model1.userInfo.nation" border="none" placeholder="必填"></u-input
          ></u-form-item> -->
          <u-form-item label="手机号" labelWidth="25%">
            <u-input v-model="model1.userInfo.phone" border="none" placeholder="必填"></u-input
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
              v-model="model1.userInfo.birth"
              border="none"
              @click="show1 = true"
              placeholder="请选择出生日期"
            ></u-input>
          </u-form-item>
          <u-form-item label="性别" labelWidth="25%">
            <u-radio-group v-model="sex" placement="column">
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
            <u-input v-model="model1.userInfo.address" border="none" placeholder="选填"></u-input
          ></u-form-item>
        </u-form>
        <view class="button" @click="addAffiliated()"> 保存 </view>
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
import { useMemberStore } from '@/stores'
import type { authenticationList } from '@/types/profile'
import { Authentication } from '@/services/profile'
import { addAffiliatedAPI } from '@/services/home'
import { onLoad } from '@dcloudio/uni-app'
import { getCloudPath } from '@/utils/getCloudPath'
const show = ref(false)
const show1 = ref(false)
const defaultTime = 631123200000
let model1 = {
  userInfo: {
    name: '',
    gender: 0,
    idNumber: '',
    address: '',
    birth: '',
    nation: '',
    idCard: '',
    homeAddress: '',
    phone: '',
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
let sex = ''
const handleConfirm2 = (e: any) => {
  let date = new Date(e.value)
  let YY = date.getFullYear()
  let MM = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  let DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  model1.userInfo.birth = YY + '-' + MM + '-' + DD
  show1.value = false
}
const handleConfirm1 = () => {
  show1.value = false
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
          if (res.data.code == 200) {
            uni.showToast({
              icon: 'success',
              title: '上传成功',
            })
            //图片上传云端成功
            uploadFileParam.size = size
            uploadFileParam.objName = objName
          } else {
            uni.showToast({
              icon: 'error',
              title: '上传失败,请重试！',
            })
          }
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
//增加联系人
const addAffiliated = async () => {
  if (!model1.userInfo.name) {
    uni.showToast({
      title: '请填写姓名',
      icon: 'error',
    })
  } else if (!model1.userInfo.phone) {
    uni.showToast({
      title: '请填写电话',
      icon: 'error',
    })
  } else {
    if (sex == '女') {
      model1.userInfo.gender = 0
    } else if (sex == '男') {
      model1.userInfo.gender = 1
    }
    const result: any = await addAffiliatedAPI(model1.userInfo)
    if (result.code == 200) {
      uni.navigateBack({
        delta: 1,
      })
    } else {
      uni.showToast({
        icon: 'error',
        title: '添加失败',
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
