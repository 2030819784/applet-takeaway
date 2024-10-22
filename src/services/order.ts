import { http } from '@/utils/http'
import type { orderListParams, orderListResult, userOrderListParams } from '@/types/order'

//根据状态获取订单列表
export const getOrderListByStateAPI = (data: orderListParams) => {
  return http({
    method: 'POST',
    url: '/order/list',
    data,
  })
}
//获取订单列表信息
export const getuserOrderListAPI = (status?: number) => {
  return http({
    method: 'GET',
    url: status === undefined ? '/order/list' : `/order/list?status=${status}`,
  })
}

//获取自己的待采样订单列表
export const getUnSampleCheckOrderListAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/order/getUnSampleCheckOrderList',
    data,
  })
}
//根据订单id获取详情信息
export const getOrderDetialByIdAPI = (id: any) => {
  return http({
    method: 'GET',
    url: `/order/detail/${id}`,
  })
}
//新增订单表信息
export const addorderListAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/order/add',
    data,
  })
}

//删除订单
export const deleteOrderListAPI = (ids: number) => {
  return http({
    method: 'POST',
    url: '/order/delete/{ids}',
  })
}

//更新订单表信息
export const updateOrderListAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/order/update',
    data,
  })
}

//订单提交
export const submitAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/order/submit',
    data,
  })
}
//付款
export const paymentAPI = (orderId: string) => {
  return http({
    method: 'POST',
    url: `/order/pay/${orderId}`,
  })
}

//根据订单编号查询订单信息

export const searchOrderAPI = (orderNo: string) => {
  return http({
    method: 'GET',
    url: `/order/pay/${orderNo}`,
  })
}

//取消订单

export const cancelOrderAPI = (orderId: string) => {
  return http({
    method: 'POST',
    url: `/order/cancel/${orderId}`,
  })
}
