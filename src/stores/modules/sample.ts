import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSample = defineStore('sample', () => {
  const sample = ref()
  const setsample = (val: any) => {
    sample.value = val
    uni.setStorageSync('sample', val)
  }
  return {
    sample,
    setsample,
  }
})
