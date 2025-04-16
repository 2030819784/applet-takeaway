<template>
  <view class="total">
    <view class="qrcode">
      <uv-qrcode ref="qrcode" size="400rpx" :options="options" :value="value" @complete="complete"></uv-qrcode>
    </view>
    <view class="setting">
      <button @click="saveQRcode" class="buttonStyle">
        <img src="../../static/images/download.png" style="width: 50rpx; height: 50rpx" />
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
const options = {
  foregroundImageSrc: '',
}
const value = ref('')
const qrcode = ref()

onLoad((option: any) => {
  value.value = option.data
})


let scene: boolean = false

const complete = (msg: any) => {
  if (msg.success) scene = true
}

const saveQRcode = () => {
  if (scene) {
    qrcode.value.toTempFilePath({
      success: () => {
        qrcode.value.save({
          success: (res: any) => {
            console.log(res)
          },
        })
      },
    })
  }
}
</script>

<style lang="scss">
.total {
  background: #00b26a;
  position: absolute;
  width: 100%;
  height: 100%;
}

.qrcode {
  margin: 0 auto;
  margin-top: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 20rpx;
  width: 500rpx;
  height: 500rpx;
}

.setting {
  margin-top: 100rpx;
  width: 150rpx;
  height: 150rpx;

  .buttonStyle {
    background: #00b26a;
    width: 100rpx;
    height: 100rpx;
    border-radius: 100rpx;
    position: absolute;
    right: 20rpx;
    bottom: 10rpx;
  }
}
</style>
