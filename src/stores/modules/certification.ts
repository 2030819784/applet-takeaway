import { defineStore } from 'pinia'
import { ref } from 'vue'
//实名信息
export const useCertification = defineStore('Certification', () => {
  const Certification = ref()
  const setCertification = (val: any) => {
    Certification.value = val
    uni.setStorageSync('Certification', val)
  }
  return {
    Certification,
    setCertification,
  }
})
