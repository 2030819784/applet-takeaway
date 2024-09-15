<template>
  <view class="Info">
    <view class="Info_card">
      <view class="Info_top">
        <text>用户信息填写</text>
      </view>
      <view class="Info_bottom">
        <u-form labelPosition="left">
          <!-- <u-form-item label="证件类型" labelWidth="25%" closeOnClickOverlay="true">
            <view>{{ form.idType }}</view>
          </u-form-item> -->
          <u-form-item label="受检者姓名" labelWidth="25%">
            <view>{{ form.name }}</view>
          </u-form-item>
          <u-form-item label="证件号码" labelWidth="25%">
            <view>{{ form.idNumber }}</view>
          </u-form-item>
          <u-form-item label="手机号码" labelWidth="25%">
            <view>{{ form.phone }}</view>
          </u-form-item>
          <u-form-item label="出生日期" labelWidth="25%">
            <view>{{ form.birth }}</view>
          </u-form-item>
          <u-form-item label="性别" labelWidth="25%">
            <view>{{ form.gender }}</view>
          </u-form-item>
          <!-- <u-form-item label="年龄" labelWidth="25%">
            <view>{{ form.age }}</view>
          </u-form-item> -->
          <!-- <u-form-item label="工作单位" labelWidth="25%">
            {{ form.career }}
          </u-form-item> -->
          <u-form-item label="地址" labelWidth="25%">
            <view>{{ form.address }}</view>
          </u-form-item>
        </u-form>
      </view>
    </view>

    <!-- <view class="text">
      <u-radio-group>
        <u-radio shape="square" label="我已阅读 用户服务协议 隐私政策"> </u-radio>
      </u-radio-group>
    </view>
    <view class="button" @click="doAuthentication()"> 保存 </view> -->
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getAffiliatedDetailAPI } from '@/services/home'
let form: any = ref()
const getAffiliatedDetail = async (id: any) => {
  const res: any = await getAffiliatedDetailAPI(id)
  if (res.code == 200) {
    form.value = res.data
    if (form.value.gender == 0) {
      form.value.gender = '女'
    } else if (form.value.gender == 1) {
      form.value.gender = '男'
    }
  }
}
onShow(() => {})
onLoad((option: any) => {
  const id = JSON.parse(decodeURIComponent(option.id))
  getAffiliatedDetail(id)
})
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
