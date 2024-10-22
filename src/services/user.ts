//用户相关

import { http } from '@/utils/http'

//根据userId获取用户详情
export const getUserInfoByUserIdAPI = (id: number) => {
  return http({
    method: 'GET',
    url: `/order/detail/${id}`,
  })
}
