<template>
  <view class="page" v-if="scene">
    <view
      v-if="
        isRoles.isSamplingStaff &
        (isRoles.isHairStaff ||
          isRoles.isMedicalStaff ||
          isRoles.isQuickInspectionStaff ||
          isRoles.isSewageStaff)
      "
    >
      <PendingProcessingOrder
        v-if="order.state == 20 || order.state == 30 || order.state == 40"
        :item="order"
      ></PendingProcessingOrder>
      <DetectionOrder v-else :item="order"></DetectionOrder>
    </view>
    <!-- 采样人员 -->
    <PendingProcessingOrder
      v-else-if="isRoles.isSamplingStaff"
      :item="order"
    ></PendingProcessingOrder>
    <!-- 检测人员 -->
    <DetectionOrder
      v-else-if="
        isRoles.isHairStaff ||
        isRoles.isMedicalStaff ||
        isRoles.isQuickInspectionStaff ||
        isRoles.isSewageStaff
      "
      :item="order"
    ></DetectionOrder>
    <!-- 普通用户&政府人员 -->
    <ProcessedOrder v-else :item="order"></ProcessedOrder>
  </view>
</template>

<script lang="ts" setup>
import ProcessedOrder from './components/processedOrder.vue'
import { useMemberStore } from '@/stores'
import PendingProcessingOrder from './components/pendingProcessingOrder.vue'
import DetectionOrder from './components/detectionOrder.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
// 获取个人信息
const memberStore = useMemberStore()
const isRoles = uni.getStorageSync('roles')
let order = ref()
let iscomfirm = ref()
let propsArray: any = []
const specimen: any = {
  page: 1,
  pageSize: 0,
}
let scene = ref(false)
onLoad((option: any) => {
  const item = JSON.parse(decodeURIComponent(option.item))
  order.value = item
  scene.value = true
  const comfirm = JSON.parse(decodeURIComponent(option.comfirm))
  order.value.iscomfirm = comfirm
})
</script>

<style lang="scss" scoped>
.page {
  background: linear-gradient(10deg, rgba(27, 193, 101, 0) 0%, #1bc172 28%, #43d180 50%);
}
</style>
