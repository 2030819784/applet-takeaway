//样品相关

import { http } from '@/utils/http'
import type { specimenParams } from '@/types/specimen'
//获取样品管理列表
export const getSpecimenListAPI = (data: specimenParams) => {
  return http({
    method: 'POST',
    url: '/specimen/list',
    data,
  })
}
//根据样品id获取样品详细信息
export const getSpecimenDetailAPI = (id: number) => {
  return http({
    method: 'GET',
    url: `/specimen/detail/${id}`,
  })
}
//根据orderId获取样品详情
export const getSpecimenAPI = (orderId: any) => {
  return http({
    method: 'GET',
    url: `/specimen/detailByOrderId/${orderId}`,
  })
}

export const addSpecimenAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/specimen/add',
    data,
  })
}

export const addSpecimenOrderAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/specimen/addWithOrder',
    data,
  })
}

export const updataSpecimenOrderAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/specimen/update',
    data,
  })
}
