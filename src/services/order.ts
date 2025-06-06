import { http } from '@/utils/http'
import type { orderListParams, orderListResult, userOrderListParams } from '@/types/order'

//获取订单列表信息
export const getuserOrderListAPI = (status?: number) => {
  return http({
    method: 'GET',
    url: status === undefined ? '/order/list' : `/order/list?status=${status}`,
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
//取消订单
export const cancelOrderAPI = (orderId: string) => {
  return http({
    method: 'POST',
    url: `/order/cancel/${orderId}`,
  })
}


//制作中订单修改地址
export const updateOrderAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/order/update/address',
    data
  })
}

//完成商品制作
export const completeGoodsAPI = (id: string) => {
  return http({
    method: 'POST',
    url: `/shop/completeGoods?orderId=${id}`,

  })
}
