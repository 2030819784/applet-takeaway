<template>
  <view v-if="isRoles">
    <!-- 采样检测 -->
    <specimenInspector
      v-if="
        isRoles.isSamplingStaff &
        (isRoles.isHairStaff ||
          isRoles.isMedicalStaff ||
          isRoles.isQuickInspectionStaff ||
          isRoles.isSewageStaff)
      "
    ></specimenInspector>
    <!-- 采样人员 -->
    <Samplers v-else-if="isRoles.isSamplingStaff"></Samplers>
    <!-- 检测人员：快检检测员、医检检测员、毛发检测员、污水检测员 -->
    <Inspectors
      v-else-if="
        isRoles.isHairStaff ||
        isRoles.isMedicalStaff ||
        isRoles.isQuickInspectionStaff ||
        isRoles.isSewageStaff
      "
    ></Inspectors>
    <!-- 普通用户 -->
    <Regularuser v-else></Regularuser>
  </view>
</template>

<script setup lang="ts">
import Regularuser from './components/regularuser.vue'
import Samplers from './components/Samplers.vue'
import Inspectors from './components/Inspectors.vue'
import specimenInspector from './components/specimenInspector.vue'
import { onLoad, onShow, onTabItemTap } from '@dcloudio/uni-app'
import { useMemberStore, useOrderType, useOtherTypes, useRolesStore } from '@/stores'
import { isCertificationAPI } from '@/services/user'
import { ref } from 'vue'
//用户角色
let isRoles: any = ref()
isRoles.value = uni.getStorageSync('roles')

onLoad(() => {})
onShow(() => {
  isRoles.value = uni.getStorageSync('roles')
  if (!isRoles.value) {
    uni.navigateTo({
      url: '/pages/login/login',
    })
  }
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
