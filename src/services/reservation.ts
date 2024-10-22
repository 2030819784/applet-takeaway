import { http } from '@/utils/http'

//根据预约时间查询预约人数
export const getReservationCountAPI = (spuId: number, reservedAt: string) => {
  return http({
    method: 'GET',
    url: `/reservation/getReservationCount/${spuId}/${reservedAt}`,
  })
}

//确认预约
export const confirmReservationAPI = (spuId: number, reservedAt: string) => {
  return http({
    method: 'POST',
    url: `/reservation/confirmReserved/${spuId}/${reservedAt}`,
  })
}
