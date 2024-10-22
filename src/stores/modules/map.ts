import { defineStore } from 'pinia'
export const useMapStore = defineStore('map', {
  state: () => {
    return {
      latitude: 0,
      longitude: 0,
      name: '',
      address: '',
    }
  },
})
