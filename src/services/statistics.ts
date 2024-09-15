import { http } from '@/utils/http'

export const sendCityDataAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/areaStatistics/add',
    data,
  })
}

export const getCityDataListAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/areaStatistics/list',
    data,
  })
}
