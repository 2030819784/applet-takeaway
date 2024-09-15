//检测相关
import { http } from '@/utils/http'
export const addDetetionAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/staQuery/add',
    data,
  })
}
export const getDetetionAPI = (orderId: any) => {
  return http({
    method: 'GET',
    url: `/staQuery/detailByOrderId/${orderId}`,
  })
}

export const createDetetionAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/staQuery/uploadFile',
    data,
  })
}

export const updateDetetionAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/staQuery/update',
    data,
  })
}
