import { http } from '@/utils/http'

//预下单
export const preOrderAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/orderLogistics/preOrder',
    data,
  })
}
//查询运费
export const getLogisticeFeeAPI = (orderId: string) => {
  return http({
    method: 'GET',
    url: `/orderLogistics/getLogisticsFee/${orderId}`,
  })
}
