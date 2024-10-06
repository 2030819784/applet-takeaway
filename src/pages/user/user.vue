<template>
  <view v-if="isRoles">
    <!-- <specimenInspector ></specimenInspector> -->
    <!-- 采样人员 -->
    <!-- <Samplers ></Samplers> -->
    <!-- 检测人员：快检检测员、医检检测员、毛发检测员、污水检测员 -->
    <!-- <Inspectors></Inspectors> -->
    <!-- 普通用户 -->
    <Regularuser></Regularuser>
  </view>
</template>

<script setup lang="ts">
import Regularuser from './components/regularuser.vue'
import Samplers from './components/Samplers.vue'
import Inspectors from './components/Inspectors.vue'
import specimenInspector from './components/specimenInspector.vue'
import { onLoad, onShow, onTabItemTap } from '@dcloudio/uni-app'
import { ref } from 'vue'
//用户角色
let isRoles: any = ref()
onShow(() => {
  if (!isRoles.value) {
    uni.navigateTo({
      url: '/pages/login/login',
    })
  }
  isRoles.value = uni.getStorageSync('roles')

})
onTabItemTap(() => {
  uni.removeStorageSync('orderTypes')
  uni.removeStorageSync('otherType')
})
</script>
<style lang="scss" scoped>
page {
  background-color: #f7f7f8;
}
</style>
