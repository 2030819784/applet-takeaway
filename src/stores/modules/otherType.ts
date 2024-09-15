import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOtherTypes = defineStore('otherType', () => {
  const otherType = ref()
  const setOtherType = (val: any) => {
    otherType.value = val
    uni.setStorageSync('otherType', val)
  }
  const clearOtherType = () => {
    otherType.value = undefined
    // uni.clearStorageSync()
  }
  return {
    otherType,
    setOtherType,
    clearOtherType,
  }
})
