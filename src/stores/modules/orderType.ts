import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderType = defineStore('orderTypes', () => {
  const orderTypes = ref()
  const setOrderTypes = (val: any) => {
    orderTypes.value = val
    uni.setStorageSync('orderTypes', val)
  }
  const clearOrderTypes = () => {
    orderTypes.value = undefined
    // uni.clearStorageSync()
  }
  return {
    orderTypes,
    setOrderTypes,
    clearOrderTypes,
  }
})
