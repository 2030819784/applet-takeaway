<template>
  <view> </view>
</template>

<script lang="ts" setup>
import { onReady } from '@dcloudio/uni-app'
let scanType: string = ''
let result: any = {}
onReady(() => {
  uni.scanCode({
    success: function (res) {
      scanType = res.scanType
      result = res.result
      console.log(scanType, result)
    },
    fail: function () {
      uni.navigateBack()
    },
  })
})
</script>

<style></style>
