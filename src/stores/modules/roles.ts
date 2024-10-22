import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRolesStore = defineStore('roles', () => {
  const roles = ref()
  const setRoles = (val: any) => {
    roles.value = val
    uni.setStorageSync('roles', val)
  }
  return {
    roles,
    setRoles,
  }
})
