import { defineStore } from 'pinia'
import { ref } from 'vue'
//被采样人身份确认
export const useComfirm = defineStore('comfirm', () => {
  const comfirm = ref()
  const setComfirm = (val: any) => {
    comfirm.value = val
    uni.setStorageSync('comfirm', val)
  }
  return {
    comfirm,
    setComfirm,
  }
})
