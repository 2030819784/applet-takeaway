//用户相关

import { http } from '@/utils/http'

//根据userId获取用户详情
export const getUserInfoByUserIdAPI = (id: number) => {
  return http({
    method: 'GET',
    url: `/order/detail/${id}`,
  })
}
//人脸识别
// export const commfirmIdenttyAPI = (data: any) => {
//   return http({
//     method: 'POST',
//     url: '/certification/face',
//     data,
//   })
// }
//实名认证
export const authenticationAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/certification/authentication',
    data,
  })
}
//判断当前用户是否实名
export const isCertificationAPI = () => {
  return http({
    method: 'GET',
    url: '/certification/judge',
  })
}
