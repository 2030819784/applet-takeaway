import { http } from '@/utils/http'

//根据用户id获取发票列表
export const getOrderInvoiceAPI = (userId: number) => {
  return http({
    method: 'GET',
    url: `/orderInvoice/list/${userId}`,
  })
}

//根据订单id获取发票详细信息
export const getOrderInvoiceDetailAPI = (orderId: number) => {
  return http({
    method: 'GET',
    url: `/orderInvoice/detail/${orderId}`,
  })
}
