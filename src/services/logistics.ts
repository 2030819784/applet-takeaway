import { http } from '@/utils/http'

//根据id获取物流信息
export const deleteOrderListAPI = (id: number) => {
  return http({
    method: 'GET',
    url: `/orderLogistics/detail/${id}`,
  })
}

//获取物流列表信息
export const getLogisticListAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/orderLogistics/list',
    data,
  })
}

//下单
export const logisticPlaceAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/orderLogistics/place',
    data,
  })
}

//获取采样点详细信息
export const getAddressAPI = (id: number) => {
  return http({
    method: 'GET',
    url: `/shopAddress/detail/${id}`,
  })
}

//获取待寄送订单数据

export const getWaitLogisticAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/order/lists',
    data,
  })
}
